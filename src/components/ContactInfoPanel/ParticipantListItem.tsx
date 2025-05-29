import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types';
import Avatar from '../common/Avatar';

export interface ParticipantListItemProps {
  participant: User;
  isCurrentUser: boolean;
  isGroupAdmin: boolean;
  // onClick?: (participant: User) => void; // Optional: if we want to make items clickable for more actions
}

const ParticipantListItem: React.FC<ParticipantListItemProps> = ({ 
  participant, 
  isCurrentUser, 
  isGroupAdmin 
}) => {
  return (
    <div 
      key={participant.id} 
      className="flex cursor-pointer items-center p-3 px-5 hover:bg-whatsapp-active-chat"
      // onClick={() => onClick && onClick(participant)} // Example if items become clickable
    >
      <Avatar 
        src={participant.avatarUrl}
        name={participant.name}
        sizeClasses="h-10 w-10"
        className="mr-4"
        fallbackText={participant.name.charAt(0)}
      />
      <div className="flex-1">
        <p className="text-sm text-whatsapp-text-primary">
          {isCurrentUser ? "Você" : participant.name}
        </p>
        {isGroupAdmin && (
          <p className="text-xs text-teal-400">Admin do grupo</p>
        )}
        {!isCurrentUser && !isGroupAdmin && participant.about && (
           <p className="text-xs text-whatsapp-text-secondary truncate">{participant.about}</p>
        )}
         {!isCurrentUser && !isGroupAdmin && !participant.about && (
           <p className="text-xs text-whatsapp-text-secondary truncate">Recado do participante...</p> // Default if no about
        )}
      </div>
      {isGroupAdmin && (
          <FontAwesomeIcon icon={faUserShield} className="ml-2 text-teal-400" title="Admin do grupo"/>
      )}
    </div>
  );
};

export default ParticipantListItem; 