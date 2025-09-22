'use client'

import React, { useEffect, useRef, useState } from 'react'
import ChatWindow from '../../components/ChatWindow';
import MessageInput from '../../components/MessageInput'
import useChatSession from '../../lib/useChatSession';
import { useTextareaAutoResize } from '@/app/lib/useTextareaAutoResize';
import { useKeyboardFocus } from '../../lib/useKeyboardFocus';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image';

export default function ChatDetail({sessionId}: {sessionId: string}) {
    const [newPrompt, setNewPrompt] = useState({content: ''})
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const endRef = useRef<HTMLDivElement>(null)

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
        <div className="flex flex-col h-screen w-full bg-zinc-900">
            {/* Mobile header */}
            <header className="flex-shrink-0 z-20 flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900 md:hidden">
                <SidebarTrigger className="flex-none" />
                <div className="flex items-center justify-center flex-grow">
                    <Image alt="LifeLink Logo" src="/lifelink_logo.png" width={28} height={28} className="mr-2" />
                    <h1 className="text-xl font-semibold">LifeLink</h1>
                </div>
                <div className="flex-none w-10"></div> {/* Empty div for balance */}
            </header>

            {/* Main chat area with consistent width container */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                    <ChatWindow prompts={prompts} isLoading={isLoading} endRef={endRef} />
                </div>
                
                <MessageInput
                    value={newPrompt.content}
                    isLoading={isLoading}
                    onChange={(e) => setNewPrompt({ content: e.target.value })}
                    onSubmit={onSubmit}
                    textareaRef={textareaRef}
                />
            </div>
        </div>
    )
}