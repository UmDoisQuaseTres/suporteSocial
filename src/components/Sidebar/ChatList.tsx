import React from 'react';
import ChatListItem from './ChatListItem';
import type { Chat } from '../../types';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  activeChatId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, activeChatId }) => {
  return (
    <div className="flex-1 overflow-y-auto chat-scrollbar">
      {chats.sort((a,b) => (b.lastActivity || 0) - (a.lastActivity || 0)).map((chat) => (
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