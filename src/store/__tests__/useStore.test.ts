import { beforeEach, describe, expect, it } from 'vitest';
import useStore from '../useStore';
import { mockUsers, initialMockChats, initialMockMessages } from '../../mockData';

describe('useStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useStore.setState({
      allChats: initialMockChats,
      activeChat: null,
      messages: initialMockMessages,
      currentUserId: 'currentUser',
      viewingContactInfoFor: null,
      isCreatingGroup: false,
      showArchivedView: false,
      searchTerm: '',
      showNewChatView: false,
      showContactInfoPanel: false,
      showCreateGroupView: false,
      showStarredMessagesView: false,
      showMediaGalleryView: false,
    });
  });

  describe('Chat Management', () => {
    it('should select a chat correctly', () => {
      const chat = initialMockChats[0];
      const { handleSelectChat } = useStore.getState();
      
      handleSelectChat(chat);
      
      const { activeChat } = useStore.getState();
      expect(activeChat).toBeTruthy();
      expect(activeChat?.id).toBe(chat.id);
      expect(activeChat?.messages).toBeDefined();
    });

    it('should send a message correctly', () => {
      const chat = initialMockChats[0];
      const { handleSelectChat, handleSendMessage } = useStore.getState();
      
      handleSelectChat(chat);
      handleSendMessage(chat.id, { text: 'Test message' });
      
      const { messages } = useStore.getState();
      const chatMessages = messages[chat.id];
      expect(chatMessages).toBeDefined();
      expect(chatMessages[chatMessages.length - 1].text).toBe('Test message');
      expect(chatMessages[chatMessages.length - 1].type).toBe('outgoing');
    });

    it('should not send message to blocked chat', () => {
      const chat = { ...initialMockChats[0], isBlocked: true };
      const { handleSelectChat, handleSendMessage } = useStore.getState();
      
      handleSelectChat(chat);
      handleSendMessage(chat.id, { text: 'Test message' });
      
      const { messages } = useStore.getState();
      const chatMessages = messages[chat.id] || [];
      expect(chatMessages.length).toBe(0);
    });
  });

  describe('UI State Management', () => {
    it('should toggle archived view correctly', () => {
      const { handleToggleArchivedView } = useStore.getState();
      
      handleToggleArchivedView();
      
      const { showArchivedView, activeChat } = useStore.getState();
      expect(showArchivedView).toBe(true);
      expect(activeChat).toBeNull();
    });

    it('should reset secondary views correctly', () => {
      const { handleToggleArchivedView, resetAllSecondaryViews } = useStore.getState();
      
      handleToggleArchivedView();
      expect(useStore.getState().showArchivedView).toBe(true);
      
      resetAllSecondaryViews();
      
      const state = useStore.getState();
      expect(state.showArchivedView).toBe(false);
      expect(state.showNewChatView).toBe(false);
      expect(state.showCreateGroupView).toBe(false);
      expect(state.showStarredMessagesView).toBe(false);
      expect(state.showMediaGalleryView).toBe(false);
    });
  });

  describe('Derived States', () => {
    it('should filter active chats correctly', () => {
      const { activeUserChats } = useStore.getState();
      const filteredChats = activeUserChats();
      
      expect(filteredChats.every(chat => !chat.isArchived)).toBe(true);
    });

    it('should filter archived chats correctly', () => {
      const { archivedUserChats } = useStore.getState();
      const filteredChats = archivedUserChats();
      
      expect(filteredChats.every(chat => chat.isArchived)).toBe(true);
    });

    it('should count unread archived messages correctly', () => {
      useStore.setState({
        allChats: [
          { ...initialMockChats[0], isArchived: true, unreadCount: 2 },
          { ...initialMockChats[1], isArchived: true, unreadCount: 3 },
        ],
      });

      const { unreadInArchivedCount } = useStore.getState();
      expect(unreadInArchivedCount()).toBe(2);
    });
  });
}); 