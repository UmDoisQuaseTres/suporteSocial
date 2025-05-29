import React from 'react';
import type { MessageStatus } from '../../../types';
import { formatMessageTime } from '../../../utils/date';
import { renderMessageStatusIcon } from '../../../utils/uiHelpers';

interface MessageMetaProps {
  timestamp: number;
  status?: MessageStatus;
  isOutgoing: boolean;
  // hasTextContent: boolean; // This prop is no longer needed
}

const MessageMeta: React.FC<MessageMetaProps> = ({ timestamp, status, isOutgoing }) => {
  // The parent div in MessageBubble now handles the primary alignment (self-end).
  // This component just needs to ensure its internal items (time, status icon) are aligned.
  const baseContainerClass = "flex items-center"; 
  
  // Simplified positioning: justify-end for outgoing, or rely on parent's self-end for incoming.
  // For incoming, ml-auto on the status icon container (if used) or on time might be needed if they don't fill width.
  // However, as MessageMeta is now placed in a self-end div in the bubble, this might be simpler.
  const alignmentClass = isOutgoing ? 'justify-end' : 'justify-end'; // Both can use justify-end within their allocated space

  const timestampColorClass = isOutgoing 
    ? 'text-gray-300/70' 
    : 'text-whatsapp-text-secondary/80';

  return (
    // The container for MessageMeta in MessageBubble is already using self-end.
    // So, this inner div just needs to arrange time and status icon correctly.
    <div className={`${baseContainerClass} ${alignmentClass}`}>
      <span className={`text-xs ${timestampColorClass}`}>
        {formatMessageTime(timestamp)}
      </span>
      {isOutgoing && renderMessageStatusIcon({ status: status, marginClass: 'ml-1' })}
    </div>
  );
};

export default MessageMeta; 