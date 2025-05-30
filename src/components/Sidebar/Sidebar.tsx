import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import type { Chat, User } from '../../types';
import SidebarHeader from './SidebarHeader';
import ChatSearch from './ChatSearch';
import ArchivedItem from './ArchivedItem';
import NewChatView from './NewChatView';
import CreateGroupView from './CreateGroupView';

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
  showCreateGroupView: boolean;
  onToggleCreateGroupView: () => void;
  onCreateGroup: (groupName: string, selectedContactIds: string[]) => void;
  currentUserId: string;
  isCreatingGroup: boolean;
  onShowStarredMessages?: () => void;
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
  onToggleArchiveChatStatus,
  showCreateGroupView,
  onToggleCreateGroupView,
  onCreateGroup,
  currentUserId,
  isCreatingGroup,
  onShowStarredMessages
}) => {
  const [contactSearchTerm, setContactSearchTerm] = useState<string>('');

  useEffect(() => {
    if (!showNewChatView && !showCreateGroupView) {
      setContactSearchTerm('');
    }
  }, [showNewChatView, showCreateGroupView]);

  const handleBackFromNewOrGroupView = () => {
    if (showNewChatView) onToggleNewChatView();
    if (showCreateGroupView) onToggleCreateGroupView();
  };

  return (
    <aside className={`flex w-full flex-col border-r border-gray-700/50 bg-whatsapp-sidebar-bg text-whatsapp-text-primary ${sidebarWidthClass || 'md:w-1/3'}`}>
      <SidebarHeader 
        showArchived={showArchived}
        showNewChatView={showNewChatView}
        showCreateGroupView={showCreateGroupView}
        onToggleArchivedView={onToggleArchivedView}
        onToggleNewChatView={handleBackFromNewOrGroupView}
        onToggleCreateGroupView={handleBackFromNewOrGroupView}
        onInitiateNewChat={onToggleNewChatView}
        onInitiateCreateGroup={onToggleCreateGroupView}
        onShowStarredMessages={onShowStarredMessages}
      />

      {showNewChatView ? (
        <NewChatView
          contacts={availableContacts}
          onSelectContact={onStartNewChat}
          contactSearchTerm={contactSearchTerm}
          onContactSearchTermChange={setContactSearchTerm}
          onShowCreateGroupView={onToggleCreateGroupView}
        />
      ) : showCreateGroupView ? (
        <CreateGroupView 
          availableContacts={availableContacts}
          currentUserId={currentUserId}
          onCreateGroup={onCreateGroup}
          onCancel={onToggleCreateGroupView}
          isCreatingGroup={isCreatingGroup}
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
              searchTerm={searchTerm}
              isArchivedView={showArchived}
            />
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;