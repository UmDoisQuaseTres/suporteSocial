import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faCircleNotch, faCommentDots, faEllipsisV, faStar } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types'; // Assuming User type might be needed if mockUsersLocal evolves
import Avatar from '../common/Avatar';
import DropdownMenu from '../common/DropdownMenu';

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

  if (showArchived || showNewChatView || showCreateGroupView) {
    return (
      <header className="flex h-[60px] items-center bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
        <button onClick={onBackAction} className="mr-6 text-xl text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="text-lg font-medium">{title}</h2>
      </header>
    );
  }

  return (
      <header className="flex h-[60px] items-center justify-between bg-whatsapp-header-bg p-3">
        <Avatar 
          src={mockUsersLocal['currentUser']?.avatarUrl}
          name={mockUsersLocal['currentUser']?.name || 'User'}
          sizeClasses="h-10 w-10"
          className="cursor-pointer"
          fallbackText="EU"
        />
        <div className="flex items-center space-x-1 md:space-x-2">
          <button title="Comunidades" className="p-2 text-lg text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faUsers} />
          </button>
          <button title="Status" className="p-2 text-lg text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faCircleNotch} />
          </button>
          <button title="Nova conversa" onClick={onInitiateNewChat} className="p-2 text-lg text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faCommentDots} />
          </button>
          <DropdownMenu 
            trigger={
              <button title="Menu" className="p-2 text-lg text-whatsapp-icon hover:text-gray-200">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            }
            items={[
              { id: 'new-group', label: 'Novo grupo', onClick: onInitiateCreateGroup || (() => console.log('Initiate new group clicked')) },
              { id: 'starred-messages', label: 'Mensagens Marcadas', onClick: onShowStarredMessages || (() => console.log('Starred messages clicked')) },
            ]}
            menuPosition="right"
          />
        </div>
      </header>
  );
};

export default SidebarHeader;
