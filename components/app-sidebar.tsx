"use client";

import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar,} from "@/components/ui/sidebar";
import { supabase } from "@/app/lib/supabase-client";
import {Session} from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { ChatSession } from "@/app/lib/types";
import Link from "next/link";  
import { usePathname } from "next/navigation";
import { UserProfile } from '../app/lib/types';
import { MessageSquare, Plus } from "lucide-react"
import { Badge } from "./ui/badge";
import Image from 'next/image';


// Consolidated color variables for consistent theming
const COLORS = {
    background: "bg-[#0F172A]",
    border: "border-[#2A3441]",
    hover: "hover:bg-[#334155]",
    muted: "text-white/60",
    newChat: {
        bg: "bg-[#1A4B84]",
        text: "text-white",
        hover: "hover:bg-[#151E30]",
    },
}

// Custom scrollbar styles to be reused
const SCROLLBAR_STYLES = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-500/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [chatSessionIds, setChatSessionIds] = useState<ChatSession[]>([])
    const [sessionId, setSessionId] = useState<Session | null>(null)
    const [userData, setUserData] = useState<UserProfile | null>(null)
    const pathname = usePathname()
    const {open} = useSidebar()
    const isCollapsed = !open

    const noSideBarRoutes = ['/onboarding', '/signup', '/login', '/reset', '/']
    const noSideBarPage = noSideBarRoutes.includes(pathname || "")

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSessionId(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSessionId(session)
            console.log("Auth event:", _event)
        })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (noSideBarPage) return

        if (!sessionId?.user?.id) {
            console.log("No session ID provided")
            return
        }

        const fetchUserData = async () => {
            try {
                const { data: chatData, error: chatError } = await supabase
                    .from('chat_sessions')
                    .select('*')
                    .eq('user_id', sessionId.user.id)
                    .order('updated_at', {ascending: false})
                
                if (chatError) {
                    console.error("Error fetching chat session: ", chatError)
                } else {
                    setChatSessionIds(chatData || []);
                }
    
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('first_name, last_name')
                    .eq('user_id', sessionId.user.id)
                
                if (profileError) {
                    console.error("Error fetching user profile: ", profileError)
                    return
                }
                                  
                if (profileData && profileData.length > 0) {
                    const user = profileData[0]
                    setUserData({
                        name: `${user.first_name} ${user.last_name}`,
                        email: sessionId.user.email ?? "",
                        initials: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`,
                    })
                } else {
                    console.error("No user profile found")
                }
            } catch (error) {
                console.error("Error fetching chat session or user profile: ", error)
            }
        }
    
        fetchUserData()
    }, [sessionId, noSideBarPage])

    useEffect(() => {
        const channel = supabase.channel('realtime_chat').on('postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_sessions',
            },
            (payload) => {
                const newSession = payload.new as ChatSession
                setChatSessionIds((prev) => [...prev, newSession])
            }
        ).subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [sessionId])
    
    if (noSideBarPage) return null

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        const sevenDays = new Date(now)
        sevenDays.setDate(sevenDays.getDate() - 7)
        const thirtyDays = new Date(now)
        thirtyDays.setDate(thirtyDays.getDate() - 30)

        // if today, show time only
        if (date.toDateString() === now.toDateString()) {
            return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        } 

        // if yesterday, show yesterday
        if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        }

        // if past 7 days, show Previous 7 Days
        if (date.toDateString() === sevenDays.toDateString()) {
            return date.toLocaleDateString([], { month: "short", day: "numeric" })
        }

        // if past 30 days, show Previous 30 Days
        if (date.toDateString() === thirtyDays.toDateString()) {
            return date.toLocaleDateString([], { month: "short", day: "numeric" })
        }

        // otherwise, show full date
        return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
    }

    // group chat sessions by date
    const today = new Date().toDateString()

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()

    const sevenDays = new Date()
    sevenDays.setDate(sevenDays.getDate() - 7)

    const thirtyDays = new Date()
    thirtyDays.setDate(thirtyDays.getDate() - 30)

    const groupedSessions = chatSessionIds.reduce((groups, session) => {
        const sessionDate = new Date(session.updated_at)
    
        if (sessionDate.toDateString() === today) {
            if (!groups.today) groups.today = []
            groups.today.push(session)
        } else if (sessionDate.toDateString() === yesterdayString) {
            if (!groups.yesterday) groups.yesterday = []
            groups.yesterday.push(session)
        } else if (sessionDate > sevenDays && sessionDate < yesterday) {
            if (!groups.sevenDays) groups.sevenDays = []
            groups.sevenDays.push(session)
        } else if (sessionDate > thirtyDays && sessionDate <= sevenDays) {
            if (!groups.thirtyDays) groups.thirtyDays = []
            groups.thirtyDays.push(session)
        } else {
            if (!groups.older) groups.older = []
            groups.older.push(session)
        }
    
        return groups
    }, { today: [], yesterday: [], sevenDays: [], thirtyDays: [], older: [] } as Record<string, ChatSession[]>)

    // Custom section header component for consistent styling
    const SectionHeader = ({ title, count }: { title: string; count?: number }) => (
        <div className="px-2 py-1 mt-2 first:mt-0 text-xs font-medium text-white/70">
            <div className="flex items-center">
                <span>{title}</span>
                {count !== undefined && (
                    <Badge variant="outline" className="ml-auto text-xs py-0 h-5">
                        {count}
                    </Badge>
                )}
            </div>
        </div>
    );

    return (
        <Sidebar 
            collapsible="icon" 
            className={`border-r ${COLORS.border} ${COLORS.background} text-white ${SCROLLBAR_STYLES}`} 
            {...props}
        >
            <SidebarHeader className="p-3.5 pt-3 flex-shrink-0">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                        <div className={`flex items-center justify-center h-8 w-8 rounded-md ${COLORS.hover} transition-colors`}>
                            <SidebarTrigger className="h-5 w-5 text-white/80 hover:text-white" />
                        </div>
                        {!isCollapsed && (
                            <span>
                                <Link href="/chat">
                                    <Image
                                        src="/lifelink.svg"
                                        alt="LifeLink Logo"
                                        width={75}
                                        height={75}
                                        priority
                                    />
                                </Link>
                            </span>
                        )}
                    </div>
                </div>
                <div className="mt-1">
                    <Link 
                        href="/chat" 
                        className={`flex items-center gap-2 px-1.5 py-2.5 rounded-lg ${COLORS.newChat.hover} transition-colors`}
                        title="New chat"
                    >
                        <div className={`flex items-center justify-center w-5 h-5 ${COLORS.newChat.bg} rounded-full`}>
                            <Plus className="h-4 w-4 text-white" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-balance font-medium text-white">New chat</span>
                        )}
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent 
                className={`px-1 py-1 overflow-y-auto max-h-[calc(100vh-150px)] ${SCROLLBAR_STYLES}`}
            >               
                {(chatSessionIds.length > 0 && !isCollapsed) && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="flex items-center gap-2 text-xs text-white/70 px-2 py-1">
                            <span>Recent Chats</span>
                            {chatSessionIds.length > 0 && (
                                <Badge variant="outline" className="ml-auto text-xs py-0 h-5">
                                    {chatSessionIds.length}
                                </Badge>
                            )}
                        </SidebarGroupLabel>

                        {chatSessionIds.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-white/60 italic">No recent chats</div>
                        ) : (
                            <SidebarMenu>
                                {groupedSessions.today?.length > 0 && (
                                    <>
                                        <SectionHeader title="Today" />
                                        {groupedSessions.today.map((session) => (
                                            <SidebarMenuItem key={session.session_id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/chat/${session.session_id}`}
                                                    tooltip={isCollapsed ? formatDate(session.updated_at) : undefined}
                                                    className="group"
                                                >
                                                    <Link href={`/chat/${session.session_id}`} className="flex items-center">
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 mr-2 group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="flex-1 truncate text-sm">{formatDate(session.updated_at)}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </>
                                )}
                                {groupedSessions.yesterday?.length > 0 && (
                                    <>
                                        <SectionHeader title="Yesterday" />
                                        {groupedSessions.yesterday.map((session) => (
                                            <SidebarMenuItem key={session.session_id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/chat/${session.session_id}`}
                                                    tooltip={isCollapsed ? formatDate(session.updated_at) : undefined}
                                                    className="group"
                                                >
                                                    <Link href={`/chat/${session.session_id}`} className="flex items-center">
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 mr-2 group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="flex-1 truncate text-sm">{formatDate(session.updated_at)}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </>
                                )}
                                {groupedSessions.sevenDays?.length > 0 && (
                                    <>
                                        <SectionHeader title="Previous 7 Days" />
                                        {groupedSessions.sevenDays.map((session) => (
                                            <SidebarMenuItem key={session.session_id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/chat/${session.session_id}`}
                                                    tooltip={isCollapsed ? formatDate(session.updated_at) : undefined}
                                                    className="group"
                                                >
                                                    <Link href={`/chat/${session.session_id}`} className="flex items-center">
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 mr-2 group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="flex-1 truncate text-sm">{formatDate(session.updated_at)}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </>
                                )}
                                {groupedSessions.thirtyDays?.length > 0 && (
                                    <>
                                        <SectionHeader title="Previous 30 Days" />
                                        {groupedSessions.thirtyDays.map((session) => (
                                            <SidebarMenuItem key={session.session_id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/chat/${session.session_id}`}
                                                    tooltip={isCollapsed ? formatDate(session.updated_at) : undefined}
                                                    className="group"
                                                >
                                                    <Link href={`/chat/${session.session_id}`} className="flex items-center">
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 mr-2 group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="flex-1 truncate text-sm">{formatDate(session.updated_at)}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </>
                                )}
                                {groupedSessions.older?.length > 0 && (
                                    <>
                                        <SectionHeader title="Older" />
                                        {groupedSessions.older.map((session) => (
                                            <SidebarMenuItem key={session.session_id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/chat/${session.session_id}`}
                                                    tooltip={isCollapsed ? formatDate(session.updated_at) : undefined}
                                                    className="group"
                                                >
                                                    <Link href={`/chat/${session.session_id}`} className="flex items-center">
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 mr-2 group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="flex-1 truncate text-sm">{formatDate(session.updated_at)}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </>
                                )}
                            </SidebarMenu>
                        )}
                    </SidebarGroup>
                )}
            </SidebarContent>

            <div className={`${isCollapsed ? "mt-auto" : ""}`}>
                <SidebarSeparator className="mx-0 w-full" />

                <SidebarFooter className="p-3">
                    {userData && <NavUser user={userData} />}
                </SidebarFooter>
            </div>
            <SidebarRail className="!cursor-default pointer-events-none" />
        </Sidebar>
    );
}