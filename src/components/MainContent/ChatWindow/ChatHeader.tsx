import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPaperclip, faEllipsisV, faArchive, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'; // Adicionado faArchive e faArrowUpFromBracket
import type { ActiveChat } from '../../../types';

interface ChatHeaderProps {
  chat: ActiveChat;
  onToggleArchiveStatus: (chatId: string) => void; // Nova prop
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onToggleArchiveStatus }) => {
  const getStatus = () => {
    if (chat.type === 'user') {
      const random = Math.random();
      if (random < 0.3) return 'online';
      if (random < 0.6) return `visto por último hoje às ${new Date(Date.now() - Math.random() * 10000000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      return 'a digitar...';
    }
    return `${chat.participants?.length || ''} participantes`;
  };

  const handleArchiveClick = () => {
    onToggleArchiveStatus(chat.id);
  };

  return (
    <header className="flex h-[60px] items-center justify-between border-b border-gray-700/50 bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
      <div className="flex items-center overflow-hidden"> {/* Adicionado overflow-hidden para nomes longos */}
        <img
          src={chat.avatarUrl || 'https://placehold.co/40x40/CCCCCC/000000?text=?'}
          alt={`${chat.name} Avatar`}
          className="mr-3 h-10 w-10 flex-shrink-0 cursor-pointer rounded-full"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/CCCCCC/000000?text=?')}
        />
        <div className="min-w-0 flex-1"> {/* Adicionado min-w-0 para truncar corretamente */}
          <h3 className="truncate text-base font-medium">{chat.name}</h3>
          <p className="truncate text-xs text-whatsapp-text-secondary">{getStatus()}</p>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center space-x-2 md:space-x-3"> {/* Adicionado flex-shrink-0 */}
        {/* Botão de Arquivar/Desarquivar */}
        <button
            onClick={handleArchiveClick}
            className="p-2 text-xl text-whatsapp-icon hover:text-gray-200"
            title={chat.isArchived ? "Desarquivar Conversa" : "Arquivar Conversa"}
        >
            <FontAwesomeIcon icon={chat.isArchived ? faArrowUpFromBracket : faArchive} />
        </button>
        <button className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faSearch} />
        </button>
        {/* Ocultar clipe de papel em telas menores para dar espaço ao botão de arquivar */}
        <button className="hidden p-2 text-xl text-whatsapp-icon hover:text-gray-200 sm:block">
          <FontAwesomeIcon icon={faPaperclip} className="rotate-[-45deg] transform" />
        </button>
        <button className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;