'use client'

import React from 'react'
import { ProfileDetailProps } from '../../lib/types';
import { User, Calendar, Heart, Pill, Target } from 'lucide-react'


const ProfileSection = React.memo(function ProfileSection({icon, title, content, className = ""}: { icon: React.ReactNode; title: string; content: React.ReactNode; className?: string }) {
    return (
        <div className={`mb-8 ${className}`}>
            <div className="flex items-center mb-4">
                <span className="text-blue-400 mr-2">{icon}</span>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <div className="pl-8 text-gray-300">{content}</div>
        </div>
    );
});

const formatDate = (dateString: string) => {
    if (!dateString) {
        return ""
    }

    // if date already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    // try to parse date
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            return dateString; 
        }
        return date.toISOString().split('T')[0];
    } catch {
        return dateString;
    }

}

export default function ProfileDetails({userData, formState, isEditing, isSaving=false, handleInputChange, toggleEditMode, handleSaveChanges}: ProfileDetailProps) {
    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            {!isEditing && (
                <div className="p-6 border-b border-zinc-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                {userData?.firstName} {userData?.lastName}
                            </h2>
                            {userData?.gender && (
                                <p className="text-gray-400">Gender: {userData?.gender}</p>
                            )}
                        </div>
                        {/* Added avatar circle similar to Claude's interface */}
                        <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
                            {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                        </div>
                    </div>
                </div>
            )}
            <div className="p-6">
                <ProfileSection
                    icon={<User className="w-5 h-5" />}
                    title="Basic Information"
                    content={
                        isEditing ? (
                            <div className = 'space-y-4'>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">First Name</label>
                                    <input
                                        type='text'
                                        value={formState?.firstName || ''}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className="bg-zinc-700 p-2 rounded text-white w-full border border-zinc-600 focus:border-blue-500 focus:outline-none"
                                        placeholder="First Name"
                                        aria-label="First Name" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                                    <input
                                        type='text'
                                        value={formState?.lastName || ''}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className="bg-zinc-700 p-2 rounded text-white w-full border border-zinc-600 focus:border-blue-500 focus:outline-none"
                                        placeholder="Last Name"
                                        aria-label="Last Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Gender</label>
                                    <select
                                        value={formState?.gender || ''}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="bg-zinc-700 p-2 rounded text-white w-full border border-zinc-600 focus:border-blue-500 focus:outline-none"
                                        aria-label="Gender"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="non-binary">Non-binary</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-2"><span className="text-gray-400">Full Name:</span> {userData?.firstName} {userData?.lastName}</p>
                                <p><span className="text-gray-400">Gender:</span> {userData?.gender || "Not specified"}</p>
                            </div>
                        )
                
                    }
                />
            </div>

        
            <ProfileSection 
                icon={<Calendar className="w-5 h-5 text-green-400" />}
                title="Date of Birth"
                content={
                    isEditing ? (
                        <div className = 'space-y-2'>
                            <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
                            <input
                                type='date'
                                value={formatDate(formState?.dob || '')}
                                onChange={(e) => handleInputChange('dob', e.target.value)}
                                className="bg-zinc-700 p-2 rounded text-white w-full border border-zinc-600 focus:border-blue-500 focus:outline-none"
                                placeholder="Date of Birth"
                                aria-label="Date of Birth"
                            />
                        </div>
                    ) : (
                        <p>
                            {formatDate(userData?.dob || '') || "Not specified"}
                        </p>
                    )
                }
            />
        
            <ProfileSection 
                icon={<Heart className="w-5 h-5 text-red-400" />}
                title="Medical Conditions"
                content={
                    isEditing ? (
                        <div className = 'space-y-2'>
                            <label className="block text-sm text-gray-400 mb-1">Medical Conditions</label>
                            <textarea
                                value = {formState?.medicalConditions || ""}
                                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}                                            
                                className="bg-zinc-700 p-2 rounded text-white w-full h-24 border border-zinc-600 focus:border-blue-500 focus:outline-none"
                                placeholder="List your medical conditions"
                                aria-label="Medical Conditions"
                            />
                        </div>
                    ) : (
                        <p className="whitespace-pre-line">
                            {userData?.medicalConditions || "None specified"}
                        </p>                                
                    )
                }   
            />
        
            <ProfileSection 
                icon={<Pill className="w-5 h-5 text-purple-400" />}
                title="Medications"
                content={
                    isEditing ? (
                        <div className = 'space-y-2'>
                            <label className="block text-sm text-gray-400 mb-1">Medications</label>
                            <textarea
                                value = {formState?.medications || ""}
                                onChange={(e) => handleInputChange('medications', e.target.value)}                                            
                                className="bg-zinc-700 p-2 rounded text-white w-full h-24 border border-zinc-600 focus:border-blue-500 focus:outline-none"
                                placeholder="List your medications"
                                aria-label="Medications"
                            />
                        </div>
                    ) : (
                        <p className="whitespace-pre-line"> 
                            {userData?.medications || "None specified"}
                        </p>
                    )
                }
            />
            
            <ProfileSection 
                icon={<Target className="w-5 h-5 text-yellow-400" />}
                title="Health Goals"
                content={
                    isEditing ? (
                        <div className = 'space-y-2 whitespace-pre-line'>
                            <label className="block text-sm text-gray-400 mb-1">Health Goals</label>
                            <textarea
                                value = {formState?.healthGoals || ""}
                                onChange={(e) => handleInputChange('healthGoals', e.target.value)}    
                                className="bg-zinc-700 p-2 rounded text-white w-full h-24 border border-zinc-600 focus:border-blue-500 focus:outline-none"                                       
                                placeholder="Describe your health goals"
                                aria-label="Health Goals" 
                            />
                        </div>
                    ) : (
                        <div className="whitespace-pre-line">
                            {userData?.healthGoals || "No health goals specified"}
                        </div>
                    )
                }
            />

            {/* Edit and Cancel Button */}
            <div className="mt-6 flex justify-end space-x-4">
                <button 
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        isSaving 
                            ? 'bg-zinc-600 text-zinc-300 cursor-not-allowed' 
                            : isEditing 
                                ? 'bg-zinc-700 text-white hover:bg-zinc-600'  // Cancel button
                                : 'bg-blue-600 text-white hover:bg-blue-700'  // Edit button
                    }`}
                    onClick={toggleEditMode}
                    type="button"
                    disabled={isSaving} // Disable during save operation
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>

                {/* Save Changes */}
                {isEditing && (
                    <button 
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            isSaving 
                                ? 'bg-zinc-600 text-zinc-300 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        onClick={handleSaveChanges}
                        type="button"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                )}
            </div>
        </div>
    )
}
