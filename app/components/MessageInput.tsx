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
        <div className = 'border-t border-gray-700 bg-gray-800 p-4 w-full'>
            <form onSubmit = {onSubmit} className = 'max-w-6xl mx-auto'>
                <div className='flex gap-2 items-end'>
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            placeholder="Ask anything"
                            value={value}
                            onChange={onChange}
                            rows={1}
                            className="w-full border border-gray-600 bg-gray-700 rounded-2xl text-white px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            style={{
                                minHeight: '50px',
                                maxHeight: '300px',
                                overflowY: value && textareaRef.current && textareaRef.current.scrollHeight > 300 ? 'auto' : 'hidden',
                                wordWrap: 'break-word'
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
                    <button
                        type="submit"
                        disabled={isLoading || !value.trim()}
                        className={`bg-blue-600 text-white rounded-full px-6 py-3 font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0 ${
                            isLoading || !value.trim() ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )    
}

export default MessageInput
