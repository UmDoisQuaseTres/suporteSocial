import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSearch, faTimes, faShare } from '@fortawesome/free-solid-svg-icons';
import type { Message, Chat, User } from '../../../types';
import Avatar from '../../common/Avatar';
import MessageBubble from './MessageBubble'; // For preview

interface ForwardModalProps {
  messageToForward: Message;
  allChats: Chat[]; // All chats to select from
  currentChatId: string; // To potentially exclude current chat or handle differently
  currentUserId: string; // For sender name in preview if needed
  onConfirmForward: (selectedChatIds: string[]) => void;
  onCancel: () => void;
}

const ForwardModal: React.FC<ForwardModalProps> = ({
  messageToForward,
  allChats,
  currentChatId,
  currentUserId,
  onConfirmForward,
  onCancel,
}) => {
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = useMemo(() => {
    return allChats.filter(chat => 
      chat.id !== currentChatId && // Exclude current chat from forwarding to itself
      chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allChats, searchTerm, currentChatId]);

  const toggleChatSelection = (chatId: string) => {
    setSelectedChatIds(prev =>
      prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
    );
  };

  // Dummy onStartReply and onStartForward for the preview bubble
  const dummyHandler = () => {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex flex-col w-full max-w-lg rounded-lg bg-whatsapp-sidebar-bg shadow-xl max-h-[90vh]">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-whatsapp-header-bg">
          <h2 className="text-xl font-semibold text-whatsapp-text-primary">Reencaminhar mensagem para...</h2>
          <button onClick={onCancel} className="text-xl text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>

        {/* Message Preview */}
        <div className="p-4 bg-whatsapp-chat-bg overflow-y-auto">
            <p className="text-xs text-whatsapp-text-secondary mb-2 flex items-center">
                <FontAwesomeIcon icon={faShare} className="mr-1.5" /> Reencaminhando mensagem:
            </p>
            {/* Scale down the preview bubble slightly */}
            <div className="transform scale-90 origin-top-left">
                 <MessageBubble 
                    message={messageToForward} 
                    onStartReply={dummyHandler} 
                    onStartForward={dummyHandler} 
                 />
            </div>
        </div>
        
        {/* Search Bar */}
        <div className="p-3 border-b border-whatsapp-header-bg">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-whatsapp-icon" />
            <input 
              type="search"
              placeholder="Pesquisar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg bg-whatsapp-input-bg py-2 pl-10 pr-3 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2 chat-scrollbar">
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => toggleChatSelection(chat.id)}
                className={`flex items-center p-2.5 rounded-md cursor-pointer hover:bg-whatsapp-active-chat mb-1 ${
                  selectedChatIds.includes(chat.id) ? 'bg-whatsapp-light-green/20' : ''
                }`}
              >
                <Avatar src={chat.avatarUrl} name={chat.name} sizeClasses="h-10 w-10" className="mr-3" />
                <div className="flex-1">
                  <p className="text-base text-whatsapp-text-primary truncate">{chat.name}</p>
                </div>
                <input 
                  type="checkbox"
                  checked={selectedChatIds.includes(chat.id)}
                  readOnly
                  className="form-checkbox h-5 w-5 text-whatsapp-light-green bg-whatsapp-input-bg border-whatsapp-text-secondary rounded focus:ring-whatsapp-light-green focus:ring-offset-0 cursor-pointer"
                />
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-sm text-whatsapp-text-secondary">
              {searchTerm ? 'Nenhuma conversa encontrada.' : 'Nenhuma conversa disponível para reencaminhar.'}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <footer className="flex justify-end items-center p-4 border-t border-whatsapp-header-bg">
          <button 
            onClick={onCancel}
            className="px-4 py-2 mr-3 rounded-md text-sm text-whatsapp-text-primary hover:bg-whatsapp-input-bg"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirmForward(selectedChatIds)}
            disabled={selectedChatIds.length === 0}
            className="px-6 py-2.5 rounded-full bg-whatsapp-light-green text-white text-sm font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-whatsapp-green transition-colors"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Reencaminhar ({selectedChatIds.length})
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ForwardModal; 