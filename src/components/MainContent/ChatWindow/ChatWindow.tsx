import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import type { ActiveChat, Message, Chat } from '../../../types';
import ForwardModal from './ForwardModal';

interface ChatWindowProps {
  chat: ActiveChat;
  currentUserId: string;
  onSendMessage: (chatId: string, messageContent: { 
    text?: string; 
    imageUrl?: string; 
    fileName?: string;
    audioUrl?: string;
    videoUrl?: string;
    duration?: number;
    mediaType?: 'image' | 'document' | 'audio' | 'video';
  }) => void;
  messages: Message[];
  onToggleArchiveStatus: (chatId: string) => void;
  onShowContactInfo: (chat: Chat) => void;
  onClearChatMessages: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  allChats: Chat[];
  onForwardMessage: (originalMessage: Message, targetChatIds: string[]) => void;
  onToggleStarMessage: (messageId: string) => void;
  messageToHighlightId?: string | null;
  clearMessageToHighlight?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  currentUserId,
  onSendMessage,
  messages,
  onToggleArchiveStatus,
  onShowContactInfo,
  onClearChatMessages,
  onDeleteChat,
  allChats,
  onForwardMessage,
  onToggleStarMessage,
  messageToHighlightId,
  clearMessageToHighlight
}) => {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);
  const [showForwardModal, setShowForwardModal] = useState<boolean>(false);
  const [isChatSearchActive, setIsChatSearchActive] = useState<boolean>(false);
  const [chatSearchTerm, setChatSearchTerm] = useState<string>('');

  const handleStartReply = (message: Message) => {
    setReplyingTo(message);
    setForwardingMessage(null);
    setShowForwardModal(false);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleStartForward = (message: Message) => {
    setForwardingMessage(message);
    setShowForwardModal(true);
    setReplyingTo(null);
  };

  const handleCancelForward = () => {
    setForwardingMessage(null);
    setShowForwardModal(false);
  };

  const handleConfirmForward = (selectedChatIds: string[]) => {
    if (forwardingMessage && selectedChatIds.length > 0) {
      console.log('Forwarding message:', forwardingMessage, 'to chats:', selectedChatIds);
      alert(`Simulando encaminhamento para ${selectedChatIds.length} conversas.`);
    }
    handleCancelForward();
  };

  const handleSendWithReply = (chatId: string, messageContent: any) => {
    if (replyingTo) {
      onSendMessage(chatId, {
        ...messageContent,
        replyToMessageId: replyingTo.id,
        replyToMessagePreview: replyingTo.text || (replyingTo.mediaType ? replyingTo.mediaType.charAt(0).toUpperCase() + replyingTo.mediaType.slice(1) : 'Mídia'),
        replyToSenderName: replyingTo.senderId === currentUserId ? 'Você' : chat.participants?.find(p => p.id === replyingTo.senderId)?.name || replyingTo.userName || 'Desconhecido',
      });
      setReplyingTo(null);
    } else {
      onSendMessage(chatId, messageContent);
    }
  };

  const handleToggleChatSearch = (isActive: boolean) => {
    setIsChatSearchActive(isActive);
    if (!isActive) {
      setChatSearchTerm('');
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        chat={chat}
        onToggleArchiveStatus={onToggleArchiveStatus}
        onShowContactInfo={onShowContactInfo}
        onClearChatMessages={onClearChatMessages}
        onDeleteChat={onDeleteChat}
        isChatSearchActive={isChatSearchActive}
        chatSearchTerm={chatSearchTerm}
        onChatSearchChange={setChatSearchTerm}
        onToggleChatSearch={handleToggleChatSearch}
      />
      <MessageArea
        messages={messages}
        currentUserId={currentUserId}
        onStartReply={handleStartReply}
        onStartForward={handleStartForward}
        onToggleStarMessage={onToggleStarMessage}
        messageToHighlightId={messageToHighlightId}
        clearMessageToHighlight={clearMessageToHighlight}
        chatSearchTerm={chatSearchTerm}
      />
      <MessageInput
        chatId={chat.id}
        onSendMessage={handleSendWithReply}
        isChatBlocked={chat.type === 'user' ? chat.isBlocked : false}
        onOpenContactInfo={() => onShowContactInfo(chat)}
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
      />
      {showForwardModal && forwardingMessage && (
        <ForwardModal
          messageToForward={forwardingMessage}
          allChats={allChats}
          currentChatId={chat.id}
          currentUserId={currentUserId}
          onConfirmForward={handleConfirmForward}
          onCancel={handleCancelForward}
        />
      )}
    </div>
  );
};

export default ChatWindow;