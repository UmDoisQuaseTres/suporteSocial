import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import type { Message, User, Chat } from '../../types';
import MessageBubble from '../MainContent/ChatWindow/MessageBubble'; // To reuse for display
import Avatar from '../common/Avatar'; // For showing chat avatar/name

interface StarredMessagesViewProps {
  allMessages: { [chatId: string]: Message[] };
  allChats: Chat[]; // To find chat info for context
  currentUserId: string;
  onClose: () => void;
  onNavigateToChat: (chat: Chat, messageId?: string) => void; // To go to the message in its chat
  onToggleStarMessage: (messageId: string) => void; // To unstar directly from this view
}

const StarredMessagesView: React.FC<StarredMessagesViewProps> = ({
  allMessages,
  allChats,
  currentUserId,
  onClose,
  onNavigateToChat,
  onToggleStarMessage
}) => {
  const starredMessagesWithContext: (Message & { chat?: Chat })[] = [];
  for (const chatId in allMessages) {
    const chat = allChats.find(c => c.id === chatId);
    allMessages[chatId].forEach(msg => {
      if (msg.isStarred) {
        starredMessagesWithContext.push({ ...msg, chat });
      }
    });
  }
  // Sort by most recently starred (or most recent message timestamp as a fallback)
  starredMessagesWithContext.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); 

  const handleUnstar = (messageId: string) => {
    onToggleStarMessage(messageId);
    // The message will be removed from the list on next render due to prop update
  };

  // Dummy handlers for MessageBubble props not used in this context
  const dummyReplyHandler = () => {}; 

  return (
    <div className="flex h-full flex-col bg-whatsapp-sidebar-bg text-whatsapp-text-primary">
      <header className="flex h-[60px] items-center bg-whatsapp-header-bg p-3 text-whatsapp-text-primary sticky top-0 z-10">
        <button onClick={onClose} className="mr-6 text-xl text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="text-lg font-medium">Mensagens Marcadas</h2>
      </header>

      {starredMessagesWithContext.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <FontAwesomeIcon icon={faStar} className="mb-4 text-5xl text-yellow-400/50" />
          <p className="text-lg text-whatsapp-text-primary">Nenhuma mensagem marcada</p>
          <p className="text-sm text-whatsapp-text-secondary">
            Para marcar uma mensagem, pressione e segure a mensagem e toque no ícone de estrela.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-2 chat-scrollbar">
          {starredMessagesWithContext.map(message => {
            const chatForMessage = message.chat;
            const sender = chatForMessage?.participants?.find(p => p.id === message.senderId);
            const senderName = message.senderId === currentUserId ? 'Você' : sender?.name || message.userName || 'Desconhecido';
            
            return (
              <div 
                key={message.id} 
                className="mb-3 rounded-lg bg-whatsapp-input-bg shadow-md transition-colors hover:bg-whatsapp-header-bg last:mb-0"
              >
                <div 
                  className="flex items-center px-3 pt-2.5 pb-1.5 cursor-pointer"
                  onClick={() => chatForMessage && onNavigateToChat(chatForMessage, message.id)}
                >
                  {chatForMessage && (
                    <Avatar src={chatForMessage.avatarUrl} name={chatForMessage.name} sizeClasses="w-6 h-6 mr-2.5 flex-shrink-0" />
                  )}
                  <div className="flex-grow min-w-0">
                    <span className="font-semibold text-sm text-whatsapp-text-primary truncate block">{chatForMessage?.name || 'Conversa desconhecida'}</span>
                    <span className="text-xs text-whatsapp-text-secondary">{senderName}</span>
                  </div>
                  <span className="ml-2 text-xs text-whatsapp-text-secondary flex-shrink-0">{new Date(message.timestamp).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}</span>
                </div>
                <div 
                  className="px-2 pb-2 cursor-pointer" 
                  onClick={() => chatForMessage && onNavigateToChat(chatForMessage, message.id)}
                >
                  <MessageBubble 
                    message={message} 
                    onStartReply={dummyReplyHandler} 
                    onStartForward={() => { /* Forwarding from here if desired */ }}
                    onToggleStarMessage={handleUnstar}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StarredMessagesView; 