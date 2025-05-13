'use client'

import React from 'react'
import { SettingsSideBar } from '@/app/lib/types';

const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' }, 
    { id: 'privacy', label: 'Privacy' }, 
    { id: 'security', label: 'Security' },
];
const SideBar = ({activeTab, setActiveTab}: SettingsSideBar) => {
    return (
        <div className="w-full mb-6 md:mb-0">
                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center w-full px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-zinc-800 text-white' // Active tab is darker background
                                    : 'text-gray-300 hover:bg-zinc-800/70' // Made inactive tabs lighter gray with hover effect
                            }`}
                        >
                            
                            <span className="text-base font-medium">
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </nav>            
        </div>
    )
}

export default SideBar
