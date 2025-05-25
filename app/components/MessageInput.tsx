import React, { useEffect} from 'react'

interface MessageInputProps {
    value: string;
    isLoading: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
}


const MessageInput: React.FC<MessageInputProps> = ({value, isLoading, onChange, onSubmit, textareaRef}: MessageInputProps) => {

    useEffect(() => {
        const adjustHeight = () => {
            const textarea = textareaRef.current
            if (textarea) {
                textarea.style.height = 'auto'; // Reset height to auto to calculate the new height
                textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
            }
        }
        adjustHeight()

        const timeoutId = setTimeout(adjustHeight, 0) // Delay to ensure the height is adjusted after rendering

        return () => clearTimeout(timeoutId)
    }, [value, textareaRef])


    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 w-full border-t bg-zinc-900 border-zinc-800 md:relative md:border-t-0 md:z-auto">
            <div className="w-full max-w-3xl px-4 py-3 mx-auto pb-safe md:py-2">
                <form onSubmit={onSubmit} className="w-full">
                    <div className="relative flex flex-col w-full px-4 py-3 border shadow-lg bg-zinc-800 rounded-2xl sm:px-5 border-zinc-700">
                        <div className="w-full" style={{ minWidth: "100%" }}>
                            <textarea
                                ref={textareaRef}
                                placeholder="Ask anything"
                                value={value}
                                onChange={onChange}
                                rows={2}
                                className="w-full py-1 text-white placeholder-gray-400 bg-transparent outline-none resize-none rounded-2xl"
                                style={{
                                    minHeight: '40px',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    lineHeight: '1.5',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    border: "1px solid transparent",
                                }}
                                onKeyDown={(e) => {
                                    // Submit on Enter without Shift key
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        const form = e.currentTarget.form;
                                        if (form && !isLoading && value.trim()) {
                                            form.requestSubmit();
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                type="submit"
                                disabled={isLoading || !value.trim()}
                                className="bg-[#1A4B84] text-black font-medium p-3 rounded-xl hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-gray-600 rounded-full border-t-white animate-spin"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up">
                                        <path d="m5 12 7-7 7 7"/>
                                        <path d="M12 19V5"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )    
}

export default MessageInput
