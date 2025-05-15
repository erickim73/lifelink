'use client'

import React, { useEffect, useRef, useState } from 'react'
import ChatWindow from '../../components/ChatWindow';
import MessageInput from '../../components/MessageInput'
import { useSidebar } from '@/components/ui/sidebar';
import useChatSession from '../../lib/useChatSession';
import { useTextareaAutoResize } from '@/app/lib/useTextareaAutoResize';
import { useKeyboardFocus } from '../../lib/useKeyboardFocus';

 
export default function ChatDetail({sessionId}: {sessionId: string}) {
    const [newPrompt, setNewPrompt] = useState({content: ''})
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const endRef = useRef<HTMLDivElement | null>(null)
    const {state} = useSidebar()

    const {prompts, isLoading, handleSubmit} = useChatSession({sessionId})
    useTextareaAutoResize(textareaRef, newPrompt.content)
    useKeyboardFocus(textareaRef)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [newPrompt.content])

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const content = newPrompt.content
        setNewPrompt({content: ""})
        await handleSubmit(content)
    }

    return (
        <div className="fixed inset-0 flex flex-col h-screen text-white overflow-hidden"
            style={{
                marginLeft: state === "expanded" ? "16rem" : "4rem", // Adjust based on sidebar state
            }}
        >
            <div className="flex-grow overflow-hidden">
                <ChatWindow prompts={prompts} isLoading={isLoading}/>
                <div ref={endRef}/>
            </div>
            <div className="flex-shrink-0">
                <MessageInput
                    value={newPrompt.content}
                    isLoading={isLoading}
                    onChange={(e) => setNewPrompt({content: e.target.value})}
                    onSubmit={onSubmit}
                    textareaRef={textareaRef}
                />
            </div>
        </div>
    )
}
