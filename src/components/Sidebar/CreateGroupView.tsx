import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCamera, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types';
import ContactListItem from './ContactListItem'; // Re-use for consistency

interface CreateGroupViewProps {
  availableContacts: User[];
  currentUserId: string; // To exclude current user from selection if needed, or for group logic
  onCreateGroup: (groupName: string, selectedContactIds: string[]) => void;
  onCancel: () => void; // To go back to the previous view
  isCreatingGroup: boolean; // New prop for loading state
}

const CreateGroupView: React.FC<CreateGroupViewProps> = ({
  availableContacts,
  currentUserId,
  onCreateGroup,
  onCancel,
  isCreatingGroup, // Destructure new prop
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [contactSearchTerm, setContactSearchTerm] = useState('');

  const handleToggleContactSelection = (contactId: string) => {
    setSelectedContactIds((prevSelected) =>
      prevSelected.includes(contactId)
        ? prevSelected.filter((id) => id !== contactId)
        : [...prevSelected, contactId]
    );
  };

  const handleCreate = () => {
    if (groupName.trim() && selectedContactIds.length > 0 && !isCreatingGroup) {
      onCreateGroup(groupName.trim(), selectedContactIds);
    } else if (isCreatingGroup) {
      console.log("A criação do grupo está em andamento...");
    } else {
      alert('Por favor, defina um nome para o grupo e selecione pelo menos um contacto.');
    }
  };

  const filteredContacts = contactSearchTerm
    ? availableContacts.filter(contact => 
        contact.id !== currentUserId && // Ensure current user is not in the list to be selected
        contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase())
      )
    : availableContacts.filter(contact => contact.id !== currentUserId);

  return (
    <div className="flex h-full flex-col bg-whatsapp-sidebar-bg">
      {/* Group Name Input Area */}
      <div className="flex items-center border-b border-whatsapp-header-bg p-4">
        <div className="mr-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-600 hover:bg-gray-500">
          <FontAwesomeIcon icon={faCamera} className="text-2xl text-gray-300" />
          {/* TODO: Add group icon selection functionality */}
        </div>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Nome do grupo (obrigatório)"
          className="flex-1 bg-transparent py-2 text-lg text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none"
        />
      </div>

      {/* Contact Search and List */}
      <div className="p-2">
        <div className="relative mb-2">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-whatsapp-icon"
          />
          <input
            type="text"
            placeholder="Pesquisar contactos para adicionar"
            value={contactSearchTerm}
            onChange={(e) => setContactSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-whatsapp-input-bg py-1.5 pl-10 pr-3 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto message-list-scrollbar px-2">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleToggleContactSelection(contact.id)}
              className={`cursor-pointer rounded-md p-2 hover:bg-whatsapp-active-chat ${
                selectedContactIds.includes(contact.id) ? 'bg-whatsapp-header-bg' : ''
              }`}
            >
              <ContactListItem
                contact={contact}
                onSelectContact={() => handleToggleContactSelection(contact.id)} // The div handles click, but this prop is required
                isSelected={selectedContactIds.includes(contact.id)} // Pass selection state
              />
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-sm text-whatsapp-text-secondary">
            Nenhum contacto encontrado.
          </p>
        )}
      </div>
      
      {/* Selected contacts preview (optional, simple version) */}
      {selectedContactIds.length > 0 && (
        <div className="p-2 border-t border-whatsapp-header-bg">
          <p className="text-xs text-whatsapp-text-secondary mb-1">Selecionados: {selectedContactIds.length}</p>
          {/* Could list names or avatars here */}
        </div>
      )}

      {/* Create Button */}
      {groupName.trim() && selectedContactIds.length > 0 && (
        <div className="p-4">
          <button
            onClick={handleCreate}
            disabled={isCreatingGroup}
            className="flex w-full items-center justify-center rounded-full bg-whatsapp-light-green p-3 text-white hover:bg-whatsapp-dark-green focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isCreatingGroup ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl" />
            ) : (
              <FontAwesomeIcon icon={faArrowRight} className="text-xl" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateGroupView; 