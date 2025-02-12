import { supabase } from "@/config/Supabase_Client";
import { headers } from "next/headers";
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
    try {
        const authHeader = (await headers()).get("authorization")
        const {name, domain, description} = await req.json()
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const apiKey = authHeader.split("Bearer ")[1]
            const {data, error} = await supabase.from("users").select().eq("api", apiKey)
            if (data.length > 0) {
                if (name.trim() == "" || domain.trim() == "") {
                    return NextResponse.json({
                        error: "name or domain fields must not be empty"
                    }, {
                        status: 400
                    }, {
                        headers: coreHeaders
                    })
                } else {
                    const {data: events, error: errorMessage} = await supabase.from("events").insert([
                       { 
                            event_name: name.toLowerCase(),
                            website_id: domain,
                            message: description
                        }
                    ])
                    if (errorMessage) {
                        return NextResponse.json(
                            {error: errorMessage},
                            {status: 400},
                            {headers: coreHeaders}
                        )
                    } else {
                        return NextResponse.json(
                            {message: "success"},
                            {status: 200},
                            {headers: coreHeaders}
                        )
                    }
                }
            } else {
                return NextResponse.json({
                    error: "Unauthorized - Invalid API",
                }, {status: 401})
            }
        }
    } catch (error) {
        return NextResponse.json(
            {error: error.message},
            {status: 500},
            {headers: coreHeaders}
        )
    }
}