import { useState, useMemo } from 'react';
import type { Chat, ActiveChat } from '../types'; // Added ActiveChat

export const useAppView = (
    // If any handlers here need to call setters from useChatManagement, they would be passed here
    // e.g., setViewingContactInfoForFromChatHook: React.Dispatch<React.SetStateAction<Chat | null>>
    // e.g., setActiveChatFromChatHook: React.Dispatch<React.SetStateAction<ActiveChat | null>>
    setActiveChatHook?: React.Dispatch<React.SetStateAction<ActiveChat | null>>, // Added setActiveChatHook
    activeUserChats?: Chat[], // Added
    archivedUserChats?: Chat[] // Added
) => {
  const [showArchivedView, setShowArchivedView] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewChatView, setShowNewChatView] = useState<boolean>(false);
  const [showContactInfoPanel, setShowContactInfoPanel] = useState<boolean>(false);
  const [showCreateGroupView, setShowCreateGroupView] = useState<boolean>(false);
  const [showStarredMessagesView, setShowStarredMessagesView] = useState<boolean>(false);
  const [showMediaGalleryView, setShowMediaGalleryView] = useState<boolean>(false); // New state

  const resetAllSecondaryViews = () => {
    setShowArchivedView(false);
    setShowNewChatView(false);
    setShowCreateGroupView(false);
    setShowStarredMessagesView(false);
    setShowMediaGalleryView(false); // Reset media gallery view as well
    // setShowContactInfoPanel(false); // Keep contact info panel independent for now, or reset if needed
    setSearchTerm('');
    // if (setActiveChatHook) { setActiveChatHook(null); } // Decide if active chat should be cleared
  };

  const handleToggleArchivedView = () => { 
    const becomingVisible = !showArchivedView;
    resetAllSecondaryViews();
    setShowArchivedView(becomingVisible);
    if (becomingVisible && setActiveChatHook) setActiveChatHook(null);
  };

  const handleToggleNewChatView = () => {
    const becomingVisible = !showNewChatView;
    resetAllSecondaryViews();
    setShowNewChatView(becomingVisible);
    if (becomingVisible && setActiveChatHook) setActiveChatHook(null);
  };

  const handleToggleCreateGroupView = () => {
    const becomingVisible = !showCreateGroupView;
    resetAllSecondaryViews();
    setShowCreateGroupView(becomingVisible);
    if (becomingVisible && setActiveChatHook) setActiveChatHook(null);
  };

  const handleToggleStarredMessagesView = () => {
    const becomingVisible = !showStarredMessagesView;
    resetAllSecondaryViews();
    setShowStarredMessagesView(becomingVisible);
    if (becomingVisible && setActiveChatHook) setActiveChatHook(null);
  };

  const handleToggleMediaGalleryView = () => { // New handler
    const becomingVisible = !showMediaGalleryView;
    resetAllSecondaryViews(); // This will close other full-sidebar views
    setShowMediaGalleryView(becomingVisible);
    // Decide if active chat should be cleared or if ContactInfoPanel should be hidden
    // For MediaGallery, it makes sense to keep the active chat context and contact info panel if it was open.
    // So, don't clear activeChatHook here, and setShowContactInfoPanel(false) is not called in resetAllSecondaryViews for it.
  };

  // handleShowContactInfo and handleCloseContactInfoPanel might need to interact with 
  // viewingContactInfoFor from useChatManagement. 
  // It's often cleaner if the component (App.tsx) calls setters from both hooks if needed.
  // Or, these handlers can be moved back to App.tsx if they are purely coordinating.

  // Example: if handleShowContactInfo needed to also set viewingContactInfoFor from the other hook:
  // const handleShowContactInfo = (chat: Chat) => { 
  //   setViewingContactInfoForFromChatHook(chat); 
  //   setShowContactInfoPanel(true); 
  // };

  const listToDisplayInitially = useMemo(() => {
    if (showArchivedView) return archivedUserChats || [];
    if (showNewChatView) return []; // New chat view doesn't show existing chats initially
    if (showCreateGroupView) return []; // Create group view also doesn't show existing chats
    if (showStarredMessagesView) return []; // Starred messages view will have its own data source
    if (showMediaGalleryView) return []; // Media gallery view doesn't use this list directly
    return activeUserChats || [];
  }, [showArchivedView, showNewChatView, showCreateGroupView, showStarredMessagesView, showMediaGalleryView, activeUserChats, archivedUserChats]);

  const currentFilteredChats = useMemo(() => {
    if (searchTerm && !showNewChatView && !showCreateGroupView && !showStarredMessagesView && !showMediaGalleryView) {
      return listToDisplayInitially.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return listToDisplayInitially;
  }, [searchTerm, showNewChatView, showCreateGroupView, showStarredMessagesView, showMediaGalleryView, listToDisplayInitially]);

  return {
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
    setShowStarredMessagesView, // Export setter for direct control if needed
    showMediaGalleryView, // Export new state
    setShowMediaGalleryView, // Export new setter
    handleToggleArchivedView,
    handleToggleNewChatView,
    handleToggleCreateGroupView,
    handleToggleStarredMessagesView,
    handleToggleMediaGalleryView, // Export new handler
    currentFilteredChats,
    // handleShowContactInfo, // Keep in App.tsx for coordination or pass setters
    // handleCloseContactInfoPanel, // Keep in App.tsx for coordination or pass setters
  };
};
