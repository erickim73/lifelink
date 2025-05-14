'use client'

import React, { useState } from 'react'
import { supabase } from "../lib/supabase-client";
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SignUp = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return 
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return 
        }
        setLoading(true)

        try {
            const {data, error: signupError} = await supabase.auth.signUp({email, password})
            if (signupError) {
                setError(signupError.message)
                return 
            }

            if (data) {
                router.push('/onboarding')
            }
        } catch (error) {
            console.error("Error signing up:", error)
            setError("An error occurred during sign up. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center">
            <div className="w-full max-w-md px-6">
                <div className="flex flex-col items-center mb-10">
                    <Image
                        alt="LifeLink Logo"
                        src="/lifelink_logo.png"
                        width={50} 
                        height={50}
                        className="mb-4"
                    />
                    <h1 className="text-3xl font-semibold text-white mb-2">Create your account</h1>
                    <p className="text-gray-400 text-center">Join LifeLink to get started</p>
                </div>
                <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-700">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 text-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm text-gray-300 block">
                                Email address
                            </label>
                            <input 
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 focus:ring-2 focus:ring-blue-500/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm text-gray-300 block">
                                Password
                            </label>
                            <input 
                                id="password"
                                type="password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 focus:ring-2 focus:ring-blue-500/50"
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirm-password" className="text-sm text-gray-300 block">
                                Confirm password
                            </label>
                            <input 
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 focus:ring-2 focus:ring-blue-500/50"
                                required
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading || !email || !password || !confirmPassword}
                            className="w-full bg-[#1A4B84] text-white font-medium py-3 px-4 rounded-xl hover:bg-[#1A4B84]/90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="h-5 w-5 border-2 border-gray-600 border-t-white rounded-full animate-spin mr-2"></div>
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                "Sign up"
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-400 hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
        
    )
}

export default SignUp
