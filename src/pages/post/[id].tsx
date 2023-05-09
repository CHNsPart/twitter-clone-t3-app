import { type NextPage } from "next";
import Head from "next/head";
// import { api } from "~/utils/api";
// import { useUser } from "@clerk/nextjs";


const SinglePostPage: NextPage = (props) => {
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
        content="https://chnspart.com/meta/tweetmeta.png">
        {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image"/>
          <meta property="twitter:url" content="https://chnspart.com/"/>
          <meta property="twitter:title" content="Tweet — Code Blogging App"/>
          <meta property="twitter:description" content="Tweet is a powerful and user-friendly code blogging app designed for developers, programmers, and coding enthusiasts."/>
          <meta property="twitter:image" 
          content="https://chnspart.com/meta/tweetmeta.png"/>
        </meta>
      </Head>
      <main className="flex justify-center h-full">
        <div>
          Post View
        </div>
      </main>
    </>
  );
};

export default SinglePostPage;
