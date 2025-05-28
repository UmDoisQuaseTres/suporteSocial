import React from 'react';
import InitialScreen from './InitialScreen';
import ChatWindow from './ChatWindow/ChatWindow';
import type { ActiveChat } from '../../types';

interface MainContentProps {
  activeChat: ActiveChat | null;
  currentUserId: string;
  onSendMessage: (chatId: string, messageText: string) => void;
  onToggleArchiveStatus: (chatId: string) => void; // Nova prop
}

const MainContent: React.FC<MainContentProps> = ({
  activeChat,
  currentUserId,
  onSendMessage,
  onToggleArchiveStatus // Recebendo a nova prop
}) => {
  return (
    <main className="flex w-full flex-col bg-whatsapp-chat-bg md:w-2/3">
      {activeChat ? (
        <ChatWindow
          chat={activeChat}
          currentUserId={currentUserId}
          onSendMessage={onSendMessage}
          messages={activeChat.messages}
          onToggleArchiveStatus={onToggleArchiveStatus} // Passando para ChatWindow
        />
      ) : (
        <InitialScreen />
      )}
    </main>
  );
};

export default MainContent;