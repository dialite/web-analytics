import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useUser from "@/hooks/useUser";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { supabase } from "@/config/Supabase_Client";
import { redirect, usePathname } from "next/navigation";

export default function Header() {
    const [user] = useUser();
    const pathname = usePathname()
    const logOut = async () => {
        await supabase.auth.signOut()
        redirect("/signin")
    }
    if (user === "no user") return <></>;

    return (
        <div className="w-full border-b border-white/5 sticky top-0 bg-black z-50 bg-opacity-20 filter backdrop-blur-lg flex items-center justify-between px-6 py-3">
            {/* logo */}
            <Logo size="sm" />
            <div className="flex space-x-6">
                {pathname !== "/dashboard" && <div className="items-center flex space-x-4">
                    <p className="text-sm text-white/60 hover:text-white smooth">snippet</p>
                    <Link prefetch href={"/dashboard"} className="flex items-center justify-center space-x-2 group">
                        <button className="text-sm text-white/60 group-hover:text-white smooth">
                            dashboard
                        </button>
                        <ArrowRightIcon className="h-4 w-4 stroke-white/60 group-hover:stroke-white smooth" />
                    </Link>
                </div>}
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-white outline-none p-0 m-0 border-none">
                        <div className="flex space-x-2 items-center justify-center hover:opacity-50">
                            <p className="text-sm">{user?.user_metadata?.full_name?.split(" ")[0] ?? "Guest"}</p>
                            {user?.user_metadata?.avatar_url ? (
                                <img 
                                    src={user.user_metadata.avatar_url} 
                                    alt="User Avatar" 
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : null}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#0a0a0a] border-white/5 outline-none text-white bg-opacity-20 backdrop-blur-md filter">
                            <DropdownMenuLabel className="text-white">
                                settings
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5"/>
                            <Link href="/settings" prefetch>
                                <DropdownMenuItem className="text-white/60 smooth cursor-pointer rounded-md">
                                    API
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/settings" prefetch>
                                <DropdownMenuItem className="text-white/60 smooth cursor-pointer rounded-md">
                                    Guide
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-white/5"/>
                                <DropdownMenuItem onClick = {logOut} className="text-white/60 smooth cursor-pointer rounded-md">
                                    log out
                                </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
