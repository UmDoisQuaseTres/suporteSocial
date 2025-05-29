import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive } from '@fortawesome/free-solid-svg-icons';

export interface ArchivedItemProps {
  unreadCount: number;
  onClick: () => void;
  totalArchived: number;
}

const ArchivedItem: React.FC<ArchivedItemProps> = ({ unreadCount, onClick, totalArchived }) => {
  if (totalArchived === 0) return null;
  return (
    <div 
      className="flex cursor-pointer items-center border-b border-whatsapp-header-bg px-3 py-3 text-whatsapp-text-primary hover:bg-whatsapp-active-chat"
      onClick={onClick}
    >
      <div className="mr-4 flex h-12 w-12 items-center justify-center">
        <FontAwesomeIcon icon={faArchive} className="text-lg text-whatsapp-icon" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-normal">Arquivadas</h3>
      </div>
      {unreadCount > 0 && (
        <span className="text-xs font-semibold text-whatsapp-light-green">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default ArchivedItem; 