import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface AttachmentMenuItemProps {
  icon: IconDefinition;
  text: string;
  onClick: () => void;
  colorClass?: string;
}

const AttachmentMenuItem: React.FC<AttachmentMenuItemProps> = ({ 
  icon, 
  text, 
  onClick, 
  colorClass = "bg-blue-500" 
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 space-y-1.5 rounded-lg hover:bg-whatsapp-active-chat w-20 h-20 transition-colors duration-150"
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
      <FontAwesomeIcon icon={icon} className="text-white text-lg" />
    </div>
    <span className="text-xs text-whatsapp-text-secondary">{text}</span>
  </button>
);

export default AttachmentMenuItem; 