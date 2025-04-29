'use client'

import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js';
import {supabase} from '../../lib/supabase-client'
import ChatWindow from '../../components/ChatWindow';
import MessageInput from '../../components/MessageInput'
import {ChatMessage, NewChatMessage} from '../../components/props'

export default function ChatDetail({sessionId}: {sessionId: string}) {
    const [authSession, setAuthSession] = useState<Session | null>(null)
    const [prompts, setPrompts] = useState<ChatMessage[]>([])
    const [newPrompt, setNewPrompt] = useState({content: ''})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setAuthSession(session)
        })
    }, [])

    useEffect(() => {        
        if (!sessionId) {
            console.log("No session ID provided")
            return
        }

        try {
            supabase.from('chat_messages').select('*').eq('session_id', sessionId).order('created_at').then(({data, error}) => {
                if (!error) {
                    setPrompts(data as ChatMessage[])
                } else {
                    console.error("Error fetching chat messages: ", error.message)
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
              table: 'chat_messages',
              filter: `session_id=eq.${sessionId}`
            },
            (payload) => {
              const newMsg = payload.new as ChatMessage
              setPrompts((prev) => [...prev, newMsg])
            }
        ).subscribe()
    
        return () => {
          supabase.removeChannel(channel)
        }
      }, [sessionId])

    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setNewPrompt({content: ''})
        console.log("Submitting prompt:", newPrompt.content)

        if (!newPrompt.content.trim() || !authSession?.user.id || !sessionId) {
            console.log("Prompt is empty or session/user ID is not available. Cannot submit prompt.")
            console.log("Session:", authSession)
            console.log("Chat Session ID:", sessionId)
            return
        }

        console.log('Prompt:', newPrompt.content)
        setIsLoading(true)
        const user_id = authSession.user.id


        try {
            const newUserMessage: NewChatMessage = {
                session_id: sessionId,
                user_id: user_id,
                sender: 'user',
                content: newPrompt.content
            }

            await supabase.from("chat_messages").insert(newUserMessage)
            console.log("Inserted user message: ", newUserMessage)
            setPrompts((p) => [...p, {...newUserMessage, message_id: crypto.randomUUID(), created_at: new Date().toISOString()}])

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
                    session_id: sessionId,
                    user_id: authSession.user.id,
                    sender: 'model',
                    content: data.response
                }
                await supabase.from("chat_messages").insert(newModelMessage)
                setPrompts((p) => [...p, {...newModelMessage, message_id: crypto.randomUUID(), created_at: new Date().toISOString()}])
                console.log("Inserted model message: ", newModelMessage)
            }
        } catch (error) {
            console.error("Error inserting prompt:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className = 'flex flex-col h-screen bg-gray-900'>
            <ChatWindow prompts={prompts} isLoading={isLoading}/>
            <MessageInput
                value={newPrompt.content}
                isLoading={isLoading}
                onChange={(e) => setNewPrompt({content: e.target.value})}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
