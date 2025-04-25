'use client'
import React, { useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../supabase-client'

const useChatSession = (session: Session | null) => {
    const [chatSessionId, setChatSessionId] = React.useState<string | null>(null)

    useEffect(() => {
        const createNewSession = async () => {
            if (!session?.user.id) {
                console.warn("User ID is not available. Cannot create a new chat session.")
                return
            }

            const {data, error} = await supabase.from('chat_sessions').insert({user_id: session.user.id}).select().single()

            if (error) {
                console.error("Error creating new chat session: ", error.message)
                return
            }
            console.log("New chat session created:", data)
            setChatSessionId(data.id)
        }
        if (session && !chatSessionId) {
            createNewSession()
        }
    }, [session])

    return chatSessionId
}

export default useChatSession