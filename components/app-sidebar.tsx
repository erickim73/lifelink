"use client";

import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar,} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { NewChat } from "./new-chat";
import { supabase } from "@/app/lib/supabase-client";
import {Session} from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { ChatSession } from "@/app/lib/types";
import Link from "next/link";  
import { usePathname } from "next/navigation";
import { UserProfile } from '../app/lib/types';
import { MessageSquare, Clock } from "lucide-react"
import { Badge } from "./ui/badge";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [chatSessionIds, setChatSessionIds] = useState<ChatSession[]>([])
    const [sessionId, setSessionId] = useState<Session | null>(null)
    const [userData, setUserData] = useState<UserProfile | null>(null)
    const pathname = usePathname()
    const { state } = useSidebar()

    const noSideBarRoutes = ['/onboarding', '/profile', '/settings/profile', '/settings']
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

            supabase.from('profiles').select('first_name, last_name').eq('user_id', sessionId?.user.id).single().then(({data, error}) => {
                if (error) {
                    console.error("Error fetching user profile: ", error)
                    return
                }

                const profile: UserProfile = {
                    name: `${data.first_name} ${data.last_name}`,
                    email: sessionId.user.email || "",
                    initials: `${data.first_name[0]}${data.last_name[0]}`.toUpperCase(),

                }

                setUserData(profile)
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

        // if today, show time only
        if (date.toDateString() === now.toDateString()) {
            return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        } 

        // if yesterday, show yesterday
        if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        }

        // if this year, show month and date
        if (date.getFullYear() === now.getFullYear()) {
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

    const groupedSessions = chatSessionIds.reduce((groups, session) => {
        const sessionDate = new Date(session.updated_at).toDateString()
    
        if (sessionDate === today) {
            if (!groups.today) groups.today = []
            groups.today.push(session)
        } else if (sessionDate === yesterdayString) {
            if (!groups.yesterday) groups.yesterday = []
            groups.yesterday.push(session)
        } else {
            if (!groups.older) groups.older = []
            groups.older.push(session)
        }
    
        return groups
        },
        { today: [], yesterday: [], older: [] } as Record<string, ChatSession[]>,
    )

    return (
        <Sidebar collapsible="icon" className="border-r border-border" {...props}>
            <SidebarHeader className="p-3">
                <div className="flex items-center justify-between w-full">
                    <SidebarTrigger className="h-8 w-8" />
                    {state === "expanded" && (
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            <NewChat />
                        </div>
                    )}
                </div>
            </SidebarHeader>
            <SidebarSeparator className="mx-0 w-full" />
            
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Recent Chats</span>
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
                                                tooltip="View chat"
                                            >
                                                <Link href={`/chat/${session.session_id}`}>
                                                    <Clock className="h-4 w-4" />
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
                                                tooltip="View chat"
                                            >
                                                <Link href={`/chat/${session.session_id}`}>
                                                    <Clock className="h-4 w-4" />
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
                                                tooltip="View chat"
                                            >
                                                <Link href={`/chat/${session.session_id}`}>
                                                    <Clock className="h-4 w-4" />
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
            </SidebarContent>

            <SidebarSeparator className="mx-0 w-full" />

            <SidebarFooter className="p-3">
                {userData && <NavUser user={userData} />}
            </SidebarFooter>

        <style jsx global>{`
            /* COMMENT: Added CSS to remove resize cursor on sidebar rail */
            .sidebar-rail {
                cursor: default !important;
                pointer-events: none; /* Disable interactions with the rail */
            }
        `}</style>
        <SidebarRail className="sidebar-rail" />

    </Sidebar>
    );
}
