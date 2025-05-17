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
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-5 sm:px-4 py-10 sm:py-12">
            <div className="w-full max-w-[360px] sm:max-w-md">
                <div className="flex flex-col items-center mb-6 sm:mb-5">
                    <Link href="/" aria-label="Go to homepage" className="mb-3 sm:mb-2">
                        <Image
                            alt="LifeLink Logo"
                            src="/lifelink_logo.png"
                            width={60} 
                            height={60}
                            className="w-14 h-14 sm:w-[60px] sm:h-[60px]"
                            priority
                        />
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2 sm:mb-1 text-center">
                        {resetPassword ? 'Reset Password' : 'Welcome back'}
                    </h1>
                    <p className="text-base sm:text-base text-gray-400 text-center max-w-[300px] sm:max-w-none">
                        {resetPassword ? 'Enter your email to receive a reset link' : 'Log in to your account'}
                    </p>
                </div>

                <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-zinc-700">
                    {error && (
                        <div 
                            className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 sm:p-3 mb-5 sm:mb-6 text-red-200 text-sm sm:text-base"
                            role="alert"
                        >
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 sm:h-5 sm:w-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 sm:p-3 mb-5 sm:mb-6 text-green-200 text-sm sm:text-base">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 sm:h-5 sm:w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Reset link sent! Check your email inbox.</span>
                            </div>
                        </div>
                    )}

                    {!resetPassword ? (
                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-5">
                            <div className="space-y-2 sm:space-y-2">
                                <label htmlFor="email" className="text-sm sm:text-sm text-gray-300 block font-medium">
                                    Email address
                                </label>
                                <input 
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 sm:py-3 px-4 sm:px-4 text-base sm:text-base focus:ring-2 focus:ring-blue-500/50"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-2 sm:space-y-2">
                                <label htmlFor="password" className="text-sm sm:text-sm text-gray-300 block font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <input 
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 sm:py-3 px-4 sm:px-4 pr-10 text-base sm:text-base focus:ring-2 focus:ring-blue-500/50"
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
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 sm:py-3 px-4 rounded-lg sm:rounded-xl hover:bg-[#1A4B84]/90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-2 text-base sm:text-base"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="h-5 w-5 sm:h-5 sm:w-5 border-2 border-gray-600 border-t-white rounded-full animate-spin mr-2"></div>
                                        <span>Logging in...</span>
                                    </div>
                                ) : (
                                    "Log in"
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-5 sm:space-y-5">
                            <div className="space-y-2 sm:space-y-2">
                                <label htmlFor="reset-email" className="text-sm sm:text-sm text-gray-300 block font-medium">
                                    Email address
                                </label>
                                <input
                                    id="reset-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 sm:py-3 px-4 sm:px-4 text-base sm:text-base focus:ring-2 focus:ring-blue-500/50"
                                    required
                                />
                            </div>

                            <button 
                                onClick={sendResetPassword}
                                disabled={loading || !email}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 sm:py-3 px-4 rounded-lg sm:rounded-xl hover:bg-[#1A4B84]/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-base"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="h-5 w-5 sm:h-5 sm:w-5 border-2 border-gray-600 border-t-white rounded-full animate-spin mr-2"></div>
                                        <span>Sending reset link...</span>
                                    </div>
                                ) : (
                                    "Send reset link"
                                )}
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-5 sm:mt-4 flex flex-row justify-between">
                    {!resetPassword && (
                        <>
                            <p
                                onClick={() => {
                                    setResetPassword(!resetPassword)
                                    setError(null)
                                }}
                                className="text-blue-400 hover:underline cursor-pointer text-base sm:text-sm"
                            >
                                Forgot password?
                            </p>
                            
                            <Link href="/signup" className="text-blue-400 hover:underline text-base sm:text-sm">
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
                            className="text-blue-400 hover:underline cursor-pointer text-base sm:text-sm"
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