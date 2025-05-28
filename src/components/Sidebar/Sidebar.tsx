import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCircleNotch, faCommentDots, faEllipsisV, faSearch } from '@fortawesome/free-solid-svg-icons';
import ChatList from './ChatList';
import type { Chat } from '../../types';

interface SidebarProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  activeChatId?: string;
}

const SidebarHeader: React.FC = () => (
  <header className="flex h-[60px] items-center justify-between bg-whatsapp-header-bg p-3">
    <img
      src="https://placehold.co/40x40/FFFFFF/000000?text=EU"
      alt="User Avatar"
      className="h-10 w-10 cursor-pointer rounded-full"
    />
    <div className="flex items-center space-x-4">
      <button className="text-whatsapp-icon hover:text-gray-200">
        <FontAwesomeIcon icon={faUsers} className="text-xl" />
      </button>
      <button className="text-whatsapp-icon hover:text-gray-200">
        <FontAwesomeIcon icon={faCircleNotch} className="text-xl" />
      </button>
      <button className="text-whatsapp-icon hover:text-gray-200">
        <FontAwesomeIcon icon={faCommentDots} className="text-xl" />
      </button>
      <button className="text-whatsapp-icon hover:text-gray-200">
        <FontAwesomeIcon icon={faEllipsisV} className="text-xl" />
      </button>
    </div>
  </header>
);

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


const Sidebar: React.FC<SidebarProps> = ({ chats, onSelectChat, activeChatId }) => {
  return (
    <aside className="flex w-full flex-col border-r border-gray-700 bg-whatsapp-sidebar-bg text-whatsapp-text-primary md:w-1/3">
      <SidebarHeader />
      <ChatSearch />
      <ChatList chats={chats} onSelectChat={onSelectChat} activeChatId={activeChatId} />
      {/* Adicionar "Arquivadas" aqui depois */}
    </aside>
  );
};

export default Sidebar;