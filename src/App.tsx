// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import ContactInfoPanel from './components/ContactInfoPanel/ContactInfoPanel';
import StarredMessagesView from './components/Sidebar/StarredMessagesView';
import MediaGalleryView from './components/MainContent/MediaGalleryView';
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
    isCreatingGroup,
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
    showMediaGalleryView,
    handleToggleArchivedView: handleToggleArchivedViewFromHook,
    handleToggleNewChatView: handleToggleNewChatViewFromHook,
    handleToggleCreateGroupView: handleToggleCreateGroupViewFromHook,
    handleToggleStarredMessagesView: handleToggleStarredMessagesViewFromHook,
    handleToggleMediaGalleryView,
    currentFilteredChats,
  } = useAppView(setActiveChat, activeUserChats, archivedUserChats);

  const [messageToHighlightId, setMessageToHighlightId] = useState<string | null>(null);

  const handleShowMediaGallery = (chat: Chat) => {
    setViewingContactInfoFor(chat);
    setShowContactInfoPanel(true);
    handleToggleMediaGalleryView();
  };

  const handleCloseMediaGallery = () => {
    handleToggleMediaGalleryView();
  };

  const handleShowContactInfo = (chat: Chat) => { 
    setViewingContactInfoFor(chat);
    setShowContactInfoPanel(true);
    if (showMediaGalleryView) handleToggleMediaGalleryView(); 
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
    if (showMediaGalleryView) {
        handleToggleMediaGalleryView();
    }
    if (messageId) {
      setMessageToHighlightId(messageId);
    }
  };

  const activeChatRef = useRef(activeChat);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  const isFullScreenViewActive = showStarredMessagesView || showMediaGalleryView;
  const sidebarLayoutWidth = isFullScreenViewActive ? "w-full" : (showContactInfoPanel ? "md:w-1/4" : "md:w-1/3");
  const mainContentLayoutWidth = isFullScreenViewActive ? "hidden" : (showContactInfoPanel ? "md:w-2/4" : "md:w-2/3");
  const contactInfoPanelLayoutWidth = isFullScreenViewActive ? "hidden" : "w-full md:w-1/4";

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-whatsapp-chat-bg">
      <div className="flex h-full w-full overflow-hidden shadow-2xl md:h-screen md:w-full md:max-w-none md:rounded-none">
        {showMediaGalleryView && viewingContactInfoFor ? (
           <MediaGalleryView 
            chatInfo={viewingContactInfoFor} 
            chatMessages={messages[viewingContactInfoFor.id] || []} 
            onClose={handleCloseMediaGallery} 
          />
        ) : showStarredMessagesView ? (
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
            sidebarWidthClass={sidebarLayoutWidth}
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
            isCreatingGroup={isCreatingGroup}
          />
        )}
        {!isFullScreenViewActive && (
            <MainContent
              mainContentWidthClass={mainContentLayoutWidth}
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
        )}
        {showContactInfoPanel && viewingContactInfoFor && !isFullScreenViewActive && (
          <ContactInfoPanel
            chatInfo={viewingContactInfoFor}
            chatMessages={messages[viewingContactInfoFor.id] || []}
            onClose={handleCloseContactInfoPanel}
            panelWidthClass={contactInfoPanelLayoutWidth}
            currentUserId={currentUserId}
            onToggleMuteChat={toggleMuteChat}
            onToggleBlockChat={handleToggleBlockChat}
            onDeleteChat={(chatId) => handleDeleteChat(chatId, showArchivedView, setShowArchivedView)} 
            onExitGroup={(chatId) => handleExitGroup(chatId, showArchivedView, setShowArchivedView)} 
            onShowMediaGallery={handleShowMediaGallery}
            onShowStarredMessages={handleToggleStarredMessagesView}
          />
        )}
      </div>
    </div>
  );
}

export default App;