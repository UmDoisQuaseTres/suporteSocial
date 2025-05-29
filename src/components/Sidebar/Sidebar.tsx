import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import type { Chat, User } from '../../types';
import SidebarHeader from './SidebarHeader';
import ChatSearch from './ChatSearch';
import ArchivedItem from './ArchivedItem';
import NewChatView from './NewChatView';

interface SidebarProps {
  unreadInArchivedCount: number;
  onSelectChat: (chat: Chat) => void;
  activeChatId?: string | null;
  onToggleArchivedView: () => void;
  showArchived: boolean;
  currentDisplayedChats: Chat[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  showNewChatView: boolean;
  onToggleNewChatView: () => void;
  availableContacts: User[];
  onStartNewChat: (contact: User) => void;
  sidebarWidthClass?: string;
  totalArchivedChats: number;
  onToggleArchiveChatStatus: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  unreadInArchivedCount,
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
  onStartNewChat,
  sidebarWidthClass,
  totalArchivedChats,
  onToggleArchiveChatStatus
}) => {
  const [contactSearchTerm, setContactSearchTerm] = useState<string>('');

  useEffect(() => {
    if (!showNewChatView) {
      setContactSearchTerm('');
    }
  }, [showNewChatView]);

  return (
    <aside className={`flex w-full flex-col border-r border-gray-700/50 bg-whatsapp-sidebar-bg text-whatsapp-text-primary ${sidebarWidthClass || 'md:w-1/3'}`}>
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
              <ArchivedItem
                unreadCount={unreadInArchivedCount}
                onClick={onToggleArchivedView}
                totalArchived={totalArchivedChats}
              />
            }
            <ChatList
              chats={currentDisplayedChats}
              onSelectChat={onSelectChat}
              activeChatId={activeChatId}
              onToggleArchiveChatStatus={onToggleArchiveChatStatus}
            />
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;