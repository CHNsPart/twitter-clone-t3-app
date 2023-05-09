
import type { PropsWithChildren } from "react";

export const InputProfile = (props:{title:string, value:string }) => {
    return (
            <div className="flex flex-row justify-between w-full">
              <div className="inline-block justify-center bg-purple-200/10 text-purple-100 py-2 px-5 rounded-lg mx-2 flex-grow">
                <span className="text-purple-100/50 font-thin">
                  {props.title}
                </span>
                <p>
                  {props.value}
                </p>
              </div>
            </div>
        )
    }

export const InputWrapper = (props:PropsWithChildren) => {
    return (
        <div className="flex flex-col md:flex-row gap-2 px-0 md:px-2 justify-between w-full">
            {props.children}
        </div>
    )
}