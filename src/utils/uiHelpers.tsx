import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faCheckDouble, faClock,
  faImage, faMicrophone, faVideo
} from '@fortawesome/free-solid-svg-icons';
import type { Chat, MessageStatus } from '../types'; // Ensure correct path to types

interface RenderMessageStatusIconProps {
  status?: MessageStatus;
  marginClass?: string; // e.g., "mr-1" or "ml-1"
}

export const renderMessageStatusIcon = ({ status, marginClass = 'mr-1' }: RenderMessageStatusIconProps): React.ReactNode => {
  if (!status) return null;
  const iconBaseClass = "text-xs";
  const combinedClass = `${iconBaseClass} ${marginClass}`;

  switch (status) {
    case 'read': return <FontAwesomeIcon icon={faCheckDouble} className={`${combinedClass} text-sky-400`} />;
    case 'delivered': return <FontAwesomeIcon icon={faCheckDouble} className={`${combinedClass} text-whatsapp-text-secondary/80`} />;
    case 'sent': return <FontAwesomeIcon icon={faCheck} className={`${combinedClass} text-whatsapp-text-secondary/80`} />;
    case 'pending': return <FontAwesomeIcon icon={faClock} className={`${combinedClass} text-whatsapp-text-secondary/80`} />;
    default: return null;
  }
};

interface RenderMediaIconProps {
  chat: Chat; // Or more specifically, the part of the chat object it needs, e.g., LastMessage
  className?: string;
}

export const renderMediaIcon = ({ chat, className = "mr-1.5 text-whatsapp-text-secondary" }: RenderMediaIconProps): React.ReactNode => {
  const lastMsg = chat.lastMessage;
  if (!lastMsg) return null;
  // Consolidate checks for mediaType or direct URL properties
  if (lastMsg.mediaType === 'image' || lastMsg.imageUrl) return <FontAwesomeIcon icon={faImage} className={className} />;
  if (lastMsg.mediaType === 'audio' || lastMsg.audioUrl) return <FontAwesomeIcon icon={faMicrophone} className={className} />;
  if (lastMsg.mediaType === 'video' || lastMsg.videoUrl) return <FontAwesomeIcon icon={faVideo} className={className} />;
  // Consider adding faFileAlt for other document types if Chat type supports it more generically
  return null;
}; 