'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { SettingsAppearance } from '../../lib/types';

const Appearance = ({darkMode, setDarkMode}: SettingsAppearance) => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                                
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        <span>Dark Mode</span>
                    </div>
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </div>
    )   
}

export default Appearance
