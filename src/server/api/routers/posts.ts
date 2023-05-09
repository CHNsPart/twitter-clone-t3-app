
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { Post } from "@prisma/client";


const addUserDataToPost = async (posts: Post[]) => {
  
  const users = (await clerkClient.users.getUserList({
    userId: posts.map(post => post.authorId),
    limit: 100
  })).map(filterUserForClient)
  
  return posts.map((post) => {
    const author = users.find(user => user.id === post.authorId)
    if (!author || !author.username) {
     throw new TRPCError({
       code: "INTERNAL_SERVER_ERROR",
       message: "Author's posts not found !" 
     })
    }
    return {
        post,
        author: {
          ...author,
          username: author.username
        }
    }}
  )
}

// Create a new ratelimiter, that allows 3 requests per 1 min seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
});

export const postsRouter = createTRPCRouter({

  /* ----------------- */
  /* Get All Data */
  /* ----------------- */
  getAll: publicProcedure.query( async ({ ctx }) => {
    
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }]
    })
    return addUserDataToPost(posts)
  }),

  /* ----------------- */
  /* Get posts by {{{__ID__}}} */
  /* ----------------- */
  getPostsByUserId: publicProcedure
  .input(
    z.object({
      userId: z.string()
    })
  )
  .query(async ({ ctx, input }) => {
    const posts = ctx.prisma.post.findMany({
      where: { authorId: input.userId },
      take: 100,
      orderBy: [{ createdAt: "desc" }]
    })
    const postsWithUserData = await addUserDataToPost(await posts);
    return postsWithUserData
    // .then(addUserDataToPost)
  }),

  /* ----------------- */
  /* Create post */
  /* ----------------- */
  create: privateProcedure
    .input(
      z.object({
        content: z.string()
        .min(5, { message: 'Tweet must be at least 5 characters long' })
        .max(50, { message: 'Tweet cannot be more than 50 characters long' }),
      }))
      .mutation(async ({ ctx, input }) => {
        const authorId = ctx.userId;
        const { success } = await ratelimit.limit(authorId)
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" })
        const post = await ctx.prisma.post.create({
          data: {
            authorId,
            content: input.content
        },
      });
      return post;
    })
});
