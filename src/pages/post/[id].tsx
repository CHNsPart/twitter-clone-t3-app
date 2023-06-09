import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { HeadLayout, PageLayout } from "~/components/layout";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

type SinglePostPage = {
  // Define the prop types for the page
  id: string;
};

const SinglePostPage: NextPage<SinglePostPage> = ({ id }) => {

  const { data } = api.posts.getByID.useQuery({
    id,
  });

  if (!data) return <div>404 Nigga!</div>

  dayjs.extend(relativeTime)



  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
        <meta name="author" content="Touhiudl Islam Chayan" />
        <meta name="description" content="Tweet is a powerful and user-friendly code blogging app designed for developers, programmers, and coding enthusiasts. With Tweet, you can easily create, share, and discover high-quality code snippets, tutorials, and projects in a vibrant community of like-minded individuals." />
        <meta name="keywords" content="HTML, CSS, JavaScript, React, NextJS, T3 app, TRPC, Planet Scale, code blogging app, code snippets, tutorials, programming projects, community, developers, programmers, coding enthusiasts." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chnspart.com/" />
        <meta property="og:title" content="Tweet — Code Blogging App" />
        <meta property="og:description" content="Tweet is a powerful and user-friendly code blogging app designed for developers, programmers, and coding enthusiasts." />
        <meta property="og:image"
          content="https://chnspart.com/meta/tweetmeta.png" />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://chnspart.com/" />
        <meta property="twitter:title" content="Tweet — Code Blogging App" />
        <meta property="twitter:description" content="Tweet is a powerful and user-friendly code blogging app designed for developers, programmers, and coding enthusiasts." />
        <meta property="twitter:image"
          content="https://chnspart.com/meta/tweetmeta.png" />
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
          <div
            className="flex flex-col md:flex-row w-full justify-between items-center 
                      p-5 gap-2 border-b border-purple-50/20 md:items-start
                      md:p-5 md:gap-2"
          >

            <div className="flex flex-col w-full gap-5 bg-purple-50/5 p-5 rounded-xl">
              <div className="flex w-full text-center justify-center h-44 items-center gap-5 border-b border-purple-50/20">
                <h1 className="text-4xl font-bold">
                  {data.post.content}
                </h1>
              </div>
              <div className="flex justify-between items-center gap-5">
                <div className="flex justify-between items-center gap-5">
                  <Image
                    src={data.author.profilePicture}
                    height={40} width={40}
                    alt="avatar" className="rounded-full"
                  />
                  <span className="font-bold text-md text-right tracking-normal text-purple-200">
                    <Link href={`/${data.author.username}`}>
                      {data.author.username}
                    </Link>
                  </span>
                </div>
                <span className="font-medium text-purple-200/80 text-xs text-right tracking-wider">{`${dayjs(data.post.createdAt).fromNow()}`}</span>
              </div>
            </div>
          </div>
        </PageLayout>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {

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
  return { paths: [], fallback: "blocking" }
}

export default SinglePostPage;
