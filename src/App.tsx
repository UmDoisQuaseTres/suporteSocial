import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import ContactInfoPanel from './components/ContactInfoPanel/ContactInfoPanel';
import type { Chat, ActiveChat, Message, User } from './types';

// Dados de exemplo (MOCK) - como na sua versão, adicionando isMuted
const mockUsers: { [id: string]: User } = {
  'currentUser': { id: 'currentUser', name: 'Eu', avatarUrl: 'https://placehold.co/40x40/FFFFFF/000000?text=EU', about: 'Eu sou o usuário atual' },
  'amigo1': { id: 'amigo1', name: 'Amigo 1', avatarUrl: 'https://placehold.co/50x50/25D366/FFFFFF?text=A1', about: 'Amigo 1 é um amigo de longa data' },
  'user2': { id: 'user2', name: 'João', avatarUrl: 'https://placehold.co/50x50/FBC531/FFFFFF?text=J', about: 'Apenas João.' },
  'user3': { id: 'user3', name: 'Colega de Trabalho', avatarUrl: 'https://placehold.co/50x50/3498DB/FFFFFF?text=C2', about: 'Colega gente boa.' },
  'promoBot': { id: 'promoBot', name: 'Promo Bot', avatarUrl: 'https://placehold.co/50x50/E74C3C/FFFFFF?text=N' },
  'tiaMaria': { id: 'tiaMaria', name: 'Tia Maria', avatarUrl: 'https://placehold.co/50x50/AAAAAA/FFFFFF?text=TM', about: 'Adoro a família!'},
  'amigo2': { id: 'amigo2', name: 'Amigo Distante', avatarUrl: 'https://placehold.co/50x50/8E44AD/FFFFFF?text=A2', about: 'Viajando o mundo.'},
  'chefe': { id: 'chefe', name: 'Chefe', avatarUrl: 'https://placehold.co/50x50/34495E/FFFFFF?text=C', about: 'Work hard, play hard.'},
};

const initialMockChats: Chat[] = [
  {
    id: '1', type: 'user', name: mockUsers['amigo1'].name, avatarUrl: mockUsers['amigo1'].avatarUrl,
    lastMessage: { id: 'm1', text: 'Ok, combinado!', timestamp: Date.now() - 100000, senderId: 'currentUser', type: 'outgoing', status: 'read'},
    unreadCount: 0, lastActivity: Date.now() - 100000, isArchived: false, participants: [mockUsers['currentUser'], mockUsers['amigo1']],
    isMuted: false, // Adicionado estado de mute
  },
  {
    id: 'group1', type: 'group', name: 'Grupo da Família', avatarUrl: 'https://placehold.co/50x50/FBC531/FFFFFF?text=G',
    lastMessage: { id: 'm2', text: 'Foto nova!', timestamp: Date.now() - 86400000, senderId: 'user2', type: 'incoming', userName: mockUsers['user2'].name, mediaType: 'image', imageUrl: '...'},
    unreadCount: 0, lastActivity: Date.now() - 86400000, participants: [mockUsers['user2'], mockUsers['currentUser'], mockUsers['tiaMaria']], isArchived: false,
    isMuted: true, // Exemplo de chat silenciado
  },
  {
    id: '3', type: 'user', name: mockUsers['user3'].name, avatarUrl: mockUsers['user3'].avatarUrl,
    lastMessage: { id: 'm3', text: 'Áudio (0:15)', timestamp: Date.now() - 172800000, senderId: 'user3', type: 'incoming', mediaType: 'audio' },
    unreadCount: 1, lastActivity: Date.now() - 172800000, isArchived: true, participants: [mockUsers['currentUser'], mockUsers['user3']],
    isMuted: false,
  },
  // ... outros chats mockados com isMuted: false ou true
];

