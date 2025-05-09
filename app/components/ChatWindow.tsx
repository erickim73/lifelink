'use client'

import React , {useEffect, useRef} from 'react'
import { ChatMessage } from '../lib/types';

type Props = {
    prompts: ChatMessage[];
    isLoading: boolean;
}

const ChatWindow = ({prompts, isLoading}: Props) => {
    const endRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [prompts])
    

    return (
        <div className = 'flex-1 overflow-y-auto p-4 pb-6 h-full'>
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
                        <p className="whitespace-pre-wrap">{prompt.content.replace(/^\s+/, '').replace(/([.?!])(?=\S)/g, '$1 ')}</p>
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
            <div ref={endRef} />
            </div>
        </div>
    )
}

export default ChatWindow
