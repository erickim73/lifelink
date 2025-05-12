'use client'

import { SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";



export function NewChat() {
    const router = useRouter()

    const handleClick = () => {
        router.push('/chat')

    }
    
    return (
        <Button
            onClick={handleClick}
            variant="ghost"
            size="icon"
            className="relative"
        >
            <SquarePen className="!h-6 !w-6" />
            <span className="sr-only">New Chat</span>
        </Button>
    )
}