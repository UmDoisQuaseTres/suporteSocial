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
  searchTermToHighlight?: string; // New prop
}

// Helper function to highlight text
const getHighlightedText = (text: string, highlight: string): React.ReactNode => {
  if (!highlight.trim()) {
    return text;
  }
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="bg-yellow-300 text-black rounded-sm px-0.5">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onStartReply, onStartForward, onToggleStarMessage, isHighlighted, searchTermToHighlight }) => {
  const isOutgoing = message.type === 'outgoing';
  // hasTextContent can be simplified as its direct usage for MessageMeta positioning will change
  // const hasTextContent = !!message.text;
  const [showActionsButton, setShowActionsButton] = useState(false);

  const handleReplyClick = () => { onStartReply(message); };
  const handleForwardClick = () => { onStartForward(message); };
  const handleToggleStarClick = () => { onToggleStarMessage(message.id); };

  const messageActionItems: DropdownMenuItem[] = [
    { id: 'reply', label: 'Responder', icon: faReply, onClick: handleReplyClick },
    { id: 'forward', label: 'Reencaminhar', icon: faShare, onClick: handleForwardClick },
    { id: 'star', label: message.isStarred ? 'Desmarcar' : 'Marcar', icon: faStar, onClick: handleToggleStarClick },
  ];

  // Determine if the message is primarily media or text for layout purposes
  const isMediaMessage = message.imageUrl || message.videoUrl || message.audioUrl || message.mediaType === 'document';

  const bubbleContent = (
    <div
      className={`relative flex flex-col max-w-xs rounded-lg px-2.5 pt-1.5 pb-1 shadow-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${ 
        isOutgoing
          ? 'bg-whatsapp-outgoing-bubble text-whatsapp-text-primary rounded-br-none'
          : 'bg-whatsapp-incoming-bubble text-whatsapp-text-primary rounded-tl-none'
      }`}
    >
      {message.isStarred && (
        <FontAwesomeIcon 
          icon={faStar} 
          className={`text-yellow-400 text-xs absolute top-1.5 ${isOutgoing ? 'left-1.5' : 'right-1.5'} z-10`}
          title="Mensagem marcada"
        />
      )}
      {message.isForwarded && (
        <div className="mb-1 flex items-center text-xs text-whatsapp-text-secondary">
          <FontAwesomeIcon icon={faShare} className="mr-1.5 text-sm" />
          Reencaminhada
        </div>
      )}
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

      {/* Media Content Area */}
      {message.imageUrl && (
        <div className="mt-1 mb-1.5 rounded-md overflow-hidden">
          <img
            src={message.imageUrl}
            alt={message.text || "Imagem enviada"}
            className="h-auto max-h-80 w-full cursor-pointer object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://placehold.co/300x200/CCCCCC/000000?text=Erro';
            }}
          />
        </div>
      )}
      {message.mediaType === 'video' && message.videoUrl && (
        // VideoPlayer already has some margin, check if mt-1 mb-1.5 is needed
        <div className="rounded-md overflow-hidden">
            <VideoPlayer 
            videoUrl={message.videoUrl}
            isOutgoing={isOutgoing}
            />
        </div>
      )}
      {message.mediaType === 'audio' && message.audioUrl && (
        <div className="my-1.5"> {/* Audio player might need its own spacing */}
            <AudioPlayer 
            audioUrl={message.audioUrl} 
            duration={message.duration} 
            isOutgoing={isOutgoing} 
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
          </div>
        </div>
      )}

      {/* Text Content / Caption Area - Render if text exists */}
      {message.text && (
        <div className={`mt-0.5 ${isMediaMessage && message.text ? 'pb-1' : ''}`}> 
          {/* Add some padding bottom if text is a caption for media above */}
          <p className="text-sm whitespace-pre-wrap break-words">
            {searchTermToHighlight ? getHighlightedText(message.text, searchTermToHighlight) : message.text}
          </p>
        </div>
      )}

      {/* Meta Info (Timestamp and Status) - Placed at the bottom of the flex column */}
      <div className={`self-end w-auto ${message.text || isMediaMessage ? 'mt-0.5' : ''} `}>
        <MessageMeta 
          timestamp={message.timestamp} 
          status={message.status} 
          isOutgoing={isOutgoing} 
          // hasTextContent prop might no longer be needed or used differently in MessageMeta
        />
      </div>
    </div>
  );

  const actionButton = (
    <div className={`relative opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center ${isOutgoing ? 'mr-1' : 'ml-1'}`}>
        <DropdownMenu
          trigger={
            <button 
                className="p-1.5 rounded-full bg-gray-700/50 hover:bg-gray-600 text-whatsapp-icon text-xs"
                title="Ações da mensagem"
            >
                <FontAwesomeIcon icon={faChevronDown} />
            </button>
          }
          items={messageActionItems}
          menuPosition={isOutgoing ? 'left' : 'right'}
          contentClasses="bg-whatsapp-input-bg border-gray-600 shadow-xl"
        />
    </div>
  );

  return (
    <div 
      className={`flex items-start mb-1 group ${isHighlighted ? 'message-highlighted' : ''} ${isOutgoing ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowActionsButton(true)} 
      onMouseLeave={() => setShowActionsButton(false)}
    >
      {isOutgoing && actionButton} 
      {bubbleContent}
      {!isOutgoing && actionButton}
    </div>
  );
};

export default MessageBubble;