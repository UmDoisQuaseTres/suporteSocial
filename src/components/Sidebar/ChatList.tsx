import React from 'react';
import ChatListItem from './ChatListItem'; // Assumindo que ChatListItem.tsx existe
import type { Chat } from '../../types';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  activeChatId?: string | null;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, activeChatId }) => {
  if (chats.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-whatsapp-text-secondary">
        Nenhuma conversa para mostrar.
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
          />
        ))}
    </div>
  );
};

export default ChatList;