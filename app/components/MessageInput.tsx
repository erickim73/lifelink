import React, {useRef, useEffect} from 'react'

interface MessageInputProps {
    value: string;
    isLoading: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}


const MessageInput: React.FC<MessageInputProps> = ({value, isLoading, onChange, onSubmit}: MessageInputProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    }, [value])

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="w-full max-w-[70%] px-4">
                <form onSubmit={onSubmit} className="w-full">
                    <div className="relative w-full flex flex-col bg-zinc-800 rounded-2xl px-5 py-3 mb-0 shadow-lg border border-zinc-700">
                        <div className="w-full" style={{ minWidth: "100%" }}>
                            <textarea
                                ref={textareaRef}
                                placeholder="Ask anything"
                                value={value}
                                onChange={onChange}
                                rows={2}
                                className="w-full bg-transparent rounded-2xl outline-none text-white placeholder-gray-400 py-1 resize-none "
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
                                    <div className="h-5 w-5 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
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
