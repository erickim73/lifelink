'use client'

import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase-client'
import ChatWindow from '../../components/ChatWindow';
import MessageInput from '../../components/MessageInput'
import {ChatMessage, NewChatMessage, UserFormData} from '../../lib/types'

export default function ChatDetail({sessionId}: {sessionId: string}) {
    const [authSession, setAuthSession] = useState<Session | null>(null)
    const [prompts, setPrompts] = useState<ChatMessage[]>([])
    const [newPrompt, setNewPrompt] = useState({content: ''})
    const [userProfile, setUserProfile] = useState<UserFormData | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setAuthSession(session)
        })
    }, [])

    useEffect(() => {        
        if (!sessionId) {
            console.log("No chat session ID provided")
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

            const { data, error } = await supabase.from('profiles').select('*').eq('user_id', authSession.user.id).single();
            console.log("User profile data: ", data)

            if (error) {
                console.error("Error fetching user profile: ", error)
            } else if (data) {
                setUserProfile(data)     
            } 

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/stream`, {
                method: 'POST',
                headers: {
                    'Accept': 'text/event-stream',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPrompt: newPrompt.content,
                    userProfile: userProfile
                })
            })

            const reader = res.body?.getReader()
            const decoder = new TextDecoder('utf-8')
            let streamedContent = ''

            if (reader) {
                while (true) {
                    const {value, done} = await reader.read()
                    if (done) break

                    const chunk = decoder.decode(value, {stream: true})
                    const matches = [...chunk.matchAll(/data: (.*)\n\n/g)]

                    for (const match of matches) {
                        const text = match[1]
                        if (text === '[DONE]') {
                            break
                        }

                        streamedContent += text

                        setPrompts((prev) => {
                            const last = prev[prev.length - 1]
                            if (last?.sender === 'model') {
                                // edit last model message
                                return [...prev.slice(0, -1), {...last, content: streamedContent}]
                            } else {
                                // append new model message
                                return [...prev, {
                                    message_id: crypto.randomUUID(),
                                    session_id: sessionId,
                                    user_id: authSession.user.id,
                                    sender: 'model',
                                    content: text,
                                    created_at: new Date().toISOString()
                                }]
                            }
                        })
                    }
                }
            }

            if (streamedContent) {
                const finalModelMessage: NewChatMessage = {
                    session_id: sessionId,
                    user_id: authSession.user.id,
                    sender: 'model',
                    content: streamedContent.replace(/^\s+/, '').replace(/([.?!])(?=[^\s])/g, '$1 ')  //remove leading white space and ensure sentences have spaces
                }
                await supabase.from("chat_messages").insert(finalModelMessage)
                console.log("Inserted model message: ", finalModelMessage)
            }

        } catch (error) {
            console.error("Error inserting prompt:", error)
        } finally {
            setIsLoading(false)
        }

        const {error} = await supabase.from("chat_sessions").update({"updated_at": new Date().toISOString()}).eq("session_id", sessionId)
        if (error) {
            console.error("Error updating updated_at: ", error)
        } else {
            console.log("Successfully updated updated_at for session: ", sessionId)
        }
    }

    return (
        <div className="flex flex-col h-screen w-full">
            <div className="flex-grow overflow-hidden">
                <ChatWindow prompts={prompts} isLoading={isLoading}/>
            </div>
            <div className="flex-shrink-0">
                <MessageInput
                    value={newPrompt.content}
                    isLoading={isLoading}
                    onChange={(e) => setNewPrompt({content: e.target.value})}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    )
}
