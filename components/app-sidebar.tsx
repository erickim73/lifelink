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

const COLORS = {
    background: "bg-[#0F172A]",
    border: "border-[#2A3441]",
    hover: "hover:bg-[#334155]",
    newChat: {
        bg: "bg-[#1A4B84]",
        text: "text-[#1A4B84]",
        hover: "hover:bg-[#151E30]",
    },
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [chatSessionIds, setChatSessionIds] = useState<ChatSession[]>([])
    const [sessionId, setSessionId] = useState<Session | null>(null)
    const [userData, setUserData] = useState<UserProfile | null>(null)
    const pathname = usePathname()
    const {open} = useSidebar()
    const isCollapsed = !open

    const noSideBarRoutes = ['/onboarding', '/signup', '/login']
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
        if (!sessionId?.user?.id) {
            console.log("No session ID provided")
            return
        }

        try {
            supabase.from('chat_sessions').select('*').eq('user_id', sessionId?.user.id).order('updated_at', {ascending: false}).then(({data, error}) => {
                if (error) {
                    console.error("Error fetching chat session: ", error)
                }
                setChatSessionIds(data || []);
            })

            supabase.from('profiles').select('first_name, last_name').eq('user_id', sessionId?.user.id).then(({data, error}) => {
                console.log(data, error)
                if (error) {
                    console.error("Error fetching user profile: ", error)
                    return
                }

                                  
                if (data && data.length > 0) {
                    const user = data[0]
                    setUserData({
                        name: `${user.first_name} ${user.last_name}`,
                        email: sessionId.user.email ?? "",
                        initials: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`,
                    })
                } else {
                    console.error("No user profile found")
                }
            })
        } catch (error) {
            console.error("Error fetching chat session or user profile: ", error)
        }
    }, [sessionId])

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

    return (
        <Sidebar collapsible="icon" className={`border-r ${COLORS.border} ${COLORS.background} text-white`} {...props}>
            <SidebarHeader className="p-1.5 pt-3 flex-shrink-0 ">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                        <div className={`flex items-center justify-center h-8 w-8 rounded-md ${COLORS.hover} transition-colors`}>
                            <SidebarTrigger className="h-5 w-5 text-white/80 hover:text-white" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-lg font-semibold text-white tracking-tight">
                                <Link href = '/chat'>
                                    LifeLink
                                </Link>
                            </span>
                    )}
                    </div>
                </div>
                <div className="mb-2 mt-1">
                    <Link 
                        href="/chat" 
                        className={`flex items-center gap-2 px-2 py-2.5 rounded-lg ${!isCollapsed ? COLORS.newChat.text : ""} ${COLORS.newChat.hover} transition-colors`}
                        title="New chat"
                    >
                        <div className={`flex items-center justify-center w-5 h-5 ${COLORS.newChat.bg} rounded-full`}>
                            <Plus className="h-4 w-43 text-white" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-balance font-medium">New chat</span>
                        )}
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent className='px-1 py-1'>               

                {(chatSessionIds.length > 0 && !isCollapsed) && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="flex items-center gap-2">
                            <span>Recent Chats </span>
                            {chatSessionIds.length > 0 && (
                                <Badge variant="outline" className="ml-auto text-xs">
                                    {chatSessionIds.length}
                                </Badge>
                            )}
                        </SidebarGroupLabel>

                        {chatSessionIds.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground italic">No recent chats</div>
                        ): (
                            <SidebarMenu>
                                {groupedSessions.today?.length > 0 && (
                                    <>
                                        <div className="px-3 py-1 text-xs font-medium text-muted-foreground">Today</div>
                                        {groupedSessions.today.map((session) => (
                                            <SidebarMenuItem key={session.session_id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/chat/${session.session_id}`}
                                                    tooltip={isCollapsed ? formatDate(session.updated_at) : undefined}
                                                    className='group'
                                                >
                                                    <Link href={`/chat/${session.session_id}`} className="flex items-center">
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-muted/20 mr-2 group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="flex-1 truncate">{formatDate(session.updated_at)}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </>
                                )}
                                {groupedSessions.yesterday?.length > 0 && (
                                    <>
                                        <div className="px-3 py-1 mt-2 text-xs font-medium text-muted-foreground">Yesterday</div>
                                        {groupedSessions.yesterday.map((session) => (
                                            <SidebarMenuItem key={session.session_id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/chat/${session.session_id}`}
                                                    tooltip={isCollapsed ? formatDate(session.updated_at) : undefined}
                                                    className='group'
                                                >
                                                    <Link href={`/chat/${session.session_id}`} className="flex items-center">
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-muted/20 mr-2 group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="flex-1 truncate">{formatDate(session.updated_at)}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </>
                                )}
                                {groupedSessions.sevenDays?.length > 0 && (
                                    <>
                                        <div className="px-3 py-1 mt-2 text-xs font-bold text-muted-foreground">Previous 7 Days</div>
                                        {groupedSessions.sevenDays.map((session) => (
                                            <SidebarMenuItem key={session.session_id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/chat/${session.session_id}`}
                                                    tooltip={isCollapsed ? formatDate(session.updated_at) : undefined}
                                                    className='group'
                                                >
                                                    <Link href={`/chat/${session.session_id}`} className="flex items-center font-normal">
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-muted/20 mr-2 group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="flex-1 truncate">{formatDate(session.updated_at)}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </>
                                )}
                                {groupedSessions.thirtyDays?.length > 0 && (
                                    <>
                                        <div className="px-3 py-1 mt-2 text-xs font-medium text-muted-foreground">Previous 30 Days</div>
                                        {groupedSessions.thirtyDays.map((session) => (
                                            <SidebarMenuItem key={session.session_id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/chat/${session.session_id}`}
                                                    tooltip={isCollapsed ? formatDate(session.updated_at) : undefined}
                                                    className='group'
                                                >
                                                    <Link href={`/chat/${session.session_id}`} className="flex items-center">
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-muted/20 mr-2 group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="flex-1 truncate">{formatDate(session.updated_at)}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </>
                                )}
                                {groupedSessions.older?.length > 0 && (
                                    <>
                                        <div className="px-3 py-1 mt-2 text-xs font-medium text-muted-foreground">Older</div>
                                        {groupedSessions.older.map((session) => (
                                            <SidebarMenuItem key={session.session_id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/chat/${session.session_id}`}
                                                    tooltip={isCollapsed ? formatDate(session.updated_at) : undefined}
                                                    className='group'
                                                >
                                                    <Link href={`/chat/${session.session_id}`} className="flex items-center">
                                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-muted/20 mr-2 group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="flex-1 truncate">{formatDate(session.updated_at)}</span>
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
