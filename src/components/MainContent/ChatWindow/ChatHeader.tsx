import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPaperclip, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import type { ActiveChat } from '../../../types'; // Certifique-se que o caminho está correto

interface ChatHeaderProps {
  chat: ActiveChat;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  // Simulação de status online/visto por último
  const getStatus = () => {
    if (chat.type === 'user') {
      const random = Math.random();
      if (random < 0.3) return 'online';
      if (random < 0.6) return `visto por último hoje às ${new Date(Date.now() - Math.random() * 10000000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      return 'a digitar...';
    }
    // Para grupos, podemos mostrar o número de participantes ou um tópico
    return `${chat.participants?.length || 'Alguns'} participantes`;
  };

  return (
    <header className="flex h-[60px] items-center justify-between border-b border-gray-700/50 bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
      <div className="flex items-center">
        <img
          src={chat.avatarUrl || 'https://placehold.co/40x40/CCCCCC/000000?text=?'}
          alt={`${chat.name} Avatar`}
          className="mr-3 h-10 w-10 cursor-pointer rounded-full"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/CCCCCC/000000?text=?')}
        />
        <div>
          <h3 className="text-base font-medium">{chat.name}</h3>
          <p className="text-xs text-whatsapp-text-secondary">{getStatus()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faSearch} className="text-xl" />
        </button>
        <button className="text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faPaperclip} className="rotate-[-45deg] transform text-xl" />
        </button>
        <button className="text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faEllipsisV} className="text-xl" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;