'use client'
import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js';
import {supabase} from '../supabase-client'
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput'
import useChatSession from './useChatSession';
import {ChatMessage, NewChatMessage} from './props'


const ChatPage = () => {
    const [session, setSession] = useState<Session | null>(null)
    const [prompts, setPrompts] = useState<ChatMessage[]>([])
    const [newPrompt, setNewPrompt] = useState({content: ''})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })
    }, [])

    const chatSessionId = useChatSession(session)

    useEffect(() => {
        if (!chatSessionId) {
            console.log("No chat session ID")
            return
        }

        supabase.from('chat_messages').select('*').eq('session_id', chatSessionId).order('created_at').then(({data, error}) => {
            if (!error) {
                setPrompts(data as ChatMessage[])
            } else {
                console.error("Error fetching chat messages: ", error.message)
            }
        })
    }, [chatSessionId])    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setNewPrompt({content: ''})
        console.log("Submitting prompt:", newPrompt.content)

        if (!newPrompt.content.trim() || !session?.user.id || !chatSessionId) {
            console.log("Prompt is empty or session/user ID is not available. Cannot submit prompt.")
            console.log("Session:", session)
            console.log("Chat Session ID:", chatSessionId)
            return
        }

        console.log('Prompt:', newPrompt.content)
        setIsLoading(true)
        const user_id = session.user.id


        try {
            const newUserMessage: NewChatMessage = {
                session_id: chatSessionId,
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
                    session_id: chatSessionId,
                    user_id: session.user.id,
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


export default ChatPage
