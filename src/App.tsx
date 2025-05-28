import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import type { Chat, ActiveChat, Message, User } from './types';

// Dados de exemplo (MOCK)
const mockUsers: { [id: string]: User } = {
  'currentUser': { id: 'currentUser', name: 'Eu', avatarUrl: 'https://placehold.co/40x40/FFFFFF/000000?text=EU' },
  'amigo1': { id: 'amigo1', name: 'Amigo 1', avatarUrl: 'https://placehold.co/50x50/25D366/FFFFFF?text=A1' },
  'user2': { id: 'user2', name: 'João', avatarUrl: 'https://placehold.co/50x50/FBC531/FFFFFF?text=J' },
  'user3': { id: 'user3', name: 'Colega de Trabalho', avatarUrl: 'https://placehold.co/50x50/3498DB/FFFFFF?text=C2' },
  'promoBot': { id: 'promoBot', name: 'Promo Bot', avatarUrl: 'https://placehold.co/50x50/E74C3C/FFFFFF?text=N' },
  'tiaMaria': { id: 'tiaMaria', name: 'Tia Maria', avatarUrl: 'https://placehold.co/50x50/AAAAAA/FFFFFF?text=TM'}
};

const mockChats: Chat[] = [
  {
    id: '1',
    type: 'user',
    name: 'Amigo 1',
    avatarUrl: mockUsers['amigo1'].avatarUrl,
    lastMessage: { id: 'm1', text: 'Ok, combinado!', timestamp: Date.now() - 100000, senderId: 'currentUser', type: 'outgoing', status: 'read'},
    unreadCount: 0,
    lastActivity: Date.now() - 100000,
    isArchived: false,
  },
  {
    id: '2',
    type: 'group',
    name: 'Grupo da Família',
    avatarUrl: 'https://placehold.co/50x50/FBC531/FFFFFF?text=G',
    lastMessage: { id: 'm2', text: 'Foto nova!', timestamp: Date.now() - 86400000, senderId: 'user2', type: 'incoming', userName: mockUsers['user2'].name},
    unreadCount: 3,
    lastActivity: Date.now() - 86400000,
    participants: [mockUsers['currentUser'], mockUsers['user2'], mockUsers['tiaMaria']],
    isArchived: false,
  },
  {
    id: '3',
    type: 'user',
    name: 'Colega de Trabalho',
    avatarUrl: mockUsers['user3'].avatarUrl,
    lastMessage: { id: 'm3', text: 'Áudio (0:15)', timestamp: Date.now() - 172800000, senderId: 'user3', type: 'incoming' },
    unreadCount: 0,
    lastActivity: Date.now() - 172800000,
    isArchived: true,
  },
  {
    id: '4',
    type: 'user',
    name: 'Notificações Antigas',
    avatarUrl: mockUsers['promoBot'].avatarUrl,
    lastMessage: { id: 'm4', text: 'Promoção imperdível!', timestamp: Date.now() - 345600000, senderId: 'promoBot', type: 'incoming' },
    unreadCount: 1,
    lastActivity: Date.now() - 345600000,
    isArchived: true,
  },
];

const mockMessages: { [chatId: string]: Message[] } = {
  '1': [
    { id: 'msg1-1', text: 'Olá! Tudo bem por aí?', timestamp: Date.now() - 120000, senderId: 'amigo1', type: 'incoming' },
    { id: 'msg1-2', text: 'Oi! Tudo ótimo, e com você?', timestamp: Date.now() - 110000, senderId: 'currentUser', type: 'outgoing', status: 'read' },
  ],
  '2': [
    { id: 'msg2-1', text: 'Alguém viu meu óculos?', userName: mockUsers['tiaMaria'].name, timestamp: Date.now() - 90000000, senderId: 'tiaMaria', type: 'incoming' },
    { id: 'msg2-2', text: 'Foto nova!', userName: mockUsers['user2'].name, imageUrl: 'https://placehold.co/300x200/RANDOM/FFFFFF?text=Foto+Grupo', timestamp: Date.now() - 86400000, senderId: 'user2', type: 'incoming' },
  ],
  '3': [
    { id: 'msg3-1', text: 'Este é um chat arquivado.', timestamp: Date.now() - 180000000, senderId: 'user3', type: 'incoming' },
    { id: 'msg3-2', text: 'Entendido.', timestamp: Date.now() - 179000000, senderId: 'currentUser', type: 'outgoing', status: 'delivered' },
  ],
  '4': [
    { id: 'msg4-1', text: 'Sua fatura vence amanhã!', timestamp: Date.now() - 350000000, senderId: 'promoBot', type: 'incoming' },
  ],
};

