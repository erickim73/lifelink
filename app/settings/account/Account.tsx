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
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                                
            <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5" />
                        <span>Notifications</span>
                    </div>
                    <button 
                        onClick={() => setNotifications(!notifications)}
                        className={`mx-2 relative inline-flex h-6 w-11 items-center rounded-full ${notifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    
                </div>
                                
                <motion.button onClick={logout} className="flex items-center gap-3 text-red-500 py-3 hover:bg-gray-900" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </motion.button>
            </div>
        </div>
    )
}

export default Account
