import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faBroadcastTower, faCommentDots, faEllipsisV, faStar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types'; // Assuming User type might be needed if mockUsersLocal evolves
import Avatar from '../common/Avatar';
import DropdownMenu from '../common/DropdownMenu';
import useStore from '../../store/useStore'; // Import useStore to potentially access clear functions if available

// mockUsersLocal is kept here as it's small and specific to default avatar
const mockUsersLocal: { [id: string]: User } = {
    'currentUser': { id: 'currentUser', name: 'Eu', avatarUrl: 'https://placehold.co/40x40/FFFFFF/000000?text=EU' },
};

export interface SidebarHeaderProps {
  showArchived: boolean;
  showNewChatView: boolean;
  showCreateGroupView: boolean;
  onToggleArchivedView: () => void;
  onToggleNewChatView: () => void;
  onToggleCreateGroupView: () => void;
  onInitiateNewChat?: () => void;
  onInitiateCreateGroup?: () => void;
  onShowStarredMessages?: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ showArchived, showNewChatView, showCreateGroupView, onToggleArchivedView, onToggleNewChatView, onToggleCreateGroupView, onInitiateNewChat, onInitiateCreateGroup, onShowStarredMessages }) => {
  let title = ""; 
  let onBackAction = () => {};
  
  if (showArchived) { 
    title = "Arquivadas"; 
    onBackAction = onToggleArchivedView; 
  }
  else if (showNewChatView) { 
    title = "Nova conversa"; 
    onBackAction = onToggleNewChatView; 
  }
  else if (showCreateGroupView) {
    title = "Novo grupo";
    onBackAction = onToggleCreateGroupView;
  }

  const handleLogout = () => {
    console.log("Logout action initiated.");
    // Clear the persisted Zustand store
    // The key is 'whatsapp-store' as defined in useStore.ts
    localStorage.removeItem('whatsapp-store');
    // Reload the page to reflect the cleared state
    window.location.reload();
  };

  if (showArchived || showNewChatView || showCreateGroupView) {
    return (
      <header className="flex h-[60px] items-center bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
        <button onClick={onBackAction} className="mr-4 p-2 text-xl text-whatsapp-icon hover:bg-whatsapp-input-bg rounded-full">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="text-lg font-medium">{title}</h2>
      </header>
    );
  }

  const dropdownItems = [
    { id: 'new-group', label: 'Novo grupo', onClick: onInitiateCreateGroup || (() => console.log('Initiate new group clicked')), icon: faUsers },
    { id: 'starred-messages', label: 'Mensagens Marcadas', onClick: onShowStarredMessages || (() => console.log('Starred messages clicked')), icon: faStar },
    // Add more items like Settings if needed here
    { id: 'logout', label: 'Terminar Sessão', onClick: handleLogout, icon: faSignOutAlt, isDestructive: true },
  ];

  return (
      <header className="flex h-[60px] items-center justify-between bg-whatsapp-header-bg p-3">
        <Avatar 
          src={mockUsersLocal['currentUser']?.avatarUrl}
          name={mockUsersLocal['currentUser']?.name || 'User'}
          sizeClasses="h-10 w-10"
          className="cursor-pointer"
          fallbackText="EU"
        />
        <div className="flex items-center space-x-0.5 md:space-x-1">
          <button title="Comunidades" className="h-10 w-10 flex items-center justify-center rounded-full text-whatsapp-icon hover:bg-whatsapp-input-bg">
            <FontAwesomeIcon icon={faUsers} className="text-xl" />
          </button>
          <button title="Status" className="h-10 w-10 flex items-center justify-center rounded-full text-whatsapp-icon hover:bg-whatsapp-input-bg">
            <FontAwesomeIcon icon={faBroadcastTower} className="text-xl" />
          </button>
          <button title="Nova conversa" onClick={onInitiateNewChat} className="h-10 w-10 flex items-center justify-center rounded-full text-whatsapp-icon hover:bg-whatsapp-input-bg">
            <FontAwesomeIcon icon={faCommentDots} className="text-xl" />
          </button>
          <DropdownMenu 
            trigger={
              <button title="Menu" className="h-10 w-10 flex items-center justify-center rounded-full text-whatsapp-icon hover:bg-whatsapp-input-bg">
                <FontAwesomeIcon icon={faEllipsisV} className="text-xl" />
              </button>
            }
            items={dropdownItems}
            menuPosition="right"
          />
        </div>
      </header>
  );
};

export default SidebarHeader;
