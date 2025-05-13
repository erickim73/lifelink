export interface ChatMessage {
    message_id: string;
    session_id: string;
    user_id: string;
    sender: 'user' | 'model';
    content: string;
    created_at: string;
}

export interface ChatSession {
    session_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export type NewChatMessage = Omit<ChatMessage, 'message_id' | 'created_at'>;

export interface UserData {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female' | 'non-binary' | 'prefer_not_to_say' | string;
    dob: string;

    medicalConditions: string[];
    medications: string[];
    healthGoals: string[];    
    consentToUseData: boolean;
}

export interface UserFormData {
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;

    medicalConditions: string;
    medications: string;
    healthGoals: string;    
    consentToUseData: boolean;
}

export interface UserProfile {
    name: string;
    email: string;
    initials: string;
}

export interface ProfileDetailProps {
    userData: UserFormData | null
    formState: UserFormData | null
    isEditing: boolean
    isSaving: boolean
    handleInputChange: (field: keyof UserFormData, value: string) => void
    toggleEditMode: () => void
    handleSaveChanges: () => void
}

export interface SettingsSideBar {
    activeTab: string;
    setActiveTab: (tab: string) => void
}


export interface SettingsAccount {
    notifications: boolean
    setNotifications: (val: boolean) => void
}