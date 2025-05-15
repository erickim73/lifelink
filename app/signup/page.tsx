'use client'

import React, { useState } from 'react' 
import { supabase } from "../lib/supabase-client";
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// Added icons for improved UX
import { Eye, EyeOff, XCircle } from 'lucide-react'

const SignUp = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false) // Added password visibility toggle
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false) // Track form submission attempts
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormSubmitted(true)
        setError(null)

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
                    <h1 className="text-3xl font-semibold text-white mb-1">Create your account</h1>
                    <p className="text-gray-400 text-center max-w-sm">
                        Start your journey with LifeLink
                    </p>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-700">
                    {error && (
                        <div 
                            className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 text-red-200"
                            role="alert"
                            aria-live="assertive"
                        >
                            <div className="flex items-center">
                                <XCircle className="h-5 w-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

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
                                className={`w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 focus:ring-2 focus:ring-blue-500/50 ${
                                    formSubmitted && !isValidEmail(email) ? "border border-red-500" : ""
                                }`}
                                required
                                aria-required="true"
                                aria-describedby="email-error"
                                autoComplete="email"
                            />
                            {formSubmitted && !isValidEmail(email) && (
                                <p id="email-error" className="text-red-400 text-sm mt-1">
                                    Please enter a valid email address
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm text-gray-300 block font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <input 
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 pr-10 focus:ring-2 focus:ring-blue-500/50 ${
                                        formSubmitted ? "border border-red-500" : ""
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
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>                       

                        <button 
                            type="submit"
                            disabled={loading || !email || !password }
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-3 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none"
                            aria-live="polite"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="h-5 w-5 border-2 border-gray-600 border-t-white rounded-full animate-spin mr-2"></div>
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-5 text-center text-gray-400">
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