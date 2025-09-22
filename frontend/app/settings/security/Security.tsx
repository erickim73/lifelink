import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/app/lib/supabase-client'
import { AlertTriangle, Key, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-separator'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link'


const Security = () => {

    const [session, setSession] = useState<Session | null>(null)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)    

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const openConfirmation = () => {
        setShowConfirmation(true)
    }

    const closeConfirmation = () => {
        setShowConfirmation(false)
        setError(null)
    }

    const deleteAccount = async () => {
        if (!session || session.user.id) {
            console.error("No session user id")
            return
        }

        try {
            const {error: deleteError} = await supabase.auth.admin.deleteUser(session.user.id)

            if (deleteError) {
                setError(`Error deleting account: ${deleteError.message}`)
                setIsDeleting(false)
            } else {
                window.location.href = '/'
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(`Unexpected error: ${err.message}`)
            } else {
                setError('An unknown error occurred.')
            }
            setIsDeleting(false)
        }
    }


    
    return (
        <div className="w-full h-full p-6 overflow-y-auto">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <CardTitle>Security Settings</CardTitle>
                    </div>
                    <CardDescription>Manage your account security and protection</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-blue-500" />
                            <h3 className="text-xl font-medium">Password & Authentication</h3>
                        </div>
                        <div className="p-4 border rounded-lg border-zinc-800">
                            <p className="mb-4 text-gray-400">
                                We recommend using a strong, unique password and enabling two-factor authentication when available.
                            </p>
                            <Link href='/reset'>
                                <Button variant="outline" className="text-blue-500 border-blue-500/30 hover:bg-blue-500/10">
                                    Change Password
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <h3 className="text-xl font-medium text-red-500">Danger Zone</h3>
                        </div>
                        <div className="p-4 border rounded-lg border-red-900/30 bg-red-950/20">
                            <p className="mb-4 text-gray-300">
                                Once you delete your account, there is no going back. All of your data will be permanently removed.
                            </p>
                            <Button
                                variant="destructive"
                                onClick={openConfirmation}
                                className="text-white bg-red-600 hover:bg-red-700"
                            >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-500">Confirm Account Deletion</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our
                            servers.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Alert variant="destructive" className="text-red-200 bg-red-950/30 border-red-900/50">
                            <AlertTriangle className="w-4 h-4" />
                            <AlertDescription>
                                All your personal information, chat history, and settings will be permanently deleted.
                            </AlertDescription>
                        </Alert>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter className="sm:justify-end">
                        <Button variant="outline" onClick={closeConfirmation} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={deleteAccount}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Security
