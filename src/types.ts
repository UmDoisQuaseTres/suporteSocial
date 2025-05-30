export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read';
export type ChatType = 'user' | 'group';
export type UserStatus = 'online' | 'offline' | 'typing';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  status?: UserStatus;
  lastSeen?: Date | string | null; // Can be a Date object or a string like "online"
  about?: string;
}

export interface Message {
  id: string;
  text?: string;
  timestamp: number;
  senderId: string;
  type: 'incoming' | 'outgoing';
  status?: MessageStatus;
  userName?: string;
  imageUrl?: string;
  fileName?: string;
  audioUrl?: string;
  videoUrl?: string;
  duration?: number;
  mediaType?: 'image' | 'document' | 'audio' | 'video';
  replyToMessageId?: string;
  replyToMessagePreview?: string;
  replyToSenderName?: string;
  reactions?: { [emoji: string]: string[] }; // emoji -> array of user IDs
  isForwarded?: boolean;
  isStarred?: boolean;
  // Optional: Add properties if message is part of a thread or specific channel in a group
  // threadId?: string;
  // channelId?: string;
}

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatarUrl?: string;
  participants?: User[]; // Full user objects for participants
  messages: Message[]; // This will be populated dynamically or from a normalized store
  lastMessage?: Message | null; // For quick preview in chat list
  lastActivity?: number;
  unreadCount?: number;
  isMuted?: boolean;
  isArchived?: boolean;
  isPinned?: boolean; // Added for pinning chats
  isMarkedUnread?: boolean; // Added for marking chat as unread manually
  isBlocked?: boolean;
  typingUserIds?: string[]; // IDs of users currently typing
  // Group specific properties
  groupAdmins?: string[]; // Array of user IDs who are admins
  createdBy?: string; // User ID of the group creator
  description?: string; // Added group description
}

// More specific type for when a chat is active (might have more details than list preview)
export interface ActiveChat extends Chat {
  // Potentially more details when a chat is opened
  // For example, full message history might only be loaded here
  // messages: Message[]; // Already in Chat, but ensure it's populated for ActiveChat
}

// Store state structure
export interface ChatState {
  allChats: Chat[];
  activeChat: ActiveChat | null;
  messages: { [chatId: string]: Message[] };
  currentUserId: string;
  viewingContactInfoFor: Chat | null;
  isCreatingGroup: boolean;
  showArchivedView: boolean;
  searchTerm: string;
  showNewChatView: boolean;
  showContactInfoPanel: boolean;
  showCreateGroupView: boolean;
  showStarredMessagesView: boolean;
  showMediaGalleryView: boolean;
  // Define other state properties and actions as in your useStore.ts
} 