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
        }else if (formStep === 1) {

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
        <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center overflow-y-auto py-16">
            <div className="w-full max-w-3xl px-8">
                <div className="flex flex-col items-center mb-10">
                <Image
                        alt="LifeLink Logo"
                        src="/lifelink_logo.png"
                        width={80} 
                        height={80} 
                        className="mb-6" 
                    />
                    <h1 className="text-4xl font-semibold text-white mb-4">Complete Your Profile</h1>
                    <p className="text-gray-400 text-center text-lg">Help us personalize your health journey</p>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-700">
                    {/* progress indicator */}
                    <div className="flex justify-between mb-8">
                        {[0, 1, 2].map((step) => (
                            <div key={step} className="flex flex-col items-center">
                                <div 
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg
                                    ${formStep >= step 
                                        ? 'bg-[#1A4B84] text-white' 
                                        : 'bg-zinc-700 text-gray-400'}`}
                                >
                                    {step + 1}
                                </div>
                                <div className={`text-sm mt-2 ${formStep >= step ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {step === 0 ? 'Personal' : step === 1 ? 'Medical' : 'Goals'}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden">
                        <div className={`${getAnimationClass()} transition-all duration-500 ease-in-out`}>
                            {formStep === 0 && (
                                <>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                                        <div className="space-y-3">
                                            <label className="block text-base text-gray-300">First Name</label>
                                            <input
                                                type="text"
                                                placeholder="John"
                                                {...register('firstName', { required: "First name is required" })}
                                                className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-4 px-5 focus:ring-2 focus:ring-blue-500/50 text-lg"
                                            />
                                            {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-base text-gray-300">Last Name</label>
                                            <input
                                                type="text"
                                                placeholder="Doe"
                                                {...register('lastName', { required: "Last name is required" })}
                                                className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-4 px-5 focus:ring-2 focus:ring-blue-500/50 text-lg"
                                            />
                                            {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                                        <div className="space-y-3">
                                            <label className="block text-base text-gray-300">Date of Birth</label>
                                            <input
                                                type="date"
                                                {...register('dob', { required: "Date of Birth is required" })}
                                                className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-4 px-5 focus:ring-2 focus:ring-blue-500/50 text-lg"
                                            />
                                            {errors.dob && <p className="text-red-400 text-sm mt-1">{errors.dob.message}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-base text-gray-300">Gender</label>
                                            <select
                                                {...register('gender', { required: "Gender is required" })}
                                                className="w-full bg-zinc-700 rounded-xl outline-none text-white py-4 px-5 focus:ring-2 focus:ring-blue-500/50 text-lg"
                                            >
                                                <option value="" className="bg-zinc-800">Select your gender</option>
                                                <option value="male" className="bg-zinc-800">Male</option>
                                                <option value="female" className="bg-zinc-800">Female</option>
                                                <option value="non-binary" className="bg-zinc-800">Non-binary</option>
                                                <option value="prefer_not_to_say" className="bg-zinc-800">Prefer not to say</option>
                                            </select>
                                            {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender.message}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6">
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-8 py-4 bg-[#1A4B84] text-white font-medium rounded-xl hover:bg-[#1A4B84]/90 transition text-lg"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* step 2: medical information */}
                            {formStep === 1 && (
                                <>
                                    <div className="space-y-3 mb-6">
                                        <label className="block text-base text-gray-300">Medical Conditions</label>
                                        <input
                                            placeholder="Diabetes, Asthma, etc."
                                            {...register("medicalConditions")}
                                            className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-4 px-5 focus:ring-2 focus:ring-blue-500/50 text-lg"
                                        />
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <label className="block text-base text-gray-300">Current Medications</label>
                                        <input
                                            placeholder="Advil, Metformin, etc."
                                            {...register("medications")}
                                            className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-4 px-5 focus:ring-2 focus:ring-blue-500/50 text-lg"
                                        />
                                    </div>

                                    <div className="flex justify-between pt-6">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-8 py-4 bg-zinc-700 text-white font-medium rounded-xl hover:bg-zinc-600 transition text-lg"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-8 py-4 bg-[#1A4B84] text-white font-medium rounded-xl hover:bg-[#1A4B84]/90 transition text-lg"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* step 3: health goals  */}
                            {formStep === 2 && (
                                <>
                                    <div className="space-y-3 mb-6">
                                        <label className="block text-base text-gray-300">Health Goals</label>
                                        <textarea
                                            placeholder="Lose Weight, Improve Sleep, Reduce Stress..."
                                            {...register("healthGoals")}
                                            rows={4}
                                            className="w-full bg-zinc-700 rounded-xl outline-none text-white placeholder-gray-400 py-4 px-5 focus:ring-2 focus:ring-blue-500/50 resize-none text-lg"
                                        />
                                    </div>

                                    <div className="flex items-start py-4">
                                        <div className="flex items-center h-6">
                                            <input
                                                type="checkbox"
                                                {...register("consentToUseData", { required: "You must agree to continue" })}
                                                className="h-5 w-5 text-blue-600 bg-zinc-700 border-zinc-500 rounded focus:ring-blue-500/50"
                                            />
                                        </div>
                                        <div className="ml-3 text-base">
                                            <label className="text-gray-300">
                                                I agree to allow my information to be used for personalized responses.
                                            </label>
                                            {errors.consentToUseData && <p className="text-red-400 text-sm mt-1">{errors.consentToUseData.message}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-6">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-8 py-4 bg-zinc-700 text-white font-medium rounded-xl hover:bg-zinc-600 transition text-lg"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            onClick={handleSubmit(onSubmit)}
                                            className={`px-8 py-4 bg-[#1A4B84] text-white font-medium rounded-xl hover:bg-[#1A4B84]/90 transition text-lg ${
                                                loading || !watchedFields.consentToUseData ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                            disabled={loading || !watchedFields.consentToUseData}
                                        >
                                            {loading ? (
                                                <div className="flex items-center">
                                                    <div className="w-6 h-6 border-3 border-zinc-500 border-t-white rounded-full animate-spin mr-3"></div>
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
