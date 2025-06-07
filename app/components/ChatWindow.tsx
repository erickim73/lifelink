'use client' 

import React , {useEffect} from 'react'
import { ChatMessage } from '../lib/types';
import { useSidebar } from '@/components/ui/sidebar';

type Props = {
    prompts: ChatMessage[];
    isLoading: boolean;
    endRef: React.RefObject<HTMLDivElement | null>
}

const ChatWindow = ({prompts, isLoading, endRef}: Props) => {
    const { isMobile } = useSidebar()

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [prompts, endRef])

    const isControlMessage = (content: string): boolean => {
        const trimmed = content.trim()
        return (
            trimmed === '[DONE]' ||
            trimmed.startsWith('data:') ||
            trimmed === '' ||
            trimmed === '...'
        )
    }

    function formatMessage(text: string): React.ReactNode {
        if (isControlMessage(text)) {
            return null
        }
        
        // More aggressive approach to handle your specific formatting issue
        let formattedText = text
            .replace(/^\s+|\s+$/g, "")         // trim leading / trailing whitespace
            .replace(/\r\n/g, "\n")            // normalise line endings
        
        // Key fix: Insert double newlines before numbered list items that don't already have them
        formattedText = formattedText.replace(/([^.\n])(\d+\.\s+)/g, '$1\n\n$2')
        
        // Also handle cases where numbered items are directly after punctuation
        formattedText = formattedText.replace(/([.!?])(\d+\.\s+)/g, '$1\n\n$2')
        
        // Clean up any triple+ newlines
        formattedText = formattedText.replace(/\n{3,}/g, '\n\n')

        // Split into sections
        const sections = formattedText.split('\n\n').filter(section => section.trim().length > 0)

        return sections.map((section, sectionIndex) => {
            const trimmedSection = section.trim()
            
            // Check if this section starts with a numbered list item
            if (/^\d+\.\s/.test(trimmedSection)) {
                // This is a numbered list item
                const match = trimmedSection.match(/^(\d+\.\s+)(.*)$/s)
                if (match) {
                    const [, number, content] = match
                    
                    // Handle bullet points within the numbered item
                    if (content.includes('- ')) {
                        const parts = content.split(/(?=- )/);
                        const mainContent = parts[0].trim()
                        const bulletItems = parts.slice(1)
                        
                        return (
                            <div key={sectionIndex} className={sectionIndex < sections.length - 1 ? "mb-6" : ""}>
                                <div className="mb-3">
                                    <span className="font-bold text-blue-400">{number}</span>
                                    <span className="font-semibold">{mainContent}</span>
                                </div>
                                {bulletItems.length > 0 && (
                                    <div className="ml-6 space-y-2">
                                        {bulletItems.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex">
                                                <span className="mr-2 text-blue-300">•</span>
                                                <span>{item.replace(/^-\s*/, '').trim()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    } else {
                        // Simple numbered item without bullet points
                        return (
                            <div key={sectionIndex} className={sectionIndex < sections.length - 1 ? "mb-4" : ""}>
                                <span className="font-bold text-blue-400">{number}</span>
                                <span>{content}</span>
                            </div>
                        )
                    }
                }
            }
            
            // Handle standalone bullet points
            if (trimmedSection.startsWith("- ")) {
                return (
                    <div key={sectionIndex} className={`flex ${sectionIndex < sections.length - 1 ? "mb-4" : ""}`}>
                        <span className="mr-2 font-bold text-blue-300">•</span>
                        <span>{trimmedSection.substring(2)}</span>
                    </div>
                )
            }
            
            // Regular paragraph
            return (
                <p key={sectionIndex} className={`leading-relaxed ${sectionIndex < sections.length - 1 ? "mb-4" : ""}`}>
                    {trimmedSection}
                </p>
            )
        })
    }

    return (
        <div className="w-full h-full overflow-y-auto bg-zinc-900">
            <div
                className="w-full max-w-3xl px-4 mx-auto"
                style={{
                    paddingTop: isMobile ? "1.5rem" : "1.5rem",
                    paddingBottom: isMobile ? "120px" : "0.5rem",
                }}
            >
                {prompts.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                        <p className="text-lg">Start a conversation</p>
                        <p className="text-sm">Type a message to begin</p>
                    </div>
                )}
                
                {prompts.map((prompt) => (
                    <div 
                        key={prompt.message_id}
                        className={`flex ${prompt.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                    >
                        <div
                            className={
                                prompt.sender === "user"
                                ? "bg-zinc-800 text-white px-4 py-3 rounded-2xl inline-block max-w-md"
                                : "text-white py-2 px-1 font-sans"
                            }
                        >
                            <div className={`leading-relaxed whitespace-pre-wrap ${prompt.sender !== "user" ? "text-base" : ""}`}>
                                {formatMessage(prompt.content)}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className='flex items-center justify-center py-4'>
                        <div className='flex space-x-2 animate-pulse'>
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <div className="w-2 h-2 delay-100 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 delay-200 bg-blue-400 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
            <div ref={endRef} className="h-4" />
            
            </div>
        </div>
    )
}

export default ChatWindow