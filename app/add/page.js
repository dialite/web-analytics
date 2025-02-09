"use client"
import { useEffect, useState } from "react";
import Logo from "../comps/Logo";
import { supabase } from "@/config/Supabase_Client";
import useUser from "@/hooks/useUser";
import { Item } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";

export default function AddPage() {
    const [user] = useUser();
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [website, setWebsite] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const addWebsite = async () => {
        if (website.trim() === "" || loading || user === "no user") return;
        setLoading(true);

        const { data, error } = await supabase
            .from("website")
            .insert([{ website_name: website.trim(), user_id: user.id }])
            .select();

        if (error) {
            setError(error.message);
        } else {
            setStep(2);
        }

        setLoading(false);
    };

    const checkDomainAddedBefore = async () => {
        setError(""); // Reset error state
        let fetchedWebsites = [];
    
        const { data: websites, error } = await supabase.from("website").select("*");
    
        if (error) {
            setError("Error fetching websites"); // Set error if the query fails
            return;
        }
    
        fetchedWebsites = websites || []; // Ensure it's always an array
    
        if (fetchedWebsites.some(item => item.website_name === website)) {
            setError("This domain has already been added before"); // Display error message
        } else {
            setError(""); // Clear error if not found
            addWebsite();
        }
    };
    
    useEffect(() => {
        if (
            website.trim().includes("http") ||
            website.trim().includes("http://") ||
            website.trim().includes("https://") ||
            website.trim().includes("://") ||
            website.trim().includes(":") ||
            website.trim().includes("/")
        ) {
            setError ("please enter the domain only. ie:(google.com)")
        } else {
            setError("")
        }
    }, [website])

    return (
        <div className="w-full min-h-screen bg-black items-center justify-center flex flex-col">
            <Logo size="lg" />
            <div className="flex flex-col items-center justify-center p-12 mt-10 w-full z-0 border-y border-white/5 bg-black text-white">
                {step === 1 ? (
                    <div className="w-full items-center justify-center flex flex-col space-y-10">
                        <span className="w-full lg:w-[50%] group">
                            <p className="text-white/40 pb-4 group-hover:text-white smooth">Domain</p>
                            <input 
                                value={website} 
                                onChange={(e) => setWebsite(e.target.value.trim().toLowerCase())} 
                                className="input" 
                            />
                            {error ? (
                                <p className="text-xs pt-2 font-light text-red-400">{error}</p>
                            ) : (
                                <p className={`text-xs pt-2 font-light ${error ? "text-red-400" : "text-white/20"}`}>
                                    enter the domain or subdomain without {"www"}
                                </p>
                            )}
                        </span>
                        {error === "" && (
                            <button className="button" onClick={checkDomainAddedBefore} disabled={user === "no user" || loading}>
                                {loading ? "Adding..." : "Add Website"}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col w-full items-center justify-center space-y-10">
                        <span className="w-full lg:w-[50%]">
                            <textarea type="text" className="input text-white/20 cursor-pointer" disabled value={`<script defer data-domain="${website}" src="http://localhost/3000/tracking-script.js"></script>`}/>
                            <p>
                                paste this snippet in the <b className="text-red-600">{"<head>"}</b> of your website
                            </p>
                        </span>
                        <button onClick={() => router.push(`/w/${website.trim()}`)} className="button">
                            added
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
