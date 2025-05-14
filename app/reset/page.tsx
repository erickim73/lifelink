'use client'

import React, { useState } from 'react'
import { supabase } from '../lib/supabase-client'
import { useRouter } from 'next/navigation'

const ResetPassword = () => {
    const [data, setData] = useState<{password: string, confirmPassword: string}>({password: '', confirmPassword: ''})
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const router = useRouter()

    const confirmPasswords = async () => {
        const { password, confirmPassword } = data
        if (password !== confirmPassword) {
            alert('Passwords do not match')
            return  // <-- This was missing
        }
    
        const { data: resetData, error } = await supabase.auth.updateUser({ password })
    
        if (resetData) {
            console.log('Password reset successfully', resetData)
            router.push('/login')
        }
    
        if (error) {
            console.error('Error resetting password', error)
        }
    }
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    return (
        <div>
            <div>
                <label>Enter your new password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={data.password}
                    onChange={handleChange}
                />
                <label>Confirm your new password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    value={data.confirmPassword}
                    onChange={handleChange}
                />            
            </div>
            <button onClick={() => setShowPassword(!showPassword)} className = 'border border-white px-2'>
                {showPassword ? 'Hide Password' : 'Show Password'}
            </button>
            
            <div>
                <button onClick={confirmPasswords} className = 'border border-white px-2'>Confirm</button>
            </div>
        </div>
    )
}

export default ResetPassword
