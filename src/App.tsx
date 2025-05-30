// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import ContactInfoPanel from './components/ContactInfoPanel/ContactInfoPanel';
import StarredMessagesView from './components/Sidebar/StarredMessagesView';
import MediaGalleryView from './components/MainContent/MediaGalleryView';
import type { Chat, Message } from './types';
import useStore, {
  useActiveChat,
  useCurrentUserId,
  useFilteredChats,
  useChatViewState
} from './store/useStore';
import ConfirmationDialog from './components/common/ConfirmationDialog';

function App() {
  const {
    // Actions
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
    handleToggleStarMessage,
    
    // State getters
    allChats,
    messages,
    viewingContactInfoFor,
    setViewingContactInfoFor,
    isCreatingGroup,
    
    // UI Actions
    setSearchTerm,
    setShowContactInfoPanel,
    handleToggleArchivedView,
    handleToggleNewChatView,
    handleToggleCreateGroupView,
    handleToggleStarredMessagesView,
    handleToggleMediaGalleryView,
    
    // Derived state
    archivedUserChats,
    unreadInArchivedCount,
    availableContacts,
    confirmationDialog,
    showConfirmationDialog,
    hideConfirmationDialog,
    confirmConfirmationDialog,
  } = useStore(state => ({
    // Actions
    handleSelectChat: state.handleSelectChat,
    handleSendMessage: state.handleSendMessage,
    toggleArchiveChatStatus: state.toggleArchiveChatStatus,
    toggleMuteChat: state.toggleMuteChat,
    handleToggleBlockChat: state.handleToggleBlockChat,
    handleDeleteChat: state.handleDeleteChat,
    handleExitGroup: state.handleExitGroup,
    handleStartNewChat: state.handleStartNewChat,
    handleCreateGroup: state.handleCreateGroup,
    handleClearChatMessages: state.handleClearChatMessages,
    handleForwardMessage: state.handleForwardMessage,
    handleToggleStarMessage: state.handleToggleStarMessage,
    
    // State getters
    allChats: state.allChats,
    messages: state.messages,
    viewingContactInfoFor: state.viewingContactInfoFor,
    setViewingContactInfoFor: state.setViewingContactInfoFor,
    isCreatingGroup: state.isCreatingGroup,
    
    // UI Actions
    setSearchTerm: state.setSearchTerm,
    setShowContactInfoPanel: state.setShowContactInfoPanel,
    handleToggleArchivedView: state.handleToggleArchivedView,
    handleToggleNewChatView: state.handleToggleNewChatView,
    handleToggleCreateGroupView: state.handleToggleCreateGroupView,
    handleToggleStarredMessagesView: state.handleToggleStarredMessagesView,
    handleToggleMediaGalleryView: state.handleToggleMediaGalleryView,
    
    // Derived state
    archivedUserChats: state.archivedUserChats(),
    unreadInArchivedCount: state.unreadInArchivedCount(),
    availableContacts: state.availableContacts(),
    confirmationDialog: state.confirmationDialog,
    showConfirmationDialog: state.showConfirmationDialog,
    hideConfirmationDialog: state.hideConfirmationDialog,
    confirmConfirmationDialog: state.confirmConfirmationDialog,
  }));

  // Use optimized selectors for frequently changing state
  const activeChat = useActiveChat();
  const currentUserId = useCurrentUserId();
  const currentFilteredChats = useFilteredChats();
  const viewState = useChatViewState();

  const [messageToHighlightId, setMessageToHighlightId] = useState<string | null>(null);

  // Simplified handlers, as toggle actions are now in the store
  const handleShowMediaGallery = (chat: Chat) => {
    setViewingContactInfoFor(chat);
    setShowContactInfoPanel(true); // Maintain direct control if needed, or integrate into store action
    handleToggleMediaGalleryView(); // This now calls the store action
  };

  const handleCloseMediaGallery = () => {
    handleToggleMediaGalleryView(); // Calls store action
  };

  const handleShowContactInfo = (chat: Chat) => { 
    setViewingContactInfoFor(chat);
    setShowContactInfoPanel(true);
    if (viewState.showMediaGalleryView) handleToggleMediaGalleryView(); // Call store action
  };

  const handleCloseContactInfoPanel = () => { 
    setShowContactInfoPanel(false); // Can remain direct or become a store action
  }; 

  const handleNavigateToChat = (chat: Chat, messageId?: string) => {
    handleSelectChat(chat); // Store action updated, no longer needs UI setters
    if (viewState.showStarredMessagesView) {
      handleToggleStarredMessagesView(); // Store action
    }
    if (viewState.showMediaGalleryView) {
        handleToggleMediaGalleryView(); // Store action
    }
    if (messageId) {
      setMessageToHighlightId(messageId);
    }
  };

  const activeChatRef = useRef(activeChat);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  const isFullScreenViewActive = viewState.showStarredMessagesView || viewState.showMediaGalleryView;
  const sidebarLayoutWidth = isFullScreenViewActive ? "w-full" : (viewState.showContactInfoPanel ? "md:w-1/4" : "md:w-1/3");
  const mainContentLayoutWidth = isFullScreenViewActive ? "hidden" : (viewState.showContactInfoPanel ? "md:w-2/4" : "md:w-2/3");
  const contactInfoPanelLayoutWidth = isFullScreenViewActive ? "hidden" : "w-full md:w-1/4";

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-whatsapp-chat-bg">
      <div className="flex h-full w-full overflow-hidden shadow-2xl md:h-screen md:w-full md:max-w-none md:rounded-none">
        {viewState.showMediaGalleryView && viewingContactInfoFor ? (
           <MediaGalleryView 
            chatInfo={viewingContactInfoFor} 
            chatMessages={messages[viewingContactInfoFor.id] || []} 
            onClose={handleCloseMediaGallery} 
          />
        ) : viewState.showStarredMessagesView ? (
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
            onSelectChat={handleSelectChat}
            activeChatId={activeChat?.id}
            onToggleArchivedView={handleToggleArchivedView}
            showArchived={viewState.showArchivedView}
            currentDisplayedChats={currentFilteredChats}
            searchTerm={viewState.searchTerm}
            onSearchTermChange={setSearchTerm}
            showNewChatView={viewState.showNewChatView}
            onToggleNewChatView={handleToggleNewChatView}
            showCreateGroupView={viewState.showCreateGroupView}
            onToggleCreateGroupView={handleToggleCreateGroupView}
            availableContacts={availableContacts}
            onStartNewChat={handleStartNewChat}
            onToggleArchiveChatStatus={toggleArchiveChatStatus}
            totalArchivedChats={archivedUserChats.length}
            onCreateGroup={handleCreateGroup}
            currentUserId={currentUserId}
            onShowStarredMessages={handleToggleStarredMessagesView}
            isCreatingGroup={isCreatingGroup}
          />
        )}
        {!isFullScreenViewActive && (
            <MainContent
              mainContentWidthClass={mainContentLayoutWidth}
              activeChat={activeChat} currentUserId={currentUserId}
              onSendMessage={handleSendMessage} // Store action
              onToggleArchiveStatus={toggleArchiveChatStatus} // Store action
              onShowContactInfo={handleShowContactInfo}
              onClearChatMessages={handleClearChatMessages}
              onDeleteChat={handleDeleteChat} // Store action
              allChats={allChats}
              onForwardMessage={handleForwardMessage}
              onToggleStarMessage={handleToggleStarMessage}
              messageToHighlightId={messageToHighlightId}
              clearMessageToHighlight={() => setMessageToHighlightId(null)}
            />
        )}
        {viewState.showContactInfoPanel && viewingContactInfoFor && !isFullScreenViewActive && (
          <ContactInfoPanel
            chatInfo={viewingContactInfoFor}
            chatMessages={messages[viewingContactInfoFor.id] || []}
            onClose={handleCloseContactInfoPanel}
            panelWidthClass={contactInfoPanelLayoutWidth}
            currentUserId={currentUserId}
            onToggleMuteChat={toggleMuteChat}
            onToggleBlockChat={handleToggleBlockChat}
            onDeleteChat={handleDeleteChat} // Store action
            onExitGroup={handleExitGroup} // Store action
            onShowMediaGallery={handleShowMediaGallery}
            onShowStarredMessages={handleToggleStarredMessagesView} // Store action
          />
        )}
        {confirmationDialog && confirmationDialog.isOpen && (
          <ConfirmationDialog 
            isOpen={true}
            title={confirmationDialog.title}
            message={confirmationDialog.message}
            confirmText={confirmationDialog.confirmText}
            cancelText={confirmationDialog.cancelText}
            onConfirm={confirmConfirmationDialog}
            onCancel={hideConfirmationDialog}
            isDestructive={confirmationDialog.isDestructive}
            confirmButtonVariant={confirmationDialog.confirmButtonVariant}
            hideCancelButton={confirmationDialog.hideCancelButton}
          />
        )}
      </div>
    </div>
  );
}

export default App;