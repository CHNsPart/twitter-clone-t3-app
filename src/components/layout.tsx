import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {

    return (
        <div className="flex flex-col h-full w-full border-x border-purple-50/20 md:max-w-2xl mx-5">
            {props.children}
        </div>
        )
    }

export const HeadLayout = (props: PropsWithChildren) => {

    return (
            <div className="flex w-full border-b border-purple-50/20 justify-between items-center p-5">
                {props.children}
            </div>
        )
    }