import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPaperclip, faEllipsisV, faArchive, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import type { ActiveChat, Chat } // Adicionado Chat
from '../../../types';

interface ChatHeaderProps {
  chat: ActiveChat;
  onToggleArchiveStatus: (chatId: string) => void;
  onShowContactInfo: (chat: Chat) => void; // Nova prop
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onToggleArchiveStatus, onShowContactInfo }) => {
  // ... (função getStatus como antes)
   const getStatus = () => {
    if (chat.type === 'user') {
      // Simulação de status online/visto por último para utilizadores 1-1
      const otherParticipants = chat.participants?.filter(p => p.id !== 'currentUser'); // Assumindo que currentUserId é 'currentUser'
      const lastSeenOptions = ["online", `visto por último hoje às ${new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`, "a digitar..."];
      if (otherParticipants && otherParticipants.length === 1) {
        // Para simplificar, vamos apenas usar uma opção aleatória.
        // Numa app real, este status viria do backend.
        return lastSeenOptions[Math.floor(Math.random() * lastSeenOptions.length)];
      }
      return "offline"; // Fallback
    }
    // Para grupos, mostrar o número de participantes
    return `${chat.participants?.length || 0} participantes`;
  };


  const handleArchiveClick = () => {
    onToggleArchiveStatus(chat.id);
  };

  const handleHeaderClick = () => {
    onShowContactInfo(chat); // Chama a função para mostrar o painel de info
  };

  return (
    <header className="flex h-[60px] items-center justify-between border-b border-gray-700/50 bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
      {/* Área clicável para nome e avatar */}
      <div className="flex flex-1 cursor-pointer items-center overflow-hidden" onClick={handleHeaderClick}>
        <img
          src={chat.avatarUrl || 'https://placehold.co/40x40/CCCCCC/000000?text=?'}
          alt={`${chat.name} Avatar`}
          className="mr-3 h-10 w-10 flex-shrink-0 rounded-full"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/CCCCCC/000000?text=?')}
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-medium">{chat.name}</h3>
          <p className="truncate text-xs text-whatsapp-text-secondary">{getStatus()}</p>
        </div>
      </div>

      {/* Ícones de ação */}
      <div className="flex flex-shrink-0 items-center space-x-1 md:space-x-2"> {/* Reduzido space-x para mais ícones */}
        <button
            onClick={handleArchiveClick}
            className="p-2 text-xl text-whatsapp-icon hover:text-gray-200"
            title={chat.isArchived ? "Desarquivar Conversa" : "Arquivar Conversa"}
        >
            <FontAwesomeIcon icon={chat.isArchived ? faArrowUpFromBracket : faArchive} />
        </button>
        <button className="p-2 text-xl text-whatsapp-icon hover:text-gray-200" title="Pesquisar">
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button className="hidden p-2 text-xl text-whatsapp-icon hover:text-gray-200 sm:block" title="Anexar">
          <FontAwesomeIcon icon={faPaperclip} className="rotate-[-45deg] transform" />
        </button>
        <button className="p-2 text-xl text-whatsapp-icon hover:text-gray-200" title="Mais opções">
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;