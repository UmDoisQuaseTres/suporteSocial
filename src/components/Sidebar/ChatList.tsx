import React from 'react';
import ChatListItem from './ChatListItem';
import type { Chat } from '../../types';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  activeChatId?: string | null;
  onToggleArchiveChatStatus: (chatId: string) => void; // <-- Nova prop
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  onSelectChat,
  activeChatId,
  onToggleArchiveChatStatus // <-- Recebendo a prop
}) => {
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
            onToggleArchiveChatStatus={onToggleArchiveChatStatus} // <-- Passando para ChatListItem
          />
        ))}
    </div>
  );
};

export default ChatList;