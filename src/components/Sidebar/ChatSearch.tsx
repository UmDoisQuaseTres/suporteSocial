// src/components/Sidebar/ChatSearch.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface ChatSearchProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div className="bg-whatsapp-sidebar-bg p-2 border-b border-whatsapp-header-bg">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <FontAwesomeIcon icon={faSearch} className="text-whatsapp-icon" />
        </div>
        <input
          type="search"
          placeholder="Pesquisar ou começar uma nova conversa"
          className="h-9 w-full rounded-lg bg-whatsapp-header-bg py-2 pl-9 pr-3 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none focus:ring-1 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChatSearch;