import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArchive, faArrowUpFromBracket,
  faThumbtack, // For Pin
  faBellSlash, // For Mute
  faVolumeUp,  // For Unmute
  faCheckCircle, // For Mark as Read (or use Eye for Unread)
  faEyeSlash, // For Mark as Unread
  faTrashAlt   // For Delete
} from '@fortawesome/free-solid-svg-icons';
import type { Chat } from '../../types';
import { formatTimestamp } from '../../utils/date';
import LastMessagePreview from './LastMessagePreview';
import ChatListItemStatusIcons from './ChatListItemStatusIcons';
import Avatar from '../common/Avatar';
import ContextMenu, { type ContextMenuItem } from '../common/ContextMenu'; // Import ContextMenu
import useStore from '../../store/useStore'; // Import useStore to access actions

interface ChatListItemProps {
  chat: Chat;
  onSelectChat: (chat: Chat) => void;
  isActive: boolean;
  currentUserId: string;
  // onToggleArchiveChatStatus is now handled by the store directly
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  onSelectChat,
  isActive,
  currentUserId,
}) => {
  const [isHovered, setIsHovered] = useState(false); // Keep for hover effects if any, besides context menu
  const [contextMenuState, setContextMenuState] = useState<{ isOpen: boolean; position: { x: number; y: number } }>({ isOpen: false, position: { x: 0, y: 0 } });

  // Access store actions
  const toggleArchiveChatStatus = useStore(state => state.toggleArchiveChatStatus);
  const togglePinChat = useStore(state => state.togglePinChat);
  const toggleMuteChat = useStore(state => state.toggleMuteChat);
  const toggleMarkUnread = useStore(state => state.toggleMarkUnread);
  const deleteChat = useStore(state => state.handleDeleteChat); // Assuming handleDeleteChat handles confirmation
  const showConfirmationDialog = useStore(state => state.showConfirmationDialog); // Add this

  const activeBgClass = isActive ? 'bg-whatsapp-active-chat' : '';

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuState({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const closeContextMenu = () => {
    setContextMenuState({ isOpen: false, position: { x: 0, y: 0 } });
  };

  // Define context menu items
  const contextMenuItems: ContextMenuItem[] = [
    {
      id: 'archive',
      label: chat.isArchived ? 'Desarquivar conversa' : 'Arquivar conversa',
      icon: chat.isArchived ? faArrowUpFromBracket : faArchive,
      onClick: () => toggleArchiveChatStatus(chat.id),
    },
    {
      id: 'pin',
      label: chat.isPinned ? 'Desafixar conversa' : 'Fixar conversa',
      icon: faThumbtack,
      onClick: () => togglePinChat(chat.id),
      isToggle: true,
      isActive: !!chat.isPinned, // Show different state if pinned
    },
    {
      id: 'mute',
      label: chat.isMuted ? 'Reativar som da conversa' : 'Silenciar conversa',
      icon: chat.isMuted ? faVolumeUp : faBellSlash,
      onClick: () => toggleMuteChat(chat.id),
      isToggle: true,
      isActive: !!chat.isMuted,
    },
    {
      id: 'markUnread',
      label: chat.isMarkedUnread ? 'Marcar como lida' : 'Marcar como não lida',
      icon: chat.isMarkedUnread || (chat.unreadCount && chat.unreadCount > 0) ? faCheckCircle : faEyeSlash,
      onClick: () => toggleMarkUnread(chat.id),
      isToggle: true,
      isActive: !!chat.isMarkedUnread || (chat.unreadCount ? chat.unreadCount > 0 : false),
    },
    {
      id: 'delete',
      label: 'Apagar conversa',
      icon: faTrashAlt,
      onClick: () => {
        showConfirmationDialog({
          title: "Apagar Conversa",
          message: "Tem certeza que quer apagar esta conversa? As mensagens serão perdidas.",
          confirmText: "Apagar",
          isDestructive: true,
          confirmButtonVariant: 'danger',
          onConfirm: () => deleteChat(chat.id),
        });
      },
      isDestructive: true,
    },
  ];

  const avatarFallbackText = chat.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';

  // The archive button on hover is removed as it's now in the context menu

  return (
    <>
      <div
        className={`group relative flex cursor-pointer items-center px-3 py-2.5 ${activeBgClass} border-b border-whatsapp-header-bg hover:bg-whatsapp-active-chat focus:outline-none focus:ring-2 focus:ring-whatsapp-light-green focus:z-10`}
        onClick={() => onSelectChat(chat)}
        onContextMenu={handleContextMenu} // Added context menu handler
        onMouseEnter={() => setIsHovered(true)} // Keep for other potential hover effects
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
        aria-current={isActive ? "page" : undefined}
      >
        <Avatar 
          src={chat.avatarUrl}
          name={chat.name}
          sizeClasses="h-12 w-12"
          className="mr-3 flex-shrink-0"
          fallbackText={avatarFallbackText}
        />
        <div className={`min-w-0 flex-1`}> {/* Removed pr-12 logic, context menu handles actions */}
          <div className="flex items-center justify-between">
            <h3 className="truncate text-base font-medium text-whatsapp-text-primary">{chat.name}</h3>
            <span className={`ml-2 flex-shrink-0 text-xs ${(chat.isMarkedUnread || (chat.unreadCount && chat.unreadCount > 0)) && !chat.isMuted ? 'font-semibold text-whatsapp-light-green' : 'text-whatsapp-text-secondary'}`}>
              {formatTimestamp(chat.lastMessage?.timestamp)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <LastMessagePreview chat={chat} currentUserId={currentUserId} />
            <ChatListItemStatusIcons 
              isMuted={chat.isMuted} 
              unreadCount={chat.unreadCount} 
              isMarkedUnread={chat.isMarkedUnread} 
            />
          </div>
        </div>
        {/* The archive button is removed, actions are in context menu now */}
      </div>
      <ContextMenu 
        isOpen={contextMenuState.isOpen} 
        onClose={closeContextMenu} 
        items={contextMenuItems} 
        position={contextMenuState.position} 
      />
    </>
  );
};

export default ChatListItem;