'use client'
import { Session } from '@supabase/supabase-js';
import {supabase} from '../supabase-client'
import React, { useEffect, useState } from 'react'

interface ChatMessage {
    message_id: string;
    // session_id: string;
    user_id: string;
    sender: 'user' | 'model';
    content: string;
    created_at: string;
}

type NewChatMessage = Omit<ChatMessage, 'message_id' | 'created_at'>;

const ChatHistory = () => {
    const [newPrompt, setNewPrompt] = useState({content: ''})
    const [prompts, setPrompts] = useState<ChatMessage[]>([]);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(false)

    const fetchPrompts = async () => {
        const {error, data} = await supabase.from("chat_messages").select('*').order("created_at", {ascending: true})

        if (error) {
            console.error("Error reading task: ", error.message)
            return
        }
        setPrompts(data as ChatMessage[])
        console.log("Fetched prompts: ", data)
    }

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })
    }, [])

    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()

        setNewPrompt({content: ''})

        if (!newPrompt.content.trim()) {
            console.warn("Prompt is empty. Please enter a prompt.")
            return
        }
        setIsLoading(true)
        console.log('Prompt:', newPrompt.content)

        let responseText = ''
    
        try {
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
            responseText = data.response?.trim() || '';
            console.log('Response:', data.response)
        } catch (err) {
            console.error('Error:', err)
            setIsLoading(false)
            return
        }

        try {
            if (!session || !session.user || !session?.user?.id) {
                console.error("No user ID found in session", session?.user.id)
                console.log('Session:', session)
                setIsLoading(false)
                return
            }
            
            const newUserMessage: NewChatMessage = {
                // session_id: 'session-id',
                user_id: session.user.id,
                sender: 'user',
                content: newPrompt.content
            }

            const messageToInsert: NewChatMessage[] = [newUserMessage]

            if (responseText) {
                const newModelMessage: NewChatMessage = {
                    // session_id: 'session-id',
                    user_id: session.user.id,
                    sender: 'model',
                    content: responseText
                }
                messageToInsert.push(newModelMessage)
            }            

            console.log("Inserting messages: ", messageToInsert)

            await supabase.from("chat_messages").insert(messageToInsert).throwOnError()
            await fetchPrompts()            
              
        } catch (err) {
            console.error("Error inserting message: ", err)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchPrompts()
    }, [])

    return (
        <div className = 'flex flex-col h-screen bg-gray-900'>
            <div className = 'flex-1 overflow-y-auto p-4 pb-24'>
                <div className = 'max-w-4xl mx-auto space-y-4'>
                    {prompts.map((prompt) => (
                        <div 
                            key={prompt.message_id} 
                            className={`p-3 rounded-lg max-w-3xl ${
                                prompt.sender === 'user' 
                                    ? 'bg-gray-500 ml-auto text-white' 
                                    : 'bg-gray-700 text-gray-100'
                            }`}
                        >
                            <p className="text-sm font-semibold mb-1">
                                {prompt.sender === 'user' ? 'You' : 'AI Assistant'}
                            </p>
                            <p className="whitespace-pre-wrap">{prompt.content}</p>
                        </div>
                    ))}
                    {isLoading && (
                        <div className = 'flex justify-center items-center py-4'>
                            <div className = 'animate-pulse flex space-x-2'>
                                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className = 'border-t border-gray-700 bg-gray-800 p-4'>
                <form onSubmit = {handleSubmit} className = 'max-w-4xl mx-auto'>
                    <div className='flex gap-2'>
                        <input
                            type = 'text'
                            placeholder='Type your message here...'
                            value={newPrompt.content}
                            onChange={(e) => setNewPrompt((prev) => ({...prev, content: e.target.value}))}
                            className="flex-1 border border-gray-600 bg-gray-700 rounded-full text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type = 'submit'
                            disabled={isLoading}
                            className={`bg-blue-600 text-white rounded-full px-6 py-3 font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChatHistory;
