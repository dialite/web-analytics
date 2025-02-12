"use client"
import useUser from "@/hooks/useUser";
import { redirect } from "next/navigation";
import Header from "../comps/Header";
import { supabase } from "@/config/Supabase_Client";
import { useEffect, useState } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { sunburst } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [APIKey, setAPIKey] = useState("")

    const [user] = useUser()
    useEffect(() => {
      if (!user) return
      if (user == "no user") redirect("/signin")
    }, [user]);

    const getUserAPIs = async () => {
        setLoading(true)
        const {data, error} = await supabase.from("users").select().eq("user_id", user.id)
        if (data.length > 0) {
            setAPIKey(data[0].api)
        }
        setLoading(false)
    }

    const generateAPIKey = async () => {
        setLoading(true)
        if (loading || !user) return
        const randomString = Math.random().toString(36).substring(2, 300) + Math.random().toString(36).substring(2, 300)
        const {data, error} = await supabase.from("users").insert([{api: randomString, user_id: user.id}])
        if (error) console.error(error)
            setAPIKey(randomString)
            setLoading(false)
    }

    const copyAPIKey = () => {
        navigator.clipboard.writeText(APIKey)
        alert("API key copied to clipboard")
    }

    useEffect(() => {
        if (!user || !supabase) return
        getUserAPIs()
    }, [user, supabase])

    if (user == "no user") {
        <div>
            <Header />
            <div className="min-h-screen items-center justify-center flex flex-col w-full z-40 text-white">
                Redirecting...
            </div>
        </div>
    }
    return (
        <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center">
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center w-full z-40 text-white">
                {!APIKey && !loading && 
                    <button className="button" onClick={generateAPIKey}>Generate API Key</button>}
                {APIKey && <div className="mt-12 border-white/5 border bg-black space-y-12 lg:w-1/2 py-12 w-full md:w-3/4">
                    <div className="space-y-12 px-4">
                        <p>YOUR API KEY IS: </p>
                        <input disabled className="input-disabled" value={APIKey} readOnly type="text"/>
                        <button className="button" onClick={copyAPIKey}>Copy API Key</button>
                    </div>
                    <div className="space-y-4 border-t border-white/5 bg-black p-6"></div>
                    <h1>You can create custom events using our API like below</h1>
                    <div>
                        <CodeComp />
                    </div>
                </div>}
            </div>
        </div>
    )
}

export const CodeComp = () => {
    let codeString = `
    const url = "http://localhost:3000/api/events"
    const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer {{APIKey}}",
    }

    const eventData = {
        name: "",//* required
        domain: "", //* required
        description: "",//optional
    }

    const sendRequest = async () => {
        axios
            .post(url, eventData, {headers})
            .then()
            .catch((error) => {
                console.error("Error:", error)
            })
    }`
    return(
        <SyntaxHighlighter language="javascript" style={sunburst}>{codeString}</SyntaxHighlighter>
    )
}