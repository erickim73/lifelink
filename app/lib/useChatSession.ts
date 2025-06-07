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
    const streamingMessageIdRef = useRef<string | null>(null)

    useEffect(() => {
        pendingResponseCheckedRef.current = false
        firstLoadRef.current = true
        processingAIResponseRef.current = false
        streamingMessageIdRef.current = null
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
                
                // Skip if this is the streaming message we're currently processing
                if (streamingMessageIdRef.current && 
                    newMsg.sender === 'model' && 
                    processingAIResponseRef.current) {
                    return
                }
                
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
    const streamAIResponse = useCallback(async (res: Response, userId: string, messageId: string): Promise<string> => {
        if (!res.body) {
            throw new Error('No response body')
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let streamedContent = ''
        let buffer = ''

        // Store the streaming message ID
        streamingMessageIdRef.current = messageId

        try {
            while (true) {
                const { value, done } = await reader.read()
                
                if (done) {
                    setIsLoading(false)
                    processingAIResponseRef.current = false
                    streamingMessageIdRef.current = null
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
                            streamingMessageIdRef.current = null
                            return streamedContent
                        }
                        
                        if (data.trim() !== '') {
                            streamedContent += data
                            
                            setPrompts((prev) => {
                                return prev.map(msg => {
                                    if (msg.message_id === messageId) {
                                        return {
                                            ...msg,
                                            content: streamedContent.trimStart()
                                        }
                                    }
                                    return msg
                                })
                            })
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Streaming error:', error)
            setIsLoading(false)
            processingAIResponseRef.current = false
            streamingMessageIdRef.current = null
            throw error
        } finally {
            reader.releaseLock()
        }

        return streamedContent
    }, [])

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

            // Create the model message in database first
            const initialModelMessage: NewChatMessage = {
                session_id: sessionId,
                user_id: userId,
                sender: 'model',
                content: '...'
            }
            
            const { data: insertedMsg, error: insertError } = await supabase
                .from("chat_messages")
                .insert(initialModelMessage)
                .select()
                .single()

            if (insertError) {
                console.error("Error inserting initial model message:", insertError)
                processingAIResponseRef.current = false
                setIsLoading(false)
                return
            }

            // Add to local state with the actual database ID
            const actualMessageId = insertedMsg.message_id
            setPrompts((prev) => [...prev, {
                message_id: actualMessageId,
                session_id: sessionId,
                user_id: userId,
                sender: 'model',
                content: '...',
                created_at: insertedMsg.created_at
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

            const streamedContent = await streamAIResponse(res, userId, actualMessageId)

            // Update the existing message in database with final content
            if (streamedContent.trim()) {
                await supabase
                    .from("chat_messages")
                    .update({ content: streamedContent.trimStart() })
                    .eq('message_id', actualMessageId)
            } else {
                // If no content, remove the placeholder message
                await supabase
                    .from("chat_messages")
                    .delete()
                    .eq('message_id', actualMessageId)
                    
                setPrompts((prev) => prev.filter(msg => msg.message_id !== actualMessageId))
                processingAIResponseRef.current = false
                setIsLoading(false)
            } 
        } catch (error) {
            console.error("Error getting response: ", error)
            // Show error message
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
            // Insert user message to database first
            const dbUserMessage: NewChatMessage = {
                session_id: sessionId,
                user_id: user_id,
                sender: 'user',
                content: promptContent
            }
            
            const { data: insertedUserMsg, error: userMsgError } = await supabase
                .from("chat_messages")
                .insert(dbUserMessage)
                .select()
                .single()

            if (userMsgError) {
                console.error("Error inserting user message:", userMsgError)
                setIsLoading(false)
                return
            }

            // Add to local state
            setPrompts((p) => [...p, {
                message_id: insertedUserMsg.message_id,
                session_id: sessionId,
                user_id: user_id,
                sender: 'user',
                content: promptContent,
                created_at: insertedUserMsg.created_at
            }])

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

            // Create model message in database first
            const initialModelMessage: NewChatMessage = {
                session_id: sessionId,
                user_id: user_id,
                sender: 'model',
                content: '...'
            }
            
            const { data: insertedModelMsg, error: modelMsgError } = await supabase
                .from("chat_messages")
                .insert(initialModelMessage)
                .select()
                .single()

            if (modelMsgError) {
                console.error("Error inserting model message:", modelMsgError)
                setIsLoading(false)
                processingAIResponseRef.current = false
                return
            }

            // Add to local state
            const actualMessageId = insertedModelMsg.message_id
            setPrompts((prev) => [...prev, {
                message_id: actualMessageId,
                session_id: sessionId,
                user_id: user_id,
                sender: 'model',
                content: '...',
                created_at: insertedModelMsg.created_at
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

            const streamedContent = await streamAIResponse(res, user_id, actualMessageId)

            // Update the existing message in database with final content
            if (streamedContent.trim()) {
                await supabase
                    .from("chat_messages")
                    .update({ content: streamedContent.trimStart() })
                    .eq('message_id', actualMessageId)
            } else {
                // If no content, remove the placeholder message
                await supabase
                    .from("chat_messages")
                    .delete()
                    .eq('message_id', actualMessageId)
                    
                setPrompts((prev) => prev.filter(msg => msg.message_id !== actualMessageId))
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