import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faCheckDouble, faClock, // Ícones de status
  faImage, faMicrophone, faVideo, faFileAlt // Ícones de mídia
} from '@fortawesome/free-solid-svg-icons';
import type { Chat, MessageStatus } from '../../types';

interface ChatListItemProps {
  chat: Chat;
  onSelectChat: (chat: Chat) => void;
  isActive: boolean;
}

const formatTimestamp = (timestamp?: number): string => {
  // ... (função formatTimestamp como antes)
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }
  return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const renderStatusIcon = (status?: MessageStatus) => {
  if (!status) return null;
  switch (status) {
    case 'read':
      return <FontAwesomeIcon icon={faCheckDouble} className="mr-1 text-sky-400" />; // Cor azul para lido
    case 'delivered':
      return <FontAwesomeIcon icon={faCheckDouble} className="mr-1 text-whatsapp-text-secondary" />;
    case 'sent':
      return <FontAwesomeIcon icon={faCheck} className="mr-1 text-whatsapp-text-secondary" />;
    case 'pending':
      return <FontAwesomeIcon icon={faClock} className="mr-1 text-whatsapp-text-secondary" />;
    default:
      return null;
  }
};

const renderMediaIcon = (chat: Chat): React.ReactNode => {
  const lastMsg = chat.lastMessage;
  if (!lastMsg) return null;

  // Prioriza mediaType se disponível
  if (lastMsg.mediaType === 'image' || lastMsg.imageUrl) {
    return <FontAwesomeIcon icon={faImage} className="mr-1.5 text-whatsapp-text-secondary" />;
  }
  if (lastMsg.mediaType === 'audio' || lastMsg.audioUrl) {
    return <FontAwesomeIcon icon={faMicrophone} className="mr-1.5 text-whatsapp-text-secondary" />;
  }
  if (lastMsg.mediaType === 'video' || lastMsg.videoUrl) {
    return <FontAwesomeIcon icon={faVideo} className="mr-1.5 text-whatsapp-text-secondary" />;
  }
  // Poderia adicionar mais tipos, como faFileAlt para documentos
  return null;
};


const getLastMessagePreview = (chat: Chat): React.ReactNode => {
  const lastMsg = chat.lastMessage;
  if (!lastMsg) return <span className="truncate text-sm text-whatsapp-text-secondary">Nenhuma mensagem</span>;

  let statusPrefix = null;
  if (lastMsg.type === 'outgoing' && lastMsg.senderId === 'currentUser') { // Assume 'currentUser' é o ID do usuário logado
    statusPrefix = renderStatusIcon(lastMsg.status);
  }

  const mediaIcon = renderMediaIcon(chat);
  const messageText = lastMsg.text || (lastMsg.mediaType ? lastMsg.mediaType.charAt(0).toUpperCase() + lastMsg.mediaType.slice(1) : 'Mídia');


  return (
    <div className="flex items-center text-sm text-whatsapp-text-secondary">
      {statusPrefix}
      {mediaIcon}
      <span className="truncate">{messageText}</span>
    </div>
  );
};

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onSelectChat, isActive }) => {
  const activeBgClass = isActive ? 'bg-whatsapp-active-chat' : 'hover:bg-whatsapp-active-chat';

  return (
    <div
      className={`flex cursor-pointer items-center p-3 ${activeBgClass} border-b border-gray-700/30`} // Ajustada borda
      onClick={() => onSelectChat(chat)}
    >
      <img
        src={chat.avatarUrl || 'https://placehold.co/50x50/CCCCCC/000000?text=?'}
        alt={`${chat.name} Avatar`}
        className="mr-3 h-12 w-12 rounded-full"
        onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50/CCCCCC/000000?text=?')}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-base font-medium text-whatsapp-text-primary">{chat.name}</h3>
          <span className={`text-xs ${chat.unreadCount && chat.unreadCount > 0 ? 'font-semibold text-whatsapp-light-green' : 'text-whatsapp-text-secondary'}`}>
            {formatTimestamp(chat.lastMessage?.timestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-0.5"> {/* Pequeno ajuste de padding-top */}
          {getLastMessagePreview(chat)}
          {chat.unreadCount && chat.unreadCount > 0 && (
            <span className="ml-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-whatsapp-light-green px-1 text-xs font-semibold text-white">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;