import React from 'react';
import type { User } from '../../types';
import ParticipantListItem from './ParticipantListItem';

interface ParticipantListProps {
  participants: User[];
  currentUserId: string;
  groupAdminId: string | null;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, currentUserId, groupAdminId }) => {
  if (!participants || participants.length === 0) {
    return null; // Or some placeholder if needed when there are no participants but the section should show
  }

  return (
    <>
      <hr className="mx-0 border-gray-700/20" />
      <section className="px-1 py-3">
        <h3 className="mb-1 px-5 text-sm font-normal text-whatsapp-text-secondary">
          {participants.length} Participante{participants.length === 1 ? '' : 's'}
        </h3>
        <div className="max-h-60 overflow-y-auto chat-scrollbar">
          {participants.map(participant => (
            <ParticipantListItem 
              key={participant.id} 
              participant={participant} 
              isCurrentUser={participant.id === currentUserId}
              isGroupAdmin={participant.id === groupAdminId}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default ParticipantList; 