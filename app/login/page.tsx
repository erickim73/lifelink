'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from "../lib/supabase-client";
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';


const Login = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [session, setSession] = useState<Session | null>(null)
    const router = useRouter()
    
    
    useEffect(() => {
        const fetchSession = async () => {const {data: {session}} = await supabase.auth.getSession()
            setSession(session)
        }
        fetchSession()

        const {data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session)
            console.log("Auth event:", event)
        })

        return () => subscription.unsubscribe()
    }, [])
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const {data, error} = await supabase.auth.signInWithPassword({email, password})

        if (error) {
            console.error("Error signing in:", error.message)
            return
        }

        const signedInSesssion = data.session

        if (!signedInSesssion?.user?.id) {
            console.error("No user ID found in session")
            console.log("Error signing in with email:", email, "and password", password)
            console.log(session)
            return
        } 

        console.log("Successfully signed in with user ID:", signedInSesssion.user.id)
        router.push('/')
    }

    return (
        <div>
            <h1 className = 'text-3xl'>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                <input 
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <button type='submit' className = 'border border-white p-3 rounded-2xl'>
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login
