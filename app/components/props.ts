export interface ChatMessage {
    message_id: string;
    session_id: string;
    user_id: string;
    sender: 'user' | 'model';
    content: string;
    created_at: string;
}

export type NewChatMessage = Omit<ChatMessage, 'message_id' | 'created_at'>;
