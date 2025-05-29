import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Chat, ActiveChat, Message, User, MessageStatus } from '../types';
import { mockUsers, initialMockChats, initialMockMessages } from '../mockData';

// Define the state shape
interface AppState {
  // Chat Management State
  allChats: Chat[];
  activeChat: ActiveChat | null;
  messages: { [chatId: string]: Message[] };
  currentUserId: string;
  viewingContactInfoFor: Chat | null;
  isCreatingGroup: boolean;

  // UI State
  showArchivedView: boolean;
  searchTerm: string;
  showNewChatView: boolean;
  showContactInfoPanel: boolean;
  showCreateGroupView: boolean;
  showStarredMessagesView: boolean;
  showMediaGalleryView: boolean;

  // Derived states (getters)
  activeUserChats: () => Chat[];
  archivedUserChats: () => Chat[];
  unreadInArchivedCount: () => number;
  availableContacts: () => User[];
  currentFilteredChats: () => Chat[]; // New derived state

  // Actions for Chat Management
  setAllChats: (chats: Chat[]) => void;
  setActiveChat: (chat: ActiveChat | null) => void;
  setMessages: (messages: { [chatId: string]: Message[] }) => void;
  setViewingContactInfoFor: (chat: Chat | null) => void;
  setIsCreatingGroup: (isCreating: boolean) => void;

  // Actions for UI View Management
  setShowArchivedView: (show: boolean) => void;
  setSearchTerm: (term: string) => void;
  setShowNewChatView: (show: boolean) => void;
  setShowContactInfoPanel: (show: boolean) => void;
  setShowCreateGroupView: (show: boolean) => void;
  setShowStarredMessagesView: (show: boolean) => void;
  setShowMediaGalleryView: (show: boolean) => void;
  
  resetAllSecondaryViews: () => void; // Helper for toggles

  handleToggleArchivedView: () => void;
  handleToggleNewChatView: () => void;
  handleToggleCreateGroupView: () => void;
  handleToggleStarredMessagesView: () => void;
  handleToggleMediaGalleryView: () => void;

  // More complex actions (Chat Management - signatures updated)
  handleSelectChat: (chat: Chat) => void; // Removed UI params
  handleSendMessage: (chatId: string, messageContent: {
    text?: string; imageUrl?: string; fileName?: string; audioUrl?: string; videoUrl?: string;
    duration?: number; mediaType?: 'image' | 'document' | 'audio' | 'video';
    replyToMessageId?: string; replyToMessagePreview?: string; replyToSenderName?: string;
  }) => void; // Removed UI params
  toggleArchiveChatStatus: (chatId: string) => void; // Removed UI params
  toggleMuteChat: (chatId: string) => void;
  handleToggleBlockChat: (chatId: string) => void;
  handleDeleteChat: (chatId: string) => void; // Removed UI params
  handleExitGroup: (chatId: string) => void; // Removed UI params
  handleStartNewChat: (contact: User) => void; // Removed UI params
  handleCreateGroup: (groupName: string, selectedContactIds: string[]) => void; // Removed UI params
  handleClearChatMessages: (chatId: string) => void;
  handleForwardMessage: (originalMessage: Message, targetChatIds: string[]) => void;
  handleToggleStarMessage: (messageId: string) => void;
}

