import React from 'react'
import { SettingsAccount } from '../../lib/types';
import { Bell, LogOut } from 'lucide-react'
import { supabase } from '@/app/lib/supabase-client';
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation';


const Account = ({notifications, setNotifications}: SettingsAccount) => {
    const router = useRouter()
    

    const logout = async () => {
        await supabase.auth.signOut();
        console.log("Logged out")
        router.push('/')
    }

    return (
        <div className="space-y-6 w-full">
            <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
                                
            <div className="space-y-6">
            <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5" />
                        <span className="font-medium">Notifications</span>
                    </div>
                    <button 
                        onClick={() => setNotifications(!notifications)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notifications ? 'bg-blue-600' : 'bg-gray-600'}`}
                        aria-label={notifications ? "Disable notifications" : "Enable notifications"}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    
                </div>
                                
                <motion.button 
                    onClick={logout} 
                    className="flex items-center gap-3 text-red-500 py-2" 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log Out</span>
                </motion.button>
            </div>
        </div>
    )
}

export default Account
