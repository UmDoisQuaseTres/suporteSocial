import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import type { Chat, MessageStatus } from '../../types';

interface ChatListItemProps {
  chat: Chat;
  onSelectChat: (chat: Chat) => void;
  isActive: boolean;
}

const formatTimestamp = (timestamp?: number): string => {
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

const getLastMessagePreview = (chat: Chat): React.ReactNode => {
  const lastMsg = chat.lastMessage;
  if (!lastMsg) return <span className="text-sm text-whatsapp-text-secondary truncate">Nenhuma mensagem</span>;

  let prefix = '';
  if (lastMsg.type === 'outgoing') {
    let statusIcon;
    switch (lastMsg.status) {
      case 'read': statusIcon = <FontAwesomeIcon icon={faCheckDouble} className="text-blue-400 mr-1" />; break;
      case 'delivered': statusIcon = <FontAwesomeIcon icon={faCheckDouble} className="text-whatsapp-text-secondary mr-1" />; break;
      case 'sent': statusIcon = <FontAwesomeIcon icon={faCheck} className="text-whatsapp-text-secondary mr-1" />; break;
      default: statusIcon = null;
    }
    prefix = <span className="mr-1">{statusIcon}</span>;
  } else if (chat.type === 'group' && lastMsg.userName) {
     // Não mostrar nome do remetente se for a última mensagem do próprio usuário
     // (isso precisaria de lógica mais complexa se o 'currentUser' fosse parte do grupo)
    // prefix = <span className="font-semibold mr-1">{lastMsg.userName}:</span>;
  }

  if (lastMsg.text) {
    return <p className="text-sm text-whatsapp-text-secondary truncate">{prefix}{lastMsg.text}</p>;
  }
  if (lastMsg.imageUrl) {
    return <p className="text-sm text-whatsapp-text-secondary truncate">{prefix}<FontAwesomeIcon icon={faMicrophone /* Placeholder for image icon */} className="mr-1"/> Foto</p>;
  }
  // Adicionar outros tipos de mensagem (áudio, vídeo, etc.)
  return <p className="text-sm text-whatsapp-text-secondary truncate">{prefix}Mensagem</p>;
};

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onSelectChat, isActive }) => {
  return (
    <div
      className={`flex cursor-pointer items-center p-3 hover:bg-whatsapp-active-chat ${isActive ? 'bg-whatsapp-active-chat' : ''} border-b border-gray-700/50`}
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
          <span className={`text-xs ${chat.unreadCount && chat.unreadCount > 0 ? 'text-whatsapp-light-green font-semibold' : 'text-whatsapp-text-secondary'}`}>
            {formatTimestamp(chat.lastMessage?.timestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          {getLastMessagePreview(chat)}
          {chat.unreadCount && chat.unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-whatsapp-light-green text-xs font-semibold text-white">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;