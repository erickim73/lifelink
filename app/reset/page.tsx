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
                    <h1 className="text-3xl font-semibold text-white mb-1">Reset Password</h1>
                    <p className="text-gray-400 text-center">Create a new secure password for your account</p>
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
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6 text-green-200">
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
                            <label htmlFor="password" className="text-sm text-gray-300 block font-medium">
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
                                    className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 pr-10 focus:ring-2 focus:ring-blue-500/50"
                                    required
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

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm text-gray-300 block font-medium">
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
                                    className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 pr-10 focus:ring-2 focus:ring-blue-500/50"
                                    required
                                    autoComplete="new-password"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white "
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
                                        <div className="h-5 w-5 border-2 border-gray-600 border-t-white rounded-full animate-spin mr-2"></div>
                                        <span>Resetting password...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <Lock className="h-4 w-4 mr-2" />
                                        <span>Reset Password</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        
                    </div>
                </div>
                
                {/* Link back to login */}
                <div className="mt-4 flex justify-center">
                    <Link href="/login" className="text-blue-400 hover:underline text-sm">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword