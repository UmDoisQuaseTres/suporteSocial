import React from 'react';
import type { Message } from '../../../types';

interface ReplyPreviewProps {
  repliedMessageText?: string;
  repliedMessageSenderName?: string;
  isOutgoingBubble: boolean; // To adjust styling if needed based on the main bubble
  onCancelReply?: () => void; // For the reply context in MessageInput
  isContextInInput?: boolean; // True if this preview is shown in MessageInput
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  repliedMessageText,
  repliedMessageSenderName,
  isOutgoingBubble,
  onCancelReply,
  isContextInInput = false,
}) => {
  if (!repliedMessageText || !repliedMessageSenderName) {
    return null;
  }

  const bgColor = isContextInInput 
    ? 'bg-whatsapp-input-bg' 
    : (isOutgoingBubble ? 'bg-black/20' : 'bg-black/20');
  const borderColor = isContextInInput 
    ? 'border-whatsapp-light-green' 
    : (isOutgoingBubble ? 'border-teal-300' : 'border-teal-400');
  const textColor = isContextInInput ? 'text-whatsapp-text-primary' : 'text-gray-300';
  const senderColor = isContextInInput 
    ? 'text-whatsapp-light-green' 
    : (isOutgoingBubble ? 'text-teal-300' : 'text-teal-400');

  return (
    <div className={`relative mb-1.5 p-2 rounded-md ${bgColor} border-l-4 ${borderColor}`}>
      {isContextInInput && onCancelReply && (
        <button 
          onClick={onCancelReply}
          className="absolute top-1 right-1 text-xs text-gray-400 hover:text-gray-200 p-0.5"
          title="Cancelar Resposta"
        >
          &times;
        </button>
      )}
      <p className={`text-xs font-semibold ${senderColor}`}>{repliedMessageSenderName}</p>
      <p className={`text-sm truncate ${textColor}`}>{repliedMessageText}</p>
    </div>
  );
};

export default ReplyPreview; 