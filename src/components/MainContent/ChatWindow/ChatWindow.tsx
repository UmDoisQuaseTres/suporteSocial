import React from 'react';
import ChatHeader from './ChatHeader';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import type { ActiveChat, Message } from '../../../types';

interface ChatWindowProps {
  chat: ActiveChat;
  currentUserId: string;
  onSendMessage: (chatId: string, messageText: string) => void;
  messages: Message[];
  onToggleArchiveStatus: (chatId: string) => void; // Nova prop
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  currentUserId,
  onSendMessage,
  messages,
  onToggleArchiveStatus // Recebendo a nova prop
}) => {
  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        chat={chat}
        onToggleArchiveStatus={onToggleArchiveStatus} // Passando para ChatHeader
      />
      <MessageArea messages={messages} currentUserId={currentUserId} />
      <MessageInput chatId={chat.id} onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;