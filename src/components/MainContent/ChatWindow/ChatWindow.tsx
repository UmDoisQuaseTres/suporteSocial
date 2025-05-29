import React from 'react';
import ChatHeader from './ChatHeader';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import type { ActiveChat, Message, Chat } from '../../../types';

interface ChatWindowProps {
  chat: ActiveChat;
  currentUserId: string;
  onSendMessage: (chatId: string, messageContent: { 
    text?: string; 
    imageUrl?: string; 
    fileName?: string;
    audioUrl?: string;
    duration?: number;
    mediaType?: 'image' | 'document' | 'audio';
  }) => void;
  messages: Message[];
  onToggleArchiveStatus: (chatId: string) => void;
  onShowContactInfo: (chat: Chat) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  currentUserId,
  onSendMessage,
  messages,
  onToggleArchiveStatus,
  onShowContactInfo
}) => {
  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        chat={chat}
        onToggleArchiveStatus={onToggleArchiveStatus}
        onShowContactInfo={onShowContactInfo}
      />
      <MessageArea messages={messages} currentUserId={currentUserId} />
      <MessageInput
        chatId={chat.id}
        onSendMessage={onSendMessage}
        isChatBlocked={chat.type === 'user' ? chat.isBlocked : false} // Passa o estado de bloqueio
        onOpenContactInfo={() => onShowContactInfo(chat)} // Passa a função para abrir o painel de info
      />
    </div>
  );
};

export default ChatWindow;