import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faCheckDouble, faClock,
  faImage, faMicrophone, faVideo, faFileAlt,
  faArchive, faArrowUpFromBracket // Ícones para arquivar/desarquivar
} from '@fortawesome/free-solid-svg-icons';
import type { Chat, MessageStatus } from '../../types';

interface ChatListItemProps {
  chat: Chat;
  onSelectChat: (chat: Chat) => void;
  isActive: boolean;
  onToggleArchiveChatStatus: (chatId: string) => void;
}

const formatTimestamp = (timestamp?: number): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
  return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const renderStatusIcon = (status?: MessageStatus) => {
  if (!status) return null;
  switch (status) {
    case 'read': return <FontAwesomeIcon icon={faCheckDouble} className="mr-1 text-sky-400" />;
    case 'delivered': return <FontAwesomeIcon icon={faCheckDouble} className="mr-1 text-whatsapp-text-secondary" />;
    case 'sent': return <FontAwesomeIcon icon={faCheck} className="mr-1 text-whatsapp-text-secondary" />;
    case 'pending': return <FontAwesomeIcon icon={faClock} className="mr-1 text-whatsapp-text-secondary" />;
    default: return null;
  }
};

const renderMediaIcon = (chat: Chat): React.ReactNode => {
  const lastMsg = chat.lastMessage;
  if (!lastMsg) return null;
  if (lastMsg.mediaType === 'image' || lastMsg.imageUrl) return <FontAwesomeIcon icon={faImage} className="mr-1.5 text-whatsapp-text-secondary" />;
  if (lastMsg.mediaType === 'audio' || lastMsg.audioUrl) return <FontAwesomeIcon icon={faMicrophone} className="mr-1.5 text-whatsapp-text-secondary" />;
  if (lastMsg.mediaType === 'video' || lastMsg.videoUrl) return <FontAwesomeIcon icon={faVideo} className="mr-1.5 text-whatsapp-text-secondary" />;
  return null;
};

const getLastMessagePreview = (chat: Chat): React.ReactNode => {
  const lastMsg = chat.lastMessage;
  if (!lastMsg) return <span className="truncate text-sm text-whatsapp-text-secondary">Nenhuma mensagem</span>;
  let statusPrefix = null;
  if (lastMsg.type === 'outgoing' && lastMsg.senderId === 'currentUser') { // Assume 'currentUser'
    statusPrefix = renderStatusIcon(lastMsg.status);
  }
  const mediaIcon = renderMediaIcon(chat);
  const messageText = lastMsg.text || (lastMsg.mediaType ? lastMsg.mediaType.charAt(0).toUpperCase() + lastMsg.mediaType.slice(1) : 'Mídia');
  return (<div className="flex items-center text-sm text-whatsapp-text-secondary">{statusPrefix}{mediaIcon}<span className="truncate">{messageText}</span></div>);
};

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  onSelectChat,
  isActive,
  onToggleArchiveChatStatus
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const activeBgClass = isActive ? 'bg-whatsapp-active-chat' : '';

  const handleArchiveButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Impede que o clique selecione o chat
    onToggleArchiveChatStatus(chat.id);
  };

  return (
    <div
      className={`relative flex cursor-pointer items-center p-3 ${activeBgClass} border-b border-gray-700/30 hover:bg-whatsapp-active-chat`}
      onClick={() => onSelectChat(chat)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={chat.avatarUrl || 'https://placehold.co/50x50/CCCCCC/000000?text=?'}
        alt={`${chat.name} Avatar`}
        className="mr-3 h-12 w-12 flex-shrink-0 rounded-full" // Adicionado flex-shrink-0
        onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50/CCCCCC/000000?text=?')}
      />
      {/* Container do conteúdo principal que terá padding ajustado no hover */}
      <div className={`min-w-0 flex-1 ${isHovered ? 'pr-10' : ''}`}> {/* Adiciona pr-10 quando hovered */}
        <div className="flex items-center justify-between">
          <h3 className="truncate text-base font-medium text-whatsapp-text-primary">{chat.name}</h3>
          <span className={`ml-2 flex-shrink-0 text-xs ${chat.unreadCount && chat.unreadCount > 0 ? 'font-semibold text-whatsapp-light-green' : 'text-whatsapp-text-secondary'}`}>
            {formatTimestamp(chat.lastMessage?.timestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          {getLastMessagePreview(chat)}
          {chat.unreadCount && chat.unreadCount > 0 && (
            <span className="ml-2 flex h-5 min-w-[1.25rem] flex-shrink-0 items-center justify-center rounded-full bg-whatsapp-light-green px-1 text-xs font-semibold text-white">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Botão de Arquivar/Desarquivar que aparece no hover */}
      {isHovered && (
        <button
          onClick={handleArchiveButtonClick}
          // Ajustado padding e tamanho do texto, posicionado mais à direita
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-1.5 text-sm text-whatsapp-icon hover:bg-whatsapp-header-bg hover:text-whatsapp-text-primary"
          title={chat.isArchived ? "Desarquivar conversa" : "Arquivar conversa"}
        >
          <FontAwesomeIcon icon={chat.isArchived ? faArrowUpFromBracket : faArchive} />
        </button>
      )}
    </div>
  );
};

export default ChatListItem;