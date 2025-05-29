import React from 'react';
import type { Chat } from '../../types';
import { renderMessageStatusIcon, renderMediaIcon } from '../../utils/uiHelpers';

interface LastMessagePreviewProps {
  chat: Chat;
}

const LastMessagePreview: React.FC<LastMessagePreviewProps> = ({ chat }) => {
  const lastMsg = chat.lastMessage;

  if (!lastMsg) {
    return <span className="truncate text-sm text-whatsapp-text-secondary">Nenhuma mensagem</span>;
  }

  let statusPrefix = null;
  if (lastMsg.type === 'outgoing' && lastMsg.senderId === 'currentUser') {
    statusPrefix = renderMessageStatusIcon({ status: lastMsg.status });
  }

  const mediaIcon = renderMediaIcon({ chat });
  const messageText = lastMsg.text || (lastMsg.mediaType ? lastMsg.mediaType.charAt(0).toUpperCase() + lastMsg.mediaType.slice(1) : 'Mídia');

  return (
    <div className="flex items-center text-sm text-whatsapp-text-secondary">
      {statusPrefix}
      {mediaIcon}
      <span className="truncate">{messageText}</span>
    </div>
  );
};

export default LastMessagePreview; 