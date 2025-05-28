import React from 'react';
import ChatListItem from './ChatListItem';
import type { Chat } from '../../types';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  activeChatId?: string | null; // Pode ser null
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, activeChatId }) => {
  if (chats.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-whatsapp-text-secondary">
        Nenhuma conversa aqui.
      </div>
    );
  }
  return (
    // Removido flex-1 e overflow-y-auto pois o pai já controla o scroll e altura
    <div>
      {chats
        // A ordenação já é feita no App.tsx antes de passar a lista
        // .sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0))
        .map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            onSelectChat={onSelectChat}
            isActive={chat.id === activeChatId}
          />
        ))}
    </div>
  );
};

export default ChatList;