const initialMockMessages: { [chatId: string]: Message[] } = {
  '1': [ { id: 'msg1-1', text: 'Olá! Tudo bem por aí?', timestamp: Date.now() - 120000, senderId: 'amigo1', type: 'incoming' }, { id: 'msg1-2', text: 'Ok, combinado!', timestamp: Date.now() - 100000, senderId: 'currentUser', type: 'outgoing', status: 'read' },],
  'group1': [ { id: 'msg2-1', text: 'Alguém viu meu óculos?', userName: mockUsers['tiaMaria'].name, timestamp: Date.now() - 90000000, senderId: 'tiaMaria', type: 'incoming' }, { id: 'msg2-2', text: 'Foto nova!', userName: mockUsers['user2'].name, imageUrl: 'https://placehold.co/300x200/RANDOM/FFFFFF?text=Foto+Grupo', mediaType:'image', timestamp: Date.now() - 86400000, senderId: 'user2', type: 'incoming' }, ],
  '3': [ { id: 'msg3-1', text: 'Este é um chat arquivado.', timestamp: Date.now() - 180000000, senderId: 'user3', type: 'incoming' }, { id: 'msg3-2', text: 'Entendido.', timestamp: Date.now() - 179000000, senderId: 'currentUser', type: 'outgoing', status: 'delivered' }, ],
};


