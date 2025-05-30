import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faEllipsisV, faArchive, faArrowUpFromBracket,
  faInfoCircle, faTrashAlt, faBroom,
  faArrowLeft, faBellSlash, faVolumeUp
} from '@fortawesome/free-solid-svg-icons';
import type { ActiveChat, Chat, User } from '../../../types';
import Avatar from '../../common/Avatar';
import DropdownMenu, { type DropdownMenuItem } from '../../common/DropdownMenu';
import useStore from '../../../store/useStore';

interface ChatHeaderProps {
  chat: ActiveChat;
  currentUserId: string;
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
  currentUserId,
  onToggleArchiveStatus,
  onShowContactInfo,
  onClearChatMessages,
  onDeleteChat,
  chatSearchTerm,
  onChatSearchChange,
  onToggleChatSearch,
  isChatSearchActive
}) => {
  const toggleMuteChat = useStore(state => state.toggleMuteChat);
  const showConfirmationDialog = useStore(state => state.showConfirmationDialog);

  const getStatus = () => {
    if (chat.typingUserIds && chat.typingUserIds.length > 0) {
      const typingParticipantNames = chat.typingUserIds
        .map(userId => {
          if (userId === currentUserId) return null;
          const participant = chat.participants?.find(p => p.id === userId);
          return participant?.name.split(' ')[0];
        })
        .filter(Boolean) as string[];

      if (typingParticipantNames.length > 0) {
        const namesString = typingParticipantNames.join(', ');
        return (
          <span className="text-whatsapp-light-green">
            {typingParticipantNames.length === 1 
              ? `${namesString} a digitar...` 
              : `${namesString} estão a digitar...`
            }
          </span>
        );
      }
    }

    if (chat.type === 'user') {
      const otherParticipants = chat.participants?.filter(p => p.id !== currentUserId);
      const lastSeenOptions = ["online", `visto por último às ${new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`];
      if (otherParticipants && otherParticipants.length === 1 && otherParticipants[0].status) {
        if (otherParticipants[0].status === 'online') return "online";
        if (otherParticipants[0].status === 'offline' && otherParticipants[0].lastSeen) {
            return `visto por último às ${new Date(otherParticipants[0].lastSeen).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
        }
      }
      return lastSeenOptions[Math.floor(Math.random() * lastSeenOptions.length)];
    }
    return `${chat.participants?.length || 0} participantes`;
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
      id: 'archive-chat',
      label: chat.isArchived ? 'Desarquivar Conversa' : 'Arquivar Conversa',
      icon: chat.isArchived ? faArrowUpFromBracket : faArchive,
      onClick: () => onToggleArchiveStatus(chat.id),
    },
    {
      id: 'mute-chat',
      label: chat.isMuted ? 'Reativar som' : 'Silenciar notificações',
      icon: chat.isMuted ? faVolumeUp : faBellSlash,
      onClick: () => toggleMuteChat(chat.id),
    },
    {
      id: 'clear-messages',
      label: 'Limpar mensagens',
      icon: faBroom,
      onClick: () => {
        showConfirmationDialog({
          title: "Limpar Mensagens",
          message: "Tem certeza que quer limpar todas as mensagens desta conversa? Esta ação não pode ser desfeita.",
          confirmText: "Limpar",
          isDestructive: true,
          confirmButtonVariant: 'danger',
          onConfirm: () => onClearChatMessages(chat.id),
        });
      },
    },
    {
      id: 'delete-chat',
      label: 'Apagar conversa',
      icon: faTrashAlt,
      isDestructive: true,
      onClick: () => {
        showConfirmationDialog({
          title: "Apagar Conversa",
          message: "Tem certeza que quer apagar esta conversa? Esta ação não pode ser desfeita.",
          confirmText: "Apagar",
          isDestructive: true,
          confirmButtonVariant: 'danger',
          onConfirm: () => onDeleteChat(chat.id),
        });
      },
    },
  ];

  if (isChatSearchActive) {
    return (
      <header className="flex h-[60px] items-center justify-between border-b border-whatsapp-divider bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
        <button 
          onClick={() => onToggleChatSearch(false)} 
          className="p-2 text-lg text-whatsapp-icon hover:text-whatsapp-text-primary focus:outline-none focus:ring-1 focus:ring-whatsapp-light-green rounded-full mr-2"
          title="Fechar Pesquisa"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <input
          type="search"
          placeholder="Pesquisar mensagens..."
          value={chatSearchTerm}
          onChange={(e) => onChatSearchChange(e.target.value)}
          className="flex-1 h-9 rounded-lg bg-whatsapp-input-bg py-2 px-3 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none focus:ring-1 focus:ring-whatsapp-light-green"
          autoFocus
        />
      </header>
    );
  }

  return (
    <header className="flex h-[60px] items-center justify-between border-b border-whatsapp-divider bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
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

      <div className="flex flex-shrink-0 items-center space-x-0.5 md:space-x-1">
        <button 
            onClick={() => onToggleChatSearch(true)} 
            className="h-10 w-10 flex items-center justify-center rounded-full text-whatsapp-icon hover:bg-whatsapp-input-bg focus:outline-none focus:ring-1 focus:ring-whatsapp-light-green"
            title="Pesquisar"
        >
          <FontAwesomeIcon icon={faSearch} className="text-xl" />
        </button>
        <DropdownMenu 
          trigger={
            <button className="h-10 w-10 flex items-center justify-center rounded-full text-whatsapp-icon hover:bg-whatsapp-input-bg focus:outline-none focus:ring-1 focus:ring-whatsapp-light-green" title="Mais opções">
              <FontAwesomeIcon icon={faEllipsisV} className="text-xl" />
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