function App() {
  const [allChats, setAllChats] = useState<Chat[]>(mockChats);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [currentUserId] = useState<string>('currentUser');
  const [showArchivedView, setShowArchivedView] = useState<boolean>(false);

  const activeUserChats = allChats.filter(chat => !chat.isArchived);
  const archivedUserChats = allChats.filter(chat => chat.isArchived);

  const handleSelectChat = (chat: Chat) => {
    const messagesForSelectedChat = mockMessages[chat.id] || [];
    if (messagesForSelectedChat.length === 0 && !mockMessages[chat.id]) {
        messagesForSelectedChat.push({
            id: `placeholder-${Date.now()}`,
            text: `Nenhuma mensagem em ${chat.name} ainda.`,
            timestamp: Date.now(),
            senderId: 'system',
            type: 'incoming'
        });
    }
    setActiveChat({ ...chat, messages: messagesForSelectedChat });

    if ((!chat.isArchived && !showArchivedView) || (chat.isArchived && showArchivedView)) {
      if (chat.unreadCount && chat.unreadCount > 0) {
        setAllChats(prevChats => prevChats.map(c =>
          c.id === chat.id ? { ...c, unreadCount: 0 } : c
        ));
      }
    }
  };

  const handleToggleArchivedView = () => {
    setShowArchivedView(prev => !prev);
    setActiveChat(null);
  };

  const toggleArchiveChatStatus = (chatId: string) => {
    let chatIsNowArchived = false;
    setAllChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === chatId) {
          chatIsNowArchived = !chat.isArchived;
          console.log(`Chat ${chatId} is now ${chatIsNowArchived ? 'archived' : 'unarchived'}`);
          return { ...chat, isArchived: chatIsNowArchived };
        }
        return chat;
      }).sort((a,b) => (b.lastActivity || 0) - (a.lastActivity || 0)) // Re-sort if archiving changes order
    );

    // Se o chat ativo foi o que acabou de ser arquivado/desarquivado, limpamos ele da vista principal.
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }

    // Se estávamos na vista de arquivados, e um chat foi desarquivado de lá,
    // e não há mais chats arquivados, voltamos para a lista principal.
    // (Esta lógica pode ser ajustada conforme a preferência de UX)
    const stillArchivedChats = allChats.map(c => c.id === chatId ? {...c, isArchived: chatIsNowArchived} : c).filter(c => c.isArchived);
    if (showArchivedView && !chatIsNowArchived && stillArchivedChats.length === 0) {
        setShowArchivedView(false);
    }
  };

  const handleSendMessage = (chatId: string, messageText: string): void => {
    if (!activeChat || activeChat.id !== chatId) {
        console.warn("Tentativa de enviar mensagem sem chat ativo ou ID de chat incorreto.");
        return;
    }
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: messageText,
      timestamp: Date.now(),
      senderId: currentUserId,
      type: 'outgoing',
      status: 'sent',
    };
    setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);

    let chatWasArchived = false;
    setAllChats(prevAllChats => prevAllChats.map(c => {
        if (c.id === chatId) {
            chatWasArchived = !!c.isArchived;
            return { ...c, lastMessage: newMessage, lastActivity: newMessage.timestamp, isArchived: false, unreadCount: 0 };
        }
        return c;
    }).sort((a,b) => (b.lastActivity || 0) - (a.lastActivity || 0))
    );

    if (chatWasArchived && showArchivedView) {
        setShowArchivedView(false);
    }

    setTimeout(() => {
      if (activeChatRef.current && activeChatRef.current.id === chatId) {
        const contactForReply = allChats.find(c => c.id === chatId);
        let replySenderId = 'otherUser';
        let replySenderName: string | undefined = undefined;

        if(contactForReply?.type === 'user') {
            replySenderId = contactForReply.id;
        } else if (contactForReply?.type === 'group' && contactForReply.participants) {
            const otherParticipant = contactForReply.participants.find(p => p.id !== currentUserId);
            if(otherParticipant) {
                replySenderId = otherParticipant.id;
                replySenderName = otherParticipant.name;
            }
        }
        const replyMessage: Message = {
          id: `reply-${Date.now()}`,
          text: `Ok: "${messageText.substring(0, 20)}..."`,
          timestamp: Date.now(),
          senderId: replySenderId,
          type: 'incoming',
          userName: replySenderName,
        };
        setActiveChat(prev => {
            if (prev && prev.id === chatId) {
                return { ...prev, messages: [...prev.messages, replyMessage] };
            }
            return prev;
        });

        let repliedChatWasArchivedBeforeUpdate = false;
        setAllChats(prevAllChats => prevAllChats.map(c => {
            if (c.id === chatId) {
                repliedChatWasArchivedBeforeUpdate = !!c.isArchived;
                const newUnreadCount = (showArchivedView && c.isArchived) || (activeChatRef.current?.id !== c.id) ? (c.unreadCount || 0) + 1 : 0;
                return {
                    ...c,
                    lastMessage: replyMessage,
                    unreadCount: newUnreadCount,
                    lastActivity: replyMessage.timestamp,
                    isArchived: false
                };
            }
            return c;
        }).sort((a,b) => (b.lastActivity || 0) - (a.lastActivity || 0)));

        if (repliedChatWasArchivedBeforeUpdate && showArchivedView) {
            // setShowArchivedView(false); // Opcional
        }
      }
    }, 1500 + Math.random() * 1000);
  };

  const activeChatRef = useRef(activeChat);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-800">
      <div className="flex h-full w-full overflow-hidden shadow-2xl md:h-[95%] md:w-[95%] md:max-w-6xl md:rounded-lg">
        <Sidebar
          archivedChatsCount={archivedUserChats.length > 0 ? archivedUserChats.length : 0}
          onSelectChat={handleSelectChat}
          activeChatId={activeChat?.id}
          onToggleArchivedView={handleToggleArchivedView}
          showArchived={showArchivedView}
          currentDisplayedChats={showArchivedView ? archivedUserChats : activeUserChats}
        />
        <MainContent
          activeChat={activeChat}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onToggleArchiveStatus={toggleArchiveChatStatus}
        />
      </div>
    </div>
  );
}

export default App;