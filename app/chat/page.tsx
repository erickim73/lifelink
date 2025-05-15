'use client'

import React, { useState, useRef } from 'react'
import { supabase } from '@/app/lib/supabase-client';
import { NewChatMessage } from '@/app/lib/types';
import { createNewSession } from '@/app/utils/createNewSession';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import Image from 'next/image';
import { useAuth } from '@/app/lib//useAuth';
import { useTextareaAutoResize } from '@/app/lib/useTextareaAutoResize';
import { useKeyboardFocus } from '@/app/lib/useKeyboardFocus'

export default function MainChat() {
    const [chatSessionId, setChatSessionId] = useState<string | null>(null)
    const [newPrompt, setNewPrompt] = useState({content: ''})
    const [isLoading, setIsLoading] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()
    const {state} = useSidebar()

    const {session} = useAuth()
    useTextareaAutoResize(textareaRef, newPrompt.content)
    useKeyboardFocus(textareaRef)

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
            console.log("Cannot submit: missing prompt, user ID, or session ID")
            return
        }

        setIsLoading(true)

        try {
            const newUserMessage: NewChatMessage = {
                session_id: currentChatSessionId,
                user_id: session.user.id,
                sender: 'user',
                content: newPrompt.content
            }

            await supabase.from("chat_messages").insert(newUserMessage)
            console.log("Inserted user message: ", newUserMessage)

            const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single();
            console.log("User profile data: ", profileData)

            if (profileError || !profileData) {
                console.error("Error fetching user profile: ", profileError);
                setIsLoading(false);
                return;
            }

            await supabase.from("chat_sessions").update({"updated_at": new Date().toISOString()}).eq("session_id", currentChatSessionId)

            setNewPrompt({content: ''})

            router.push(`/chat/${currentChatSessionId}`);

        } catch (error) {
            console.error("Error inserting prompt:", error)
        } finally {
            setIsLoading(false)
        }        
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Enter without Shift key
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const form = e.currentTarget.form;
            if (form && !isLoading && newPrompt.content.trim()) {
                form.requestSubmit();
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-zinc-900"
            style={{
                marginLeft: state === "expanded" ? "16rem" : "4rem", 
            }}
        >
            <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="w-full max-w-[63%] px-4">
                    <div className="flex items-center justify-center gap-4 mb-10">
                    <Image
                        alt="LifeLink Logo"
                        src="/lifelink_logo.png"
                        width={40} 
                        height={40}
                    />
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">What can I help you with?</h1>
                    </div>
            
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
                                    onKeyDown={handleKeyDown}
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

