'use client'

import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import { UserFormData } from '../lib/types';
import { supabase } from '../lib/supabase-client';
import { Session } from '@supabase/supabase-js'
import { motion } from "framer-motion"



const Onboarding = () => {
    const [loading, setLoading] = useState(false)
    const [session, setSession] = useState<Session | null>(null)
    const {register, handleSubmit, formState: {errors}} = useForm<UserFormData>()

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

    const onSubmit = async (data: UserFormData) => {
        console.log("Submitting User Data: ", data)

        const transformedUserData = {
            id: session?.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            gender: data.gender,
            dob: data.dob,
            medical_conditions: data.medicalConditions,
            medications: data.medications,
            health_goals: data.healthGoals,
            consent_to_use_data: data.consentToUseData,
        }

        if (!session) {
            console.log("Session is not available. Cannot submit prompt.")
            return
        }

        setLoading(true)

        try {
            await supabase.from("profiles").insert(transformedUserData)
            console.log("Inserted User Data: ", transformedUserData)
        } catch (error) {
            console.error("Error inserting user data: ", error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 px-6 py-8 text-white">
                    <h2 className="text-3xl font-bold text-center">Complete Your Profile</h2>
                    <p className="mt-2 text-center text-blue-100">
                        Help us personalize your health journey
                    </p>
                </div>
                
                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input 
                                    type="text" 
                                    placeholder="John"
                                    {...register('firstName', {required: "Required"})}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Doe"
                                    {...register('lastName', {required: "Required"})}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    {...register('dob', {required: "Date of Birth is Required"})}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    {...register('gender', {required: "Required"})}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non-binary">Non-binary</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                            <input
                                placeholder="Diabetes, Asthma, etc"
                                {...register("medicalConditions")}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Current Medications</label>
                            <input
                                placeholder="Advil, Metformin, etc"
                                {...register("medications")}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Health Goals</label>
                            <textarea
                                placeholder="Lose Weight, Improve Sleep, Reduce Stress..."
                                {...register("healthGoals")}
                                rows={3}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input 
                                    type="checkbox" 
                                    {...register("consentToUseData", { required: true })} 
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label className="font-medium text-gray-700">
                                    I agree to allow my information to be used for personalized responses.
                                </label>
                                {errors.consentToUseData && <p className="text-red-500 text-xs mt-1">You must agree to continue</p>}
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <motion.button
                                type="submit"
                                className={`px-8 py-3 font-bold shadow-lg rounded-xl transition duration-300 ease-in-out bg-blue-600 text-white hover:bg-blue-700 ${
                                    loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                ) : (
                                    "Complete Profile"
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Onboarding
