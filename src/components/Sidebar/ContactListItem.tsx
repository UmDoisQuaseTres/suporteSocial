import React from 'react';
import type { User } from '../../types';
import Avatar from '../common/Avatar';

export interface ContactListItemProps {
  contact: User;
  onSelectContact: (contact: User) => void;
}

const ContactListItem: React.FC<ContactListItemProps> = ({ contact, onSelectContact }) => (
  <div 
    className="flex cursor-pointer items-center border-b border-gray-700/30 p-3 text-whatsapp-text-primary hover:bg-whatsapp-active-chat" 
    onClick={() => onSelectContact(contact)}
  >
    <Avatar 
      src={contact.avatarUrl}
      name={contact.name}
      sizeClasses="h-12 w-12"
      className="mr-3"
      fallbackText={contact.name.charAt(0).toUpperCase()}
    />
    <div className="min-w-0 flex-1">
      <h3 className="text-base font-medium">{contact.name}</h3>
    </div>
  </div>
);

export default ContactListItem; 