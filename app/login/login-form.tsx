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
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center mb-4 sm:mb-5 md:mb-6">
                <Link href="/" aria-label="Go to homepage" className="mb-2 sm:mb-3">
                    <Image
                        alt="LifeLink Logo"
                        src="/lifelink_logo.png"
                        width={60}
                        height={60}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px]"
                        priority
                    />
                </Link>
                <h1 className="mb-1 text-xl font-semibold text-center text-white sm:text-2xl md:text-3xl">
                    {resetPassword ? "Reset Password" : "Welcome back"}
                </h1>
                <p className="text-sm sm:text-base text-gray-400 text-center max-w-[280px] sm:max-w-[300px] md:max-w-none">
                    {resetPassword ? "Enter your email to receive a reset link" : "Log in to your account"}
                </p>
            </div>

            <div className="p-4 sm:p-5 md:p-6 border shadow-lg bg-zinc-800/90 rounded-xl sm:rounded-2xl border-zinc-700 w-full max-w-[320px] sm:max-w-[360px] md:max-w-md">
                {error && (
                    <div
                        className="p-2 mb-4 text-xs text-red-200 border rounded-lg sm:p-3 sm:mb-5 sm:text-sm bg-red-500/10 border-red-500/50"
                        role="alert"
                    >
                        <div className="flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="p-2 mb-4 text-xs text-green-200 border rounded-lg sm:p-3 sm:mb-5 sm:text-sm bg-green-500/10 border-green-500/50">
                        <div className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-2 sm:w-5 sm:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Reset link sent! Check your email inbox.</span>
                        </div>
                    </div>
                )}

                {!resetPassword ? (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div className="space-y-1 sm:space-y-2">
                            <label htmlFor="email" className="block text-xs font-medium text-gray-300 sm:text-sm">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 text-sm text-white placeholder-gray-400 rounded-lg outline-none sm:px-4 sm:py-3 sm:text-base bg-zinc-700 focus:ring-2 focus:ring-blue-500/50"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <label htmlFor="password" className="block text-xs font-medium text-gray-300 sm:text-sm">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 text-sm text-white placeholder-gray-400 rounded-lg outline-none sm:px-4 sm:py-3 sm:text-base bg-zinc-700 focus:ring-2 focus:ring-blue-500/50"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-white"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full px-4 py-2 mt-2 text-sm font-medium text-white transition rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 sm:py-3 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed sm:text-base"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                <div className="w-4 h-4 mr-2 border-2 border-gray-600 rounded-full sm:w-5 sm:h-5 border-t-white animate-spin"></div>
                                <span>Logging in...</span>
                                </div>
                            ) : (
                                "Log in"
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4 sm:space-y-5">
                        <div className="space-y-1 sm:space-y-2">
                            <label htmlFor="reset-email" className="block text-xs font-medium text-gray-300 sm:text-sm">
                                Email address
                            </label>
                            <input
                                id="reset-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 text-sm text-white placeholder-gray-400 rounded-lg outline-none sm:px-4 sm:py-3 sm:text-base bg-zinc-700 focus:ring-2 focus:ring-blue-500/50"
                                required
                            />
                        </div>

                        <button
                            onClick={sendResetPassword}
                            disabled={loading || !email}
                            className="w-full px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 sm:py-3 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed sm:text-base"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 mr-2 border-2 border-gray-600 rounded-full sm:w-5 sm:h-5 border-t-white animate-spin"></div>
                                    <span>Sending reset link...</span>
                                </div>
                            ) : (
                                "Send reset link"
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-row justify-between mt-4 sm:mt-5 w-full max-w-[320px] sm:max-w-[360px] md:max-w-md">
                {!resetPassword && (
                <>
                    <p onClick={() => {
                        setResetPassword(!resetPassword)
                        setError(null)
                    }}
                    className="text-xs text-blue-400 cursor-pointer sm:text-sm hover:underline"
                    >
                        Forgot password?
                    </p>

                    <Link href="/signup" className="text-xs text-blue-400 sm:text-sm hover:underline">
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
                        className="text-xs text-blue-400 cursor-pointer sm:text-sm hover:underline"
                    >
                        Back to login
                    </p>
                )}
            </div>
        </div>
    )
}

export default Login