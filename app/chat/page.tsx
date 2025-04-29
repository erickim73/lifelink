'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase-client';
import { Session } from '@supabase/supabase-js'
import { NewChatMessage } from '../components/props';
import { createNewSession } from '../utils/createNewSession';
import { useRouter } from 'next/navigation';

export default function MainChat() {
    const [chatSessionId, setChatSessionId] = useState<string | null>(null)
    const [newPrompt, setNewPrompt] = useState({content: ''})
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

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

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPrompt: newPrompt.content
                })
            })

            const data = await res.json()
            console.log("Response from backend: ", data)

            if (data.response) {
                const newModelMessage: NewChatMessage = {
                    session_id: currentChatSessionId,
                    user_id: session.user.id,
                    sender: 'model',
                    content: data.response
                }
                await supabase.from("chat_messages").insert(newModelMessage)
                console.log("Inserted model message: ", newModelMessage)
            }

        } catch (error) {
            console.error("Error inserting prompt:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
            <h1 className="text-3xl sm:text-4xl font-semibold mb-10 text-center">What can I help you with?</h1>
            
            <form onSubmit={handleSubmit} className="w-full max-w-2xl px-4">
                <div className="flex items-center gap-3 bg-zinc-900 rounded-full px-4 py-3 shadow-lg border border-zinc-700">
                    <input
                        type="text"
                        placeholder="Ask anything"
                        value={newPrompt.content}
                        onChange={(e) => setNewPrompt({ content: e.target.value })}
                        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                    />
                    <button
                        type = 'submit'
                        disabled={isLoading}
                        className="bg-white text-black font-medium px-4 py-1.5 rounded-full hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-icon lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    </button>
                </div>
            </form>
        </div>
    )
}

