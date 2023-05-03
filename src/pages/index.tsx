import { type NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { AiOutlineLogout } from "react-icons/ai"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";
import toast from 'react-hot-toast';
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api"; 
import { LoadingPage, LoadingTriangle } from "~/components/loading";
import { useState } from "react";
import Link from "next/link";



dayjs.extend(relativeTime)
  /* Stylings */
  const btnStyle = "bg-none text-center py-3 px-10 border border-purple-500 rounded-xl text-purple-500 cursor-pointer hover:bg-purple-500 hover:text-white"

  const btnStylePost = "bg-none text-center py-2 px-10 rounded-full text-purple-500 cursor-pointer hover:bg-purple-500/10 hover:text-white"

  const btnOutStyle = "bg-none text-center p-4 rounded-xl text-red-500 cursor-pointer hover:bg-red-500 hover:text-white"

  const postStyle = "bg-purple-200 text-purple-950 py-2 px-5 rounded-lg w-full p-5"

  const Avatar = () => {
    
    const { user } = useUser()
    
    if(!user) return null
    
    return (
      <div className="hidden md:inline-block p-1 border border-purple-500 rounded-full">
        <Image height={64} width={64} className="object-contain w-16 h-16 rounded-full" src={user.profileImageUrl} alt="avatar" />
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
    // #221133
    // #d3cfd6
    
    // mutate()
    // console.log(user)
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
          {isPosting ? <LoadingTriangle size={20}/> :"Post"}
        </button>
      </div>
    )
  }

  type PostWithUser = RouterOutputs["posts"]["getAll"][number]
  const PostView = (props: PostWithUser) => {
    const { post, author } = props;
    return(
      <div className={`flex justify-start items-start gap-5`} key={post.id}>
        <Image height={56} width={56} className="object-contain w-10 h-10 rounded-full" src={author?.profilePicture} alt={`${author.username}'s post`} />
        <div className="flex flex-col flex-grow gap-2">
          <Link href={`/post/${post.id}`}>          
            <p className={postStyle}>
              {post.content}
            </p>   
          </Link>
          <p className="font-thin text-purple-100/50 text-xs text-right tracking-wider">
            posted by <span className="tracking-normal text-purple-100"> <Link href={`/@${author.username}`}>{`@${author?.username}`}</Link></span><span>{` • ${dayjs(post.createdAt).fromNow()}`}</span>
          </p> 
        </div>
      </div>
    )
  }

  
  const Feed = () => {

    const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

    if (postsLoading) return <LoadingPage/>
    if (!data) return <div>Something went wrong !</div> 

    return (
      <div className="flex flex-col gap-5 w-full p-5 border-b border-purple-50/20">
        {data?.map((fullPost) => (
          <PostView key={fullPost.post.id} {...fullPost} />
        )) }
      </div>
    )
  }

  
  const Home: NextPage = (props) => {

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
        <title>Twitter Clone with T3 app</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-full">
        <div className="flex flex-col h-full w-full border-x border-purple-50/20 md:max-w-2xl">
          
          <div className="flex w-full border-b border-purple-50/20 justify-between items-center p-5">
            
            { isSignedIn && <Avatar/> }
            
            <h1 className="text-2xl text-white font-bold"> 
              { isSignedIn ?
                (
                  <>
                    <span className="font-thin">Welcome,</span> { user.fullName || 'default' }
                  </>
                ) 
                : 
                "🟣 Tweet" }
            </h1>


            { !isSignedIn && <div className={btnStyle}><SignInButton /></div> }
            
            { !!isSignedIn && <div className={btnOutStyle}><SignOutButton><AiOutlineLogout size={30}/></SignOutButton></div> }

          </div>
          { isSignedIn &&
            <div className="flex flex-col gap-5 w-full p-5 
            border-b border-purple-50/20">
              <CreatePostWizard/>
            </div>
          }
          <Feed/>
        </div>
      </main>
    </>
  );
};

export default Home;
