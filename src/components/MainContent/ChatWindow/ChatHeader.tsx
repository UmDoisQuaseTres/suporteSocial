import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faPaperclip, faEllipsisV, faArchive, faArrowUpFromBracket,
  faUserCircle, faInfoCircle, faTrashAlt, faBroom,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import type { ActiveChat, Chat } from '../../../types';
import Avatar from '../../common/Avatar';
import DropdownMenu, { type DropdownMenuItem } from '../../common/DropdownMenu';

interface ChatHeaderProps {
  chat: ActiveChat;
  onToggleArchiveStatus: (chatId: string) => void;
  onShowContactInfo: (chat: Chat) => void;
  onClearChatMessages: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  chatSearchTerm: string;
  onChatSearchChange: (term: string) => void;
  onToggleChatSearch: (isActive: boolean) => void;
  isChatSearchActive: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onToggleArchiveStatus,
  onShowContactInfo,
  onClearChatMessages,
  onDeleteChat,
  chatSearchTerm,
  onChatSearchChange,
  onToggleChatSearch,
  isChatSearchActive
}) => {
  const getStatus = () => {
    if (chat.type === 'user') {
      const otherParticipants = chat.participants?.filter(p => p.id !== 'currentUser');
      const lastSeenOptions = ["online", `visto por último hoje às ${new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`, "a digitar..."];
      if (otherParticipants && otherParticipants.length === 1) {
        return lastSeenOptions[Math.floor(Math.random() * lastSeenOptions.length)];
      }
      return "offline";
    }
    return `${chat.participants?.length || 0} participantes`;
  };

  const handleArchiveClick = () => {
    onToggleArchiveStatus(chat.id);
  };

  const handleHeaderClick = () => {
    if (!isChatSearchActive) {
        onShowContactInfo(chat);
    }
  };

  const menuItems: DropdownMenuItem[] = [
    {
      id: 'contact-info',
      label: chat.type === 'group' ? 'Dados do grupo' : 'Dados do contato',
      icon: faInfoCircle,
      onClick: () => onShowContactInfo(chat),
    },
    {
      id: 'clear-messages',
      label: 'Limpar mensagens',
      icon: faBroom,
      onClick: () => {
        if (window.confirm(`Tem certeza que quer limpar todas as mensagens desta conversa? Esta ação não pode ser desfeita.`)) {
          onClearChatMessages(chat.id);
        }
      },
    },
    {
      id: 'delete-chat',
      label: 'Apagar conversa',
      icon: faTrashAlt,
      isDestructive: true,
      onClick: () => {
        if (window.confirm(`Tem certeza que quer apagar esta conversa? Esta ação não pode ser desfeita.`)) {
          onDeleteChat(chat.id);
        }
      },
    },
  ];

  if (isChatSearchActive) {
    return (
      <header className="flex h-[60px] items-center justify-between border-b border-gray-700/50 bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
        <button 
          onClick={() => onToggleChatSearch(false)} 
          className="p-2 text-lg text-whatsapp-icon hover:text-gray-200 mr-2"
          title="Fechar Pesquisa"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <input
          type="search"
          placeholder="Pesquisar mensagens..."
          value={chatSearchTerm}
          onChange={(e) => onChatSearchChange(e.target.value)}
          className="flex-1 h-9 rounded-lg bg-whatsapp-input-bg py-2 px-3 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none focus:ring-1 focus:ring-teal-500"
          autoFocus
        />
      </header>
    );
  }

  return (
    <header className="flex h-[60px] items-center justify-between border-b border-gray-700/50 bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
      <div className={`flex flex-1 items-center overflow-hidden ${isChatSearchActive ? '' : 'cursor-pointer'}`} onClick={handleHeaderClick}>
        <Avatar 
          src={chat.avatarUrl}
          name={chat.name}
          sizeClasses="h-10 w-10"
          className="mr-3 flex-shrink-0"
          fallbackText="?"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-medium">{chat.name}</h3>
          <p className="truncate text-xs text-whatsapp-text-secondary">{getStatus()}</p>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center space-x-1 md:space-x-2">
        <button
            onClick={handleArchiveClick}
            className="p-2 text-lg text-whatsapp-icon hover:text-gray-200"
            title={chat.isArchived ? "Desarquivar Conversa" : "Arquivar Conversa"}
        >
            <FontAwesomeIcon icon={chat.isArchived ? faArrowUpFromBracket : faArchive} />
        </button>
        <button 
            onClick={() => onToggleChatSearch(true)} 
            className="p-2 text-lg text-whatsapp-icon hover:text-gray-200" 
            title="Pesquisar"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <DropdownMenu 
          trigger={
            <button className="p-2 text-lg text-whatsapp-icon hover:text-gray-200" title="Mais opções">
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          }
          items={menuItems}
          menuPosition="right"
        />
      </div>
    </header>
  );
};

export default ChatHeader;