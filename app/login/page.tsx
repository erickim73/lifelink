'use client'

import React, { useState } from 'react'
import { supabase } from "../lib/supabase-client";
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

const Login = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [resetPassword, setResetPassword] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const router = useRouter()
       

    const sendResetPassword = async () => {
        if (!email.trim()) {
            setError("Please enter your email address")
            return
        }
        
        setLoading(true)
        setError(null)
        
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset`
            })
            if (error) throw error
            setSuccess(true)
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error sending reset password email:", error)
                setError(error.message || "Failed to send reset email. Please try again.")
            } else {
                console.error("Unknown error:", error)
                setError("Failed to send reset email. Please try again.")
            }            
        } finally {
            setLoading(false)
            setTimeout(() => {
                setSuccess(false)
            }, 5000)
        }
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const {data, error} = await supabase.auth.signInWithPassword({email, password})

            if (error) {
                setError(error.message)
                return
            }

            const signedInSession = data.session

            if (!signedInSession?.user?.id) {
                setError("Login failed. Please try again.")
                return
            } 

            console.log("Successfully signed in with user ID:", signedInSession.user.id)
            router.push('/chat')
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error signing in:", error)
                setError("An unexpected error occurred. Please try again.")
            } else {
                console.error("Unknown error:", error)
                setError("Unknown error. Please try again")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md px-6">
                <div className="flex flex-col items-center mb-5">
                    <Link href="/" aria-label="Go to homepage">
                        <Image
                            alt="LifeLink Logo"
                            src="/lifelink_logo.png"
                            width={60} 
                            height={60}
                            className="mb-2"
                            priority
                        />
                    </Link>
                    <h1 className="text-3xl font-semibold text-white mb-1">
                        {resetPassword ? 'Reset Password' : 'Welcome back'}
                    </h1>
                    <p className="text-gray-400 text-center">
                        {resetPassword ? 'Enter your email to receive a reset link' : 'Log in to your account'}
                    </p>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-700">
                    {error && (
                        <div 
                            className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 text-red-200"
                            role="alert"
                        >
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mb-6 text-green-200">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Reset link sent! Check your email inbox.</span>
                            </div>
                        </div>
                    )}

                    {!resetPassword ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm text-gray-300 block font-medium">
                                    Email address
                                </label>
                                <input 
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 focus:ring-2 focus:ring-blue-500/50"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm text-gray-300 block font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <input 
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 pr-10 focus:ring-2 focus:ring-blue-500/50"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading || !email || !password}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 px-4 rounded-xl hover:bg-[#1A4B84]/90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="h-5 w-5 border-2 border-gray-600 border-t-white rounded-full animate-spin mr-2"></div>
                                        <span>Logging in...</span>
                                    </div>
                                ) : (
                                    "Log in"
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="reset-email" className="text-sm text-gray-300 block font-medium">
                                    Email address
                                </label>
                                <input
                                    id="reset-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 focus:ring-2 focus:ring-blue-500/50"
                                    required
                                />
                            </div>

                            <button 
                                onClick={sendResetPassword}
                                disabled={loading || !email}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 px-4 rounded-xl hover:bg-[#1A4B84]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="h-5 w-5 border-2 border-gray-600 border-t-white rounded-full animate-spin mr-2"></div>
                                        <span>Sending reset link...</span>
                                    </div>
                                ) : (
                                    "Send reset link"
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Changed structure: Added these links directly below the form inside the card */}
                <div className="mt-4 flex flex-row justify-between">
                    {!resetPassword && (
                        <>
                            <p
                                onClick={() => {
                                    setResetPassword(!resetPassword)
                                    setError(null)
                                }}
                                className="text-blue-400 hover:underline cursor-pointer text-sm"
                            >
                                Forgot password?
                            </p>
                            
                            <Link href="/signup" className="text-blue-400 hover:underline text-sm">
                                Create account
                            </Link>
                        </>
                    )}
                    
                    {resetPassword && (
                        <p
                            onClick={() => {
                                setResetPassword(!resetPassword)
                                setError(null)
                            }}
                            className="text-blue-400 hover:underline cursor-pointer text-sm"
                        >
                            Back to login
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login