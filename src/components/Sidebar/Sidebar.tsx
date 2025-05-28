import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faArrowLeft, faUsers, faCircleNotch, faCommentDots, faEllipsisV, faSearch } from '@fortawesome/free-solid-svg-icons'; // faUserPlus não é mais necessário aqui se não for usado no header
import ChatList from './ChatList';
import type { Chat, User } from '../../types';

interface SidebarHeaderProps {
  showArchived: boolean;
  showNewChatView: boolean;
  onToggleArchivedView: () => void;
  onToggleNewChatView: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  showArchived,
  showNewChatView,
  onToggleArchivedView,
  onToggleNewChatView
}) => {
  let title = "";
  let onBackAction = () => {};

  if (showArchived) {
    title = "Arquivadas";
    onBackAction = onToggleArchivedView;
  } else if (showNewChatView) {
    title = "Nova conversa";
    onBackAction = onToggleNewChatView;
  }

  if (showArchived || showNewChatView) {
    return (
      <header className="flex h-[60px] items-center bg-whatsapp-header-bg p-3 text-whatsapp-text-primary">
        <button onClick={onBackAction} className="mr-6 text-xl text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="text-lg font-medium">{title}</h2>
      </header>
    );
  }

  // Cabeçalho Padrão
  return (
      <header className="flex h-[60px] items-center justify-between bg-whatsapp-header-bg p-3">
        <img
          src={mockUsers['currentUser']?.avatarUrl || "https://placehold.co/40x40/FFFFFF/000000?text=EU"} // Adicionado fallback e mockUsers
          alt="User Avatar"
          className="h-10 w-10 cursor-pointer rounded-full"
        />
        <div className="flex items-center space-x-1 md:space-x-4">
          <button title="Comunidades" className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faUsers} />
          </button>
           <button title="Status" className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faCircleNotch} />
          </button>
          <button title="Nova conversa" onClick={onToggleNewChatView} className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faCommentDots} />
          </button>
          <button title="Menu" className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>
      </header>
  );
};

// Definindo mockUsers aqui temporariamente para o avatar no SidebarHeader.
// Idealmente, o avatar do usuário atual viria de um contexto ou prop.
const mockUsers: { [id: string]: User } = {
    'currentUser': { id: 'currentUser', name: 'Eu', avatarUrl: 'https://placehold.co/40x40/FFFFFF/000000?text=EU' },
};


interface ChatSearchProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ searchTerm, onSearchTermChange }) => (
  <div className="bg-whatsapp-sidebar-bg p-2">
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <FontAwesomeIcon icon={faSearch} className="text-whatsapp-icon" />
      </div>
      <input
        type="search"
        placeholder="Pesquisar ou começar uma nova conversa"
        className="h-9 w-full rounded-lg bg-whatsapp-header-bg py-2 pl-10 pr-3 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none focus:ring-1 focus:ring-teal-500"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </div>
  </div>
);


interface ArchivedItemProps {
  count: number;
  onClick: () => void;
}

const ArchivedItem: React.FC<ArchivedItemProps> = ({ count, onClick }) => (
  <div
    className="flex cursor-pointer items-center border-b border-gray-700/30 px-3 py-4 text-whatsapp-text-primary hover:bg-whatsapp-active-chat"
    onClick={onClick}
  >
    <div className="mr-4 flex h-12 w-12 items-center justify-center">
      <FontAwesomeIcon icon={faArchive} className="text-lg text-whatsapp-icon" />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="text-base font-normal">Arquivadas</h3>
    </div>
    {count > 0 && (
      <span className="text-xs font-semibold text-whatsapp-light-green">{count}</span>
    )}
  </div>
);

interface ContactListItemProps {
  contact: User;
  onSelectContact: (contact: User) => void;
}

