import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/app/lib/supabase-client'
import { AlertTriangle, X } from 'lucide-react'


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
            console.log("Auth event:", _event)
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
        <div className="max-w-md mx-auto mt-8 p-6 ">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Account Security</h2>
            
            <div className="border-t border-gray-200 pt-4">
                <p className="text-white mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                
                <button 
                    onClick={openConfirmation}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
                >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Delete Account
                </button>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-red-600">Confirm Account Deletion</h3>
                            <button 
                                onClick={closeConfirmation}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-center mb-4 bg-gray-700 p-3 rounded-md">
                                <AlertTriangle className="text-red-500 mr-3 h-6 w-6" />
                                <p className="text-red-600">This action cannot be undone. All data will be permanently deleted.</p>
                            </div>
                            
                            <p className="text-gray-600 mb-2">
                                Are you absolutely sure you want to delete your account?
                            </p>
                        </div>
                        
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeConfirmation}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors duration-300"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            
                            <button 
                                onClick={deleteAccount}
                                className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center ${isDeleting ? 'opacity-75 cursor-not-allowed' : ''}`}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Security
