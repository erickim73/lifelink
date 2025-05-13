'use client'

import { useState } from 'react';
import Profile from './profile/ProfileSection';
import SideBar from './sidebar/Sidebar';
import Account from './account/Account';
import Privacy from './privacy/Privacy';
import Security from './security/Security';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="flex h-screen w-screen bg-zinc-900 text-white overflow-hidden">
            
            
            <div className="flex flex-1">
                <div className="w-64 flex flex-col border-r border-zinc-800">
                    <h1 className="text-4xl font-normal py-6 px-8 border-b border-zinc-800">Settings</h1>
        
                    <div className="p-4">
                        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                </div>                

                {/* Main Content */}
                <div className="flex-1 max-w-2xl">
                    {activeTab === 'profile' && (
                        <div className="w-full">
                            <Profile/>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div className="w-full">
                            <Privacy/>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="w-full">
                            <Security/>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="w-full">
                            <Account notifications={notifications} setNotifications={setNotifications}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}