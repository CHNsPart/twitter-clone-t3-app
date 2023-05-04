
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { 
    createTRPCRouter,
    publicProcedure 
} from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  /* Get All Username Data */
  getUserByUserName: publicProcedure
    .input(
        z.object({
            username: z.string()
        })
    )
    .query(async ({ input }) => {
        /* Array of users from clerk */
        const [user] = await clerkClient.users.getUserList({
            username: [input.username]
        });
        /* If no user */
        if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User not found !" })
        
        return filterUserForClient(user);
    })
});