function App() {
  const [allChats, setAllChats] = useState<Chat[]>(initialMockChats);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [currentUserId] = useState<string>('currentUser');
  const [showArchivedView, setShowArchivedView] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewChatView, setShowNewChatView] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>(initialMockMessages);

  const [showContactInfoPanel, setShowContactInfoPanel] = useState<boolean>(false);
  const [viewingContactInfoFor, setViewingContactInfoFor] = useState<Chat | null>(null);

  const availableContacts: User[] = Object.values(mockUsers).filter(user => user.id !== currentUserId);
  const activeUserChats = allChats.filter(chat => !chat.isArchived);
  const archivedUserChats = allChats.filter(chat => chat.isArchived);
  const unreadInArchivedCount = archivedUserChats.filter(chat => (chat.unreadCount || 0) > 0).length;

  const handleShowContactInfo = (chat: Chat) => {
    setViewingContactInfoFor(chat);
    setShowContactInfoPanel(true);
  };

  const handleCloseContactInfoPanel = () => {
    setShowContactInfoPanel(false);
    // Não resetar viewingContactInfoFor aqui para que o painel possa usá-lo ao fechar,
    // mas ele será resetado se um novo chat for selecionado ou a vista mudar.
  };

  const handleSelectChat = (chat: Chat) => {
    const chatMessages = messages[chat.id] || [];
    setActiveChat({ ...chat, messages: chatMessages });
    setShowNewChatView(false);
    if (showArchivedView && chat.isArchived) { /* Mantém showArchivedView true */ }
    else if (!chat.isArchived) { setShowArchivedView(false); }

    if ((!chat.isArchived && !showArchivedView) || (chat.isArchived && showArchivedView)) {
      if (chat.unreadCount && chat.unreadCount > 0) {
        setAllChats(prevChats => prevChats.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));
      }
    }
    setShowContactInfoPanel(false); // Fecha o painel de info ao selecionar um chat
  };

  const handleToggleArchivedView = () => { /* ...como antes... */ setShowArchivedView(prev => !prev); setShowNewChatView(false); setActiveChat(null); setSearchTerm(''); setShowContactInfoPanel(false); };
  const handleToggleNewChatView = () => { /* ...como antes... */ setShowNewChatView(prev => !prev); setShowArchivedView(false); setActiveChat(null); setSearchTerm(''); setShowContactInfoPanel(false); };
  const handleStartNewChat = (contact: User) => { /* ...como antes... */
    const existingChat = allChats.find(c => c.type === 'user' && c.participants?.some(p => p.id === contact.id));
    if (existingChat) { handleSelectChat(existingChat); }
    else {
      const newChatId = contact.id;
      const newChat: Chat = {
        id: newChatId, type: 'user', name: contact.name, avatarUrl: contact.avatarUrl,
        lastMessage: undefined, unreadCount: 0, lastActivity: Date.now(),
        isArchived: false, isMuted: false, participants: [mockUsers[currentUserId], contact],
      };
      setAllChats(prev => [newChat, ...prev].sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0)));
      setMessages(prev => ({ ...prev, [newChatId]: [] }));
      handleSelectChat(newChat);
    }
    setShowNewChatView(false); setShowContactInfoPanel(false);
  };

  const toggleArchiveChatStatus = (chatId: string) => { /* ...como antes... */
    if (viewingContactInfoFor?.id === chatId) { handleCloseContactInfoPanel(); }
    let chatIsNowArchived = false;
    setAllChats(prev => prev.map(c => c.id === chatId ? (chatIsNowArchived = !c.isArchived, {...c, isArchived: chatIsNowArchived}) : c ).sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0)));
    if (activeChat?.id === chatId) setActiveChat(null);
    const stillHaveArchivedChats = allChats.some(c => c.id !== chatId ? c.isArchived : chatIsNowArchived);
    if (showArchivedView && !stillHaveArchivedChats) setShowArchivedView(false);
  };

  // NOVA FUNÇÃO para silenciar/reativar som do chat
  const toggleMuteChat = (chatId: string) => {
    setAllChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
      )
    );
    // Se o chat ativo for o silenciado, atualizamos o activeChat para refletir a mudança
    if (activeChat?.id === chatId) {
      setActiveChat(prevActiveChat => prevActiveChat ? { ...prevActiveChat, isMuted: !prevActiveChat.isMuted } : null);
    }
    // Se o chat silenciado estiver no painel de informações, atualizamos também
    if (viewingContactInfoFor?.id === chatId) {
      setViewingContactInfoFor(prevInfo => prevInfo ? { ...prevInfo, isMuted: !prevInfo.isMuted } : null);
    }
  };

  const handleSendMessage = (chatId: string, messageText: string): void => { /* ...como antes... */
    if (!activeChat || activeChat.id !== chatId) return;
    const newMessage: Message = { id: `msg-${Date.now()}`, text: messageText, timestamp: Date.now(), senderId: currentUserId, type: 'outgoing', status: 'sent'};
    setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    setMessages(prevMsgs => ({ ...prevMsgs, [chatId]: [...(prevMsgs[chatId] || []), newMessage] }));
    let chatWasArchived = false;
    setAllChats(prevAllChats => prevAllChats.map(c => c.id === chatId ? (chatWasArchived = !!c.isArchived, { ...c, lastMessage: newMessage, lastActivity: newMessage.timestamp, isArchived: false, unreadCount: 0 }) : c).sort((a,b) => (b.lastActivity||0) - (a.lastActivity||0)));
    if (chatWasArchived && showArchivedView) setShowArchivedView(false);
    setTimeout(() => { /* ...resposta simulada como antes... */ }, 1500);
  };

  const activeChatRef = useRef(activeChat);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  const listToDisplayInitially = showArchivedView ? archivedUserChats : (showNewChatView ? [] : activeUserChats);
  const currentFilteredChats = searchTerm && !showNewChatView ? listToDisplayInitially.filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase())) : listToDisplayInitially;
  const sidebarWidth = showContactInfoPanel ? "md:w-1/4" : "md:w-1/3";
  const mainContentWidth = showContactInfoPanel ? "md:w-2/4" : "md:w-2/3";

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-800">
      <div className="flex h-full w-full overflow-hidden shadow-2xl md:h-[95%] md:w-[95%] md:max-w-7xl md:rounded-lg">
        <Sidebar
          sidebarWidthClass={sidebarWidth}
          unreadInArchivedCount={unreadInArchivedCount}
          onSelectChat={handleSelectChat} activeChatId={activeChat?.id}
          onToggleArchivedView={handleToggleArchivedView} showArchived={showArchivedView}
          currentDisplayedChats={currentFilteredChats}
          searchTerm={searchTerm} onSearchTermChange={setSearchTerm}
          showNewChatView={showNewChatView} onToggleNewChatView={handleToggleNewChatView}
          availableContacts={availableContacts} onStartNewChat={handleStartNewChat}
          onToggleArchiveChatStatus={toggleArchiveChatStatus}
          totalArchivedChats={archivedUserChats.length}
        />
        <MainContent
          mainContentWidthClass={mainContentWidth}
          activeChat={activeChat} currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onToggleArchiveStatus={toggleArchiveChatStatus}
          onShowContactInfo={handleShowContactInfo}
        />
        {showContactInfoPanel && viewingContactInfoFor && (
          <ContactInfoPanel
            chatInfo={viewingContactInfoFor}
            onClose={handleCloseContactInfoPanel}
            panelWidthClass="w-full md:w-1/4"
            currentUserId={currentUserId}
            onToggleMuteChat={toggleMuteChat} // <-- Passando a nova função
          />
        )}
      </div>
    </div>
  );
}

export default App;