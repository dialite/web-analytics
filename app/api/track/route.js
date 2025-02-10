import { supabase } from "@/config/Supabase_Client";
import { NextResponse } from "next/server";

export const coreHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Control-Type, Authorization",
}

export async function OPTIONS(request) {
    return NextResponse.json({}, {headers: coreHeaders})
}

export async function POST(req) {
    const res = await req.json()
    const {domain, url, event} = res
    if (!url.includes(domain)) return NextResponse.json({
        error: "the script ponts to a different domain than the current url. Make sure the match"
    })
    if (event == "session_start") {
        await supabase.from("visits").insert([{website_id: domain}]).select()
    }
    if (event == "pageview") {
        await supabase.from("page_views").insert([{domain, page: url}])
    }
    return NextResponse.json({res})
}