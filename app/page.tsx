'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase-client';
import type {Session} from '@supabase/supabase-js'

export default function Home() {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        const fetchSession = async () => {const {data: {session}} = await supabase.auth.getSession()
            setSession(session)
        }
        fetchSession()

        const {data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session)
            console.log("Auth event:", event)
            console.log("Session", session)
        })

        return () => subscription.unsubscribe()


    }, [])

    const logout = async () => {
        await supabase.auth.signOut();
        console.log("Logged out")
    }

    return (
        <div className="h-screen">
            <h1 className='text-3xl'>Main Page</h1>

            {session ? (
                <>
                    <Link href = '/chat'>
                        <button className='border border-white p-3 rounded-2xl'>
                            Chat
                        </button>
                    </Link>
                    <Link href = '/settings'>
                        <button className='border border-white p-3 rounded-2xl'>
                            Settings
                        </button>
                    </Link>
                    <button onClick={logout} className='border border-white p-3 rounded-2xl'>
                        Log Out
                    </button>
                </>
            ) : (
                <>
                    <Link href = '/signup'>
                        <button className='border border-white p-3 rounded-2xl'>
                            Sign up page
                        </button>
                    </Link>

                    <Link href = '/login'>
                        <button className='border border-white p-3 rounded-2xl'>
                            Login page
                        </button>
                    </Link>
                </>
            )}
        </div>
    )
    
}

