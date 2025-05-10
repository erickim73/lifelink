import React from 'react'
import { SettingsAccount } from '../../lib/types';
import { Bell, ChevronRight, Lock, HelpCircle, LogOut } from 'lucide-react'


const Account = ({notifications, setNotifications, darkMode}: SettingsAccount) => {
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
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${notifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
                
                <div className={`flex items-center justify-between py-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5" />
                        <span>Password & Security</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className={`flex items-center justify-between py-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5" />
                        <span>Help & Support</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <button className="flex items-center gap-3 text-red-500 py-3">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}

export default Account
