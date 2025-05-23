"use client"

import type React from "react"
import { useState, useRef } from "react"
import { supabase } from "@/app/lib/supabase-client"
import type { NewChatMessage } from "@/app/lib/types"
import { createNewSession } from "@/app/utils/createNewSession"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/app/lib/useAuth"
import { useTextareaAutoResize } from "@/app/lib/useTextareaAutoResize"
import { useKeyboardFocus } from "@/app/lib/useKeyboardFocus"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function MainChat() {
	const [chatSessionId, setChatSessionId] = useState<string | null>(null)
	const [newPrompt, setNewPrompt] = useState({ content: "" })
	const [isLoading, setIsLoading] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const router = useRouter()

	const { session } = useAuth()
	useTextareaAutoResize(textareaRef, newPrompt.content)
	useKeyboardFocus(textareaRef)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!session) {
			return
		}

		let currentChatSessionId = chatSessionId

		if (!currentChatSessionId) {
			currentChatSessionId = await createNewSession(session)
			if (currentChatSessionId) {
				setChatSessionId(currentChatSessionId)
			} else {
				console.error("Failed to create a new chat session.")
				return
			}
		}

		if (!newPrompt.content.trim() || !session?.user.id || !currentChatSessionId) {
			return
		}

		setIsLoading(true)

		try {
			const newUserMessage: NewChatMessage = {
				session_id: currentChatSessionId,
				user_id: session.user.id,
				sender: "user",
				content: newPrompt.content,
			}

			await supabase.from("chat_messages").insert(newUserMessage)

			const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).single()

			if (profileError || !profileData) {
				console.error("Error fetching user profile: ", profileError)
				setIsLoading(false)
				return
			}

			await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("session_id", currentChatSessionId)
			setNewPrompt({ content: "" })

			router.push(`/chat/${currentChatSessionId}`)
		} catch (error) {
			console.error("Error inserting prompt:", error)
		} finally {
			setIsLoading(false)
		}
  	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Submit on Enter without Shift key
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			const form = e.currentTarget.form
			if (form && !isLoading && newPrompt.content.trim()) {
				form.requestSubmit()
			}
		}
	}

	return (
		<div className="relative flex flex-col w-full h-full bg-zinc-900">
			{/* Header with toggle for mobile */}
			 <header className="flex items-center justify-between p-4 border-b border-zinc-800 md:hidden">
				<SidebarTrigger className="flex-none" />
				<div className="flex items-center justify-center flex-grow">
					<Image alt="LifeLink Logo" src="/lifelink_logo.png" width={28} height={28} className="mr-2" />
					<h1 className="text-xl font-semibold">LifeLink</h1>
				</div>
				<div className="flex-none w-10"></div> 
			</header>

			{/* Main content */}
			<div className="flex flex-col items-center justify-center flex-grow w-full px-4 overflow-auto">
				<div className="w-full max-w-3xl mx-auto my-auto">
					<div className="flex items-center justify-center gap-4 mb-8 md:mb-10">
						<Image alt="LifeLink Logo" src="/lifelink_logo.png" width={40} height={40} />
            <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">What can I help you with?</h1>
					</div>

					<form onSubmit={handleSubmit} className="w-full">
						<div className="relative flex flex-col w-full px-4 py-4 border shadow-lg bg-zinc-800 rounded-2xl sm:px-6 sm:py-6 border-zinc-700">
							<div className="w-full">
								<textarea
									ref={textareaRef}
									placeholder="Ask anything"
									value={newPrompt.content}
									onChange={(e) => setNewPrompt({ content: e.target.value })}
									rows={2}
									className="w-full py-1 text-white placeholder-gray-400 bg-transparent outline-none resize-none rounded-2xl"
									style={{
										minHeight: "40px",
										maxHeight: "200px",
										overflowY: "auto",
										lineHeight: "1.5",
										width: "100%",
										boxSizing: "border-box",
										border: "1px solid transparent",
									}}
									onKeyDown={handleKeyDown}
								/>
							</div>
							<div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
								<button
									type="submit"
									disabled={isLoading || !newPrompt.content.trim()}
									className="bg-[#1A4B84] text-black font-medium p-2.5 sm:p-3 rounded-xl hover:bg-[#1A4B84]/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? (
										<div className="w-5 h-5 border-2 border-gray-600 rounded-full border-t-white animate-spin"></div>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="white"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="lucide lucide-arrow-up"
										>
											<path d="m5 12 7-7 7 7" />
											<path d="M12 19V5" />
										</svg>
									)}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}