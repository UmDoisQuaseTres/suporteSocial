// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import ContactInfoPanel from './components/ContactInfoPanel/ContactInfoPanel';
import StarredMessagesView from './components/Sidebar/StarredMessagesView';
import type { Chat, User, ActiveChat, Message } from './types';
import { useChatManagement } from './hooks/useChatManagement';
import { useAppView } from './hooks/useAppView';

function App() {
  const {
    allChats,
    activeChat,
    setActiveChat,
    currentUserId,
    messages,
    viewingContactInfoFor,
    setViewingContactInfoFor,
    activeUserChats,
    archivedUserChats,
    unreadInArchivedCount,
    availableContacts,
    handleSelectChat,
    handleSendMessage,
    toggleArchiveChatStatus,
    toggleMuteChat,
    handleToggleBlockChat,
    handleDeleteChat,
    handleExitGroup,
    handleStartNewChat,
    handleCreateGroup,
    handleClearChatMessages,
    handleForwardMessage,
    handleToggleStarMessage
  } = useChatManagement();

  const {
    showArchivedView,
    setShowArchivedView,
    searchTerm,
    setSearchTerm,
    showNewChatView,
    setShowNewChatView,
    showContactInfoPanel,
    setShowContactInfoPanel,
    showCreateGroupView,
    setShowCreateGroupView,
    showStarredMessagesView,
    handleToggleArchivedView: handleToggleArchivedViewFromHook,
    handleToggleNewChatView: handleToggleNewChatViewFromHook,
    handleToggleCreateGroupView: handleToggleCreateGroupViewFromHook,
    handleToggleStarredMessagesView: handleToggleStarredMessagesViewFromHook,
    currentFilteredChats,
  } = useAppView(setActiveChat, activeUserChats, archivedUserChats);

  const [messageToHighlightId, setMessageToHighlightId] = useState<string | null>(null);

  const handleShowContactInfo = (chat: Chat) => { 
    setViewingContactInfoFor(chat);
    setShowContactInfoPanel(true);
  };

  const handleCloseContactInfoPanel = () => { 
    setShowContactInfoPanel(false);
  }; 

  const handleToggleArchivedView = () => {
    handleToggleArchivedViewFromHook();
  };

  const handleToggleNewChatView = () => {
    handleToggleNewChatViewFromHook();
  };

  const handleToggleCreateGroupView = () => {
    handleToggleCreateGroupViewFromHook();
  };

  const handleToggleStarredMessagesView = () => {
    handleToggleStarredMessagesViewFromHook();
  };

  const handleNavigateToChat = (chat: Chat, messageId?: string) => {
    handleSelectChat(chat, showArchivedView, setShowContactInfoPanel, setShowNewChatView);
    if (showStarredMessagesView) {
      handleToggleStarredMessagesView();
    }
    if (messageId) {
      setMessageToHighlightId(messageId);
    }
  };

  const activeChatRef = useRef(activeChat);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  const sidebarWidth = showContactInfoPanel ? "md:w-1/4" : "md:w-1/3";
  const mainContentWidth = showContactInfoPanel ? "md:w-2/4" : "md:w-2/3";

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-whatsapp-chat-bg">
      <div className="flex h-full w-full overflow-hidden shadow-2xl md:h-screen md:w-full md:max-w-none md:rounded-none">
        {showStarredMessagesView ? (
          <StarredMessagesView 
            allMessages={messages}
            allChats={allChats}
            currentUserId={currentUserId}
            onClose={handleToggleStarredMessagesView}
            onNavigateToChat={handleNavigateToChat}
            onToggleStarMessage={handleToggleStarMessage}
          />
        ) : (
          <Sidebar
            sidebarWidthClass={sidebarWidth}
            unreadInArchivedCount={unreadInArchivedCount}
            onSelectChat={(chat) => handleSelectChat(chat, showArchivedView, setShowContactInfoPanel, setShowNewChatView)} 
            activeChatId={activeChat?.id}
            onToggleArchivedView={handleToggleArchivedView} 
            showArchived={showArchivedView}
            currentDisplayedChats={currentFilteredChats}
            searchTerm={searchTerm} onSearchTermChange={setSearchTerm}
            showNewChatView={showNewChatView} onToggleNewChatView={handleToggleNewChatView}
            showCreateGroupView={showCreateGroupView}
            onToggleCreateGroupView={handleToggleCreateGroupView}
            availableContacts={availableContacts} 
            onStartNewChat={(contact) => handleStartNewChat(contact, setShowNewChatView, setShowContactInfoPanel)}
            onToggleArchiveChatStatus={(chatId) => toggleArchiveChatStatus(chatId, showArchivedView, setShowArchivedView)} 
            totalArchivedChats={archivedUserChats.length}
            onCreateGroup={(groupName, selectedIds) => handleCreateGroup(groupName, selectedIds, setShowCreateGroupView, setActiveChat)}
            currentUserId={currentUserId}
            onShowStarredMessages={handleToggleStarredMessagesView}
          />
        )}
        <MainContent
          mainContentWidthClass={mainContentWidth}
          activeChat={activeChat} currentUserId={currentUserId}
          onSendMessage={(chatId, messageText) => handleSendMessage(chatId, messageText, showArchivedView, setShowArchivedView)}
          onToggleArchiveStatus={(chatId) => toggleArchiveChatStatus(chatId, showArchivedView, setShowArchivedView)} 
          onShowContactInfo={handleShowContactInfo}
          onClearChatMessages={handleClearChatMessages}
          onDeleteChat={(chatId) => handleDeleteChat(chatId, showArchivedView, setShowArchivedView)}
          allChats={allChats}
          onForwardMessage={handleForwardMessage}
          onToggleStarMessage={handleToggleStarMessage}
          messageToHighlightId={messageToHighlightId}
          clearMessageToHighlight={() => setMessageToHighlightId(null)}
        />
        {showContactInfoPanel && viewingContactInfoFor && (
          <ContactInfoPanel
            chatInfo={viewingContactInfoFor}
            onClose={handleCloseContactInfoPanel}
            panelWidthClass="w-full md:w-1/4"
            currentUserId={currentUserId}
            onToggleMuteChat={toggleMuteChat}
            onToggleBlockChat={handleToggleBlockChat}
            onDeleteChat={(chatId) => handleDeleteChat(chatId, showArchivedView, setShowArchivedView)} 
            onExitGroup={(chatId) => handleExitGroup(chatId, showArchivedView, setShowArchivedView)} 
          />
        )}
      </div>
    </div>
  );
}

export default App;