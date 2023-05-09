import type { RouterOutputs } from "~/utils/api"; 
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const postStyle = "bg-purple-200/10 text-purple-100 py-2 px-5 rounded-lg w-full p-5"
export const PostView = (props: PostWithUser) => {

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