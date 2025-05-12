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

    function formatMessage(text: string): string {
        return text
          .replace(/^\s+/, '')                              // remove leading whitespace
          .replace(/([.?!])(?=\S)/g, '$1 ')                 // ensure space after punctuation
          .replace(/(?<!\n)(\d+)\.\s/g, '\n$1. ')           // newline before numbered items
          .replace(/([a-z])\:\s*(?=\d+\.)/gi, '$1:\n')      // newline after colon before list
    }

    return (
        <div className='flex-1 overflow-y-auto py-6 px-4 h-full'>
            <div className='max-w-[70%] mx-auto space-y-6'>
                {prompts.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <p className="text-lg">Start a conversation</p>
                        <p className="text-sm">Type a message to begin</p>
                    </div>
                )}
                
                {prompts.map((prompt) => (
                    <div 
                        key={prompt.message_id}
                        className={`flex ${prompt.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={
                            prompt.sender === 'user'
                                ? 'bg-zinc-800 text-white px-4 py-3 rounded-2xl inline-block text-center max-w-md'
                                : 'text-white py-2 px-1'
                        }>
                            <p className=" leading-relaxed ">
                                {formatMessage(prompt.content)}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className='flex justify-center items-center py-4'>
                        <div className='animate-pulse flex space-x-2'>
                            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                            <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                            <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
            <div ref={endRef} />
            
            </div>
        </div>
    )
}

export default ChatWindow
