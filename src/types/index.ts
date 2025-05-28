export interface User {
    id: string;
    name: string;
    avatarUrl?: string;
  }
  
  export type MessageStatus = 'sent' | 'delivered' | 'read' | 'pending';
  
  export interface Message {
    id: string;
    text?: string;
    imageUrl?: string;
    audioUrl?: string; // Novo: para indicar áudio
    videoUrl?: string; // Novo: para indicar vídeo
    mediaType?: 'image' | 'audio' | 'video'; // Novo: para facilitar
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
  }
  
  export interface ActiveChat extends Chat {
    messages: Message[];
  }