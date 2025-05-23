"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import type { UserFormData } from "../lib/types"
import { supabase } from "../lib/supabase-client"
import type { Session } from "@supabase/supabase-js"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ChevronDown } from "lucide-react"


const Onboarding = () => {
	const [loading, setLoading] = useState(false)
	const [session, setSession] = useState<Session | null>(null)
	const [formStep, setFormStep] = useState(0)
	const [animationDirection, setAnimationDirection] = useState("forward")
	const [error, setError] = useState<string | null>(null)
	const [genderDropdownOpen, setGenderDropdownOpen] = useState(false)
	const router = useRouter()

	const {register, handleSubmit, formState: { errors }, trigger, watch, setValue} = useForm<UserFormData>({ mode: "onChange" })

  	const watchedFields = watch()

	const validateDOB = (value: string) => {
		const date = new Date(value)
		if (isNaN(date.getTime())) {
			return "Please enter a valid date"
		}

		if (date > new Date()) {
			return "Date of birth must be in the past"
		}
		const oneYearAgo = new Date()
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

		const maxAge = new Date()
		maxAge.setFullYear(maxAge.getFullYear() - 120)

		if (date > oneYearAgo) {
			return "You must be at least 1 year old"
		}

		if (date < maxAge) {
			return "Please enter a realistic date of birth"
		}

		return true
	}

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
		})

		const {data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})

		return () => subscription.unsubscribe()
	}, [])

	const onSubmit = async (data: UserFormData) => {
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
			setError("Session is not available. Cannot submit profile.")
			return
		}

		setLoading(true)

		try {
			await supabase.from("profiles").insert(transformedUserData)
			router.push("/chat")
		} catch (error) {
			console.error("Error inserting user data: ", error)
			setError("Failed to save profile. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	const nextStep = async () => {
		if (formStep === 0) {
			const isValid = await trigger(["firstName", "lastName", "dob", "gender"])
		if (!isValid) {
			return
		}
		} else if (formStep === 1) {
		// No validation needed for step 2
		}
		setAnimationDirection("forward")
		setFormStep(formStep + 1)
	}

	const prevStep = () => {
		setAnimationDirection("backward")
		setFormStep(formStep - 1)
	}

	const getAnimationClass = () => {
		if (animationDirection === "forward") {
			return "animate-slide-in-right"
		} else {
			return "animate-slide-in-left"
		}
	}
	const selectGender = (gender: string) => {
		setValue("gender", gender, { shouldValidate: true })
		setGenderDropdownOpen(false)
	}

	const genderOptions = [
		{ value: "male", label: "Male" },
		{ value: "female", label: "Female" },
		{ value: "non-binary", label: "Non-binary" },
		{ value: "prefer_not_to_say", label: "Prefer not to say" },
	]

	return (
		<div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center mb-4 sm:mb-5 md:mb-6">
                <Link href="/" aria-label="Go to homepage" className="mb-3 sm:mb-2">
                    <Image
                    alt="LifeLink Logo"
                    src="/lifelink_logo.png"
                    width={60}
                    height={60}
                    className="w-14 h-14 sm:w-[60px] sm:h-[60px]"
                    priority
                    />
                </Link>
                <h1 className="mb-2 text-2xl font-semibold text-center text-white sm:text-3xl sm:mb-1">
                    Complete Your Profile
                </h1>
                <p className="text-base sm:text-base text-gray-400 text-center max-w-[300px] sm:max-w-none">
                    Tell us about yourself
                </p>
            </div>

            <div className="p-5 border shadow-lg bg-zinc-800 rounded-xl sm:rounded-2xl sm:p-6 border-zinc-700">
                {error && (
                    <div
                        className="p-3 mb-5 text-sm text-red-200 border rounded-lg bg-red-500/10 border-red-500/50 sm:p-3 sm:mb-6 sm:text-base"
                        role="alert"
                    >
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2 sm:h-5 sm:w-5" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mb-5 sm:mb-6">
                    {[0, 1, 2].map((step) => (
                        <div key={step} className="flex flex-col items-center">
                            <div
                                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm
                                    ${formStep >= step ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white" : "bg-zinc-700 text-gray-400"}`}
                            >
                                {step + 1}
                            </div>
                            <div className={`text-xs mt-1 ${formStep >= step ? "text-gray-300" : "text-gray-500"}`}>
                                {step === 0 ? "Personal" : step === 1 ? "Medical" : "Goals"}
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={`${getAnimationClass()} transition-all duration-500 ease-in-out`}>
                        {formStep === 0 && (
                            <>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">First Name</label>
                                            <input
                                                type="text"
                                                placeholder="John"
                                                {...register("firstName", { required: "First name is required" })}
                                                className="w-full px-4 py-3 text-base text-white placeholder-gray-400 rounded-lg outline-none bg-zinc-700 sm:rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                            />
                                            {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Last Name</label>
                                            <input
                                                type="text"
                                                placeholder="Doe"
                                                {...register("lastName", { required: "Last name is required" })}
                                                className="w-full px-4 py-3 text-base text-white placeholder-gray-400 rounded-lg outline-none bg-zinc-700 sm:rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                            />
                                            {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
                                                <input
                                                type="date"
                                                {...register("dob", {
                                                    required: "Date of Birth is required",
                                                    validate: validateDOB,
                                                })}
                                                className="w-full px-4 py-3 text-base text-white placeholder-gray-400 rounded-lg outline-none bg-zinc-700 sm:rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                            />
                                            {errors.dob && <p className="mt-1 text-xs text-red-400">{errors.dob.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Gender</label>
                    
                    {/* Hidden original select for form validation */}
                    <input
                        type="hidden"
                        {...register("gender", { required: "Gender is required" })}
                    />

                    {/* Custom dropdown implementation */}
                    <div className="relative" id="gender-dropdown">
                        <button
                        type="button"
                        onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 text-base text-white rounded-lg outline-none bg-zinc-700 sm:rounded-xl focus:ring-2 focus:ring-blue-500/50"
                        >
                        <span className={`${!watchedFields.gender ? "text-gray-400" : ""}`}>
                            {watchedFields.gender 
                            ? genderOptions.find(option => option.value === watchedFields.gender)?.label
                            : "Gender"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {genderDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 overflow-hidden border rounded-lg shadow-lg bg-zinc-800 border-zinc-700">
                            {genderOptions.map((option) => (
                            <div
                                key={option.value}
                                className="px-4 py-2 text-sm text-white transition-colors cursor-pointer hover:bg-zinc-700"
                                onClick={() => selectGender(option.value)}
                            >
                                {option.label}
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                    {errors.gender && <p className="mt-1 text-xs text-red-400">{errors.gender.message}</p>}
                    </div>
                </div>
                </div>

                                <div className="flex justify-end mt-5">
                                    <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-5 py-3 text-base font-medium text-white transition rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 sm:rounded-xl hover:opacity-90"
                                    >
                                    Next
                                    </button>
                                </div>
                            </>
                        )}

                        {/* step 2: medical information */}
                        {formStep === 1 && (
                            <>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Medical Conditions</label>
                                            <input
                                            placeholder="Diabetes, Asthma, etc."
                                            {...register("medicalConditions")}
                                            className="w-full px-4 py-3 text-base text-white placeholder-gray-400 rounded-lg outline-none bg-zinc-700 sm:rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Current Medications</label>
                                            <input
                                            placeholder="Advil, Metformin, etc."
                                            {...register("medications")}
                                            className="w-full px-4 py-3 text-base text-white placeholder-gray-400 rounded-lg outline-none bg-zinc-700 sm:rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-5">
                                    <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-5 py-3 text-base font-medium text-white transition rounded-lg bg-zinc-700 sm:rounded-xl hover:bg-zinc-600"
                                    >
                                    Back
                                    </button>
                                    <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-5 py-3 text-base font-medium text-white transition rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 sm:rounded-xl hover:opacity-90"
                                    >
                                    Next
                                    </button>
                                </div>
                            </>
                        )}

                        {/* step 3: health goals  */}
                        {formStep === 2 && (
                            <>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Health Goals</label>
                                        <textarea
                                            placeholder="Lose Weight, Improve Sleep, Reduce Stress..."
                                            {...register("healthGoals")}
                                            rows={3}
                                            className="w-full px-4 py-3 text-base text-white placeholder-gray-400 rounded-lg outline-none resize-none bg-zinc-700 sm:rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </div>

                                    <div className="flex items-start py-2">
                                        <div className="flex items-center h-5">
                                            <input
                                            type="checkbox"
                                            {...register("consentToUseData", { required: "You must agree to continue" })}
                                            className="w-4 h-4 text-blue-600 rounded bg-zinc-700 border-zinc-500 focus:ring-blue-500/50"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label className="text-gray-300">
                                            I agree to allow my information to be used for personalized responses.
                                            </label>
                                            {errors.consentToUseData && (
                                            <p className="mt-1 text-xs text-red-400">{errors.consentToUseData.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-5">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-5 py-3 text-base font-medium text-white transition rounded-lg bg-zinc-700 sm:rounded-xl hover:bg-zinc-600"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className={`px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg sm:rounded-xl hover:opacity-90 transition text-base ${
                                            loading || !watchedFields.consentToUseData ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        disabled={loading || !watchedFields.consentToUseData}
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                            <div className="w-4 h-4 mr-2 border-2 border-gray-600 rounded-full border-t-white animate-spin"></div>
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
	)
}

export default Onboarding
