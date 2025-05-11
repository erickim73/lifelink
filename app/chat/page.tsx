'use client'

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase-client';
import { Session } from '@supabase/supabase-js'
import { NewChatMessage, UserFormData } from '../lib/types';
import { createNewSession } from '../utils/createNewSession';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';

export default function MainChat() {
    const [chatSessionId, setChatSessionId] = useState<string | null>(null)
    const [newPrompt, setNewPrompt] = useState({content: ''})
    const [session, setSession] = useState<Session | null>(null)
    const [userProfile, setUserProfile] = useState<UserFormData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const {state} = useSidebar()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            console.log("Auth event:", _event)
        })

        return () => subscription.unsubscribe()
    }, [])
    
    useEffect(() => {
        const adjustHeight = () => {
            const textarea = textareaRef.current
            if (textarea) {
                textarea.style.height = 'auto'
                const scrollHeight = textarea.scrollHeight
                const maxHeight = 200
                const newHeight = Math.min(maxHeight, scrollHeight)
                textarea.style.height = `${newHeight}px`
                textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden'
            }
        }
        adjustHeight()

        const timeoutId = setTimeout(adjustHeight, 10) // Delay to ensure the height is adjusted after rendering

        return () => clearTimeout(timeoutId)
    }, [newPrompt.content])
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log("Submitting prompt:", newPrompt.content)

        if (!session) {
            console.log("Session is not available. Cannot submit prompt.")
            return
        }

        let currentChatSessionId = chatSessionId

        if (!currentChatSessionId) {
            currentChatSessionId = await createNewSession(session)
            if (currentChatSessionId) {
                setChatSessionId(currentChatSessionId)
            } else {
                console.error("Failed to create a new chat session.")
                return
            }
        }

        if (!newPrompt.content.trim() || !session?.user.id || !currentChatSessionId) {
            console.log("Prompt is empty or session/user ID is not available. Cannot submit prompt.")
            console.log("Prompt:", newPrompt.content)
            console.log("Session:", session)
            console.log("User ID:", session?.user.id)
            console.log("Chat Session ID:", currentChatSessionId)
            return
        }

        setIsLoading(true)

        router.push(`/chat/${currentChatSessionId}`)

        try {
            const newUserMessage: NewChatMessage = {
                session_id: currentChatSessionId,
                user_id: session.user.id,
                sender: 'user',
                content: newPrompt.content
            }

            await supabase.from("chat_messages").insert(newUserMessage)
            console.log("Inserted user message: ", newUserMessage)

            const { data, error } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single();
            console.log("User profile data: ", data)

            if (error) {
                console.error("Error fetching user profile: ", error)
            } else if (data) {
                setUserProfile(data)     
            } 

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPrompt: newPrompt.content,
                    userProfile: userProfile

                })
            })

            const response = await res.json()
            console.log("Response from backend: ", response)

            if (response.response) {
                const newModelMessage: NewChatMessage = {
                    session_id: currentChatSessionId,
                    user_id: session.user.id,
                    sender: 'model',
                    content: data.response.replace(/^\s+/, '').replace(/([.?!])(?=[^\s])/g, '$1 ')  //remove leading white space and ensure sentences have spaces
                }
                await supabase.from("chat_messages").insert(newModelMessage)
                console.log("Inserted model message: ", newModelMessage)
            }
        } catch (error) {
            console.error("Error inserting prompt:", error)
        } finally {
            setIsLoading(false)
        }

        const {error} = await supabase.from("chat_sessions").update({"updated_at": new Date().toISOString()}).eq("session_id", currentChatSessionId)
        if (error) {
            console.error("Error updating updated_at: ", error)
        } else {
            console.log("Successfully updated updated_at for session: ", currentChatSessionId)
        }
        
    }

    return (
        <div className="fixed inset-0"
            style={{
                marginLeft: state === "expanded" ? "16rem" : "4rem", // 64px or 16px for sidebar
                backgroundColor: "#111",
            }}
        >
            <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="w-full max-w-[90%] px-4">
                    <h1 className="text-3xl sm:text-4xl font-semibold mb-10 text-center">What can I help you with?</h1>
            
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="relative w-full flex flex-col bg-zinc-800 rounded-2xl px-6 py-6 shadow-lg border border-zinc-700">
                            <div className="w-full" style={{ minWidth: "100%" }}>
                                <textarea
                                    ref={textareaRef}
                                    placeholder="Ask anything"
                                    value={newPrompt.content}
                                    onChange={(e) => setNewPrompt({ content: e.target.value })}
                                    rows={2}
                                    className="w-full bg-transparent rounded-2xl outline-none text-white placeholder-gray-400 py-1 resize-none"
                                    style={{
                                        minHeight: '40px',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        lineHeight: '1.5',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        border: "1px solid transparent",
                                    }}
                                    onKeyDown={(e) => {
                                        // Submit on Enter without Shift key
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            const form = e.currentTarget.form;
                                            if (form && !isLoading && newPrompt.content.trim()) {
                                                form.requestSubmit();
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="absolute bottom-4 right-4">
                                <button
                                    type="submit"
                                    disabled={isLoading || !newPrompt.content.trim()}
                                    className="bg-[#1A4B84] text-black font-medium p-3 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="h-5 w-5 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up">
                                            <path d="m5 12 7-7 7 7"/>
                                            <path d="M12 19V5"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

