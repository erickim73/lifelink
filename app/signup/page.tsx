'use client'
import React, { useState } from 'react'
import { supabase } from "../supabase-client";

const SignUp = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const {error} = await supabase.auth.signUp({email, password})
        if (error) {
            console.error("Error signing up:", error.message)
            return 
        }
    }

    return (
        <div>
            <h1 className = 'text-3xl'>Sign Up Page</h1>
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
                <button type='submit'>
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default SignUp
