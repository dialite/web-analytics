"use client"
import Header from "@/app/comps/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/config/Supabase_Client";
import useUser from "@/hooks/useUser";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  

export default function WebsitePage() {
    const [user] = useUser()
    const {website} = useParams()
    const [loading, setLoading] = useState(false)
    const [pageViews, setPageViews] = useState([])
    const [customEvents, setCustomEvents] = useState([])
    const [totalVisits, setTotalVisits] = useState([])
    const [groupedPageViews, setGroupedPageViews] = useState([])
    const [groupedPageSources, setGroupedPageSources] = useState([])
    const [groupedCustomEvents, setGroupedCustomEvents] = useState([])


    useEffect(() => {
        if (!user) return
        if (user.role !== "authenticated") redirect("/signin")
        const checkWebsiteCurrentUser = async () => {
            const {data, error} = await supabase.from("websites").select().eq("website_name", website).eq("user_id", user.id)
            data.length == 0 ? redirect("/dashboard") : setTimeout(() => {fetchViews()}, 500)
        }
        checkWebsiteCurrentUser()
    }, [user])

    const fetchViews = async () => {
        setLoading(true)
        try {
            const [viewsResponse, visitsResponse, customEventsResponse] = await Promise.all([
                supabase.from("page_views").select().eq("domain", website),
                supabase.from("visits").select().eq("website_id", website),
                supabase.from("events").select().eq("website_id", website)
            ])
            const views = viewsResponse.data
            const visits = visitsResponse.data
            const customEventsData = customEventsResponse.data
            setPageViews(views)
            setGroupedPageViews(groupPageViews(views))
            setTotalVisits(visits)
            setCustomEvents(customEventsData)
            setGroupedCustomEvents(
                customEventsData.reduce((acc, event) => {
                    acc[event.event_name] = (acc[event.event_name] || 0) + 1
                }, {})
            )
        } catch (error) {
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    function groupPageViews (pageViews) {
        const groupedPageViews = {}
        pageViews.forEach(({page}) => {
            const path = page.replace(/^(?:\/\/|[^/]+)*\//, "")

            groupedPageViews[path] = (groupedPageViews[path] || 0) + 1
        })

        return Object.keys(groupedPageViews).map((page) => ({
            page: page,
            visits: groupedPageViews[page]
        }))
    }

    const abbreviateNumber = (number) => {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + "M"
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + "k"
        } else {
            return number.toString()
        }
    }

    const formatTimeStampz = (date) => {
        const timestamp = new Date(date)
        const formatTimeStamp = timestamp.toLocaleString()
        return formatTimeStamp
    }

    if (loading) {
        <div className="bg-black text-white min-h-screen w-full items-start justify-start flex flex-col">
            <Header />
            <div className="min-h-screen w-full items-center justify-center flex text-white relative">
                loading...
            </div>
        </div>
    }

    return<div className="bg-black text-white min-h-screen w-full items-center justify-center flex flex-col">
        <Header />
        {pageViews?.length == 0 && !loading ? <div className="w-full items-center justify-center flex flex-col space-y-6 z-40 relative min-h-screen px-4">
            <div className="z-40 w-full lg:w-2/3 bg-black border-white/5 py-12 px-8 items-center justify-center flex flex-col text-white space-y-4 relative">
                <p className="bg-green-600 rounded-full p-4 animate-pulse" />
                <p className="animate-pulse">Waiting for the first page view</p>
                <button className="button" onClick={() => window.location.reload()}>Refresh</button>
                <div></div>
            </div>
        </div> : 
            <div className="z-40 w-[95%] md:w-3/4 lg:w-2/3 min-h-screen py-6 border-x border-white/5 items-center justify-start flex flex-col">
                <div className="w-full items-center justify-center flex flex-col">
                <Tabs defaultValue="general" className="w-full items-center justify-center flex flex-col">
                    <TabsList className="w-full bg-transparent mb-4 items-start justify-start flex">
                        <TabsTrigger value="general">general</TabsTrigger>
                        <TabsTrigger value="custom Events">custom Events</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="w-full">
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 px-4 gap-6">
                            <div className="bg-black border-white/5 border text-white text-center">
                                <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5">TOTAL VISITS</p>
                                <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                                    {abbreviateNumber(totalVisits?.length)}
                                </p>
                            </div>
                            <div className="bg-black border-white/5 border text-white text-center">
                                <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5">PAGE VIEWS</p>
                                <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                                    {abbreviateNumber(pageViews?.length)}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 bg-black items-center justify-center lg:grid-cols-2 mt-12 w-full border-y border-white/5">
                            {/* top pages */}
                            <div className="flex flex-col bg-black z-40 h-full w-full">
                                <h1 className="label">Top Pages</h1>
                                {groupedPageViews.map(view => (
                                    <div key={view} className="text-white w-full items-center justify-between px-6 py-4 border-b border-white/5 flex">
                                        <p>/{view.page}</p>
                                        <p>{abbreviateNumber(view.visits)}</p>
                                    </div>
                                ))}
                            </div>
                            {/* top sources */}
                            <div className="flex flex-col bg-black z-40 h-full w-full lg:border-1 border-t lg:border-t-0 border-white/5">
                                <h1 className="label relative">
                                    Top Visit Sources
                                    <p className="absolute bottom-2 right-2 text-[10px] italic font-light">
                                        add ?utm={"{source}"} to track
                                    </p>
                                </h1>
                                {groupedPageSources.map((pageSource) => (
                                    <div key={pageSource} className="text-white w-full items-center justify-between px-6 py-4 border-b border-white/5 flex">
                                        <p className="text-white/70 font-light">/{pageSource.source}</p>
                                        <p>{abbreviateNumber(pageSource.visits)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="custom Events" className="w-full">
                        {groupedCustomEvents && <Carousel className="w-full px-4">
                            <CarouselContent>
                                {Object.entries(groupedCustomEvents).map(
                                    ([eventName, count]) => (
                                    <CarouselItem
                                        key={`${eventName}-${count}`}
                                        className="basis-1/2"
                                    >
                                        <div
                                        className={`bg-black smooth group hover:border-white/10
                                        text-white text-center border`}
                                        >
                                        <p
                                            className={`text-white/70 font-medium py-8 w-full
                                            group-hover:border-white/10
                                            smooth text-center border-b`}
                                        >
                                            {eventName}
                                        </p>
                                        <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                                            {count}
                                        </p>
                                        </div>
                                    </CarouselItem>
                                    )
                                )}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>}
                        <div className="items-center justify-center bg-black mt-12
                            w-full border-y border-white/5 relative">
                             {customEvents.map(event => (
                                <div key={event.id}
                                    className={`text-white w-full items-start justify-start 
                                        px-6 py-12 border-b border-white/5 flex flex-col relative`}>
                                    <p className="text-white/70 font-light pb-3">
                                            {event.event_name}
                                    </p>
                                    <p className="">{event.message}</p>
                                    <p className="italic absolute right-2 bottom-2 text-xs text-white/50">{formatTimeStampz(event.timestamp)}</p>
                                </div>
                             ))}   
                        </div>
                    </TabsContent>
                    </Tabs>

                </div>
            </div>}
    </div>
}
