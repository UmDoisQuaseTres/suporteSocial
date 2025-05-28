import React from 'react';
import ChatHeader from './ChatHeader';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import type { ActiveChat, Message } from '../../../types'; // Certifique-se que o caminho está correto

interface ChatWindowProps {
  chat: ActiveChat;
  currentUserId: string;
  onSendMessage: (chatId: string, messageText: string) => void;
  messages: Message[]; // Recebe as mensagens como prop
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUserId, onSendMessage, messages }) => {
  return (
    <div className="flex h-full flex-col">
      <ChatHeader chat={chat} />
      <MessageArea messages={messages} currentUserId={currentUserId} />
      <MessageInput chatId={chat.id} onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;