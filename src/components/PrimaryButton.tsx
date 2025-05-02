import React from "react";

export const PrimaryButton = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="relative flex flex-col items-center w-full">
            <button type="submit"
                    className="__cta_button z-20 flex flex-row justify-center items-center relative anton text-2xl py-2 rounded-sm w-full text-[#D48900] uppercase font-bold mt-2 border-b-2 border-[#FAC35D] min-h-12">
                {children}
            </button>
            <div
                className="anton relative z-10 text-2xl py-2 -mt-10.5 rounded-xl w-full text-[#C78406] bg-[#C78406] uppercase">
                { children }
            </div>
        </div>
    )
}
