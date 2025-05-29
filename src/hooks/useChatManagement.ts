import { useState } from 'react';
import type { Chat, ActiveChat, Message, User } from '../types';
import { mockUsers, initialMockChats, initialMockMessages } from '../mockData';

export const useChatManagement = () => {
  const [allChats, setAllChats] = useState<Chat[]>(initialMockChats);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>(initialMockMessages);
  const [currentUserId] = useState<string>('currentUser');
  const [viewingContactInfoFor, setViewingContactInfoFor] = useState<Chat | null>(null);

  const handleCloseContactInfo = () => { 
    setViewingContactInfoFor(null); 
  };

  const handleSelectChat = (
    chat: Chat, 
    currentShowArchivedView: boolean, 
    setShowContactInfoPanel: React.Dispatch<React.SetStateAction<boolean>>,
    setShowNewChatView: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const chatMessages = messages[chat.id] || [];
    setActiveChat({ ...chat, messages: chatMessages });
    setShowNewChatView(false); // UI concern, passed from App

    if ((!chat.isArchived && !currentShowArchivedView) || (chat.isArchived && currentShowArchivedView)) {
      if (chat.unreadCount && chat.unreadCount > 0) {
        setAllChats(prevChats => prevChats.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));
      }
    }
    setShowContactInfoPanel(false); // UI concern, passed from App
  };

  const handleSendMessage = (chatId: string, messageText: string, currentShowArchivedView: boolean, setShowArchivedView: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!activeChat || activeChat.id !== chatId) return;
    if (activeChat.isBlocked) {
        alert("Não pode enviar mensagens para um contacto bloqueado.");
        return;
    }
    const newMessage: Message = { id: `msg-${Date.now()}`, text: messageText, timestamp: Date.now(), senderId: currentUserId, type: 'outgoing', status: 'sent'};
    setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    setMessages(prevMsgs => ({ ...prevMsgs, [chatId]: [...(prevMsgs[chatId] || []), newMessage] }));
    let chatWasArchived = false;
    setAllChats(prevAllChats => 
        prevAllChats.map(c => 
            c.id === chatId ? 
            (chatWasArchived = !!c.isArchived, { ...c, lastMessage: newMessage, lastActivity: newMessage.timestamp, isArchived: false, unreadCount: 0 }) : 
            c
        ).sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0))
    );
    if (chatWasArchived && currentShowArchivedView) {
        setShowArchivedView(false); // UI concern, passed from App
    }
    // setTimeout(() => { /* mock response */ }, 1500);
  };

  const toggleArchiveChatStatus = (chatId: string, currentShowArchivedView: boolean, setShowArchivedView: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (viewingContactInfoFor?.id === chatId) { 
      handleCloseContactInfo(); // Uses hook's own setter for viewingContactInfoFor
    }
    let chatIsNowArchived = false;
    setAllChats(prev => 
        prev.map(c => 
            c.id === chatId ? 
            (chatIsNowArchived = !c.isArchived, {...c, isArchived: chatIsNowArchived}) : 
            c 
        ).sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0))
    );
    if (activeChat?.id === chatId) setActiveChat(null); // Use hook's own setter
    
    // This logic needs allChats, which might not be updated yet if setAllChats is async
    // Consider deriving this in App.tsx or passing updated allChats state
    const stillHaveArchivedChatsAfterToggle = allChats.some(c => c.id !== chatId ? c.isArchived : chatIsNowArchived);
    if (currentShowArchivedView && !stillHaveArchivedChatsAfterToggle) {
        setShowArchivedView(false); // UI concern, passed from App
    }
  };

  const toggleMuteChat = (chatId: string) => {
    setAllChats(prevChats => prevChats.map(chat => chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat ));
    if (activeChat?.id === chatId) { setActiveChat(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null); }
    if (viewingContactInfoFor?.id === chatId) { setViewingContactInfoFor(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null); }
  };

  const handleToggleBlockChat = (chatId: string) => {
    let isNowBlocked = false;
    setAllChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === chatId && chat.type === 'user') {
          isNowBlocked = !chat.isBlocked;
          return { ...chat, isBlocked: isNowBlocked };
        }
        return chat;
      })
    );
    if (activeChat?.id === chatId && activeChat.type === 'user') {
      setActiveChat(prev => prev ? { ...prev, isBlocked: isNowBlocked } : null);
    }
    if (viewingContactInfoFor?.id === chatId && viewingContactInfoFor.type === 'user') {
      setViewingContactInfoFor(prev => prev ? { ...prev, isBlocked: isNowBlocked } : null);
    }
  };

  const handleDeleteChat = (chatId: string, currentShowArchivedView: boolean, setShowArchivedView: React.Dispatch<React.SetStateAction<boolean>>) => {
    console.log(`A apagar chat: ${chatId}`);
    const chatsAfterDelete = allChats.filter(chat => chat.id !== chatId);
    setAllChats(chatsAfterDelete);
    setMessages(prevMessages => {
      const newMessages = { ...prevMessages };
      delete newMessages[chatId];
      return newMessages;
    });
    if (activeChat?.id === chatId) {
      setActiveChat(null); // Use hook's own setter
    }
    if (viewingContactInfoFor?.id === chatId) {
      handleCloseContactInfo(); // Use hook's own setter
    }
    const remainingArchived = chatsAfterDelete.filter(c => c.isArchived);
    if (currentShowArchivedView && remainingArchived.length === 0) {
        setShowArchivedView(false); // UI concern, passed from App
    }
  };

  const handleExitGroup = (chatId: string, currentShowArchivedView: boolean, setShowArchivedView: React.Dispatch<React.SetStateAction<boolean>>) => {
    console.log(`A sair do grupo: ${chatId}`);
    handleDeleteChat(chatId, currentShowArchivedView, setShowArchivedView);
  };

 const handleStartNewChat = (
    contact: User, 
    setShowNewChatView: React.Dispatch<React.SetStateAction<boolean>>, 
    setShowContactInfoPanel: React.Dispatch<React.SetStateAction<boolean>>
    // currentShowArchivedView is not directly used here for core logic, can be removed if only for handleSelectChat
 ) => {
    const existingChat = allChats.find(c => c.type === 'user' && c.participants?.some(p => p.id === contact.id));
    let chatToSelect: Chat;

    if (existingChat) { 
        chatToSelect = existingChat;
    } else {
      const newChatId = contact.id;
      const newChatData: Chat = {
        id: newChatId, type: 'user', name: contact.name, avatarUrl: contact.avatarUrl,
        lastMessage: undefined, unreadCount: 0, lastActivity: Date.now(),
        isArchived: false, isMuted: false, isBlocked: false, participants: [mockUsers[currentUserId], contact],
      };
      setAllChats(prev => [newChatData, ...prev].sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0)));
      setMessages(prev => ({ ...prev, [newChatId]: [] }));
      chatToSelect = newChatData;
    }
    // Select the chat (either existing or new)
    const chatMessages = messages[chatToSelect.id] || [];
    setActiveChat({ ...chatToSelect, messages: chatMessages });

    setShowNewChatView(false); // UI concern, passed from App
    setShowContactInfoPanel(false); // UI concern, passed from App
  };

  return {
    allChats,
    activeChat,
    setActiveChat, // Export setActiveChat directly
    messages,
    currentUserId,
    viewingContactInfoFor,
    setViewingContactInfoFor,
    handleSelectChat,
    handleSendMessage,
    toggleArchiveChatStatus,
    toggleMuteChat,
    handleToggleBlockChat,
    handleDeleteChat,
    handleExitGroup,
    handleStartNewChat,
    handleCloseContactInfo // Export this utility if App.tsx needs it directly
  };
};
