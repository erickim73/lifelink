import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase-client'

export const createNewSession = async (session: Session | null) => {
    if (!session?.user.id) {
        console.warn("User ID is not available. Cannot create a new chat session.")
        return null
    }

    const {data, error} = await supabase.from('chat_sessions').insert({user_id: session.user.id}).select().single()

    if (error) {
        console.error("Error creating new chat session: ", error.message)
        return
    }
    return data.session_id
}