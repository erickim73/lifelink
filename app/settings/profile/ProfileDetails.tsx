'use client'

import React from 'react'
import { ProfileDetailProps } from '../../lib/types';
import { User, Calendar, Heart, Pill, Target } from 'lucide-react'


const ProfileSection = React.memo(function ProfileSection({icon, title, content, className = ""}: { icon: React.ReactNode; title: string; content: React.ReactNode; className?: string }) {
    return (
        <div className={`mb-6 ${className}`}>
            <div className="flex items-center mb-2">
                {icon}
                <h3 className="text-lg font-semibold ml-2 text-gray-200">{title}</h3>
            </div>
            <div className="pl-8 text-gray-300">{content}</div>
        </div>
    );
});

export default function ProfileDetails({userData, formState, isEditing, handleInputChange, toggleEditMode, handleSaveChanges}: ProfileDetailProps) {
    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <ProfileSection 
                icon={<User className="w-5 h-5 text-blue-400" />}
                title="Basic Information"
                content={
                    isEditing ? (
                        <div className = 'space-y-2'>
                            <input
                                type='text'
                                value = {formState?.firstName || ''}
                                onChange = {(e) => handleInputChange('firstName', e.target.value)}
                                className = "bg-gray-700 p-2 rounded text-white w-full"
                                placeholder="First Name"
                            />
                            <input
                                type='text'
                                value = {formState?.lastName || ''}
                                onChange = {(e) => handleInputChange('lastName', e.target.value)}
                                className = "bg-gray-700 p-2 rounded text-white w-full"
                                placeholder="Last Name"
                            />
                            <select
                                value={formState?.gender || ''}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                className="bg-gray-700 p-2 rounded text-white w-full"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </div>
                    ) : (
                        <div>
                            <p><span className="text-gray-400">Full Name:</span> {userData?.firstName} {userData?.lastName}</p>
                            <p><span className="text-gray-400">Gender:</span> {userData?.gender || "Not specified"}</p>
                        </div>
                    )
                    
                }
            />

        
            <ProfileSection 
                icon={<Calendar className="w-5 h-5 text-green-400" />}
                title="Date of Birth"
                content={
                    isEditing ? (
                        <div className = 'space-y-2'>
                            <input
                                type='text'
                                value = {formState?.dob || ''}
                                onChange={(e) => handleInputChange('dob', e.target.value)}
                                className = "bg-gray-700 p-2 rounded text-white w-full"
                                placeholder="Date of Birth"
                            />
                        </div>
                    ) : (
                        <p>
                            {userData?.dob || "Not specified"}
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
                            <input
                                type = 'text'
                                value = {formState?.medicalConditions || ""}
                                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}                                            
                                className = "bg-gray-700 p-2 rounded text-white w-full"
                                placeholder="Medical Conditions"
                            />
                        </div>
                    ) : (
                        <p>
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
                            <input
                                type = 'text'
                                value = {formState?.medications || ""}
                                onChange={(e) => handleInputChange('medications', e.target.value)}                                            
                                className = "bg-gray-700 p-2 rounded text-white w-full"
                                placeholder="Medications"
                            />
                        </div>
                    ) : (
                        <p>
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
                            <input
                                type = 'text'
                                value = {formState?.healthGoals || ""}
                                onChange={(e) => handleInputChange('healthGoals', e.target.value)}                                           
                                className = "bg-gray-700 p-2 rounded text-white w-full"
                                placeholder="Health Goals"
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
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                    onClick = {toggleEditMode}
                    type='button'
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>

                {/* Save Changes */}
                {isEditing && (
                    <button 
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                        onClick = {handleSaveChanges}
                        type='button'
                    >
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    )
}
