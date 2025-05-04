"use client";

import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarTrigger, useSidebar,} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { NewChat } from "./new-chat";
import { supabase } from "@/app/lib/supabase-client";
import {Session} from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { ChatSession } from "@/app/components/props";
import Link from "next/link";  

// This is sample data.
const data = {
  user: {
    name: "Eric Kim",
    email: "seyoon2006@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  }
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [chatSessionIds, setChatSessionIds] = useState<ChatSession[]>([])
    const [sessionId, setSessionId] = useState<Session | null>(null)

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
            supabase.from('chat_sessions').select('*').eq('user_id', sessionId?.user.id).order('created_at', {ascending: false}).then(({data, error}) => {
                if (!error) {
                    setChatSessionIds(data || []);
                } else {
                    console.error("Error fetching chat sessions: ", error.message)
                }
            })
        } catch (error) {
            console.error("Error fetching chat session: ", error)
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
    
    const { state } = useSidebar();

    return (
        <Sidebar collapsible="icon" {...props}>
            <div className="relative">
                <SidebarHeader className="flex justify-center py-4">
                <div className="absolute left-4 top-4 scale-150">
                    <SidebarTrigger />
                </div>

                {state === "expanded" && (
                    <>
                    <div className="absolute right-13 top-4 scale-150">
                        <ModeToggle />
                    </div>
                    <div className="absolute right-3 top-4 scale-150">
                        <NewChat />
                    </div>
                    </>
                )}
                </SidebarHeader>
            </div>
        <SidebarContent>
            {chatSessionIds.length > 0 && (
                <div className = 'p-2'>
                    <div className = 'text-xs font-semibold text-muted-foreground mb-2 mt-5'>
                        Recent Chats
                    </div>
                    <ul className="flex flex-col gap-1">
                    {chatSessionIds.map((session) => (
                        <li key={session.session_id}>
                            <Link
                            href={`/chat/${session.session_id}`}
                            className="block text-sm px-2 py-1 rounded hover:bg-muted cursor-pointer truncate"
                            title={session.session_id}
                            >
                            {new Date(session.created_at).toLocaleString()}
                            </Link>
                        </li>
                        ))}
                    </ul>
                </div>
            )}
        </SidebarContent>

        <SidebarFooter>
            <NavUser user={data.user} />
        </SidebarFooter>

        <SidebarRail />
        </Sidebar>
    );
}
