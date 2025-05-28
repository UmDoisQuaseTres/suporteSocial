import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import ContactInfoPanel from './components/ContactInfoPanel/ContactInfoPanel'; // Novo componente
import type { Chat, ActiveChat, Message, User } from './types';

// Dados de exemplo (MOCK) - como definidos anteriormente
const mockUsers: { [id: string]: User } = {
  'currentUser': { id: 'currentUser', name: 'Eu', avatarUrl: 'https://placehold.co/40x40/FFFFFF/000000?text=EU' },
  'amigo1': { id: 'amigo1', name: 'Amigo 1', avatarUrl: 'https://placehold.co/50x50/25D366/FFFFFF?text=A1' },
  'user2': { id: 'user2', name: 'João', avatarUrl: 'https://placehold.co/50x50/FBC531/FFFFFF?text=J' },
  'user3': { id: 'user3', name: 'Colega de Trabalho', avatarUrl: 'https://placehold.co/50x50/3498DB/FFFFFF?text=C2' },
  'promoBot': { id: 'promoBot', name: 'Promo Bot', avatarUrl: 'https://placehold.co/50x50/E74C3C/FFFFFF?text=N' },
  'tiaMaria': { id: 'tiaMaria', name: 'Tia Maria', avatarUrl: 'https://placehold.co/50x50/AAAAAA/FFFFFF?text=TM'},
  'amigo2': { id: 'amigo2', name: 'Amigo Distante', avatarUrl: 'https://placehold.co/50x50/8E44AD/FFFFFF?text=A2'},
  'chefe': { id: 'chefe', name: 'Chefe', avatarUrl: 'https://placehold.co/50x50/34495E/FFFFFF?text=C'},
};

const initialMockChats: Chat[] = [
  {
    id: '1', type: 'user', name: mockUsers['amigo1'].name, avatarUrl: mockUsers['amigo1'].avatarUrl,
    lastMessage: { id: 'm1', text: 'Ok, combinado!', timestamp: Date.now() - 100000, senderId: 'currentUser', type: 'outgoing', status: 'read'},
    unreadCount: 0, lastActivity: Date.now() - 100000, isArchived: false, participants: [mockUsers['currentUser'], mockUsers['amigo1']]
  },
  {
    id: 'group1', type: 'group', name: 'Grupo da Família', avatarUrl: 'https://placehold.co/50x50/FBC531/FFFFFF?text=G',
    lastMessage: { id: 'm2', text: 'Foto nova!', timestamp: Date.now() - 86400000, senderId: 'user2', type: 'incoming', userName: mockUsers['user2'].name},
    unreadCount: 3, lastActivity: Date.now() - 86400000, participants: [mockUsers['currentUser'], mockUsers['user2'], mockUsers['tiaMaria']], isArchived: false,
  },
  {
    id: '3', type: 'user', name: mockUsers['user3'].name, avatarUrl: mockUsers['user3'].avatarUrl,
    lastMessage: { id: 'm3', text: 'Áudio (0:15)', timestamp: Date.now() - 172800000, senderId: 'user3', type: 'incoming' },
    unreadCount: 0, lastActivity: Date.now() - 172800000, isArchived: true, participants: [mockUsers['currentUser'], mockUsers['user3']]
  },
];

const initialMockMessages: { [chatId: string]: Message[] } = {
  '1': [ /* ... mensagens ... */ ],
  'group1': [ /* ... mensagens ... */ ],
  '3': [ /* ... mensagens ... */ ],
};


