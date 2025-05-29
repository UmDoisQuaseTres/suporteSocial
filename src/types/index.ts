export interface User {
    id: string;
    name: string;
    avatarUrl?: string;
    about?: string;
  }
  
  export type MessageStatus = 'sent' | 'delivered' | 'read' | 'pending';
  
  export interface Message {
    id: string;
    text?: string; // Caption for media, or text message
    imageUrl?: string;
    audioUrl?: string;
    videoUrl?: string;
    documentUrl?: string; // For potential future download link
    fileName?: string; // To display the name of the document
    duration?: number; // Added for audio/video duration in seconds
    mediaType?: 'image' | 'audio' | 'video' | 'document'; // Added 'document'
    timestamp: number; // Usaremos timestamp para ordenação e formatação
    senderId: string; // Para saber quem enviou
    receiverId?: string; // Para chats 1-1
    groupId?: string; // Para chats em grupo
    status?: MessageStatus; // Apenas para mensagens enviadas pelo usuário atual
    type: 'incoming' | 'outgoing'; // Facilita a renderização
    userName?: string; // Para mensagens de grupo recebidas
  }
  
  export interface Chat {
    id: string;
    type: 'user' | 'group';
    name: string;
    avatarUrl?: string;
    lastMessage?: Message;
    unreadCount?: number;
    lastActivity: number; // Timestamp da última atividade para ordenação
    participants?: User[]; // Para grupos
    isArchived?: boolean;
    isMuted?: boolean;
    isBlocked?: boolean;
  }
  
  export interface ActiveChat extends Chat {
    messages: Message[];
  }