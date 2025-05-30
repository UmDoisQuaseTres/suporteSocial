import React from 'react';
import ChatListItem from './ChatListItem';
import type { Chat } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faSearch } from '@fortawesome/free-solid-svg-icons';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  activeChatId?: string | null;
  onToggleArchiveChatStatus: (chatId: string) => void;
  searchTerm?: string;
  isArchivedView?: boolean;
  currentUserId: string;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  onSelectChat,
  activeChatId,
  onToggleArchiveChatStatus,
  searchTerm,
  isArchivedView,
  currentUserId
}) => {
  if (chats.length === 0) {
    let emptyMessage = "Nenhuma conversa para mostrar.";
    let icon = faComments;

    if (searchTerm) {
      emptyMessage = `Nenhuma conversa encontrada para "${searchTerm}".`;
      icon = faSearch;
    } else if (isArchivedView) {
      emptyMessage = "Nenhuma conversa arquivada.";
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-whatsapp-text-secondary">
        <FontAwesomeIcon icon={icon} className="mb-4 text-4xl text-whatsapp-icon/50" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div>
      {chats
        .map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            onSelectChat={onSelectChat}
            isActive={chat.id === activeChatId}
            currentUserId={currentUserId}
          />
        ))}
    </div>
  );
};

export default ChatList;