'use client'

import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import { UserFormData } from '../lib/types';
import { supabase } from '../lib/supabase-client';
import { Session } from '@supabase/supabase-js'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Onboarding = () => {
    const [loading, setLoading] = useState(false)
    const [session, setSession] = useState<Session | null>(null)
    const [formStep, setFormStep] = useState(0)
    const [animationDirection, setAnimationDirection] = useState('forward')
    const router = useRouter()

    const {register, handleSubmit, formState: {errors}, trigger, watch} = useForm<UserFormData>({mode: "onChange"})

    const watchedFields = watch()

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
            user_id: session?.user.id,
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
            router.push(`/chat?refresh=${Date.now()}`);
        } catch (error) {
            console.error("Error inserting user data: ", error)
        } finally {
            setLoading(false)
        }
    }

    const nextStep = async () => {
        if (formStep === 0 ) {
            const isValid = await trigger(['firstName', 'lastName', 'dob', 'gender'])
            if (!isValid) {
                return
            }
        } else if (formStep === 1) {
        // No validation needed for step 2
        }
        setAnimationDirection('forward')
        setFormStep(formStep + 1)
    }

    const prevStep = () => {
        setAnimationDirection('backward')
        setFormStep(formStep - 1)
    }

    const getAnimationClass = () => {
        if (animationDirection === 'forward') {
            return 'animate-slide-in-right'
        } else {
            return 'animate-slide-in-left'
        }
    }

    return (
        <div className="flex flex-col h-screen w-full items-center justify-center py-3 px-4 overflow-y-auto md:overflow-y-hidden">
            <div className="w-full max-w-3xl mx-auto">
                <div className="flex flex-col items-center mb-2 sm:mb-4">
                    <Image
                        alt="LifeLink Logo"
                        src="/lifelink_logo.png"
                        width={60} 
                        height={60} 
                        className="mb-2 sm:mb-3 md:mb-4 md:w-20 md:h-20" 
                    />
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">Complete Your Profile</h1>
                </div>

                <div className="bg-zinc-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-zinc-700">
                    <div className="flex justify-between mb-3 sm:mb-4 md:mb-6">
                        {[0, 1, 2].map((step) => (
                            <div key={step} className="flex flex-col items-center">
                                <div
                                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-base
                                ${formStep >= step ? "bg-[#1A4B84] text-white" : "bg-zinc-700 text-gray-400"}`}
                                >
                                    {step + 1}
                                </div>
                                <div className={`text-xs mt-1 ${formStep >= step ? "text-gray-300" : "text-gray-500"}`}>
                                    {step === 0 ? 'Personal' : step === 1 ? 'Medical' : 'Goals'}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className={`${getAnimationClass()} transition-all duration-500 ease-in-out`}>
                            {formStep === 0 && (
                                <>
                                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 mb-3 sm:mb-4 md:mb-6">
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="block text-sm md:text-base text-gray-300">First Name</label>
                                            <input
                                                type="text"
                                                placeholder="John"
                                                {...register('firstName', { required: "First name is required" })}
                                                className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 focus:ring-2 focus:ring-blue-500/50 text-base md:text-lg"
                                            />
                                            {errors.firstName && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.firstName.message}</p>}
                                        </div>

                                        <div className="space-y-2 md:space-y-3">
                                            <label className="block text-sm md:text-base text-gray-300">Last Name</label>
                                            <input
                                                type="text"
                                                placeholder="Doe"
                                                {...register('lastName', { required: "Last name is required" })}
                                                className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 focus:ring-2 focus:ring-blue-500/50 text-base md:text-lg"
                                            />
                                            {errors.lastName && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.lastName.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 mb-3 sm:mb-4 md:mb-6">
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="block text-sm md:text-base text-gray-300">Date of Birth</label>
                                            <input
                                                type="date"
                                                {...register('dob', { required: "Date of Birth is required" })}
                                                className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 focus:ring-2 focus:ring-blue-500/50 text-base md:text-lg"
                                            />
                                            {errors.dob && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.dob.message}</p>}
                                        </div>

                                        <div className="space-y-2 md:space-y-3">
                                            <label className="block text-sm md:text-base text-gray-300">Gender</label>
                                            <select
                                                {...register('gender', { required: "Gender is required" })}
                                                className="w-full bg-zinc-700 rounded-xl outline-none text-white py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 focus:ring-2 focus:ring-blue-500/50 text-base md:text-lg"
                                            >
                                                <option value="" className="bg-zinc-800">Select your gender</option>
                                                <option value="male" className="bg-zinc-800">Male</option>
                                                <option value="female" className="bg-zinc-800">Female</option>
                                                <option value="non-binary" className="bg-zinc-800">Non-binary</option>
                                                <option value="prefer_not_to_say" className="bg-zinc-800">Prefer not to say</option>
                                            </select>
                                            {errors.gender && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.gender.message}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-3 sm:pt-4 md:pt-6">
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-[#1A4B84] text-white font-medium rounded-xl hover:bg-[#1A4B84]/90 transition text-sm sm:text-base md:text-lg"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* step 2: medical information */}
                            {formStep === 1 && (
                                <>
                                    <div className="space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
                                        <label className="block text-sm md:text-base text-gray-300">Medical Conditions</label>
                                        <input
                                            placeholder="Diabetes, Asthma, etc."
                                            {...register("medicalConditions")}
                                            className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 focus:ring-2 focus:ring-blue-500/50 text-base md:text-lg"
                                        />
                                    </div>

                                    <div className="space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
                                        <label className="block text-sm md:text-base text-gray-300">Current Medications</label>
                                        <input
                                            placeholder="Advil, Metformin, etc."
                                            {...register("medications")}
                                            className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 focus:ring-2 focus:ring-blue-500/50 text-base md:text-lg"
                                        />
                                    </div>

                                    <div className="flex justify-between pt-3 sm:pt-4 md:pt-6">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-zinc-700 text-white font-medium rounded-xl hover:bg-zinc-600 transition text-sm sm:text-base md:text-lg"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-[#1A4B84] text-white font-medium rounded-xl hover:bg-[#1A4B84]/90 transition text-sm sm:text-base md:text-lg"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* step 3: health goals  */}
                            {formStep === 2 && (
                                <>
                                    <div className="space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
                                        <label className="block text-sm md:text-base text-gray-300">Health Goals</label>
                                        <textarea
                                            placeholder="Lose Weight, Improve Sleep, Reduce Stress..."
                                            {...register("healthGoals")}
                                            rows={3}
                                            className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 focus:ring-2 focus:ring-blue-500/50 resize-none text-base md:text-lg"
                                        />
                                    </div>

                                    <div className="flex items-start py-2 sm:py-3 md:py-4">
                                        <div className="flex items-center h-5 sm:h-6">
                                            <input
                                                type="checkbox"
                                                {...register("consentToUseData", { required: "You must agree to continue" })}
                                                className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 bg-zinc-700 border-zinc-500 rounded focus:ring-blue-500/50"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm sm:text-base">
                                            <label className="text-gray-300">
                                                I agree to allow my information to be used for personalized responses.
                                            </label>
                                            {errors.consentToUseData && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.consentToUseData.message}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-3 sm:pt-4 md:pt-6">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-zinc-700 text-white font-medium rounded-xl hover:bg-zinc-600 transition text-sm sm:text-base md:text-lg"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            onClick={handleSubmit(onSubmit)}
                                            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-[#1A4B84] text-white font-medium rounded-xl hover:bg-[#1A4B84]/90 transition text-sm sm:text-base md:text-lg ${
                                                loading || !watchedFields.consentToUseData ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                            disabled={loading || !watchedFields.consentToUseData}
                                        >
                                            {loading ? (
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 sm:border-3 border-zinc-500 border-t-white rounded-full animate-spin mr-2 sm:mr-3"></div>
                                                    <span>Saving...</span>
                                                </div>
                                            ) : (
                                                "Complete Profile"
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Onboarding