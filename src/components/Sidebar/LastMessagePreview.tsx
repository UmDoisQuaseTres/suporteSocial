import React from 'react';
import type { Chat } from '../../types';
import { renderMessageStatusIcon, renderMediaIcon } from '../../utils/uiHelpers';
// Assuming currentUserId will be accessible globally or passed down if needed for complex scenarios
// For now, the simulation in store ensures typingUserIds doesn't include currentUser.

interface LastMessagePreviewProps {
  chat: Chat;
  currentUserId: string; // Added to help determine typing names if needed, though store simulation helps
}

const LastMessagePreview: React.FC<LastMessagePreviewProps> = ({ chat, currentUserId }) => {
  // Typing Indicator Logic
  if (chat.typingUserIds && chat.typingUserIds.length > 0) {
    const typingParticipantNames = chat.typingUserIds
      .map(userId => {
        // In ChatListItem context, we might not have currentUserId easily without prop drilling or store access here.
        // However, the simulation in useStore is designed to only have *other* users type.
        // If we needed to be absolutely sure and filter out self, currentUserId would be essential here.
        const participant = chat.participants?.find(p => p.id === userId);
        return participant?.name.split(' ')[0]; // Get first name
      })
      .filter(Boolean) as string[];

    if (typingParticipantNames.length > 0) {
      // For chat list, a simple "a digitar..." is often enough, or first typer
      // const displayName = typingParticipantNames[0];
      return (
        <div className="truncate text-sm text-whatsapp-light-green">
          {/* {`${displayName} a digitar...`} */}
          a digitar...
        </div>
      );
    }
  }

  const lastMsg = chat.lastMessage;

  if (!lastMsg) {
    return <span className="truncate text-sm text-whatsapp-text-secondary">Nenhuma mensagem</span>;
  }

  let statusPrefix = null;
  // In the chat list, the current user is always 'currentUser'.
  if (lastMsg.type === 'outgoing' && lastMsg.senderId === 'currentUser') { 
    statusPrefix = renderMessageStatusIcon({ status: lastMsg.status });
  }

  const mediaIcon = renderMediaIcon({ chat });
  const messageText = lastMsg.text || (lastMsg.mediaType ? lastMsg.mediaType.charAt(0).toUpperCase() + lastMsg.mediaType.slice(1) : 'Mídia');

  return (
    <div className="flex items-center text-sm text-whatsapp-text-secondary">
      {statusPrefix && <span className="mr-1.5 flex items-center">{statusPrefix}</span>}
      {mediaIcon && <span className="mr-1 flex items-center">{mediaIcon}</span>}
      <span className="truncate">{messageText}</span>
    </div>
  );
};

export default LastMessagePreview; 