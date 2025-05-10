'use client'

import React from 'react'
import { SettingsSideBar } from '@/app/lib/types';
import { User, Moon, CreditCard, Lock, Shield } from 'lucide-react';

const SideBar = ({activeTab, setActiveTab, darkMode}: SettingsSideBar) => {
    
    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
        { id: 'appearance', label: 'Appearance', icon: <Moon className="w-5 h-5" /> },
        { id: 'privacy', label: 'Privacy', icon: <Shield className="w-5 h-5" /> },
        { id: 'security', label: 'Security', icon: <Lock className="w-5 h-5" /> },
        { id: 'account', label: 'Account', icon: <CreditCard className="w-5 h-5" /> },
    ];


    return (
        <div className="w-full md:w-64 mb-6 md:mb-0">
            <div className={`rounded-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                <nav className="space-y-1">
                    {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors ${
                        activeTab === tab.id
                            ? darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-blue-50 text-blue-700'
                            : darkMode
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-100'
                        }`}
                    >
                        <span className="mr-3">{tab.icon}</span>
                        <span className="font-medium">{tab.label}</span>
                    </button>
                    ))}
                </nav>
            </div>
            
        </div>
    )
}

export default SideBar
