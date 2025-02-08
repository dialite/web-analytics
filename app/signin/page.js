"use client"
import { supabase } from "@/config/Supabase_Client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage(){
    const router = useRouter()
    const signIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider:"google"
        })
    }
    const catchUser = async () => {
        const {data:{user}} = await supabase.auth.getUser()
        if (user) {
            if (user.role === "authenticated") router.push("/dashboard") 
        }
    }
    useEffect(() => {
        if (!supabase) return
        catchUser()
    }, [supabase])

    return (
        <div className="bg-black items-center justify-center flex w-full min-h-screen">
            <button onClick={signIn} className="button flex items-center justify-center space-x-5">
                SignIn with Google
            </button>
        </div>
    )
}