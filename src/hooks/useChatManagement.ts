import { useState, useMemo, useEffect } from 'react';
import type { Chat, ActiveChat, Message, User, MessageStatus } from '../types';
import { mockUsers, initialMockChats, initialMockMessages } from '../mockData';

export const useChatManagement = () => {
  const [allChats, setAllChats] = useState<Chat[]>(initialMockChats);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>(initialMockMessages);
  const [currentUserId] = useState<string>('currentUser');
  const [viewingContactInfoFor, setViewingContactInfoFor] = useState<Chat | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setIsCreatingGroup(false);
    };
  }, []);

  // Derived state for chat lists and counts
  const activeUserChats = useMemo(() => allChats.filter(chat => !chat.isArchived), [allChats]);
  const archivedUserChats = useMemo(() => allChats.filter(chat => chat.isArchived), [allChats]);
  const unreadInArchivedCount = useMemo(() => 
    archivedUserChats.filter(chat => (chat.unreadCount || 0) > 0).length
  , [archivedUserChats]);

  // Derived state for available contacts
  const availableContacts = useMemo(() => 
    Object.values(mockUsers).filter(user => user.id !== currentUserId)
  , [currentUserId]); // currentUserId is stable, but good practice to include dependency

  const handleCloseContactInfo = () => { 
    setViewingContactInfoFor(null); 
  };

  const handleClearChatMessages = (chatId: string) => {
    setMessages(prevMsgs => ({
      ...prevMsgs,
      [chatId]: []
    }));
    setActiveChat(prevActiveChat => {
      if (prevActiveChat && prevActiveChat.id === chatId) {
        return { ...prevActiveChat, messages: [] };
      }
      return prevActiveChat;
    });
    setAllChats(prevAllChats => 
      prevAllChats.map(c => 
          c.id === chatId ? 
          { ...c, lastMessage: undefined } : // Clear last message preview
          c
      )
    );
    // No need to change active chat or view based on this action alone.
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

  const handleSendMessage = (
    chatId: string, 
    messageContent: { 
      text?: string; 
      imageUrl?: string; 
      fileName?: string;
      audioUrl?: string;
      videoUrl?: string;
      duration?: number;
      mediaType?: 'image' | 'document' | 'audio' | 'video';
      replyToMessageId?: string;
      replyToMessagePreview?: string;
      replyToSenderName?: string;
    },
    currentShowArchivedView: boolean, 
    setShowArchivedView: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!activeChat || activeChat.id !== chatId) return;
    if (activeChat.isBlocked) {
        alert("Não pode enviar mensagens para um contacto bloqueado.");
        return;
    }

    // Ensure there's some content to send
    if (!messageContent.text && !messageContent.imageUrl && !messageContent.fileName && !messageContent.audioUrl && !messageContent.videoUrl) {
      console.error("Attempted to send an empty message.");
      return;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: messageContent.text,
      imageUrl: messageContent.imageUrl,
      fileName: messageContent.fileName,
      audioUrl: messageContent.audioUrl,
      videoUrl: messageContent.videoUrl,
      duration: messageContent.duration,
      mediaType: messageContent.mediaType,
      timestamp: Date.now(),
      senderId: currentUserId,
      type: 'outgoing',
      status: 'pending',
      replyToMessageId: messageContent.replyToMessageId,
      replyToMessagePreview: messageContent.replyToMessagePreview,
      replyToSenderName: messageContent.replyToSenderName,
    };

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
        setShowArchivedView(false);
    }

    setTimeout(() => {
      const updateMessageStatus = (chatIdToUpdate: string, messageIdToUpdate: string, newStatus: MessageStatus) => {
        setMessages(prevMsgs => {
          const chatMsgs = prevMsgs[chatIdToUpdate] || [];
          return {
            ...prevMsgs,
            [chatIdToUpdate]: chatMsgs.map(msg => 
              msg.id === messageIdToUpdate ? { ...msg, status: newStatus } : msg
            )
          };
        });
        setActiveChat(prevActive => {
          if (prevActive && prevActive.id === chatIdToUpdate) {
            return {
              ...prevActive,
              messages: prevActive.messages.map(msg => 
                msg.id === messageIdToUpdate ? { ...msg, status: newStatus } : msg
              )
            };
          }
          return prevActive;
        });
        setAllChats(prevAll => prevAll.map(c => {
          if (c.id === chatIdToUpdate && c.lastMessage?.id === messageIdToUpdate) {
            return { ...c, lastMessage: { ...c.lastMessage, status: newStatus } };
          }
          return c;
        }));
      };
      updateMessageStatus(chatId, newMessage.id, 'sent');
    }, 1500);
  };

  const toggleArchiveChatStatus = (chatId: string, currentShowArchivedView: boolean, setShowArchivedView: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (viewingContactInfoFor?.id === chatId) { 
      handleCloseContactInfo();
    }
    let chatIsNowArchived = false;
    setAllChats(prev => 
        prev.map(c => 
            c.id === chatId ? 
            (chatIsNowArchived = !c.isArchived, {...c, isArchived: chatIsNowArchived}) : 
            c 
        ).sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0))
    );
    if (activeChat?.id === chatId) setActiveChat(null);
    
    const stillHaveArchivedChatsAfterToggle = allChats.some(c => c.id !== chatId ? c.isArchived : chatIsNowArchived);
    if (currentShowArchivedView && !stillHaveArchivedChatsAfterToggle) {
        setShowArchivedView(false);
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
      setActiveChat(null);
    }
    if (viewingContactInfoFor?.id === chatId) {
      handleCloseContactInfo();
    }
    const remainingArchived = chatsAfterDelete.filter(c => c.isArchived);
    if (currentShowArchivedView && remainingArchived.length === 0) {
        setShowArchivedView(false);
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
    const chatMessages = messages[chatToSelect.id] || [];
    setActiveChat({ ...chatToSelect, messages: chatMessages });

    setShowNewChatView(false);
    setShowContactInfoPanel(false);
  };

  const handleCreateGroup = (
    groupName: string, 
    selectedContactIds: string[],
    setShowCreateGroupView: React.Dispatch<React.SetStateAction<boolean>>,
    setActiveChatHook: React.Dispatch<React.SetStateAction<ActiveChat | null>>
  ) => {
    setIsCreatingGroup(true);
    const newGroupId = `group-${Date.now()}`;
    const currentUser = mockUsers[currentUserId];
    const selectedUsers = selectedContactIds.map(id => mockUsers[id]).filter(Boolean) as User[];
    
    if (!currentUser) {
      console.error("Current user not found for group creation.");
      return;
    }

    const participants = [currentUser, ...selectedUsers];

    const newGroupChat: Chat = {
      id: newGroupId,
      type: 'group',
      name: groupName,
      avatarUrl: `https://placehold.co/100x100/CCCCCC/000000?text=${groupName.substring(0,2).toUpperCase()}`,
      participants: participants,
      lastMessage: undefined,
      unreadCount: 0,
      lastActivity: Date.now(),
      isArchived: false,
      isMuted: false,
    };

    setTimeout(() => {
      setAllChats(prev => [newGroupChat, ...prev].sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0)));
      setMessages(prev => ({ ...prev, [newGroupId]: [] }));

      const newActiveGroup: ActiveChat = { ...newGroupChat, messages: [] };
      setActiveChatHook(newActiveGroup);
      setShowCreateGroupView(false);
      setViewingContactInfoFor(null);
      setIsCreatingGroup(false);
    }, 2000);
  };

  const handleForwardMessage = (
    originalMessage: Message,
    targetChatIds: string[],
  ) => {
    const timestamp = Date.now();
    targetChatIds.forEach(chatId => {
      const targetChat = allChats.find(c => c.id === chatId);
      if (!targetChat) return;

      const forwardedMessageContent = {
        text: originalMessage.text,
        imageUrl: originalMessage.imageUrl,
        audioUrl: originalMessage.audioUrl,
        videoUrl: originalMessage.videoUrl,
        documentUrl: originalMessage.documentUrl,
        fileName: originalMessage.fileName,
        duration: originalMessage.duration,
        mediaType: originalMessage.mediaType,
      }

      const newMessage: Message = {
        ...forwardedMessageContent,
        id: `msg-${timestamp}-${Math.random().toString(36).substring(2, 9)}-fwdto-${chatId}`,
        timestamp: timestamp,
        senderId: currentUserId,
        type: 'outgoing',
        status: 'sent',
        isForwarded: true,
        replyToMessageId: undefined, 
        replyToMessagePreview: undefined,
        replyToSenderName: undefined,
      };

      setMessages(prevMsgs => ({
        ...prevMsgs,
        [chatId]: [...(prevMsgs[chatId] || []), newMessage],
      }));

      let chatWasArchived = false;
      setAllChats(prevAllChats =>
        prevAllChats.map(c => {
          if (c.id === chatId) {
            const originallyArchived = !!c.isArchived;
            const isTargetActive = c.id === activeChat?.id;

            if (originallyArchived && !isTargetActive) {
              return {
                ...c,
                lastMessage: newMessage,
                lastActivity: timestamp,
                isArchived: true, 
                unreadCount: (c.unreadCount || 0) + 1,
              };
            } else {
              return {
                ...c,
                lastMessage: newMessage,
                lastActivity: timestamp,
                isArchived: false, 
                unreadCount: isTargetActive ? 0 : (c.unreadCount || 0) + 1,
              };
            }
          }
          return c;
        }).sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0))
      );
    });
  };

  const handleToggleStarMessage = (messageId: string) => {
    setMessages(prevMessages => {
      const updatedMessages: { [chatId: string]: Message[] } = {};
      for (const chatId in prevMessages) {
        updatedMessages[chatId] = prevMessages[chatId].map(msg => 
          msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
        );
      }
      return updatedMessages;
    });

    if (activeChat && activeChat.messages.some(msg => msg.id === messageId)) {
      setActiveChat(prevActiveChat => {
        if (!prevActiveChat) return null;
        return {
          ...prevActiveChat,
          messages: prevActiveChat.messages.map(msg => 
            msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
          )
        };
      });
    }

    setAllChats(prevAllChats => 
      prevAllChats.map(chat => {
        if (chat.lastMessage?.id === messageId) {
          return {
            ...chat,
            lastMessage: { ...chat.lastMessage, isStarred: !chat.lastMessage.isStarred }
          };
        }
        return chat;
      })
    );
  };

  return {
    allChats,
    activeChat,
    setActiveChat,
    messages,
    currentUserId,
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
    handleCloseContactInfo,
    handleCreateGroup,
    handleClearChatMessages,
    handleForwardMessage,
    handleToggleStarMessage,
    isCreatingGroup
  };
};
