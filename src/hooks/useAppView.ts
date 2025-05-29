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

  const handleToggleArchivedView = () => { 
    setShowArchivedView(prev => !prev); 
    setShowNewChatView(false); 
    setShowCreateGroupView(false);
    setShowStarredMessagesView(false);
    setSearchTerm(''); 
    setShowContactInfoPanel(false); 
    if (setActiveChatHook) {
      setActiveChatHook(null);
    }
  };

  const handleToggleNewChatView = () => {
    setShowNewChatView(prev => !prev); 
    setShowArchivedView(false); 
    setShowCreateGroupView(false);
    setShowStarredMessagesView(false);
    setSearchTerm(''); 
    setShowContactInfoPanel(false); 
    if (setActiveChatHook) {
      setActiveChatHook(null);
    }
  };

  const handleToggleCreateGroupView = () => {
    setShowCreateGroupView(prev => !prev);
    setShowNewChatView(false);
    setShowArchivedView(false);
    setShowStarredMessagesView(false);
    setSearchTerm('');
    setShowContactInfoPanel(false);
    if (setActiveChatHook) {
      setActiveChatHook(null);
    }
  };

  const handleToggleStarredMessagesView = () => {
    setShowStarredMessagesView(prev => !prev);
    setShowArchivedView(false);
    setShowNewChatView(false);
    setShowCreateGroupView(false);
    setSearchTerm('');
    setShowContactInfoPanel(false);
    if (setActiveChatHook) {
      setActiveChatHook(null);
    }
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
    return activeUserChats || [];
  }, [showArchivedView, showNewChatView, showCreateGroupView, showStarredMessagesView, activeUserChats, archivedUserChats]);

  const currentFilteredChats = useMemo(() => {
    if (searchTerm && !showNewChatView && !showCreateGroupView && !showStarredMessagesView) {
      return listToDisplayInitially.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return listToDisplayInitially;
  }, [searchTerm, showNewChatView, showCreateGroupView, showStarredMessagesView, listToDisplayInitially]);

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
    handleToggleArchivedView,
    handleToggleNewChatView,
    handleToggleCreateGroupView,
    handleToggleStarredMessagesView,
    currentFilteredChats,
    // handleShowContactInfo, // Keep in App.tsx for coordination or pass setters
    // handleCloseContactInfoPanel, // Keep in App.tsx for coordination or pass setters
  };
};
