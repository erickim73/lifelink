import { useEffect, useRef, useState, useCallback } from 'react' 
import { supabase } from './supabase-client'
import { Session } from '@supabase/supabase-js';
import { NewChatMessage, ChatMessage } from '@/app/lib/types';


function useChatSession({sessionId}: {sessionId: string}) {
    const [authSession, setAuthSession] = useState<Session | null>(null)    
    const [prompts, setPrompts] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const pendingResponseCheckedRef = useRef(false)
    const firstLoadRef = useRef(true)    
    const processingAIResponseRef = useRef(false)

    useEffect(() => {
        pendingResponseCheckedRef.current = false
        firstLoadRef.current = true
        processingAIResponseRef.current = false
    }, [sessionId])
    
    // get auth session on component mount
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setAuthSession(session)
        })
    }, [])    

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
    const streamAIResponse = useCallback(async (res: Response, userId: string): Promise<string> => {
        if (!res.body) {
            throw new Error('No response body')
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let streamedContent = ''
        let buffer = ''

        try {
            while (true) {
                const { value, done } = await reader.read()
                
                if (done) {
                    setIsLoading(false)
                    processingAIResponseRef.current = false
                    break
                }

                buffer += decoder.decode(value, { stream: true })
                
                const lines = buffer.split('\n')
                buffer = lines.pop() || '' // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.trim() === '') continue
                    
                    if (line.startsWith('data: ')) {
                        const data = line.substring(6) 
                        
                        if (data.trim() === '[DONE]') {
                            setIsLoading(false)
                            processingAIResponseRef.current = false
                            return streamedContent
                        }
                        
                        if (data.trim() !== '') {
                            streamedContent += data
                            
                            setPrompts((prev) => {
                                const last = prev[prev.length - 1]
                                
                                // Find and update the loading message or latest model message
                                if (last?.sender === 'model') {
                                    if (last.content === '...' || !last.content.includes('Error:')) {
                                        // Replace loading message or update existing model message
                                        return [...prev.slice(0, -1), {
                                            ...last, 
                                            content: streamedContent.trimStart()
                                        }]
                                    }
                                }
                                
                                // If no suitable message to update, create new one
                                return [...prev, {
                                    message_id: crypto.randomUUID(),
                                    session_id: sessionId,
                                    user_id: userId,
                                    sender: 'model',
                                    content: streamedContent.trimStart(),
                                    created_at: new Date().toISOString()
                                }]
                            })
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Streaming error:', error)
            setIsLoading(false)
            processingAIResponseRef.current = false
            throw error
        } finally {
            reader.releaseLock()
        }

        return streamedContent
    }, [sessionId])


    // Wrapped in useCallback to stabilize between renders
    const initiateAIResponse = useCallback(async (promptContent: string, userId: string) => {
        if (!authSession || !promptContent || !sessionId) {
            return
        }

        if (processingAIResponseRef.current) {
            return
        }

        processingAIResponseRef.current = true
        setIsLoading(true)

        try {
            const {data: profileData, error: profileError} = await supabase.from('profiles').select("*").eq('user_id', userId).single()
            
            if (profileError || !profileData) {
                console.error("Error fetching user profile: ", profileError)
                processingAIResponseRef.current = false 
                setIsLoading(false)
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
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({
                    newPrompt: promptContent,
                    userProfile: profileData,
                })
            })

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`)
            }

            const streamedContent = await streamAIResponse(res, userId)

            if (streamedContent.trim()) {
                const finalModelMessage: NewChatMessage = {
                    session_id: sessionId,
                    user_id: authSession.user.id,
                    sender: 'model',
                    content: streamedContent.trimStart()
                }
                await supabase.from("chat_messages").insert(finalModelMessage)
            } else {
                processingAIResponseRef.current = false
                setIsLoading(false)
            } 
        } catch (error) {
            console.error("Error getting response: ", error)
            // Remove loading message and show error
            setPrompts((prev) => {
                const filtered = prev.filter(msg => msg.content !== '...')
                return [...filtered, {
                    message_id: crypto.randomUUID(),
                    session_id: sessionId,
                    user_id: userId,
                    sender: 'model',
                    content: 'Sorry, I encountered an error. Please try again.',
                    created_at: new Date().toISOString()
                }]
            })
            setIsLoading(false)
            processingAIResponseRef.current = false
        }
    }, [authSession, sessionId, streamAIResponse]) 

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
                if (!pendingResponseCheckedRef.current && !processingAIResponseRef.current && authSession?.user?.id && data && data.length > 0) {
                    pendingResponseCheckedRef.current = true
                    const lastMessage = data[data.length - 1] as ChatMessage

                    if (lastMessage.sender === 'user') {
                        const userMessageIndex = data.length - 1
                        const hasModelResponse = data.slice(userMessageIndex + 1).some(msg => msg.sender === 'model')
                        
                        if (!hasModelResponse) {
                            initiateAIResponse(lastMessage.content, authSession.user.id)
                        }
                    }
                }
                firstLoadRef.current = false
            } catch (error) {
                console.error("Error fetching chat session: ", error)
            }
        }
        fetchMessages()
    }, [sessionId, authSession, initiateAIResponse]) 

    const handleSubmit = async (promptContent: string) => {
        if (!promptContent.trim() || !authSession?.user.id || !sessionId || isLoading) {
            return
        }

        if (processingAIResponseRef.current) {
            return
        }

        setIsLoading(true)
        const user_id = authSession.user.id

        try {
            const userMsgId = crypto.randomUUID()
            const newUserMessage: ChatMessage = {
                message_id: userMsgId,
                session_id: sessionId,
                user_id: user_id,
                sender: 'user',
                content: promptContent,
                created_at: new Date().toISOString()
            }
            
            setPrompts((p) => [...p, newUserMessage])

            const dbUserMessage: NewChatMessage = {
                session_id: sessionId,
                user_id: user_id,
                sender: 'user',
                content: promptContent
            }
            await supabase.from("chat_messages").insert(dbUserMessage)

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user_id)
                .single()

            if (profileError || !profileData) {
                console.error("Error fetching user profile: ", profileError)
                setIsLoading(false)
                return
            }

            processingAIResponseRef.current = true

            const loadingMsgId = crypto.randomUUID()
            setPrompts((prev) => [...prev, {
                message_id: loadingMsgId,
                session_id: sessionId,
                user_id: user_id,
                sender: 'model',
                content: '...',
                created_at: new Date().toISOString()
            }])

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/stream`, {
                method: 'POST',
                headers: {
                    'Accept': 'text/event-stream',
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({
                    newPrompt: promptContent,
                    userProfile: profileData,
                    sessionId: sessionId
                })
            })

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`)
            }

            const streamedContent = await streamAIResponse(res, user_id)

            if (streamedContent.trim()) {
                const finalModelMessage: NewChatMessage = {
                    session_id: sessionId,
                    user_id: authSession.user.id,
                    sender: 'model',
                    content: streamedContent.trimStart()    
                }
                await supabase.from("chat_messages").insert(finalModelMessage)
            } else {
                processingAIResponseRef.current = false
                setIsLoading(false)
            }

            await supabase
                .from("chat_sessions")
                .update({"updated_at": new Date().toISOString()})
                .eq("session_id", sessionId)

        } catch (error) {
            console.error("Error processing message:", error)
            setPrompts((prev) => {
                const filtered = prev.filter(msg => msg.content !== '...')
                return [...filtered, {
                    message_id: crypto.randomUUID(),
                    session_id: sessionId,
                    user_id: user_id,
                    sender: 'model',
                    content: 'Sorry, I encountered an error. Please try again.',
                    created_at: new Date().toISOString()
                }]
            })
            setIsLoading(false)
            processingAIResponseRef.current = false
        } 
    }

    return {prompts, isLoading, handleSubmit, authSession}
}

export default useChatSession