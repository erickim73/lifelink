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
			setError("Session is not available. Cannot submit profile.")
			return
		}

		setLoading(true)

		try {
			await supabase.from("profiles").insert(transformedUserData)
			console.log("Inserted User Data: ", transformedUserData)
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
		<div className="min-h-screen bg-zinc-900 flex items-center justify-center px-5 sm:px-6 py-10 sm:py-12">
			<div className="w-full max-w-[360px] sm:max-w-xl">
				<div className="flex flex-col items-center mb-6 sm:mb-5">
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
					<h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2 sm:mb-1 text-center">
						Complete Your Profile
					</h1>
					<p className="text-base sm:text-base text-gray-400 text-center max-w-[300px] sm:max-w-none">
						Tell us about yourself
					</p>
				</div>

				<div className="bg-zinc-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-zinc-700">
					{error && (
						<div
							className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 sm:p-3 mb-5 sm:mb-6 text-red-200 text-sm sm:text-base"
							role="alert"
						>
							<div className="flex items-center">
								<AlertCircle className="h-5 w-5 sm:h-5 sm:w-5 mr-2" />
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
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="space-y-2">
												<label className="text-sm text-gray-300 block font-medium">First Name</label>
												<input
													type="text"
													placeholder="John"
													{...register("firstName", { required: "First name is required" })}
													className="w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 text-base focus:ring-2 focus:ring-blue-500/50"
												/>
												{errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
											</div>

											<div className="space-y-2">
												<label className="text-sm text-gray-300 block font-medium">Last Name</label>
												<input
													type="text"
													placeholder="Doe"
													{...register("lastName", { required: "Last name is required" })}
													className="w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 text-base focus:ring-2 focus:ring-blue-500/50"
												/>
												{errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
											</div>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="space-y-2">
												<label className="text-sm text-gray-300 block font-medium">Date of Birth</label>
													<input
													type="date"
													{...register("dob", {
														required: "Date of Birth is required",
														validate: validateDOB,
													})}
													className="w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 text-base focus:ring-2 focus:ring-blue-500/50"
												/>
												{errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob.message}</p>}
											</div>

											<div className="space-y-2">
                        <label className="text-sm text-gray-300 block font-medium">Gender</label>
                        
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
                            className="w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white py-3 px-4 text-base focus:ring-2 focus:ring-blue-500/50 flex justify-between items-center"
                          >
                            <span className={`${!watchedFields.gender ? "text-gray-400" : ""}`}>
                              {watchedFields.gender 
                                ? genderOptions.find(option => option.value === watchedFields.gender)?.label
                                : "Select your gender"}
                            </span>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </button>

                          {genderDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg overflow-hidden">
                              {genderOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className="px-4 py-2 text-sm hover:bg-zinc-700 cursor-pointer text-white transition-colors"
                                  onClick={() => selectGender(option.value)}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>}
                      </div>
                    </div>
                  </div>

									<div className="flex justify-end mt-5">
										<button
										type="button"
										onClick={nextStep}
										className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg sm:rounded-xl hover:opacity-90 transition text-base"
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
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="space-y-2">
												<label className="text-sm text-gray-300 block font-medium">Medical Conditions</label>
												<input
												placeholder="Diabetes, Asthma, etc."
												{...register("medicalConditions")}
												className="w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 text-base focus:ring-2 focus:ring-blue-500/50"
												/>
											</div>

											<div className="space-y-2">
												<label className="text-sm text-gray-300 block font-medium">Current Medications</label>
												<input
												placeholder="Advil, Metformin, etc."
												{...register("medications")}
												className="w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 text-base focus:ring-2 focus:ring-blue-500/50"
												/>
											</div>
										</div>
									</div>

									<div className="flex justify-between mt-5">
										<button
										type="button"
										onClick={prevStep}
										className="px-5 py-3 bg-zinc-700 text-white font-medium rounded-lg sm:rounded-xl hover:bg-zinc-600 transition text-base"
										>
										Back
										</button>
										<button
										type="button"
										onClick={nextStep}
										className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg sm:rounded-xl hover:opacity-90 transition text-base"
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
											<label className="text-sm text-gray-300 block font-medium">Health Goals</label>
											<textarea
												placeholder="Lose Weight, Improve Sleep, Reduce Stress..."
												{...register("healthGoals")}
												rows={3}
												className="w-full bg-zinc-700 rounded-lg sm:rounded-xl outline-none text-white placeholder-gray-400 py-3 px-4 text-base focus:ring-2 focus:ring-blue-500/50 resize-none"
											/>
										</div>

										<div className="flex items-start py-2">
											<div className="flex items-center h-5">
												<input
												type="checkbox"
												{...register("consentToUseData", { required: "You must agree to continue" })}
												className="h-4 w-4 text-blue-600 bg-zinc-700 border-zinc-500 rounded focus:ring-blue-500/50"
												/>
											</div>
											<div className="ml-3 text-sm">
												<label className="text-gray-300">
												I agree to allow my information to be used for personalized responses.
												</label>
												{errors.consentToUseData && (
												<p className="text-red-400 text-xs mt-1">{errors.consentToUseData.message}</p>
												)}
											</div>
										</div>
									</div>

									<div className="flex justify-between mt-5">
										<button
											type="button"
											onClick={prevStep}
											className="px-5 py-3 bg-zinc-700 text-white font-medium rounded-lg sm:rounded-xl hover:bg-zinc-600 transition text-base"
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
												<div className="w-4 h-4 border-2 border-gray-600 border-t-white rounded-full animate-spin mr-2"></div>
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