const ContactListItem: React.FC<ContactListItemProps> = ({ contact, onSelectContact }) => (
  <div
    className="flex cursor-pointer items-center border-b border-gray-700/30 p-3 text-whatsapp-text-primary hover:bg-whatsapp-active-chat"
    onClick={() => onSelectContact(contact)}
  >
    <img
      src={contact.avatarUrl || `https://placehold.co/50x50/CCCCCC/000000?text=${contact.name.charAt(0).toUpperCase()}`}
      alt={`${contact.name} avatar`}
      className="mr-3 h-12 w-12 rounded-full"
    />
    <div className="min-w-0 flex-1">
      <h3 className="text-base font-medium">{contact.name}</h3>
    </div>
  </div>
);

interface NewChatViewProps {
  contacts: User[];
  onSelectContact: (contact: User) => void;
  contactSearchTerm: string; // Novo
  onContactSearchTermChange: (term: string) => void; // Novo
}

const NewChatView: React.FC<NewChatViewProps> = ({
  contacts,
  onSelectContact,
  contactSearchTerm,
  onContactSearchTermChange
}) => {
  const filteredContacts = contactSearchTerm
    ? contacts.filter(contact =>
        contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase())
      )
    : contacts;

  return (
    <div className="flex flex-col h-full"> {/* Garante que a view ocupe o espaço */}
      <div className="bg-whatsapp-sidebar-bg p-2"> {/* Barra de pesquisa para contactos */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FontAwesomeIcon icon={faSearch} className="text-whatsapp-icon" />
          </div>
          <input
            type="search"
            placeholder="Pesquisar contactos"
            className="h-9 w-full rounded-lg bg-whatsapp-header-bg py-2 pl-10 pr-3 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none focus:ring-1 focus:ring-teal-500"
            value={contactSearchTerm}
            onChange={(e) => onContactSearchTermChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <ContactListItem key={contact.id} contact={contact} onSelectContact={onSelectContact} />
          ))
        ) : (
          <p className="p-4 text-center text-sm text-whatsapp-text-secondary">
            {contactSearchTerm ? "Nenhum contacto encontrado." : "Nenhum contacto disponível."}
          </p>
        )}
      </div>
    </div>
  );
};


interface SidebarProps {
  archivedChatsCount: number;
  onSelectChat: (chat: Chat) => void;
  activeChatId?: string | null;
  onToggleArchivedView: () => void;
  showArchived: boolean;
  currentDisplayedChats: Chat[];
  searchTerm: string; // Para pesquisa de chats
  onSearchTermChange: (term: string) => void; // Para pesquisa de chats
  showNewChatView: boolean;
  onToggleNewChatView: () => void;
  availableContacts: User[];
  onStartNewChat: (contact: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  archivedChatsCount,
  onSelectChat,
  activeChatId,
  onToggleArchivedView,
  showArchived,
  currentDisplayedChats,
  searchTerm,
  onSearchTermChange,
  showNewChatView,
  onToggleNewChatView,
  availableContacts,
  onStartNewChat
}) => {
  const [contactSearchTerm, setContactSearchTerm] = useState<string>('');

  // Limpar o termo de pesquisa de contactos quando a vista de Novo Chat for fechada
  useEffect(() => {
    if (!showNewChatView) {
      setContactSearchTerm('');
    }
  }, [showNewChatView]);

  return (
    <aside className="flex w-full flex-col border-r border-gray-700/50 bg-whatsapp-sidebar-bg text-whatsapp-text-primary md:w-1/3">
      <SidebarHeader
        showArchived={showArchived}
        showNewChatView={showNewChatView}
        onToggleArchivedView={onToggleArchivedView}
        onToggleNewChatView={onToggleNewChatView}
      />

      {showNewChatView ? (
        <NewChatView
          contacts={availableContacts}
          onSelectContact={onStartNewChat}
          contactSearchTerm={contactSearchTerm}
          onContactSearchTermChange={setContactSearchTerm}
        />
      ) : (
        <>
          {!showArchived &&
            <ChatSearch
                searchTerm={searchTerm}
                onSearchTermChange={onSearchTermChange}
            />
          }
          <div className="flex-1 overflow-y-auto chat-scrollbar">
            {!showArchived &&
              <ArchivedItem count={archivedChatsCount} onClick={onToggleArchivedView} />
            }
            <ChatList
              chats={currentDisplayedChats}
              onSelectChat={onSelectChat}
              activeChatId={activeChatId}
            />
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;