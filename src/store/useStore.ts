import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import type { Chat, ActiveChat, Message, User, MessageStatus } from '../types';
import { mockUsers, initialMockChats as originalInitialMockChats, initialMockMessages } from '../mockData';

// Adjust initialMockChats to conform to Chat[] by adding messages and handling unreadCount
const initialMockChats: Chat[] = originalInitialMockChats.map((chatOmitted, index) => ({
  ...(chatOmitted as Omit<Chat, 'messages' | 'lastMessage' | 'lastActivity' | 'isArchived' | 'isMuted' | 'isPinned' | 'isMarkedUnread' | 'typingUserIds'>),
  id: chatOmitted.id,
  type: chatOmitted.type,
  name: chatOmitted.name,
  avatarUrl: chatOmitted.avatarUrl,
  participants: chatOmitted.participants,
  groupAdmins: chatOmitted.groupAdmins,
  createdBy: chatOmitted.createdBy,
  description: chatOmitted.description,
  isBlocked: chatOmitted.isBlocked,
  messages: [], // Add empty messages array to satisfy Chat type
  lastMessage: null, // Initialize appropriately
  lastActivity: Date.now() - Math.random() * 100000000, // Example, replace with actual logic if needed
  unreadCount: index === 2 ? 1 : 0, // Provide a default for unreadCount
  isPinned: index < 2,
  isMarkedUnread: index === 2,
  isArchived: false, // Default value
  isMuted: false, // Default value
  typingUserIds: [], // Default value
}));

interface ConfirmationDialogConfigState {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void; // This will be wrapped by the store action
  onCancelAction?: () => void; // Optional action to run on explicit cancel, besides closing
  isDestructive?: boolean;
  confirmButtonVariant?: 'primary' | 'danger' | 'success' | 'warning';
  hideCancelButton?: boolean;
}

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
  currentFilteredChats: () => Chat[];

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
  
  resetAllSecondaryViews: () => void;

  handleToggleArchivedView: () => void;
  handleToggleNewChatView: () => void;
  handleToggleCreateGroupView: () => void;
  handleToggleStarredMessagesView: () => void;
  handleToggleMediaGalleryView: () => void;

  // More complex actions
  handleSelectChat: (chat: Chat) => void;
  handleSendMessage: (chatId: string, messageContent: {
    text?: string; imageUrl?: string; fileName?: string; audioUrl?: string; videoUrl?: string;
    duration?: number; mediaType?: 'image' | 'document' | 'audio' | 'video';
    replyToMessageId?: string; replyToMessagePreview?: string; replyToSenderName?: string;
  }) => void;
  toggleArchiveChatStatus: (chatId: string) => void;
  toggleMuteChat: (chatId: string) => void;
  handleToggleBlockChat: (chatId: string) => void;
  handleDeleteChat: (chatId: string) => void;
  handleExitGroup: (chatId: string) => void;
  handleStartNewChat: (contact: User) => void;
  handleCreateGroup: (groupName: string, selectedContactIds: string[]) => void;
  handleClearChatMessages: (chatId: string) => void;
  handleForwardMessage: (originalMessage: Message, targetChatIds: string[]) => void;
  handleToggleStarMessage: (messageId: string) => void;
  togglePinChat: (chatId: string) => void;
  toggleMarkUnread: (chatId: string) => void;
  startTyping: (chatId: string, userId: string) => void;
  stopTyping: (chatId: string, userId: string) => void;
  updateGroupDescription: (chatId: string, newDescription: string) => void;
  addParticipantsToGroup: (chatId: string, userIdsToAdd: string[]) => void;
  removeParticipantFromGroup: (chatId: string, userIdToRemove: string) => void;
  promoteParticipantToAdmin: (chatId: string, userIdToPromote: string) => void;
  demoteAdminToParticipant: (chatId: string, userIdToDemote: string) => void;
  updateGroupNameAndDescription: (chatId: string, newName: string | undefined, newDescription: string | undefined) => void;
  updateGroupAvatar: (chatId: string, newAvatarUrl: string) => void;

  confirmationDialog: ConfirmationDialogConfigState | null;

  showConfirmationDialog: (config: Omit<ConfirmationDialogConfigState, 'isOpen' | 'onCancelAction'> & { onConfirm: () => void; onCancelAction?: () => void }) => void;
  hideConfirmationDialog: () => void;
  confirmConfirmationDialog: () => void;
}

