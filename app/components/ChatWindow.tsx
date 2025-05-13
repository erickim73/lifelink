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
          .replace(/^\s+|\s+$/g, "")         // trim leading / trailing whitespace
          .replace(/\r\n/g, "\n")            // normalise line endings
          .replace(/(\d+\.)\s*\n+/g, "$1 ")  // CHANGED: keep list number on same line
          .replace(/\n{3,}/g, "\n\n");       // CHANGED: collapse 3+ newlines → exactly 2
    }
      

    return (
        <div className='flex-1 overflow-y-auto py-6 px-4 h-full bg-zinc-900'>
            <div className='max-w-[70%] mx-auto space-y-6'>
                {prompts.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                        
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
                                ? 'bg-zinc-800 text-white px-4 py-3 rounded-2xl inline-block max-w-md'
                                : 'text-white py-2 px-1'
                        }>
                            <p className="leading-relaxed whitespace-pre-wrap">
                                {/* {prompt.content} */}
                                {formatMessage(prompt.content)}
                                {/* {formatMessage("To help maintain healthy hair and prevent hair loss, I'd be happy to provide some tips that might be suitable for you, Eric. Here are some things you can consider:\n\n1. Healthy Diet: Consuming a balanced diet rich in protein, vitamins, and minerals is essential for hair health. Foods like fish, eggs, nuts, seeds, and vegetables are great sources of these nutrients.\n\n2. Regular Exercise: Regular physical activity, including weightlifting if suitable for you given your health goals, can help stimulate blood flow to your scalp, promoting hair growth.\n\n3. Avoid Tight Hairstyles: Try to avoid hairstyles that pull on the hair tightly, as this can lead to hair loss over time.\n\n4. Limit Heat Styling: Using heating tools excessively can damage your hair, potentially leading to breakage or hair loss. Try to limit the use of hot tools like hair straighteners or curling irons.\n\n5. Manage Stress: Stress can affect hair growth, so finding ways to manage stress, such as through exercise, meditation, or relaxation techniques, can help promote healthy hair.\n\n6. Avoid Harsh Chemicals: Hair dyes, bleach, and perms can damage your hair and potentially cause hair loss. If you must use these products, try to use them less frequently and follow the instructions carefully.\n\n7. Regular Trims: Getting regular hair trims every 8-12 weeks can help remove split ends and keep your hair looking healthy.\n\n8. Hydration: Staying hydrated is important for overall health, including hair health. Make sure you're drinking enough water each day.\n\n9. Limit Sun Exposure: Protect your scalp from the sun by wearing a hat or using a hair product with sunscreen.\n\n10. Gentle Hair Care: When washing your hair, use a gentle shampoo and conditioner, and avoid scrubbing your scalp too vigorously.\n\nIf you notice an unusual amount of hair loss, it may be a good idea to consult with a healthcare professional to rule out any underlying health issues.\n\n.")} */}
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
