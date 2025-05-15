import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase-client'
import { Session } from '@supabase/supabase-js';
import { NewChatMessage, ChatMessage } from '@/app/lib/types';


function useChatSession({sessionId}: {sessionId: string}) {
    const [authSession, setAuthSession] = useState<Session | null>(null)    
    const [prompts, setPrompts] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const pendingResponseCheckedRef = useRef(false)
    const firstLoadRef = useRef(true)
    
    
    // get auth session on component mount
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setAuthSession(session)
        })
    }, [])

    // load messages and check for pending responses
    useEffect(() => {
        if (!sessionId || !authSession?.user?.id) {
            return
        }

        const fetchMessages = async () => {
            try {
                const {data, error} = await supabase.from("chat_messages").select("*").eq('session_id', sessionId).order('created_at')

                if (error) {
                    console.error("Error fetching chat messages: ", error.message)
                    return
                }

                setPrompts(data as ChatMessage[])

                // if first message
                if (!pendingResponseCheckedRef.current && authSession?.user?.id && data && data.length > 0) {
                    pendingResponseCheckedRef.current = true
                    const lastMessage = data[data.length - 1] as ChatMessage

                    if (lastMessage.sender === 'user') {
                        console.log("Found pending user message, initiating AI response")
                        initiateAIResponse(lastMessage.content, authSession.user.id)
                    }
                }
                firstLoadRef.current = false
            } catch (error) {
                console.error("Error fetching chat session: ", error)
            }
        }
        fetchMessages()
    }, [sessionId, authSession])

    // realtime subscription for new messages
    useEffect(() => {
        if (!sessionId) {
            return
        }
        const channel = supabase.channel('realtime_chat').on('postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `session_id=eq.${sessionId}`
            },
            (payload) => {
                const newMsg = payload.new as ChatMessage
                setPrompts((prev) => {
                    // Check if the message already exists in our list to avoid duplicates
                    if (!prev.some(msg => msg.message_id === newMsg.message_id)) {
                        return [...prev, newMsg]
                    }
                    return prev
                })
            }
        ).subscribe()
    
        return () => {
            supabase.removeChannel(channel)
        }
    }, [sessionId])

    // helper function for streaming ai response
    const streamAIResponse = async (res: Response, userId: string) => {
        const reader = res.body?.getReader()
        const decoder = new TextDecoder('utf-8')
        let streamedContent = ''
        let hasStartedStreaming = false

        if (!reader) {
            return ''
        }

        while (true) {
            const {value, done} = await reader.read()
            if (done) break

            const clean = decoder.decode(value, { stream: true }).replace(/^data:\s?/gm, "");

            if (clean.trim() === '[DONE]') continue;
        
            if (!hasStartedStreaming && clean.trim()) {
                hasStartedStreaming = true;
                setIsLoading(false); 
            }


            streamedContent += clean;

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
                        user_id: userId,
                        sender: 'model',
                        content: clean,
                        created_at: new Date().toISOString()
                    }]
                }
            })
        }
        return streamedContent
    }

    const initiateAIResponse = async (promptContent: string, userId: string) => {
        if (!authSession || !promptContent || !sessionId) {
            return
        }

        setIsLoading(true)

        try {
            const {data: profileData, error: profileError} = await supabase.from('profiles').select("*").eq('user_id', userId).single()
            
            if (profileError || !profileData) {
                console.error("Error fetching user profile: ", profileError)
                return
            }

            const loadingMsgId = crypto.randomUUID()
            setPrompts((prev) => [...prev, {
                message_id: loadingMsgId,
                session_id: sessionId,
                user_id: userId,
                sender: 'model',
                content: '...',
                created_at: new Date().toISOString()
            }])

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/stream`, {
                method: 'POST',
                headers: {
                    'Accept': 'text/event-stream',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPrompt: promptContent,
                    userProfile: profileData,
                })
            })

            const streamedContent = await streamAIResponse(res, userId)

            if (streamedContent) {
                const finalModelMessage: NewChatMessage = {
                    session_id: sessionId,
                    user_id: authSession.user.id,
                    sender: 'model',
                    content: streamedContent.trimStart()
                }
                await supabase.from("chat_messages").insert(finalModelMessage)
                console.log("Inserted model message: ", finalModelMessage)
            }       
        } catch (error) {
            console.error("Error getting response: ", error)
            setPrompts((prev) => prev.filter(msg => msg.message_id !== 'temp-loading-message'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (promptContent: string) => {
        if (!promptContent.trim() || !authSession?.user.id || !sessionId) {
            console.log("Cannot submit: missing prompt, user ID, or session ID")
            return
        }

        setIsLoading(true)
        const user_id = authSession.user.id

        try {
            const newUserMessage: NewChatMessage = {
                session_id: sessionId,
                user_id: user_id,
                sender: 'user',
                content: promptContent
            }

            await supabase.from("chat_messages").insert(newUserMessage)
            setPrompts((p) => [...p, {...newUserMessage, message_id: crypto.randomUUID(), created_at: new Date().toISOString()}])

            const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('user_id', user_id).single();

            if (profileError || !profileData) {
                console.error("Error fetching user profile: ", profileError);
                setIsLoading(false);
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/stream`, {
                method: 'POST',
                headers: {
                    'Accept': 'text/event-stream',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPrompt: promptContent,
                    userProfile: profileData,
                    sessionId: sessionId
                })
            })

            const streamedContent = await streamAIResponse(res, user_id)

            if (streamedContent) {
                const finalModelMessage: NewChatMessage = {
                    session_id: sessionId,
                    user_id: authSession.user.id,
                    sender: 'model',
                    content: streamedContent.trimStart()    
                }
                await supabase.from("chat_messages").insert(finalModelMessage)
            }

            await supabase.from("chat_sessions").update({"updated_at":new Date().toISOString}).eq("session_id", sessionId)
        } catch (error) {
            console.error("Error processing message:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return {prompts, isLoading, handleSubmit, authSession}
}

export default useChatSession