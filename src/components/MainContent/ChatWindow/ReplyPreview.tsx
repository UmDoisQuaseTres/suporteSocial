import React from 'react';
import type { Message } from '../../../types';

interface ReplyPreviewProps {
  repliedMessageText?: string;
  repliedMessageSenderName?: string;
  isOutgoingBubble: boolean; // To adjust styling if needed based on the main bubble
  onCancelReply?: () => void; // For the reply context in MessageInput
  isContextInInput?: boolean; // True if this preview is shown in MessageInput
  onClick?: () => void; // For jumping to the original message from bubble
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  repliedMessageText,
  repliedMessageSenderName,
  isOutgoingBubble,
  onCancelReply,
  isContextInInput = false,
  onClick,
}) => {
  if (!repliedMessageText || !repliedMessageSenderName) {
    return null;
  }

  // Styles for when the preview is inside MessageInput
  const inputContextBgColor = 'bg-whatsapp-input-bg';
  const inputContextBorderColor = 'border-whatsapp-light-green';
  const inputContextTextColor = 'text-whatsapp-text-primary';
  const inputContextSenderColor = 'text-whatsapp-light-green';

  // Styles for when the preview is inside a MessageBubble
  const bubbleContextBgColor = isOutgoingBubble ? 'bg-whatsapp-outgoing-bubble/80' : 'bg-whatsapp-incoming-bubble/80';
  const bubbleContextBorderColor = repliedMessageSenderName === 'Você' ? 'border-whatsapp-light-green' : 'border-sky-500';
  const bubbleContextTextColor = 'text-whatsapp-text-primary'; // Assuming this works on the semi-transparent bg
  const bubbleContextSenderColor = repliedMessageSenderName === 'Você' ? 'text-whatsapp-light-green' : 'text-sky-400';

  const bgColor = isContextInInput ? inputContextBgColor : bubbleContextBgColor;
  const borderColor = isContextInInput ? inputContextBorderColor : bubbleContextBorderColor;
  const textColor = isContextInInput ? inputContextTextColor : bubbleContextTextColor;
  const senderColor = isContextInInput ? inputContextSenderColor : bubbleContextSenderColor;
  const padding = isContextInInput ? 'p-2' : 'px-2 py-1.5';
  const cursor = isContextInInput ? '' : 'cursor-pointer';

  return (
    <div 
      className={`relative mb-1.5 ${padding} rounded-md ${bgColor} border-l-4 ${borderColor} ${cursor}`}
      onClick={isContextInInput ? undefined : onClick}
    >
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