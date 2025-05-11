'use client'

import { useState } from 'react';
import Profile from './profile/ProfileSection';
import SideBar from './sidebar/Sidebar';
import Appearance from './appearance/Appearance';
import Account from './account/Account';
import Privacy from './privacy/Privacy';
import Security from './security/Security';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>
                
                <div className="flex flex-col md:flex-row gap-6">
                    <SideBar activeTab={activeTab} setActiveTab={setActiveTab} darkMode/>                

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                            {activeTab === 'profile' && (
                                <div>
                                    <Profile/>
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div>
                                    <Appearance darkMode={darkMode} setDarkMode={setDarkMode}/>
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div>
                                    <Privacy/>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div>
                                    <Security/>
                                </div>
                            )}

                            {activeTab === 'account' && (
                                <Account notifications={notifications} setNotifications={setNotifications}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}