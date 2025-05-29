import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArchive, faArrowUpFromBracket
  // faBellSlash is no longer needed here
} from '@fortawesome/free-solid-svg-icons';
import type { Chat } from '../../types';
import { formatTimestamp } from '../../utils/date';
import LastMessagePreview from './LastMessagePreview';
import ChatListItemStatusIcons from './ChatListItemStatusIcons'; // Import the new component
import Avatar from '../common/Avatar'; // Added import

interface ChatListItemProps {
  chat: Chat;
  onSelectChat: (chat: Chat) => void;
  isActive: boolean;
  onToggleArchiveChatStatus: (chatId: string) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  onSelectChat,
  isActive,
  onToggleArchiveChatStatus
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const activeBgClass = isActive ? 'bg-whatsapp-active-chat' : '';

  const handleArchiveButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleArchiveChatStatus(chat.id);
  };

  return (
    <div
      className={`relative flex cursor-pointer items-center p-3 ${activeBgClass} border-b border-gray-700/30 hover:bg-whatsapp-active-chat`}
      onClick={() => onSelectChat(chat)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar 
        src={chat.avatarUrl}
        name={chat.name}
        sizeClasses="h-12 w-12"
        className="mr-3 flex-shrink-0"
        fallbackText="?"
      />
      <div className={`min-w-0 flex-1 ${isHovered ? 'pr-10' : ''}`}>
        <div className="flex items-center justify-between">
          <h3 className="truncate text-base font-medium text-whatsapp-text-primary">{chat.name}</h3>
          <span className={`ml-2 flex-shrink-0 text-xs ${chat.unreadCount && chat.unreadCount > 0 && !chat.isMuted ? 'font-semibold text-whatsapp-light-green' : 'text-whatsapp-text-secondary'}`}>
            {formatTimestamp(chat.lastMessage?.timestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <LastMessagePreview chat={chat} />
          <ChatListItemStatusIcons isMuted={chat.isMuted} unreadCount={chat.unreadCount} />
        </div>
      </div>

      {isHovered && (
        <button
          onClick={handleArchiveButtonClick}
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