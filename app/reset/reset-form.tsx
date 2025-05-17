'use client'

import React, { useState } from 'react'
import { supabase } from '../lib/supabase-client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock } from 'lucide-react'

const ResetPassword = () => {
    const [data, setData] = useState<{password: string, confirmPassword: string}>({password: '', confirmPassword: ''})
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const confirmPasswords = async () => {
        setError(null)
        
        // Validate passwords
        if (!data.password.trim()) {
            setError('Password cannot be empty')
            return
        }
        
        if (data.password.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }
        
        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match')
            return 
        }
        
        setLoading(true)
        
        try {
            const { error: resetError } = await supabase.auth.updateUser({ 
                password: data.password 
            })
            
            if (resetError) throw resetError
            
            setSuccess(true)
            console.log('Password reset successfully')
            
            // Redirect after a short delay
            setTimeout(() => {
                router.push('/login')
            }, 3000)
            
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error resetting password:', error)
                setError(error?.message || 'Failed to reset password. Please try again.')
            } else {
                console.error("Unknown error occured:", error)
                setError(`Please try again. ${String(error)}`)
            }
            
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center mb-4 sm:mb-5 md:mb-6">
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
                <h1 className="mb-1 text-3xl font-semibold text-white">Reset Password</h1>
                <p className="text-center text-gray-400">Create a new secure password for your account</p>
            </div>

            <div className="w-full max-w-xl p-6 border shadow-lg bg-zinc-800 rounded-2xl border-zinc-700">
                {error && (
                    <div 
                        className="p-3 mb-6 text-red-200 border rounded-lg bg-red-500/10 border-red-500/50"
                        role="alert"
                    >
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="p-4 mb-6 text-green-200 border rounded-lg bg-green-500/10 border-green-500/50">
                        <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Password reset successful!</p>
                                <p className="mt-1 text-sm">You&apos;ll be redirected to the login page shortly.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            New password
                        </label>
                        <div className="relative">
                            <input 
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your new password"
                                value={data.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 pr-10 text-white placeholder-gray-400 outline-none bg-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                required
                                autoComplete="new-password"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-white"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                            Confirm new password
                        </label>
                        <div className="relative">
                            <input 
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your new password"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 pr-10 text-white placeholder-gray-400 outline-none bg-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                required
                                autoComplete="new-password"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-white "
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            onClick={confirmPasswords}
                            disabled={loading || !data.password || !data.confirmPassword}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 px-4 rounded-xl hover:bg-[#1A4B84]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 mr-2 border-2 border-gray-600 rounded-full border-t-white animate-spin"></div>
                                    <span>Resetting password...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Lock className="w-4 h-4 mr-2" />
                                    <span>Reset Password</span>
                                </div>
                            )}
                        </button>
                    </div>

                    
                </div>
            </div>
            
            {/* Link back to login */}
            <div className="flex justify-center mt-4">
                <Link href="/login" className="text-sm text-blue-400 hover:underline">
                    Back to login
                </Link>
            </div>
        </div>
    )
}

export default ResetPassword