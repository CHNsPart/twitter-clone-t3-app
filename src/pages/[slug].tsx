import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import superjson from "superjson";

const ProfilePage: NextPage<{ username: string }> = ({ username }: InferGetStaticPropsType<typeof getStaticProps>) => {
  
  const { data } = api.profile.getUserByUserName.useQuery({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    username,
  });

  // console.log(data?.email)

  if (!data) return <div>404 Nigga!</div>

  return (
    <>
      <Head>
        <title>{data.username} - Profile Page</title>
        <meta name="author" content="Touhiudl Islam Chayan" />
        <meta name="description" content="Tweet is a powerful and user-friendly code blogging app designed for developers, programmers, and coding enthusiasts. With Tweet, you can easily create, share, and discover high-quality code snippets, tutorials, and projects in a vibrant community of like-minded individuals." />
        <meta name="keywords" content="HTML, CSS, JavaScript, React, NextJS, T3 app, TRPC, Planet Scale, code blogging app, code snippets, tutorials, programming projects, community, developers, programmers, coding enthusiasts."/>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        {/* Open Graph */}
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://chnspart.com/"/>
        <meta property="og:title" content="Tweet — Code Blogging App"/>
        <meta property="og:description" content="Tweet is a powerful and user-friendly code blogging app designed for developers, programmers, and coding enthusiasts."/>
        <meta property="og:image" 
        content="https://chnspart.com/meta/tweetmeta.png"/>
        {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image"/>
          <meta property="twitter:url" content="https://chnspart.com/"/>
          <meta property="twitter:title" content="Tweet — Code Blogging App"/>
          <meta property="twitter:description" content="Tweet is a powerful and user-friendly code blogging app designed for developers, programmers, and coding enthusiasts."/>
          <meta property="twitter:image" 
          content="https://chnspart.com/meta/tweetmeta.png"/>
      </Head>
      <main className="flex justify-center h-full">
        <div>
          {data.username}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps =async (ctx) => {

    const ssg = createServerSideHelpers({
      router: appRouter,
      ctx: { prisma, userId:null },
      transformer: superjson, // optional - adds superjson serialization
    });

    const slug = ctx.params?.slug as string

    if (typeof slug !== "string") throw new Error("no slug")

    const username = slug.replace("@","")

    await ssg.profile.getUserByUserName.prefetch({ username })

    return {
      props: {
        trpcState: ssg.dehydrate(),
        username
      }
    }
}

export const getStaticPaths = () => {
  return {paths:[], fallback: "blocking"}
}

export default ProfilePage;
