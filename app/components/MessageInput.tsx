import React from 'react'

interface MessageInputProps {
    value: string;
    isLoading: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}


const MessageInput: React.FC<MessageInputProps> = ({value, isLoading, onChange, onSubmit}: MessageInputProps) => {
    return (
        <div className = 'border-t border-gray-700 bg-gray-800 p-4'>
            <form onSubmit = {onSubmit} className = 'max-w-4xl mx-auto'>
                <div className='flex gap-2'>
                    <input
                        type = 'text'
                        placeholder='Type your message here...'
                        value={value}
                        onChange={onChange}
                        className="flex-1 border border-gray-600 bg-gray-700 rounded-full text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type = 'submit'
                        disabled={isLoading}
                        className={`bg-blue-600 text-white rounded-full px-6 py-3 font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
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