function App() {
  const [allChats, setAllChats] = useState<Chat[]>(initialMockChats);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [currentUserId] = useState<string>('currentUser');
  const [showArchivedView, setShowArchivedView] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewChatView, setShowNewChatView] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>(initialMockMessages);

  // Novos estados para o painel de informações do contacto/grupo
  const [showContactInfoPanel, setShowContactInfoPanel] = useState<boolean>(false);
  const [viewingContactInfoFor, setViewingContactInfoFor] = useState<Chat | null>(null);


  const availableContacts: User[] = Object.values(mockUsers).filter(user => user.id !== currentUserId);
  const activeUserChats = allChats.filter(chat => !chat.isArchived);
  const archivedUserChats = allChats.filter(chat => chat.isArchived);

  // Funções para o painel de informações
  const handleShowContactInfo = (chat: Chat) => {
    setViewingContactInfoFor(chat);
    setShowContactInfoPanel(true);
  };

  const handleCloseContactInfoPanel = () => {
    setShowContactInfoPanel(false);
    setViewingContactInfoFor(null);
  };

  const handleSelectChat = (chat: Chat) => {
    // ... (lógica de handleSelectChat como antes)
    const chatMessages = messages[chat.id] || [];
    setActiveChat({ ...chat, messages: chatMessages });
    setShowNewChatView(false);
    //setShowArchivedView(false); // Não fechar arquivados se selecionar um chat de lá
    if (showArchivedView && chat.isArchived) {
        // Mantém showArchivedView true
    } else {
        setShowArchivedView(false);
    }


    if ((!chat.isArchived && !showArchivedView) || (chat.isArchived && showArchivedView)) {
      if (chat.unreadCount && chat.unreadCount > 0) {
        setAllChats(prevChats => prevChats.map(c =>
          c.id === chat.id ? { ...c, unreadCount: 0 } : c
        ));
      }
    }
    setShowContactInfoPanel(false); // Fecha o painel de info ao selecionar um chat
  };

  const handleToggleArchivedView = () => {
    // ... (lógica de handleToggleArchivedView como antes)
    setShowArchivedView(prev => !prev);
    setShowNewChatView(false);
    setActiveChat(null);
    setSearchTerm('');
    setShowContactInfoPanel(false);
  };

  const handleToggleNewChatView = () => {
    // ... (lógica de handleToggleNewChatView como antes)
    setShowNewChatView(prev => !prev);
    setShowArchivedView(false);
    setActiveChat(null);
    setSearchTerm('');
    setShowContactInfoPanel(false);
  };

  const handleStartNewChat = (contact: User) => {
    // ... (lógica de handleStartNewChat como antes)
    const existingChat = allChats.find(chat =>
      chat.type === 'user' && chat.participants &&
      chat.participants.some(p => p.id === contact.id) &&
      chat.participants.some(p => p.id === currentUserId)
    );
    if (existingChat) {
      handleSelectChat(existingChat);
    } else {
      const newChatId = contact.id;
      const newChat: Chat = {
        id: newChatId, type: 'user', name: contact.name, avatarUrl: contact.avatarUrl,
        lastMessage: undefined, unreadCount: 0, lastActivity: Date.now(),
        isArchived: false, participants: [mockUsers[currentUserId], contact],
      };
      setAllChats(prevChats => [newChat, ...prevChats].sort((a,b) => (b.lastActivity || 0) - (a.lastActivity || 0)));
      setMessages(prevMessages => ({ ...prevMessages, [newChatId]: [] }));
      handleSelectChat(newChat);
    }
    setShowNewChatView(false);
    setShowContactInfoPanel(false);
  };

  const toggleArchiveChatStatus = (chatId: string) => {
    // ... (lógica de toggleArchiveChatStatus como antes)
    // ... (importante: se o chat que está no viewingContactInfoFor for arquivado, o painel deve fechar ou atualizar)
    if (viewingContactInfoFor?.id === chatId) {
        handleCloseContactInfoPanel(); // Fecha o painel se o chat visualizado for arquivado/desarquivado
    }
    // ... (resto da lógica)
    let chatIsNowArchived = false;
    setAllChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === chatId) {
          chatIsNowArchived = !chat.isArchived;
          return { ...chat, isArchived: chatIsNowArchived };
        }
        return chat;
      }).sort((a,b) => (b.lastActivity || 0) - (a.lastActivity || 0))
    );
    if (activeChat?.id === chatId) setActiveChat(null);
    const stillArchivedChats = allChats.map(c => c.id === chatId ? {...c, isArchived: chatIsNowArchived} : c).filter(c => c.isArchived);
    if (showArchivedView && !chatIsNowArchived && stillArchivedChats.length === 0) {
        setShowArchivedView(false);
    }
  };

  const handleSendMessage = (chatId: string, messageText: string): void => {
    // ... (lógica de handleSendMessage como antes)
    if (!activeChat || activeChat.id !== chatId) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`, text: messageText, timestamp: Date.now(),
      senderId: currentUserId, type: 'outgoing', status: 'sent',
    };
    setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    setMessages(prevMsgs => ({ ...prevMsgs, [chatId]: [...(prevMsgs[chatId] || []), newMessage] }));
    let chatWasArchived = false;
    setAllChats(prevAllChats => prevAllChats.map(c => {
        if (c.id === chatId) {
            chatWasArchived = !!c.isArchived;
            return { ...c, lastMessage: newMessage, lastActivity: newMessage.timestamp, isArchived: false, unreadCount: 0 };
        }
        return c;
    }).sort((a,b) => (b.lastActivity || 0) - (a.lastActivity || 0)));
    if (chatWasArchived && showArchivedView) setShowArchivedView(false);
    setTimeout(() => { /* ... resposta simulada ... */ }, 1500);
  };

  const activeChatRef = useRef(activeChat);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  const listToDisplayInitially = showArchivedView ? archivedUserChats : (showNewChatView ? [] : activeUserChats);
  const currentFilteredChats = searchTerm && !showNewChatView
    ? listToDisplayInitially.filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : listToDisplayInitially;

  // Ajustar classes de largura com base na visibilidade do painel de info
  const sidebarWidth = showContactInfoPanel ? "md:w-1/4" : "md:w-1/3";
  const mainContentWidth = showContactInfoPanel ? "md:w-2/4" : "md:w-2/3"; // Ou md:w-1/2

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-800">
      <div className="flex h-full w-full overflow-hidden shadow-2xl md:h-[95%] md:w-[95%] md:max-w-7xl md:rounded-lg"> {/* Aumentado max-w se necessário */}
        <Sidebar
          // ...props da Sidebar como antes...
          sidebarWidthClass={sidebarWidth} // Passa a classe de largura dinâmica
          archivedChatsCount={archivedUserChats.length > 0 ? archivedUserChats.length : 0}
          onSelectChat={handleSelectChat}
          activeChatId={activeChat?.id}
          onToggleArchivedView={handleToggleArchivedView}
          showArchived={showArchivedView}
          currentDisplayedChats={currentFilteredChats}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          showNewChatView={showNewChatView}
          onToggleNewChatView={handleToggleNewChatView}
          availableContacts={availableContacts}
          onStartNewChat={handleStartNewChat}
        />
        <MainContent
          mainContentWidthClass={mainContentWidth} // Passa a classe de largura dinâmica
          activeChat={activeChat}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onToggleArchiveStatus={toggleArchiveChatStatus}
          onShowContactInfo={handleShowContactInfo} // Passando a nova função
        />
        {showContactInfoPanel && viewingContactInfoFor && (
          <ContactInfoPanel
            chatInfo={viewingContactInfoFor}
            onClose={handleCloseContactInfoPanel}
            panelWidthClass="w-full md:w-1/4" // Define a largura do painel de info
          />
        )}
      </div>
    </div>
  );
}

export default App;