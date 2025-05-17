'use client'

import React, { useState } from 'react' 
import { supabase } from "../lib/supabase-client";
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, XCircle } from 'lucide-react'

const SignUp = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormSubmitted(true)
        setError(null)
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

    // Email validation function
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-5 sm:px-6 py-10 sm:py-12">
            <div className="w-full max-w-[360px] sm:max-w-md">
                <div className="flex flex-col items-center mb-5 sm:mb-6">
                    <Link href="/" aria-label="Go to homepage" className="mb-3 sm:mb-3">
                        <Image
                            alt="LifeLink Logo"
                            src="/lifelink_logo.png"
                            width={60} 
                            height={60}
                            className="w-14 h-14 sm:w-[60px] sm:h-[60px]"
                            priority 
                        />
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2 sm:mb-2 text-center">Create your account</h1>
                    <p className="text-base sm:text-base text-gray-400 text-center max-w-[300px] sm:max-w-sm">
                        Start your journey with LifeLink
                    </p>
                </div>

                <div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-zinc-700">
                    {error && (
                        <div 
                            className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 sm:p-3 mb-5 sm:mb-6 text-red-200 text-sm sm:text-base"
                            role="alert"
                            aria-live="assertive"
                        >
                            <div className="flex items-center">
                                <XCircle className="h-5 w-5 sm:h-5 sm:w-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

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
                                className={`w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 sm:py-3 px-4 sm:px-4 text-base sm:text-base focus:ring-2 focus:ring-blue-500/50 ${
                                    formSubmitted && !isValidEmail(email) ? "border border-red-500" : ""
                                }`}
                                required
                                aria-required="true"
                                aria-describedby="email-error"
                                autoComplete="email"
                            />
                            {formSubmitted && !isValidEmail(email) && (
                                <p id="email-error" className="text-red-400 text-sm sm:text-sm mt-1">
                                    Please enter a valid email address
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 sm:space-y-2">
                            <label htmlFor="password" className="text-sm sm:text-sm text-gray-300 block font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <input 
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 sm:py-3 px-4 sm:px-4 pr-10 text-base sm:text-base focus:ring-2 focus:ring-blue-500/50 ${
                                        formSubmitted && password.length < 8 ? "border border-red-500" : ""
                                    }`}
                                    required
                                    aria-required="true"
                                    aria-describedby="password-requirements"
                                    autoComplete="new-password"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} className="sm:size={20}" /> : <Eye size={20} className="sm:size={20}" />}
                                </button>
                            </div>
                            {formSubmitted && password.length < 8 && (
                                <p id="password-requirements" className="text-red-400 text-sm sm:text-sm mt-1">
                                    Password must be at least 8 characters
                                </p>
                            )}
                        </div>                       

                        <button 
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 sm:py-3 px-4 rounded-lg sm:rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-3 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none text-base sm:text-base"
                            aria-live="polite"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="h-5 w-5 sm:h-5 sm:w-5 border-2 border-gray-600 border-t-white rounded-full animate-spin mr-2"></div>
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-5 sm:mt-5 text-center text-gray-400 text-base sm:text-base">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-400 hover:underline font-medium">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignUp