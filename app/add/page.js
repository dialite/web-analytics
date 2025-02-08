"use client"
import { useState } from "react";
import Logo from "../comps/Logo";
import { supabase } from "@/config/Supabase_Client";
import useUser from "@/hooks/useUser";

export default function AddPage() {
    const [user] = useUser();
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [website, setWebsite] = useState("");
    const [loading, setLoading] = useState(false);

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
                                <p className="text-xs pt-2 font-light text-white/20">
                                    enter the domain or subdomain without {"www"}
                                </p>
                            )}
                        </span>
                        {error === "" && (
                            <button className="button" onClick={addWebsite} disabled={user === "no user"}>
                                {loading ? "adding..." : "add website"}
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-white">Website added successfully!</p>
                )}
            </div>
        </div>
    );
}
