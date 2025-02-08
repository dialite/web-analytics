"use client"
import Link from "next/link";
import Header from "../comps/Header";
import useUser from "@/hooks/useUser";
import { useEffect } from "react";

export default function DashbaordPage() {
    const [user] = useUser()
    useEffect(() => {
        if (!user) return
        if (user == "no user") redirect("/signin")
    }, [user])
    return (
        <div className="bg-black min-h-screen h-full w-full relative items-center justify-center flex flex-col">
            {/* header */}
            <Header />
            <div className="w-full items-start justify-start flex flex-col min-h-screen">
                <div className="w-full items-center justify-end flex p-6 border-b border-white/5 z-40">
                    <Link href={"/add"} prefetch>
                        <button className="button">+ add website</button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-10 p-6 z-40">
                    {/* {websites.map(website => {
                        <Link key={website.id} href={`/w/${website.website_name}`}>
                            <div className="border border-white/5 rounded-md py-12 px-6 text-white bg-black w-full cursor-pointer smooth hover:border-white/20 hover:bg-[#050505]">
                                <h2>{website.website_name}</h2>
                            </div>
                        </Link>
                    })} */}
                </div>
            </div>
        </div>
    )
}