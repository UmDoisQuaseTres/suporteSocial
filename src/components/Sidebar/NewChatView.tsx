import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUsers } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types';
import ContactListItem from './ContactListItem'; // Import the extracted component

export interface NewChatViewProps {
  contacts: User[];
  onSelectContact: (contact: User) => void;
  contactSearchTerm: string;
  onContactSearchTermChange: (term: string) => void;
  onShowCreateGroupView: () => void;
}

const NewChatView: React.FC<NewChatViewProps> = ({ 
  contacts, 
  onSelectContact, 
  contactSearchTerm, 
  onContactSearchTermChange,
  onShowCreateGroupView
}) => {
  const filteredContacts = contactSearchTerm 
    ? contacts.filter(contact => contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase())) 
    : contacts;

  return (
    <div className="flex flex-col h-full">
      <div 
        className="flex cursor-pointer items-center border-b border-whatsapp-header-bg p-3.5 text-whatsapp-text-primary hover:bg-whatsapp-active-chat"
        onClick={onShowCreateGroupView}
      >
        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-whatsapp-light-green">
          <FontAwesomeIcon icon={faUsers} className="text-xl text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium">Novo grupo</h3>
        </div>
      </div>
      <div className="bg-whatsapp-sidebar-bg p-2">
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

export default NewChatView; 