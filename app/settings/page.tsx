'use client'

import { useState } from 'react';
import Profile from './profile/Profile';
import Sidebar from './sidebar/Sidebar';
import Account from './account/Account';
import Privacy from './privacy/Privacy';
import Security from './security/Security';
import { useSidebar } from '@/components/ui/sidebar';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState(true);
    const { open } = useSidebar()

    const mainContentStyle = {
        marginLeft: open ? "0" : "0",
        width: "100%",
    }

    return (
        <div className="flex h-full w-full bg-zinc-900 text-white">
            <div className="w-64 border-r border-zinc-800 flex-shrink-0 h-full overflow-y-auto">
                <h1 className="text-4xl font-normal py-6 px-8 border-b border-zinc-800">Settings</h1>

                <div className="p-4">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>        

            {/* Main Content */}
            <div className="flex-1 overflow-hidden transition-all duration-200" style={mainContentStyle}>
                <div className="h-full w-full overflow-y-auto"> 
                    {activeTab === 'profile' && (
                         <div className="h-full">
                            <Profile/>
                        </div>
                    )}
                    {activeTab === 'account' && (
                         <div className="h-full">
                            <Account notifications={notifications} setNotifications={setNotifications}/>
                        </div>
                    )}
                    
                    {activeTab === 'privacy' && (
                         <div className="h-full">
                            <Privacy/>
                        </div>
                    )}
                    {activeTab === 'security' && (
                         <div className="h-full">
                            <Security/>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}