import React from 'react';
import InitialScreen from './InitialScreen';
import ChatWindow from './ChatWindow/ChatWindow';
import type { ActiveChat, Chat } // Adicionado Chat
from '../../types';

interface MainContentProps {
  mainContentWidthClass: string; // Nova prop para largura dinâmica
  activeChat: ActiveChat | null;
  currentUserId: string;
  onSendMessage: (chatId: string, messageContent: { 
    text?: string; 
    imageUrl?: string; 
    fileName?: string; // Added fileName
    audioUrl?: string; // Added audioUrl
    duration?: number; // Added duration
    mediaType?: 'image' | 'document' | 'audio'; // Added audio
  }) => void;
  onToggleArchiveStatus: (chatId: string) => void;
  onShowContactInfo: (chat: Chat) => void; // Nova prop
}

const MainContent: React.FC<MainContentProps> = ({
  mainContentWidthClass,
  activeChat,
  currentUserId,
  onSendMessage,
  onToggleArchiveStatus,
  onShowContactInfo // Recebendo
}) => {
  return (
    // Aplicando a classe de largura dinâmica
    <main className={`flex flex-col bg-whatsapp-chat-bg ${mainContentWidthClass}`}>
      {activeChat ? (
        <ChatWindow
          chat={activeChat}
          currentUserId={currentUserId}
          onSendMessage={onSendMessage}
          messages={activeChat.messages} // messages já está em ActiveChat
          onToggleArchiveStatus={onToggleArchiveStatus}
          onShowContactInfo={onShowContactInfo} // Passando para ChatWindow
        />
      ) : (
        <InitialScreen />
      )}
    </main>
  );
};

export default MainContent;