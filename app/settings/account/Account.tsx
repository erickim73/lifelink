import React, { useState, useEffect } from 'react'
import { SettingsAccount } from '../../lib/types';
import { AlertCircle, LogOut, Mail} from 'lucide-react';
import { supabase } from '@/app/lib/supabase-client';
import { useRouter  } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, } from '@/components/ui/alert';
import { toast, Toaster} from 'sonner'



const Account = ({notifications, setNotifications}: SettingsAccount) => {
    const router = useRouter()
    
    const [email, setEmail] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [confirmEmail, setConfirmEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailChangeOpen, setEmailChangeOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {(async () => {
        const { data } = await supabase.auth.getUser()
        setEmail(data.user?.email ?? '')
        })()
    }, [email])              

    useEffect(() => {
        const checkForEmailChangeToken = async () => {
            const params = new URLSearchParams(window.location.search)
            const token = params.get('token')
            
            // For debugging - log all URL parameters to see what Supabase is actually sending
            
            // Handle more verification types and parameter variations
            if (token) {
                try {
                    
                    // Use the general verification method for the token
                    const { error } = await supabase.auth.verifyOtp({
                        token,
                        type: 'email_change',
                        email: newEmail
                    })
                    
                    if (error) {
                        console.error('Token verification error:', error)
                        toast.error(`Error: ${error.message}`)
                    } else {
                        // Refresh the user data to get the updated email
                        const { data: userData } = await supabase.auth.getUser()
                        const updatedEmail = userData.user?.email
                        
                        if (updatedEmail && updatedEmail !== email) {
                            setEmail(updatedEmail)
                            toast.success('Email address updated successfully!')
                        } else {
                            toast.success('Verification successful')
                        }
                    }
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        console.error('Unexpected verification error:', error)
                        toast.error('An unexpected error occurred: ' + error.message)
                    } else {
                        console.error('Unknown error:', error)
                        toast.error('An unexpected error occurred.')
                    }
                }
                
                // Clean URL parameters regardless of success/failure
                window.history.replaceState({}, '', location.pathname)
            }
        }
        
        checkForEmailChangeToken()
    }, [email, newEmail])

    const resetEmailForm = () => {
        setNewEmail('')
        setConfirmEmail('')
        setPassword('')
        setErrorMessage('')
        setSuccessMessage('')
    }

    const openEmailDialog = () => {
        resetEmailForm()
        setEmailChangeOpen(true)
    }

    const closeEmailDialog = () => {
        setEmailChangeOpen(false)
        resetEmailForm()
    }
    

    const validateEmailChange = () => {
        if (!newEmail || !confirmEmail || !password) {
            setErrorMessage('All fields are required')
            return false
        }

        if (newEmail !== confirmEmail) {
            setErrorMessage('Emails do not match')
            return false
        }

        if (newEmail === email) {
            setErrorMessage('New email is the same as current email')
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(newEmail)) {
            setErrorMessage('Please enter a valid email address')
            return false
        }

        return true
    }

    const changeEmail = async () => {
        if (!validateEmailChange()) return

        setIsSubmitting(true)
        setErrorMessage('')
        
        try {
            // First verify the current password
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            
            if (signInError) {
                setErrorMessage('Current password is incorrect')
                setIsSubmitting(false)
                return
            }
            
            // Try using the session to update the email address
            // This ensures we're working with an authenticated session
            const { data: sessionData } = await supabase.auth.getSession()
            if (!sessionData.session) {
                setErrorMessage('Authentication session expired. Please log in again.')
                setIsSubmitting(false)
                return
            }
            
            // Make sure the redirect URL is properly formatted
            const redirectTo = new URL('/settings', window.location.origin).toString()
            
            // Then update the email address with the properly formatted redirect URL
            const { error } = await supabase.auth.updateUser(
                { email: newEmail },
                { emailRedirectTo: redirectTo }
            )
            
            
            if (error) {
                console.error('Email update error:', error)
                setErrorMessage(`Error: ${error.message}`)
            } else {
                // Don't close the dialog - keep showing the success message
                setSuccessMessage(
                    'Verification email sent to ' + newEmail + '. Please check your inbox and spam folder to complete the change.'
                )
                toast.success('Verification email sent. Please check your inbox and spam folder.')
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Unexpected verification error:', error)
                toast.error('An unexpected error occurred: ' + error.message)
            } else {
                console.error('Unknown error:', error)
                toast.error('An unexpected error occurred.')
            }
        }
        
        setIsSubmitting(false)
    }
    

    const logout = async () => {
        await supabase.auth.signOut();
        router.push('/')
    }

    return (
        <div className="w-full h-full p-6 overflow-y-auto">
            <Toaster />
            <Card className="w-full bg-zinc-900">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CardTitle className='pt-2'>Account Settings</CardTitle>
                    </div>
                    <CardDescription>Manage your account preferences and settings</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-medium">Email & Communication</h3>
                        </div>
                        <div className="p-3 space-y-4 border rounded-lg border-zinc-800">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">
                                        Email Address
                                    </div>
                                    <div className="text-sm text-gray-400 ">
                                        {email || "No email loaded"}
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={openEmailDialog}>
                                    Change
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="font-medium">
                                        Notifications
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Receive updates and alerts
                                    </div>
                                </div>
                                <Switch
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-medium">Account Actions</h3>
                        </div>
                        <div className="p-4 border rounded-lg border-zinc-800">
                            <Button variant="destructive" onClick={logout} className="text-white bg-red-600 hover:bg-red-700">
                                <LogOut className="w-4 h-4 mr-2" />
                                Log Out
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* change email */}
            <Dialog open={emailChangeOpen} onOpenChange={setEmailChangeOpen}>
                <DialogContent className="border sm:max-w-md bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Change Email Address
                        </DialogTitle>
                        <DialogDescription>
                            Enter your new email address and current password to update your account
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        {errorMessage && (
                            <Alert variant="destructive" className="border-red-900 bg-red-900/30 text-red-50">
                                <AlertCircle className="w-4 h-4" />
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}
                        
                        {successMessage && (
                            <Alert className="border-green-900 bg-green-900/30 text-green-50">
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="new-email" className="text-sm font-medium">
                                New Email Address
                            </label>
                            <Input
                                id="new-email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Enter your new email"
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="confirm-email" className="text-sm font-medium">
                                Confirm Email Address
                            </label>
                            <Input
                                id="confirm-email"
                                type="email"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                placeholder="Confirm your new email"
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="current-password" className="text-sm font-medium">
                                Current Password
                            </label>
                            <Input
                                id="current-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your current password"
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={closeEmailDialog}
                            className="border-zinc-700 hover:bg-zinc-800"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={changeEmail}
                            disabled={isSubmitting || !!successMessage}
                            className="text-white bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? "Processing..." : "Update Email"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Account