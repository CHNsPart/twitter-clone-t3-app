import Image from "next/image"
import Link from "next/link"

export const Contributors = () => {
    return (
            <div className="w-full border border-purple-50/20 h-fit p-5 rounded-xl">
              <div className="flex items-center space-x-2 text-base">
                <h4 className="font-semibold text-white">Contributors</h4>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">204</span>
              </div>
              <div className="mt-3 flex -space-x-2 w-full">
                <Image height={20} width={20} className="inline-block h-10 w-10 rounded-full ring-2 ring-black" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                <Image height={20} width={20} className="inline-block h-10 w-10 rounded-full ring-2 ring-black" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt=""/>
                <Image height={20} width={20} className="inline-block h-10 w-10 rounded-full ring-2 ring-black" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                <Image height={20} width={20} className="inline-block h-10 w-10 rounded-full ring-2 ring-black" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
              </div>
              <div className="mt-3 text-sm font-medium">
                <a href="#" className="text-purple-500">+ 198 others</a>
              </div>
            </div>
        )
    }

export const Notification = (props: { imageUrl:string, imageAlt:string, title:string, message:string, link:string }) => {

return (
      <Link href={props.link} target="_blank">
        <div className="p-5 max-w-sm mx-auto border border-purple-50/20 rounded-xl shadow-md flex items-center space-x-4 hover:bg-purple-50/5 hover:border-purple-500/20">
        <div className="shrink-0">
            <Image height={50} width={50} className="h-12 w-12 rounded-full" src={props.imageUrl} alt={props.imageAlt} />
        </div>
          <div>
              <div className="text-xl font-medium text-white">{props.title}</div>
              <p className="text-purple-500 break-before-all">{props.message}</p>
          </div>
        </div>
      </Link>
    )
}