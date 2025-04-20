'use client'
import React, {useState} from 'react';

export default function Home() {

    const [prompt, setPrompt] = useState<string>('');
    const [response, setResponse] = useState<string>('');

    const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(event.target.value)
    }

    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log('Prompt:', prompt)

        try {
            const res = await fetch('http://127.0.0.1:8080/chat', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            })

            const data = await res.json()
            setResponse(data.response)
            console.log('Response:', data.response)
        } catch (err) {
            console.error('Error:', err)
        }
    }

    return (
        <div>
            <form onSubmit = {handleSubmit}>
                <div>
                    <label>Prompt:</label>
                    <input 
                        type = 'text' 
                        value={prompt} 
                        onChange={handlePromptChange} 
                        className = 'border border-gray-300 rounded bg-white text-black w-3xl'
                    />
                </div>

                <button 
                    type = 'submit'
                    className = 'border border-white rounded px-2'
                >Submit</button>
            </form>
            <div>
                <p className = 'text-white'>{response}</p>
            </div>
        </div>        
    );
}