// Create the store with persistence
const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Chat Management State
      allChats: initialMockChats, // Use the corrected initialMockChats
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
        const { 
          searchTerm, 
          showNewChatView, 
          showCreateGroupView, 
          showStarredMessagesView, 
          showMediaGalleryView, 
          showArchivedView, 
          archivedUserChats, // This already returns Chat[] sorted by lastActivity implicitly by allChats sort
          // activeUserChats // We'll call this and then further process for pinning
        } = get();

        const listToDisplayInitially = (() => {
            if (showArchivedView) return archivedUserChats(); // Archived chats are not affected by pinning in this logic
            if (showNewChatView) return []; 
            if (showCreateGroupView) return []; 
            if (showStarredMessagesView) return [];
            if (showMediaGalleryView) return [];
            
            // Process active chats for pinning
            const activeChats = get().allChats.filter(chat => !chat.isArchived);
            const pinnedChats = activeChats
              .filter(chat => chat.isPinned)
              .sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
            const otherActiveChats = activeChats
              .filter(chat => !chat.isPinned)
              .sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
            
            return [...pinnedChats, ...otherActiveChats];
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

      handleStartNewChat: (contact) => {
        const existingChat = get().allChats.find(chat => 
          chat.type === 'user' && chat.participants?.some(p => p.id === contact.id)
        );
        if (existingChat) {
          get().handleSelectChat(existingChat);
          return;
        }

        const newChat: Chat = {
          id: `chat-${Date.now()}-${contact.id}`,
          type: 'user',
          name: contact.name,
          avatarUrl: contact.avatarUrl,
          participants: [mockUsers[get().currentUserId], contact],
          messages: [], // Initialize with empty messages array
          lastMessage: null,
          unreadCount: 0,
          lastActivity: Date.now(),
          isArchived: false,
          isMuted: false,
          isPinned: false,
          isMarkedUnread: false,
          isBlocked: false,
        };
        set(state => ({
          allChats: [newChat, ...state.allChats].sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0))
        }));
        get().handleSelectChat(newChat);
        get().resetAllSecondaryViews();
      },

      handleCreateGroup: (groupName, selectedContactIds) => {
        if (!groupName.trim() || selectedContactIds.length === 0) return;

        const currentUser = mockUsers[get().currentUserId];
        const selectedUsers = selectedContactIds.map(id => mockUsers[id]).filter(Boolean);
        const participants = [currentUser, ...selectedUsers];

        const newGroupChat: Chat = {
          id: `group-${Date.now()}`,
          type: 'group',
          name: groupName,
          avatarUrl: 'https://placehold.co/50x50/3498DB/FFFFFF?text=G', // Placeholder group avatar
          participants: participants,
          messages: [], // Initialize with empty messages array
          lastMessage: null,
          unreadCount: 0,
          lastActivity: Date.now(),
          isArchived: false,
          isMuted: false,
          isPinned: false,
          isMarkedUnread: false,
          groupAdmins: [get().currentUserId],
          createdBy: get().currentUserId,
        };

        set(state => ({
          allChats: [newGroupChat, ...state.allChats].sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0)),
          isCreatingGroup: false, // Reset flag after creation
        }));
        get().handleSelectChat(newGroupChat);
        get().resetAllSecondaryViews(); 
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
        set(produce((state: AppState) => {
          // Find which chat the message belongs to first
          let chatIdToUpdate: string | null = null;
          let messageIndexInChat: number = -1;

          // Check activeChat first, as it's a common case
          if (state.activeChat && state.messages[state.activeChat.id]) {
            const msgIdx = state.messages[state.activeChat.id].findIndex(m => m.id === messageId);
            if (msgIdx !== -1) {
              chatIdToUpdate = state.activeChat.id;
              messageIndexInChat = msgIdx;
            }
          }

          // If not found in activeChat's messages, search all chats' messages
          // This is important if the action is triggered from a context outside the active chat (e.g., global search results later)
          if (!chatIdToUpdate) {
            for (const id in state.messages) {
              const msgIdx = state.messages[id].findIndex(m => m.id === messageId);
              if (msgIdx !== -1) {
                chatIdToUpdate = id;
                messageIndexInChat = msgIdx;
                break;
              }
            }
          }
          
          if (chatIdToUpdate && messageIndexInChat !== -1) {
            const targetMessage = state.messages[chatIdToUpdate][messageIndexInChat];
            targetMessage.isStarred = !targetMessage.isStarred;

            // If the updated message is in the active chat, update activeChat.messages as well
            if (state.activeChat && state.activeChat.id === chatIdToUpdate) {
              const activeMsgIdx = state.activeChat.messages.findIndex(m => m.id === messageId);
              if (activeMsgIdx !== -1) {
                state.activeChat.messages[activeMsgIdx].isStarred = targetMessage.isStarred;
              }
            }
            // No need to update allChats unless isStarred affects sorting or lastMessage display,
            // which it currently doesn't seem to.
          } else {
            console.warn(`handleToggleStarMessage: Message with ID ${messageId} not found in any chat.`);
          }
        }));
      },

      // Pinning and Marking Unread
      togglePinChat: (chatId) => {
        set(produce((state: AppState) => {
          const chatIndex = state.allChats.findIndex(c => c.id === chatId);
          if (chatIndex !== -1) {
            state.allChats[chatIndex].isPinned = !state.allChats[chatIndex].isPinned;
          }
          // Re-sorting or relying on the getter to re-sort will be handled by currentFilteredChats
        }));
      },
      toggleMarkUnread: (chatId) => {
        set(produce((state: AppState) => {
          const chatIndex = state.allChats.findIndex(c => c.id === chatId);
          if (chatIndex !== -1) {
            state.allChats[chatIndex].isMarkedUnread = !state.allChats[chatIndex].isMarkedUnread;
            if (state.allChats[chatIndex].isMarkedUnread && (state.allChats[chatIndex].unreadCount || 0) === 0) {
              // Visual cue, actual count is separate
            } else if (!state.allChats[chatIndex].isMarkedUnread) {
              state.allChats[chatIndex].unreadCount = 0;
            }
          }
        }));
      },

      // Typing Indicators
      startTyping: (chatId, userId) => {
        console.log(`${userId} started typing in ${chatId}`);
      },
      stopTyping: (chatId, userId) => {
        console.log(`${userId} stopped typing in ${chatId}`);
      },

      // Update Group Description
      updateGroupDescription: (chatId, newDescription) => {
        set(produce((state: AppState) => {
          const chatIndex = state.allChats.findIndex(c => c.id === chatId && c.type === 'group');
          if (chatIndex !== -1) {
            state.allChats[chatIndex].description = newDescription;
            if (state.activeChat && state.activeChat.id === chatId) {
              state.activeChat.description = newDescription;
            }
            if (state.viewingContactInfoFor && state.viewingContactInfoFor.id === chatId) {
              state.viewingContactInfoFor.description = newDescription;
            }
          }
        }));
      },

      // New action implementation
      addParticipantsToGroup: (chatId, userIdsToAdd) => {
        set(produce((state: AppState) => {
          const chatIndex = state.allChats.findIndex(c => c.id === chatId && c.type === 'group');
          if (chatIndex !== -1) {
            const groupChat = state.allChats[chatIndex];
            const existingParticipantIds = groupChat.participants?.map(p => p.id) || [];
            const usersToAddObjects = userIdsToAdd
              .filter(id => !existingParticipantIds.includes(id))
              .map(id => mockUsers[id])
              .filter(Boolean) as User[];
            if (usersToAddObjects.length > 0) {
              groupChat.participants = [...(groupChat.participants || []), ...usersToAddObjects];
              if (state.activeChat && state.activeChat.id === chatId) {
                state.activeChat.participants = groupChat.participants;
              }
              if (state.viewingContactInfoFor && state.viewingContactInfoFor.id === chatId) {
                state.viewingContactInfoFor.participants = groupChat.participants;
              }
            }
          }
        }));
      },

      // New action implementation
      removeParticipantFromGroup: (chatId, userIdToRemove) => {
        set(produce((state: AppState) => {
          const chatIndex = state.allChats.findIndex(c => c.id === chatId && c.type === 'group');
          if (chatIndex !== -1) {
            const groupChat = state.allChats[chatIndex];
            
            // Remove from participants list
            const updatedParticipants = groupChat.participants?.filter(p => p.id !== userIdToRemove) || [];
            groupChat.participants = updatedParticipants;

            // Remove from admins list if present
            if (groupChat.groupAdmins?.includes(userIdToRemove)) {
              groupChat.groupAdmins = groupChat.groupAdmins.filter(adminId => adminId !== userIdToRemove);
            }

            // Also update activeChat and viewingContactInfoFor if they are this group
            if (state.activeChat && state.activeChat.id === chatId) {
              state.activeChat.participants = updatedParticipants;
              state.activeChat.groupAdmins = groupChat.groupAdmins;
            }
            if (state.viewingContactInfoFor && state.viewingContactInfoFor.id === chatId) {
              state.viewingContactInfoFor.participants = updatedParticipants;
              state.viewingContactInfoFor.groupAdmins = groupChat.groupAdmins;
            }
            
             if (updatedParticipants.length === 0) {
                console.warn(`Group ${chatId} has no participants left after removal.`);
             }
          }
        }));
      },

      promoteParticipantToAdmin: (chatId, userIdToPromote) => {
        set(produce((state: AppState) => {
          const chatIndex = state.allChats.findIndex(c => c.id === chatId && c.type === 'group');
          if (chatIndex === -1) return;

          const groupChat = state.allChats[chatIndex];
          const isParticipant = groupChat.participants?.some(p => p.id === userIdToPromote);
          const alreadyAdmin = groupChat.groupAdmins?.includes(userIdToPromote);

          if (isParticipant && !alreadyAdmin) {
            groupChat.groupAdmins = [...(groupChat.groupAdmins || []), userIdToPromote];

            if (state.activeChat && state.activeChat.id === chatId) {
              state.activeChat.groupAdmins = groupChat.groupAdmins;
            }
            if (state.viewingContactInfoFor && state.viewingContactInfoFor.id === chatId) {
              state.viewingContactInfoFor.groupAdmins = groupChat.groupAdmins;
            }
          }
        }));
      },

      demoteAdminToParticipant: (chatId, userIdToDemote) => {
        set(produce((state: AppState) => {
          const currentUserId = get().currentUserId;
          if (userIdToDemote === currentUserId) {
            console.warn("User cannot demote themselves via this action.");
            return;
          }

          const chatIndex = state.allChats.findIndex(c => c.id === chatId && c.type === 'group');
          if (chatIndex === -1) return;

          const groupChat = state.allChats[chatIndex];
          if (!groupChat.groupAdmins?.includes(userIdToDemote)) return;

          if (groupChat.groupAdmins.length === 1 && groupChat.groupAdmins[0] === userIdToDemote) {
            console.warn(`Demoting the last admin (${userIdToDemote}) of group ${chatId}.`);
          }

          groupChat.groupAdmins = groupChat.groupAdmins.filter(adminId => adminId !== userIdToDemote);

          if (state.activeChat && state.activeChat.id === chatId) {
            state.activeChat.groupAdmins = groupChat.groupAdmins;
          }
          if (state.viewingContactInfoFor && state.viewingContactInfoFor.id === chatId) {
            state.viewingContactInfoFor.groupAdmins = groupChat.groupAdmins;
          }
        }));
      },

      updateGroupNameAndDescription: (chatId, newName, newDescription) => {
        set(produce((state: AppState) => {
          const chatIndex = state.allChats.findIndex(c => c.id === chatId && c.type === 'group');
          if (chatIndex !== -1) {
            if (newName !== undefined) {
              state.allChats[chatIndex].name = newName;
            }
            if (newDescription !== undefined) {
              state.allChats[chatIndex].description = newDescription;
            }
            
            if (state.activeChat && state.activeChat.id === chatId) {
              if (newName !== undefined) state.activeChat.name = newName;
              if (newDescription !== undefined) state.activeChat.description = newDescription;
            }
            if (state.viewingContactInfoFor && state.viewingContactInfoFor.id === chatId) {
              if (newName !== undefined) state.viewingContactInfoFor.name = newName;
              if (newDescription !== undefined) state.viewingContactInfoFor.description = newDescription;
            }
          }
        }));
      },

      updateGroupAvatar: (chatId, newAvatarUrl) => {
        set(produce((state: AppState) => {
          const chatIndex = state.allChats.findIndex(c => c.id === chatId && c.type === 'group');
          if (chatIndex !== -1) {
            state.allChats[chatIndex].avatarUrl = newAvatarUrl;
            if (state.activeChat && state.activeChat.id === chatId) {
              state.activeChat.avatarUrl = newAvatarUrl;
            }
            if (state.viewingContactInfoFor && state.viewingContactInfoFor.id === chatId) {
              state.viewingContactInfoFor.avatarUrl = newAvatarUrl;
            }
          }
        }));
      },

      confirmationDialog: null,

      showConfirmationDialog: (config) => {
        set({
          confirmationDialog: {
            ...config,
            isOpen: true,
            // onConfirm is already part of config
          }
        });
      },

      hideConfirmationDialog: () => {
        const currentDialog = get().confirmationDialog;
        if (currentDialog && currentDialog.onCancelAction) {
          currentDialog.onCancelAction();
        }
        set({ confirmationDialog: null });
      },

      confirmConfirmationDialog: () => {
        const currentDialog = get().confirmationDialog;
        if (currentDialog && currentDialog.onConfirm) {
          currentDialog.onConfirm();
        }
        set({ confirmationDialog: null }); // Hide after confirm
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

// --- Typing Simulation ---
// This is a simple mock simulation for demonstration purposes.
// In a real app, this would be driven by WebSocket events.
let typingIntervals: Record<string, number> = {};
const SIMULATE_TYPING = true; // Set to false to disable

if (SIMULATE_TYPING) {
  const setupTypingSimulation = () => {
    const storeState = useStore.getState();
    const nonArchivedChats = storeState.allChats.filter(c => !c.isArchived);
    const currentUserId = storeState.currentUserId;

    // Clear any existing intervals
    Object.values(typingIntervals).forEach(clearInterval);
    typingIntervals = {};

    nonArchivedChats.forEach(chat => {
      // Participants excluding the current user
      const otherParticipants = chat.participants?.filter(p => p.id !== currentUserId) || [];
      
      if (otherParticipants.length > 0) {
        typingIntervals[chat.id] = setInterval(() => {
          const store = useStore.getState(); // Get fresh state
          const chatStillExists = store.allChats.find(c => c.id === chat.id);
          if (!chatStillExists) {
            clearInterval(typingIntervals[chat.id]);
            delete typingIntervals[chat.id];
            return;
          }

          otherParticipants.forEach(participant => {
            // Randomly decide if this participant starts/stops typing
            if (Math.random() < 0.15) { // Chance to start typing
              if (!chatStillExists.typingUserIds?.includes(participant.id)) {
                console.log(`SIM: ${participant.name} starts typing in ${chat.name}`);
                store.startTyping(chat.id, participant.id);

                // Simulate typing for a few seconds, then stop
                setTimeout(() => {
                  const currentStore = useStore.getState();
                  const stillExistsAndTyping = currentStore.allChats.find(c=>c.id === chat.id)?.typingUserIds?.includes(participant.id);
                  if (stillExistsAndTyping) {
                    console.log(`SIM: ${participant.name} stops typing in ${chat.name}`);
                    currentStore.stopTyping(chat.id, participant.id);
                  }
                }, Math.random() * 4000 + 3000); // Typing for 3-7 seconds
              }
            } else if (Math.random() < 0.05) { // Smaller chance to randomly stop if already typing
                 if (chatStillExists.typingUserIds?.includes(participant.id)) {
                    console.log(`SIM: ${participant.name} (randomly) stops typing in ${chat.name}`);
                    store.stopTyping(chat.id, participant.id);
                 }
            }
          });
        }, 5000); // Check every 5 seconds for each chat
      }
    });
  };

  // Initial setup
  // Timeout to ensure store is initialized
  setTimeout(setupTypingSimulation, 3000); 

  // Optionally, re-run simulation setup if chats change significantly (e.g., after new chat)
  // This could be done by subscribing to store changes, but for simplicity, we'll keep it initial.
  // useStore.subscribe(state => state.allChats, setupTypingSimulation); // Example of subscription
}
// --- End Typing Simulation ---

export default useStore; 