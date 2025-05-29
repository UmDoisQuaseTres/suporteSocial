import React, { useState } from 'react';
import type { Message } from '../../../types'; // MessageStatus might no longer be needed here
// import { formatMessageTime } from '../../../utils/date'; // Moved to MessageMeta
// import { renderMessageStatusIcon } from '../../../utils/uiHelpers'; // Moved to MessageMeta
// FontAwesomeIcon might not be needed if not used for other things in this file.
// For now, assume it might be used if other message types (audio/video icons) are added directly here later.
// If not, it can be removed.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFileAlt, faReply, faChevronDown, faShare, faStar } from '@fortawesome/free-solid-svg-icons'; // Import document icon, reply icon, and chevron down icon, and faShare for forward, faStar for starring
import MessageMeta from './MessageMeta'; // Import the new component
import AudioPlayer from './AudioPlayer'; // Import AudioPlayer
import VideoPlayer from './VideoPlayer'; // Import VideoPlayer
import ReplyPreview from './ReplyPreview'; // Added
import DropdownMenu, { type DropdownMenuItem } from '../../common/DropdownMenu'; // Added for message actions

interface MessageBubbleProps {
  message: Message;
  onStartReply: (message: Message) => void; // Added prop to initiate reply
  onStartForward: (message: Message) => void; // Added prop to initiate forward
  onToggleStarMessage: (messageId: string) => void; // Added prop to toggle star status
  isHighlighted?: boolean; // Added for visual cue
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onStartReply, onStartForward, onToggleStarMessage, isHighlighted }) => {
  const isOutgoing = message.type === 'outgoing';
  const hasTextContent = !!message.text;
  const [showActions, setShowActions] = useState(false);

  const handleReplyClick = () => {
    onStartReply(message);
    setShowActions(false); // Close actions menu if open
  };

  const handleForwardClick = () => {
    onStartForward(message);
    setShowActions(false);
  };

  const handleToggleStarClick = () => {
    onToggleStarMessage(message.id);
    setShowActions(false);
  };

  // Placeholder for other message actions like forward, star, delete for this message
  const messageActionItems: DropdownMenuItem[] = [
    {
      id: 'reply',
      label: 'Responder',
      icon: faReply,
      onClick: handleReplyClick
    },
    {
      id: 'forward',
      label: 'Reencaminhar',
      icon: faShare,
      onClick: handleForwardClick
    },
    {
      id: 'star',
      label: message.isStarred ? 'Desmarcar' : 'Marcar',
      icon: faStar,
      onClick: handleToggleStarClick
    },
    // Add other actions here e.g.:
    // { id: 'star', label: 'Marcar', icon: faStar, onClick: () => console.log("Marcar msg:", message.id) },
    // { id: 'delete', label: 'Apagar para mim', icon: faTrash, onClick: () => console.log("Apagar msg:", message.id), isDestructive: true },
  ];

  return (
    <div 
      className={`flex mb-1 relative group ${isHighlighted ? 'message-highlighted' : ''} ${isOutgoing ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`relative max-w-xs rounded-lg px-2.5 py-1.5 shadow-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${ 
          isOutgoing
            ? 'bg-whatsapp-outgoing-bubble text-whatsapp-text-primary rounded-br-none'
            : 'bg-whatsapp-incoming-bubble text-whatsapp-text-primary rounded-tl-none'
        }`}
      >
        {/* Display Forwarded label */}
        {message.isForwarded && (
          <div className="mb-1 flex items-center text-xs text-whatsapp-text-secondary">
            <FontAwesomeIcon icon={faShare} className="mr-1.5 text-sm" />
            Reencaminhada
          </div>
        )}

        {/* Display replied message context */}
        {message.replyToMessageId && message.replyToMessagePreview && message.replyToSenderName && (
          <ReplyPreview 
            repliedMessageText={message.replyToMessagePreview}
            repliedMessageSenderName={message.replyToSenderName}
            isOutgoingBubble={isOutgoing}
          />
        )}

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

        {message.mediaType === 'video' && message.videoUrl && (
          <VideoPlayer 
            videoUrl={message.videoUrl}
            isOutgoing={isOutgoing}
            // caption={message.text} // Caption is usually handled by the text part of the bubble
          />
        )}

        {message.text && (
            <p className="text-sm whitespace-pre-wrap break-words" style={{paddingRight: isOutgoing && !message.mediaType && !message.replyToMessageId ? '4.5rem' : (isOutgoing && message.mediaType && !message.replyToMessageId ? '0.5rem' : '0') }}>
                {message.text}
            </p>
        )}

        {/* Starred Icon Indicator */} 
        {message.isStarred && (
          <FontAwesomeIcon 
            icon={faStar} 
            className={`text-yellow-400 text-xs absolute top-1.5 ${isOutgoing ? 'left-1.5' : 'right-1.5'}`}
            title="Mensagem marcada"
          />
        )}

        <MessageMeta 
          timestamp={message.timestamp} 
          status={message.status} 
          isOutgoing={isOutgoing} 
          hasTextContent={hasTextContent || !!message.replyToMessageId} // Consider reply preview as content for meta positioning
        />
      </div>
      {/* Message Actions Button - shows on hover */} 
      {showActions && (
        <div className={`absolute top-0.5 z-10 ${isOutgoing ? 'right-full mr-1' : 'left-full ml-1'} opacity-0 group-hover:opacity-100 transition-opacity duration-150`}>
            <DropdownMenu
              trigger={
                <button 
                    className="p-1.5 rounded-full bg-gray-700/50 hover:bg-gray-600 text-whatsapp-icon text-xs"
                    title="Ações da mensagem"
                >
                    <FontAwesomeIcon icon={faReply} />
                </button>
              }
              items={messageActionItems}
              menuPosition={isOutgoing ? 'left' : 'right'}
              contentClasses="bg-whatsapp-input-bg border-gray-600 shadow-xl"
            />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;