import React from 'react';
import type { MessageStatus } from '../../../types';
import { formatMessageTime } from '../../../utils/date';
import { renderMessageStatusIcon } from '../../../utils/uiHelpers';

interface MessageMetaProps {
  timestamp: number;
  status?: MessageStatus;
  isOutgoing: boolean;
  hasTextContent: boolean; // To help with absolute positioning logic
}

const MessageMeta: React.FC<MessageMetaProps> = ({ timestamp, status, isOutgoing, hasTextContent }) => {
  const baseContainerClass = "mt-1 flex items-center";
  
  // Determine positioning based on whether it's an outgoing message with text
  const positioningClass = isOutgoing && hasTextContent 
    ? 'absolute bottom-1.5 right-2.5' 
    : (isOutgoing ? 'justify-end' : 'justify-end ml-auto');

  const timestampColorClass = isOutgoing 
    ? 'text-gray-300/70' 
    : 'text-whatsapp-text-secondary/80';

  return (
    <div className={`${baseContainerClass} ${positioningClass}`}>
      <span className={`text-xs ${timestampColorClass}`}>
        {formatMessageTime(timestamp)}
      </span>
      {isOutgoing && renderMessageStatusIcon({ status: status, marginClass: 'ml-1' })}
    </div>
  );
};

export default MessageMeta; 