// Create the store with persistence
const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Chat Management State
      allChats: initialMockChats,
      activeChat: null,
      messages: initialMockMessages,
      currentUserId: 'currentUser',
      viewingContactInfoFor: null,
      isCreatingGroup: false,

      // Initial UI State
      showArchivedView: false,
      searchTerm: '',
      showNewChatView: false,
      showContactInfoPanel: false,
      showCreateGroupView: false,
      showStarredMessagesView: false,
      showMediaGalleryView: false,

      // Derived state implementations
      activeUserChats: () => get().allChats.filter(chat => !chat.isArchived),
      archivedUserChats: () => get().allChats.filter(chat => chat.isArchived),
      unreadInArchivedCount: () => get().archivedUserChats().filter(chat => (chat.unreadCount || 0) > 0).length,
      availableContacts: () => Object.values(mockUsers).filter(user => user.id !== get().currentUserId),
      
      currentFilteredChats: () => {
        const { searchTerm, showNewChatView, showCreateGroupView, showStarredMessagesView, showMediaGalleryView, showArchivedView, archivedUserChats, activeUserChats } = get();
        const listToDisplayInitially = (() => {
            if (showArchivedView) return archivedUserChats();
            if (showNewChatView) return []; 
            if (showCreateGroupView) return []; 
            if (showStarredMessagesView) return [];
            if (showMediaGalleryView) return [];
            return activeUserChats();
          })();

        if (searchTerm && !showNewChatView && !showCreateGroupView && !showStarredMessagesView && !showMediaGalleryView) {
          return listToDisplayInitially.filter(chat => 
            chat.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return listToDisplayInitially;
      },

      // Basic setters for Chat Management
      setAllChats: (chats) => set({ allChats: chats }),
      setActiveChat: (chat) => set({ activeChat: chat }),
      setMessages: (messages) => set({ messages: messages }),
      setViewingContactInfoFor: (chat) => set({ viewingContactInfoFor: chat }),
      setIsCreatingGroup: (isCreating) => set({ isCreatingGroup: isCreating }),

      // Basic setters for UI View Management
      setShowArchivedView: (show) => set({ showArchivedView: show }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setShowNewChatView: (show) => set({ showNewChatView: show }),
      setShowContactInfoPanel: (show) => set({ showContactInfoPanel: show }),
      setShowCreateGroupView: (show) => set({ showCreateGroupView: show }),
      setShowStarredMessagesView: (show) => set({ showStarredMessagesView: show }),
      setShowMediaGalleryView: (show) => set({ showMediaGalleryView: show }),

      resetAllSecondaryViews: () => {
        set({
          showArchivedView: false,
          showNewChatView: false,
          showCreateGroupView: false,
          showStarredMessagesView: false,
          showMediaGalleryView: false,
          searchTerm: '',
          // activeChat: null, // Decide if active chat should be cleared based on context
          // showContactInfoPanel: false, // Keep contact info panel independent for now
        });
      },

      // UI View Toggle Actions
      handleToggleArchivedView: () => {
        const becomingVisible = !get().showArchivedView;
        get().resetAllSecondaryViews();
        set({ showArchivedView: becomingVisible });
        if (becomingVisible) set({ activeChat: null });
      },
      handleToggleNewChatView: () => {
        const becomingVisible = !get().showNewChatView;
        get().resetAllSecondaryViews();
        set({ showNewChatView: becomingVisible });
        if (becomingVisible) set({ activeChat: null });
      },
      handleToggleCreateGroupView: () => {
        const becomingVisible = !get().showCreateGroupView;
        get().resetAllSecondaryViews();
        set({ showCreateGroupView: becomingVisible });
        if (becomingVisible) set({ activeChat: null });
      },
      handleToggleStarredMessagesView: () => {
        const becomingVisible = !get().showStarredMessagesView;
        get().resetAllSecondaryViews();
        set({ showStarredMessagesView: becomingVisible });
        if (becomingVisible) set({ activeChat: null });
      },
      handleToggleMediaGalleryView: () => {
        const becomingVisible = !get().showMediaGalleryView;
        get().resetAllSecondaryViews(); 
        set({ showMediaGalleryView: becomingVisible });
      },

      // Updated Chat Management Actions
      handleSelectChat: (chat) => { // Removed UI params
        const chatMessages = get().messages[chat.id] || [];
        set({ activeChat: { ...chat, messages: chatMessages } });
        set({ showNewChatView: false, showContactInfoPanel: false }); // Internal UI state update

        const currentShowArchivedView = get().showArchivedView;
        if ((!chat.isArchived && !currentShowArchivedView) || (chat.isArchived && currentShowArchivedView)) {
          if (chat.unreadCount && chat.unreadCount > 0) {
            set(state => ({
              allChats: state.allChats.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c)
            }));
          }
        }
      },

      handleSendMessage: (chatId, messageContent) => { // Removed UI params
        const activeChat = get().activeChat;
        if (!activeChat || activeChat.id !== chatId) return;
        if (activeChat.isBlocked) {
            alert("Não pode enviar mensagens para um contacto bloqueado.");
            return;
        }
        if (!messageContent.text && !messageContent.imageUrl && !messageContent.fileName && !messageContent.audioUrl && !messageContent.videoUrl) {
          console.error("Attempted to send an empty message.");
          return;
        }

        const newMessage: Message = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          text: messageContent.text, imageUrl: messageContent.imageUrl, fileName: messageContent.fileName,
          audioUrl: messageContent.audioUrl, videoUrl: messageContent.videoUrl, duration: messageContent.duration,
          mediaType: messageContent.mediaType, timestamp: Date.now(), senderId: get().currentUserId,
          type: 'outgoing', status: 'pending', replyToMessageId: messageContent.replyToMessageId,
          replyToMessagePreview: messageContent.replyToMessagePreview, replyToSenderName: messageContent.replyToSenderName,
        };

        set(state => ({
          activeChat: state.activeChat ? { ...state.activeChat, messages: [...state.activeChat.messages, newMessage] } : null,
          messages: { ...state.messages, [chatId]: [...(state.messages[chatId] || []), newMessage] },
        }));
        
        let chatWasArchived = false;
        const currentShowArchivedView = get().showArchivedView;
        set(state => ({
            allChats: state.allChats.map(c => 
                c.id === chatId ? 
                (chatWasArchived = !!c.isArchived, { ...c, lastMessage: newMessage, lastActivity: newMessage.timestamp, isArchived: false, unreadCount: 0 }) : 
                c
            ).sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0))
        }));

        if (chatWasArchived && currentShowArchivedView) {
            set({ showArchivedView: false }); // Update internal UI state
        }

        setTimeout(() => {
          const updateMessageStatus = (chatIdToUpdate: string, messageIdToUpdate: string, newStatus: MessageStatus) => {
            set(state => {
              const chatMsgs = state.messages[chatIdToUpdate] || [];
              const updatedMessagesForChat = chatMsgs.map(msg =>
                msg.id === messageIdToUpdate ? { ...msg, status: newStatus } : msg
              );
              
              const newActiveChat = (state.activeChat && state.activeChat.id === chatIdToUpdate)
                ? { ...state.activeChat, messages: state.activeChat.messages.map(msg => msg.id === messageIdToUpdate ? { ...msg, status: newStatus } : msg )}
                : state.activeChat;

              const newAllChats = state.allChats.map(c => 
                (c.id === chatIdToUpdate && c.lastMessage?.id === messageIdToUpdate) ? 
                { ...c, lastMessage: { ...c.lastMessage, status: newStatus } } : c
              );

              return { messages: { ...state.messages, [chatIdToUpdate]: updatedMessagesForChat }, activeChat: newActiveChat, allChats: newAllChats };
            });
          };
          updateMessageStatus(chatId, newMessage.id, 'sent');
        }, 1500);
      },
      
      toggleArchiveChatStatus: (chatId) => { // Removed UI params
        if (get().viewingContactInfoFor?.id === chatId) { 
          set({ viewingContactInfoFor: null });
        }
        let chatIsNowArchived = false;
        set(state => ({
            allChats: state.allChats.map(c => 
                c.id === chatId ? 
                (chatIsNowArchived = !c.isArchived, {...c, isArchived: chatIsNowArchived}) : 
                c 
            ).sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0))
        }));

        if (get().activeChat?.id === chatId) set({ activeChat: null });
        
        const stillHaveArchivedChatsAfterToggle = get().allChats.some(c => c.id !== chatId ? c.isArchived : chatIsNowArchived);
        const currentShowArchivedView = get().showArchivedView;
        if (currentShowArchivedView && !stillHaveArchivedChatsAfterToggle) {
            set({ showArchivedView: false }); // Update internal UI state
        }
      },

      toggleMuteChat: (chatId: string) => {
        set(state => ({
          allChats: state.allChats.map(chat => chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat ),
          activeChat: state.activeChat?.id === chatId ? { ...state.activeChat, isMuted: !state.activeChat.isMuted } : state.activeChat,
          viewingContactInfoFor: state.viewingContactInfoFor?.id === chatId ? { ...state.viewingContactInfoFor, isMuted: !state.viewingContactInfoFor.isMuted } : state.viewingContactInfoFor,
        }));
      },

      handleToggleBlockChat: (chatId: string) => {
        let isNowBlocked = false;
        set(state => ({
          allChats: state.allChats.map(chat => {
            if (chat.id === chatId && chat.type === 'user') {
              isNowBlocked = !chat.isBlocked;
              return { ...chat, isBlocked: isNowBlocked };
            }
            return chat;
          }),
          activeChat: (state.activeChat?.id === chatId && state.activeChat.type === 'user') ? { ...state.activeChat, isBlocked: isNowBlocked } : state.activeChat,
          viewingContactInfoFor: (state.viewingContactInfoFor?.id === chatId && state.viewingContactInfoFor.type === 'user') ? { ...state.viewingContactInfoFor, isBlocked: isNowBlocked } : state.viewingContactInfoFor,
        }));
      },

      handleDeleteChat: (chatId) => { // Removed UI params
        console.log(`A apagar chat: ${chatId}`);
        const chatsAfterDelete = get().allChats.filter(chat => chat.id !== chatId);
        set(state => {
            const newMessages = { ...state.messages };
            delete newMessages[chatId];
            return {
                allChats: chatsAfterDelete,
                messages: newMessages,
                activeChat: state.activeChat?.id === chatId ? null : state.activeChat,
                viewingContactInfoFor: state.viewingContactInfoFor?.id === chatId ? null : state.viewingContactInfoFor,
            }
        });
        const remainingArchived = chatsAfterDelete.filter(c => c.isArchived);
        const currentShowArchivedView = get().showArchivedView;
        if (currentShowArchivedView && remainingArchived.length === 0) {
            set({ showArchivedView: false }); // Update internal UI state
        }
      },

      handleExitGroup: (chatId) => { // Removed UI params
        console.log(`A sair do grupo: ${chatId}`);
        get().handleDeleteChat(chatId); // Call updated handleDeleteChat
      },

      handleStartNewChat: (contact) => { // Removed UI params
        const existingChat = get().allChats.find(c => c.type === 'user' && c.participants?.some(p => p.id === contact.id));
        let chatToSelect: Chat;

        if (existingChat) { 
            chatToSelect = existingChat;
        } else {
          const newChatId = contact.id;
          const newChatData: Chat = {
            id: newChatId, type: 'user', name: contact.name, avatarUrl: contact.avatarUrl,
            lastMessage: undefined, unreadCount: 0, lastActivity: Date.now(),
            isArchived: false, isMuted: false, isBlocked: false, 
            participants: [mockUsers[get().currentUserId], contact],
          };
          set(state => ({
              allChats: [newChatData, ...state.allChats].sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0)),
              messages: { ...state.messages, [newChatId]: [] }
          }));
          chatToSelect = newChatData;
        }
        const chatMessages = get().messages[chatToSelect.id] || [];
        set({ activeChat: { ...chatToSelect, messages: chatMessages } });
        set({ showNewChatView: false, showContactInfoPanel: false }); // Update internal UI state
      },

      handleCreateGroup: (groupName, selectedContactIds) => { // Removed UI params
        set({ isCreatingGroup: true });
        const newGroupId = `group-${Date.now()}`;
        const currentUser = mockUsers[get().currentUserId];
        const selectedUsers = selectedContactIds.map(id => mockUsers[id]).filter(Boolean) as User[];
        
        if (!currentUser) {
          console.error("Current user not found for group creation.");
          set({ isCreatingGroup: false });
          return;
        }
        const participants = [currentUser, ...selectedUsers];
        const newGroupChat: Chat = {
          id: newGroupId, type: 'group', name: groupName,
          avatarUrl: `https://placehold.co/100x100/CCCCCC/000000?text=${groupName.substring(0,2).toUpperCase()}`,
          participants: participants, lastMessage: undefined, unreadCount: 0,
          lastActivity: Date.now(), isArchived: false, isMuted: false,
        };

        setTimeout(() => {
          set(state => ({
              allChats: [newGroupChat, ...state.allChats].sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0)),
              messages: { ...state.messages, [newGroupId]: [] },
              activeChat: { ...newGroupChat, messages: [] }, 
              viewingContactInfoFor: null,
              isCreatingGroup: false,
              showCreateGroupView: false, // Update internal UI state
          }));
        }, 2000);
      },
      
      handleClearChatMessages: (chatId: string) => {
        set(state => ({
          messages: { ...state.messages, [chatId]: [] },
          activeChat: (state.activeChat && state.activeChat.id === chatId) ? { ...state.activeChat, messages: [] } : state.activeChat,
          allChats: state.allChats.map(c => c.id === chatId ? { ...c, lastMessage: undefined } : c)
        }));
      },

      handleForwardMessage: (originalMessage, targetChatIds) => {
        const timestamp = Date.now();
        targetChatIds.forEach(chatId => {
          const targetChat = get().allChats.find(c => c.id === chatId);
          if (!targetChat) return;

          const forwardedMessageContent = {
            text: originalMessage.text, imageUrl: originalMessage.imageUrl,
            audioUrl: originalMessage.audioUrl, videoUrl: originalMessage.videoUrl,
            fileName: originalMessage.fileName, duration: originalMessage.duration,
            mediaType: originalMessage.mediaType,
          };

          const newMessage: Message = {
            ...forwardedMessageContent,
            id: `msg-${timestamp}-${Math.random().toString(36).substring(2, 9)}-fwdto-${chatId}`,
            timestamp: timestamp, senderId: get().currentUserId, type: 'outgoing',
            status: 'sent', isForwarded: true, replyToMessageId: undefined, 
            replyToMessagePreview: undefined, replyToSenderName: undefined,
          };

          set(state => ({
            messages: { ...state.messages, [chatId]: [...(state.messages[chatId] || []), newMessage] },
          }));

          set(state => ({
            allChats: state.allChats.map(c => {
              if (c.id === chatId) {
                const originallyArchived = !!c.isArchived;
                const isTargetActive = c.id === state.activeChat?.id;
                return {
                  ...c, lastMessage: newMessage, lastActivity: timestamp,
                  isArchived: (originallyArchived && !isTargetActive) ? true : false,
                  unreadCount: isTargetActive ? 0 : (c.unreadCount || 0) + 1,
                };
              }
              return c;
            }).sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0))
          }));
        });
      },

      handleToggleStarMessage: (messageId: string) => {
        set(state => {
          const updatedMessages: { [chatId: string]: Message[] } = {};
          for (const chatId in state.messages) {
            updatedMessages[chatId] = state.messages[chatId].map(msg => 
              msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
            );
          }
          
          const newActiveChat = (state.activeChat && state.activeChat.messages.some(msg => msg.id === messageId))
            ? { ...state.activeChat, messages: state.activeChat.messages.map(msg => msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg )}
            : state.activeChat;

          const newAllChats = state.allChats.map(chat => 
            (chat.lastMessage?.id === messageId) ? 
            { ...chat, lastMessage: { ...chat.lastMessage, isStarred: !chat.lastMessage.isStarred } } : chat
          );
          
          return { messages: updatedMessages, activeChat: newActiveChat, allChats: newAllChats };
        });
      },
    }),
    {
      name: 'whatsapp-store', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        // Only persist these keys
        allChats: state.allChats,
        messages: state.messages,
        currentUserId: state.currentUserId,
      }),
      // Don't persist temporary UI state or computed values
    }
  )
);

// Performance optimization: Create selectors for frequently accessed state
export const useActiveChat = () => useStore((state) => state.activeChat);
export const useMessages = (chatId: string) => useStore((state) => state.messages[chatId] || []);
export const useCurrentUserId = () => useStore((state) => state.currentUserId);
export const useFilteredChats = () => useStore((state) => state.currentFilteredChats());
export const useChatViewState = () => useStore((state) => ({
  showArchivedView: state.showArchivedView,
  showNewChatView: state.showNewChatView,
  showCreateGroupView: state.showCreateGroupView,
  showStarredMessagesView: state.showStarredMessagesView,
  showMediaGalleryView: state.showMediaGalleryView,
  showContactInfoPanel: state.showContactInfoPanel,
  searchTerm: state.searchTerm,
}));

export default useStore; 