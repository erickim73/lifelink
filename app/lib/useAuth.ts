import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase-client';

export function useAuth () {
    const [session, setSession] = useState<Session | null>(null)
    const searchParams = useSearchParams()
    const refreshParam = searchParams.get('refresh')

    useEffect(() => {
        if (refreshParam) {
            supabase.auth.refreshSession()
        }

        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            console.log("Auth event:", _event)
        })

        return () => subscription.unsubscribe()
    }, [refreshParam])

    return {session}
    
}