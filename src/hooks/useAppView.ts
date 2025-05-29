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

  const handleToggleArchivedView = () => { 
    setShowArchivedView(prev => !prev); 
    setShowNewChatView(false); 
    setSearchTerm(''); 
    setShowContactInfoPanel(false); 
    if (setActiveChatHook) {
      setActiveChatHook(null);
    }
  };

  const handleToggleNewChatView = () => {
    setShowNewChatView(prev => !prev); 
    setShowArchivedView(false); 
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
    return activeUserChats || [];
  }, [showArchivedView, showNewChatView, activeUserChats, archivedUserChats]);

  const currentFilteredChats = useMemo(() => {
    if (searchTerm && !showNewChatView) {
      return listToDisplayInitially.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return listToDisplayInitially;
  }, [searchTerm, showNewChatView, listToDisplayInitially]);

  return {
    showArchivedView,
    setShowArchivedView,
    searchTerm,
    setSearchTerm,
    showNewChatView,
    setShowNewChatView,
    showContactInfoPanel,
    setShowContactInfoPanel,
    handleToggleArchivedView,
    handleToggleNewChatView,
    currentFilteredChats,
    // handleShowContactInfo, // Keep in App.tsx for coordination or pass setters
    // handleCloseContactInfoPanel, // Keep in App.tsx for coordination or pass setters
  };
};
