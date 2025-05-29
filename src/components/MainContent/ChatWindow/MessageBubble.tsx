import React from 'react';
import type { Message } from '../../../types'; // MessageStatus might no longer be needed here
// import { formatMessageTime } from '../../../utils/date'; // Moved to MessageMeta
// import { renderMessageStatusIcon } from '../../../utils/uiHelpers'; // Moved to MessageMeta
// FontAwesomeIcon might not be needed if not used for other things in this file.
// For now, assume it might be used if other message types (audio/video icons) are added directly here later.
// If not, it can be removed.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'; // Import document icon
import MessageMeta from './MessageMeta'; // Import the new component
import AudioPlayer from './AudioPlayer'; // Import AudioPlayer

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isOutgoing = message.type === 'outgoing';
  const hasTextContent = !!message.text;

  return (
    <div className={`flex mb-1 ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-xs rounded-lg px-2.5 py-1.5 shadow-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${ 
          isOutgoing
            ? 'bg-whatsapp-outgoing-bubble text-whatsapp-text-primary rounded-br-none'
            : 'bg-whatsapp-incoming-bubble text-whatsapp-text-primary rounded-tl-none'
        }`}
      >
        {!isOutgoing && message.userName && (
          <p className="mb-0.5 text-xs font-semibold text-teal-400">{message.userName}</p>
        )}

        {message.imageUrl && (
          <div className="mt-1 mb-1.5">
            <img
              src={message.imageUrl}
              alt={message.text || "Imagem enviada"}
              className="h-auto max-h-80 w-full cursor-pointer rounded-md object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/300x200/CCCCCC/000000?text=Erro';
              }}
            />
          </div>
        )}

        {message.mediaType === 'document' && message.fileName && (
          <div className="my-2 flex items-center rounded-md bg-black/10 p-2">
            <FontAwesomeIcon icon={faFileAlt} className={`mr-2 text-2xl ${isOutgoing ? 'text-gray-300' : 'text-gray-400'}`} />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-whatsapp-text-primary">
                {message.fileName}
              </p>
              {/* Optional: could add file size here if available */}
            </div>
            {/* Optional: Download button could go here */}
          </div>
        )}

        {message.mediaType === 'audio' && message.audioUrl && (
          <AudioPlayer 
            audioUrl={message.audioUrl} 
            duration={message.duration} 
            isOutgoing={isOutgoing} 
          />
        )}

        {message.text && (
            <p className="text-sm whitespace-pre-wrap break-words" style={{paddingRight: isOutgoing && !message.mediaType ? '4.5rem' : '0' }}>
                {message.text}
            </p>
        )}

        <MessageMeta 
          timestamp={message.timestamp} 
          status={message.status} 
          isOutgoing={isOutgoing} 
          hasTextContent={hasTextContent}
        />
      </div>
    </div>
  );
};

export default MessageBubble;