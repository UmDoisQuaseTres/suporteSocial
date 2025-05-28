import React from 'react';
import InitialScreen from './InitialScreen';
import ChatWindow from './ChatWindow/ChatWindow';
import type { ActiveChat, Message } from '../../types';

interface MainContentProps {
  activeChat: ActiveChat | null;
  currentUserId: string;
  onSendMessage: (chatId: string, messageText: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ activeChat, currentUserId, onSendMessage }) => {
  return (
    <main className="flex w-full flex-col bg-whatsapp-chat-bg md:w-2/3">
      {activeChat ? (
        <ChatWindow
          chat={activeChat}
          currentUserId={currentUserId}
          onSendMessage={onSendMessage}
          messages={activeChat.messages}
        />
      ) : (
        <InitialScreen />
      )}
    </main>
  );
};

export default MainContent;