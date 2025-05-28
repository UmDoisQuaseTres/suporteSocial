import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faArrowLeft, faUsers, faCircleNotch, faCommentDots, faEllipsisV, faSearch } from '@fortawesome/free-solid-svg-icons';
import ChatList from './ChatList';
import type { Chat } from '../../types';

interface SidebarHeaderProps {
  showArchived: boolean;
  onToggleArchivedView: () => void; // Usado para voltar da vista de arquivadas
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ showArchived, onToggleArchivedView }) => {
  if (showArchived) {
    return (
      <header className="flex h-[60px] items-center bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
        <button onClick={onToggleArchivedView} className="mr-6 text-xl text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="text-lg font-medium">Arquivadas</h2>
      </header>
    );
  }
  return (
      <header className="flex h-[60px] items-center justify-between bg-whatsapp-header-bg p-3">
        <img
          src="https://placehold.co/40x40/FFFFFF/000000?text=EU" // Substitua pelo avatar do usuário real
          alt="User Avatar"
          className="h-10 w-10 cursor-pointer rounded-full"
        />
        <div className="flex items-center space-x-1 md:space-x-4">
          <button className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faUsers} />
          </button>
           <button className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faCircleNotch} />
          </button>
          <button className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faCommentDots} />
          </button>
          <button className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>
      </header>
  );
};

const ChatSearch: React.FC = () => (
  <div className="bg-whatsapp-sidebar-bg p-2">
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <FontAwesomeIcon icon={faSearch} className="text-whatsapp-icon" />
      </div>
      <input
        type="search"
        placeholder="Pesquisar ou começar uma nova conversa"
        className="h-9 w-full rounded-lg bg-whatsapp-header-bg py-2 pl-10 pr-3 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
    </div>
  </div>
);

interface ArchivedItemProps {
  count: number;
  onClick: () => void;
}

const ArchivedItem: React.FC<ArchivedItemProps> = ({ count, onClick }) => {
  // Decidi mostrar mesmo que count seja 0, para permitir entrar na tela de arquivadas
  // O WhatsApp Web geralmente esconde se for 0 E a configuração "Manter arquivadas" estiver desativada.
  // Para simplificar, vamos mostrar se a funcionalidade de arquivar existe.
  // if (count === 0) return null;

  // Contar chats arquivados com mensagens não lidas
  // Esta lógica deveria estar no App.tsx e ser passada como prop se quisermos ser mais precisos com o comportamento do WhatsApp
  // const unreadArchivedCount = allArchivedChats.filter(chat => (chat.unreadCount || 0) > 0).length;

  return (
    <div
      className="flex cursor-pointer items-center border-b border-gray-700/30 px-3 py-4 text-whatsapp-text-primary hover:bg-whatsapp-active-chat"
      onClick={onClick}
    >
      <div className="mr-4 flex h-12 w-12 items-center justify-center"> {/* Aumentado margin-right */}
        <FontAwesomeIcon icon={faArchive} className="text-lg text-whatsapp-icon" /> {/* Ajustado tamanho */}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-normal">Arquivadas</h3> {/* Ajustado font-weight */}
      </div>
      {count > 0 && ( // Mostrar contador apenas se houver chats arquivados
        <span className="text-xs font-semibold text-whatsapp-light-green">{count}</span>
      )}
    </div>
  );
};

interface SidebarProps {
  archivedChatsCount: number;
  onSelectChat: (chat: Chat) => void;
  activeChatId?: string | null; // Pode ser null
  onToggleArchivedView: () => void;
  showArchived: boolean;
  currentDisplayedChats: Chat[];
}

const Sidebar: React.FC<SidebarProps> = ({
  archivedChatsCount,
  onSelectChat,
  activeChatId,
  onToggleArchivedView,
  showArchived,
  currentDisplayedChats
}) => {
  return (
    <aside className="flex w-full flex-col border-r border-gray-700/50 bg-whatsapp-sidebar-bg text-whatsapp-text-primary md:w-1/3">
      <SidebarHeader
        showArchived={showArchived}
        onToggleArchivedView={onToggleArchivedView}
      />

      {!showArchived && <ChatSearch />}

      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {!showArchived && (
          <ArchivedItem count={archivedChatsCount} onClick={onToggleArchivedView} />
        )}
        <ChatList
          chats={currentDisplayedChats}
          onSelectChat={onSelectChat}
          activeChatId={activeChatId || undefined}
        />
      </div>
    </aside>
  );
};

export default Sidebar;