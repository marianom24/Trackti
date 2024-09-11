import React from "react";

export default function CardComponent({ children }){
    return(
        <div className="flex rounded-lg border-2 border-slate-900 dark:border-gray-200 shadow-md dark:bg-gray-800 flex-col justify-start w-full">
            <div className=" flex h-full flex-col justify-start gap-4 p-6">
                {children}
            </div>
        </div>
    )
}