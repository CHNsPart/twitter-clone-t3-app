import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import { createServerSideHelpers } from '@trpc/react-query/server';

import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { HeadLayout, PageLayout } from "~/components/layout";
import Image from "next/image";

import Link from "next/link";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";



type SinglePostPage = {
  // Define the prop types for the page
  username: string;
};
  
const ProfileFeed = (props: {userId: string}) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({ 
    userId: props.userId 
  })

  if (isLoading) return <LoadingPage/>
  if(!data || data === undefined) return <div className="w-full border-b border-purple-50/20 flex justify-center items-center py-5" >
    😥 User has no post yet !
  </div>
  console.log("data from feed",data)
  return (
    <div className="flex flex-col gap-5 w-full p-5 border-b border-purple-50/20" >
      <h1 className="text-2xl md:text-4xl py-5 px-5 mb-53 font-bold bg-purple-200/20 text-purple-200 rounded-lg">🧾 Your Posts</h1>
      {data?.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  )
}

const SinglePostPage: NextPage<SinglePostPage> = (_props: InferGetStaticPropsType<typeof getStaticProps>) => {
  

  // const { data } = api.profile.getUserByUserName.useQuery({
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   username,
  // });
    
  // if (!data) return <div>404 Nigga!</div>
  
  // dayjs.extend(relativeTime)



  return (
    <>
      <Head>
        <title>Tweet - Post Page</title>
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
        <PageLayout>
          <HeadLayout>
            <Link href="/">          
              <div className="flex justify-center items-center gap-2">
                <Image src="https://chnspart.com/meta/tweetgrad.png" height={40} width={40} alt="logo h-16 w-16 p-2" />
                <span className="text-2xl font-bold">Tweet</span>
              </div> 
            </Link>
          </HeadLayout>
        </PageLayout>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps =async (ctx) => {

    const ssg = generateSSGHelper()

    const id = ctx.params?.id as string

    if (typeof id !== "string") throw new Error("no id")

    await ssg.posts.getByID.prefetch({ id })

    return {
      props: {
        trpcState: ssg.dehydrate(),
        id
      }
    }
}

export const getStaticPaths = () => {
  return {paths:[], fallback: "blocking"}
}

export default SinglePostPage;
