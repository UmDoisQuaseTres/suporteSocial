import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons';

interface ChatListItemStatusIconsProps {
  isMuted?: boolean;
  unreadCount?: number;
}

const ChatListItemStatusIcons: React.FC<ChatListItemStatusIconsProps> = ({ isMuted, unreadCount }) => {
  // If neither icon needs to be rendered, we can return null to render nothing.
  if (!isMuted && !(unreadCount && unreadCount > 0)) {
    return null;
  }

  return (
    <div className="ml-2 flex flex-shrink-0 items-center space-x-2">
      {isMuted && (
        <FontAwesomeIcon icon={faBellSlash} className="text-sm text-whatsapp-text-secondary" title="Silenciada"/>
      )}
      {unreadCount && unreadCount > 0 && (
        <span
          className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-semibold text-white
                      ${isMuted ? 'bg-whatsapp-text-secondary' : 'bg-whatsapp-light-green'}`}
        >
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default ChatListItemStatusIcons; 