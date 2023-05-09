import { type NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { AiOutlineLogout } from "react-icons/ai"
import { IoMdAdd } from "react-icons/io"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";
import toast from 'react-hot-toast';
import { api } from "~/utils/api";
import { LoadingPage, LoadingTriangle } from "~/components/loading";
import { useState } from "react";
import { HeadLayout, PageLayout } from "~/components/layout";
import { Contributors, Notification } from "~/components/sideBards";
import { PostView } from "~/components/postView";


dayjs.extend(relativeTime)
  /* Stylings */
  const btnStyle = "bg-none text-center py-3 px-10 border border-purple-500 rounded-xl text-purple-500 cursor-pointer hover:bg-purple-500 hover:text-white"

  const btnStylePost = "bg-none text-center py-2 px-4 rounded-full text-purple-500 cursor-pointer hover:bg-purple-500/10 hover:text-white"

  const btnOutStyle = "bg-none text-center p-4 rounded-xl text-red-500 cursor-pointer hover:bg-red-500 hover:text-white"

  const Avatar = () => {
    
    const { user } = useUser()
    
    if(!user) return null
    
    return (
      <div className="hidden md:inline-block p-1 border border-purple-500 rounded-full">
        <Image height={64} width={64} className="object-contain w-16 h-16 rounded-full absolute z-20" src="https://chnspart.com/meta/tweetblack.png" alt="logo" />
        <Image height={64} width={64} className="object-contain w-16 h-16 rounded-full opacity-50" src={user.profileImageUrl} alt="avatar" />
      </div>
    )
  }

  const CreatePostWizard = () => {
    
    const { user } = useUser()
    const [input, setInput] = useState("")
    const ctx = api.useContext()
    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
      onSuccess: () => {
        setInput("")
        void ctx.posts.getAll.invalidate();
      },
      onError: (e)=> {
        const errorMessage = e.data?.zodError?.fieldErrors?.content;
        if(errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0],
            { 
              style: {
                borderRadius: '10px',
                background: '#190000',
                color: '#ff0000',
              },
            }
          );
        }
        else {
          toast("Failed to post! Please try again later.",
            {
              style: {
                borderRadius: '10px',
                background: '#190000',
                color: '#ff0000',
              },
            }
          );
        }
      }
    })

    if(!user) return null

    return (
      <div className="flex justify-start items-center p-1 border border-purple-500 rounded-full gap-5">
        <Image height={56} width={56} className="object-contain w-10 h-10 rounded-full" src={user.profileImageUrl} alt={`${user.fullName || "default"}'s profile picture`} />
        <input 
          placeholder="Type your tweet !"
          type="text" 
          className="bg-transparent outline-none p-2 w-full 
          rounded-full ring-0 active:border-0" 
          value = {input}
          disabled = {isPosting}
          onChange = {(e) => setInput(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === "Enter") {
              e.preventDefault()
              if(input !== ""){
                mutate({ content: input })
              }
            }
          }}
        />
        <button 
          className={`${btnStylePost}`} 
          disabled={isPosting} 
          onClick={()=>mutate({ content: input })}
        >
          { isPosting ? 
            <LoadingTriangle size={20}/> 
            // <IoMdAdd size={20} className="animate-spin"/>
            :
            <IoMdAdd size={20} className="h-6 w-6"/>
          }
        </button>
      </div>
    )
  }

  
  const Feed = () => {

    const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

    if (postsLoading) return <LoadingPage/>
    if (!data) return <div className="w-full border-b border-purple-50/20 flex justify-center items-center py-5">Something went wrong !</div> 

    return (
      <div className="flex flex-col gap-5 w-full p-5 border-b border-purple-50/20">
        {data?.map((fullPost) => (
          <PostView key={fullPost.post.id} {...fullPost} />
        )) }
      </div>
    )
  }

  
  const Home: NextPage = (_props) => {

  const { isSignedIn, user, isLoaded: userLoaded } = useUser()
  
  api.posts.getAll.useQuery()

  // Return if both aren't loaded, since user tends to load faster
  /* if (!postsLoaded && !postsLoaded) return <div/> */

  // if (postsLoaded) return <LoadingPage/>

  // if (!data) return <div className={postStyle}>Something went wrong!</div>

  if (!userLoaded) return <LoadingPage/>

  return (
    <>
      <Head>
        <title>Tweet</title>
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
          <div className="hidden lg:flex flex-col w-fit max-w-xs left-0 gap-5 my-5 mx-5">
            <Notification 
              imageUrl="https://images.unsplash.com/photo-1535376472810-5d229c65da09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80" 
              imageAlt="Marketing"
              title="Hello there !"
              message="more projects"
              link="https://github.com/chnspart"
            />
            <Contributors/>
          </div>
          <PageLayout>
              <HeadLayout>
              
              { isSignedIn && <Avatar/> }
              
              <h1 className="text-2xl text-white font-bold"> 
                { isSignedIn ?
                  (
                    <>
                      <span className="font-thin">Welcome,</span> { user.fullName || 'default' }
                    </>
                  ) 
                  :
                  <div className="flex justify-center items-center gap-2">
                    <Image src="https://chnspart.com/meta/tweetgrad.png" height={40} width={40} alt="logo h-16 w-16 p-2" /><span className="text-2xl font-bold">Tweet</span>
                  </div>
                }
              </h1>


              { !isSignedIn && <div className={btnStyle}><SignInButton /></div> }
              
              { !!isSignedIn && 
                <div className={btnOutStyle}>
                  <SignOutButton><AiOutlineLogout size={30}/></SignOutButton>
                </div> 
              }
              
            </HeadLayout>
            { isSignedIn &&
              <div className="flex flex-col gap-5 w-full p-5 
              border-b border-purple-50/20">
                <CreatePostWizard/>
              </div>
            }
            <Feed/>
        </PageLayout>
          <div className="hidden lg:flex flex-col w-fit max-w-xs left-0 gap-5 my-5 mx-5">
            <Notification
              imageUrl="https://images.unsplash.com/photo-1614292253389-bd2c1f89cd0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              imageAlt="Portfolio"
              title="Portfolio"
              message="checkckout"
              link="https://chnspart.com"
            />
          </div>
      </main>
    </>
  );
};

export default Home;
