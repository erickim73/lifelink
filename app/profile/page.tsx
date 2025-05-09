'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase-client'
import { UserFormData } from '../lib/types';
import { Session } from '@supabase/supabase-js';
import { Loader2, Shield } from 'lucide-react'
import ProfileDetails from './ProfileDetails';

const Profile = () => {
    const [authSession, setAuthSession] = useState<Session | null>(null)
    const [userData, setUserData] = useState<UserFormData | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formState, setFormState] = useState<UserFormData | null>(null)


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const {data: {session}} = await supabase.auth.getSession()
                if (!session) {
                    setLoading(false)
                    return
                }
                setAuthSession(session)

                const { data, error } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single();

                if (error) {
                    console.error("Error fetching user profile: ", error)
                } else if (data) {
                    const mappedUserData: UserFormData = {
                        firstName: data.first_name,
                        lastName: data.last_name,
                        gender: data.gender,
                        dob: data.dob,
                        medicalConditions: data.medical_conditions,
                        medications: data.medications,
                        healthGoals: data.health_goals,
                        consentToUseData: data.consent_to_use_data
                    }
                    
                    setUserData(mappedUserData)
                    setFormState(mappedUserData)
                } 
            } catch (error) {
                console.error("Error in profile page:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleInputChange = useCallback((field: keyof UserFormData, value: string) => {
        if (!formState) {
            return
        }

        setFormState({
            ...formState,
            [field]: value,
        })
    }, [formState])


    const handleSaveChanges = async () => {
        if (!formState || !authSession) {
            return
        }

        try {
            const {error} = await supabase.from('profiles').update({
                first_name: formState.firstName,
                last_name: formState.lastName,
                gender: formState.gender,
                dob: formState.dob,
                medical_conditions: formState.medicalConditions,
                medications: formState.medications,
                health_goals: formState.healthGoals,
                consent_to_use_data: formState.consentToUseData,
            })
            .eq("user_id", authSession.user.id)

            if (error) {
                console.error('Error updating profile:', error);
                alert("Something went wrong while saving.");
            } else {
                setUserData(formState);
                setIsEditing(false); // Exit edit mode after save
            }
        } catch (error) {
            console.error('Error in save operation:', error);
            alert("An unexpected error occurred.");
        }
    }

    const toggleEditMode = () => {
        if (isEditing) {
            // cancel editing
            setFormState(userData)
        } else {
            // enter edit mode 
            setFormState(userData)
        }
        setIsEditing(!isEditing)
    }

    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )
    }

    if (!authSession) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <Shield className="w-12 h-12 mb-4 text-red-400" />
            <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
            <p className="text-gray-400">Please sign in to view your profile</p>
          </div>
        )
    }

    

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">
                                {userData?.firstName} {userData?.lastName}
                            </h1>
                            <p className="text-gray-400">{authSession?.user?.email}</p>
                        </div>
                        <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
                            {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                        </div>
                    </div>
                </div>

                <ProfileDetails
                    userData={userData}
                    formState={formState}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                    toggleEditMode={toggleEditMode}
                    handleSaveChanges={handleSaveChanges}
                />
        
                
            </div>
        </div>
    )
}
    

export default Profile
