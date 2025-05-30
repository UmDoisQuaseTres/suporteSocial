import React from 'react';
import InitialScreen from './InitialScreen';
import ChatWindow from './ChatWindow/ChatWindow';
import type { ActiveChat, Chat, Message } // Adicionado Chat e Message
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
    videoUrl?: string; // Added videoUrl
    duration?: number; // Added duration
    mediaType?: 'image' | 'document' | 'audio' | 'video'; // Added video
  }) => void;
  onToggleArchiveStatus: (chatId: string) => void;
  onShowContactInfo: (chat: Chat) => void; // Nova prop
  onClearChatMessages: (chatId: string) => void; // Added
  onDeleteChat: (chatId: string) => void; // Added
  allChats: Chat[]; // Added
  onForwardMessage: (originalMessage: Message, targetChatIds: string[]) => void; // Added
  onToggleStarMessage: (messageId: string) => void; // Added
  messageToHighlightId?: string | null; // Added
  clearMessageToHighlight?: () => void; // Added
}

const MainContent: React.FC<MainContentProps> = ({
  mainContentWidthClass,
  activeChat,
  currentUserId,
  onSendMessage,
  onToggleArchiveStatus,
  onShowContactInfo, // Recebendo
  onClearChatMessages, // Added
  onDeleteChat, // Added
  allChats, // Added
  onForwardMessage, // Added
  onToggleStarMessage, // Added
  messageToHighlightId, // Added
  clearMessageToHighlight // Added
}) => {
  return (
    // Aplicando a classe de largura dinâmica e o novo padrão de fundo
    <main className={`flex flex-col bg-whatsapp-chat-bg bg-whatsapp-chat-pattern ${mainContentWidthClass}`}>
      {activeChat ? (
        <ChatWindow
          chat={activeChat}
          currentUserId={currentUserId}
          onSendMessage={onSendMessage}
          messages={activeChat.messages} // messages já está em ActiveChat
          onToggleArchiveStatus={onToggleArchiveStatus}
          onShowContactInfo={onShowContactInfo} // Passando para ChatWindow
          onClearChatMessages={onClearChatMessages} // Added
          onDeleteChat={onDeleteChat} // Added
          allChats={allChats} // Added
          onForwardMessage={onForwardMessage} // Added
          onToggleStarMessage={onToggleStarMessage} // Added
          messageToHighlightId={messageToHighlightId} // Added
          clearMessageToHighlight={clearMessageToHighlight} // Added
        />
      ) : (
        <InitialScreen />
      )}
    </main>
  );
};

export default MainContent;