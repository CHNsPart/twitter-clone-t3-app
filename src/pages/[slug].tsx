import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { HeadLayout, PageLayout } from "~/components/layout";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { InputProfile, InputWrapper } from "~/components/profile";

const ProfilePage: NextPage<{ username: string }> = ({ username }: InferGetStaticPropsType<typeof getStaticProps>) => {
  
  const { data } = api.profile.getUserByUserName.useQuery({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    username,
  });
  
  // console.log(data?.email)
  
  if (!data) return <div>404 Nigga!</div>
  
  dayjs.extend(relativeTime)

  // console.log(data.socials)
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
      <PageLayout>
        <HeadLayout>
          <div className="flex justify-center items-center gap-2">
            <Image src="https://chnspart.com/meta/tweetgrad.png" height={40} width={40} alt="logo h-16 w-16 p-2" />
            <span className="text-2xl font-bold">Tweet</span>
          </div>
          <span>
            was active {dayjs(data.lastSignInAt).fromNow()}
          </span> 
        </HeadLayout>
        <div 
          className="flex flex-col md:flex-row justify-between items-center 
                     p-5 gap-2 border-b border-purple-50/20 md:items-start
                     md:p-5 md:gap-2"
          >
          <div 
            className="flex flex-row overflow-auto gap-4
                       md:flex-col md:overflow-auto md:gap-5"
          >
            <Image className="rounded-xl" src={data.profilePicture} height={150} width={150} alt="logo h-16 w-16 p-2" />
          </div>
          <div className="flex flex-col gap-2 md:gap-5 justify-between w-full">
            <InputWrapper>
              <InputProfile title="first name" value={data.firstName || 'default'}/>
              <InputProfile title="last name" value={data.lastName || 'default'}/>
            </InputWrapper>
            <InputWrapper>
              <InputProfile title="username" value={data.username || 'default'}/>
              <InputProfile title="username" value={data.email || 'default'}/>
            </InputWrapper>
            <InputWrapper>
              <InputProfile title="gender" value={data.gender || '🤐'}/>
              <InputProfile title="birthday" value={data.birthday || '🤐'}/>
            </InputWrapper>
            <InputWrapper>
              <InputProfile title="last visit" value={dayjs(data.lastSignInAt).fromNow() || '🤐'}/>
              <InputProfile title="been with us since" value={dayjs(data.createdAt).fromNow() || '🤐'}/>
            </InputWrapper>
          </div>
        </div>
      </PageLayout>
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
