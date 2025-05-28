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
  'tiaMaria': { id: 'tiaMaria', name: 'Tia Maria', avatarUrl: 'https://placehold.co/50x50/AAAAAA/FFFFFF?text=TM'},
  'amigo2': { id: 'amigo2', name: 'Amigo Distante', avatarUrl: 'https://placehold.co/50x50/8E44AD/FFFFFF?text=A2'}, // Novo contacto
  'chefe': { id: 'chefe', name: 'Chefe', avatarUrl: 'https://placehold.co/50x50/34495E/FFFFFF?text=C'},       // Novo contacto
};

const initialMockChats: Chat[] = [ // Renomeado para evitar conflito com mockChats no escopo global
  {
    id: '1', // Corresponde ao ID de 'amigo1' se for um chat 1-1
    type: 'user',
    name: mockUsers['amigo1'].name,
    avatarUrl: mockUsers['amigo1'].avatarUrl,
    lastMessage: { id: 'm1', text: 'Ok, combinado!', timestamp: Date.now() - 100000, senderId: 'currentUser', type: 'outgoing', status: 'read'},
    unreadCount: 0,
    lastActivity: Date.now() - 100000,
    isArchived: false,
    participants: [mockUsers['currentUser'], mockUsers['amigo1']]
  },
  {
    id: 'group1', // ID de grupo
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
    id: '3', // Corresponde ao ID de 'user3'
    type: 'user',
    name: mockUsers['user3'].name,
    avatarUrl: mockUsers['user3'].avatarUrl,
    lastMessage: { id: 'm3', text: 'Áudio (0:15)', timestamp: Date.now() - 172800000, senderId: 'user3', type: 'incoming' },
    unreadCount: 0,
    lastActivity: Date.now() - 172800000,
    isArchived: true,
    participants: [mockUsers['currentUser'], mockUsers['user3']]
  },
  {
    id: '4', // Corresponde ao ID de 'promoBot'
    type: 'user',
    name: mockUsers['promoBot'].name,
    avatarUrl: mockUsers['promoBot'].avatarUrl,
    lastMessage: { id: 'm4', text: 'Promoção imperdível!', timestamp: Date.now() - 345600000, senderId: 'promoBot', type: 'incoming' },
    unreadCount: 1,
    lastActivity: Date.now() - 345600000,
    isArchived: true,
    participants: [mockUsers['currentUser'], mockUsers['promoBot']]
  },
];

// Manter mockMessages separado, pois ele pode não ter entradas para todos os chats inicialmente
const initialMockMessages: { [chatId: string]: Message[] } = { // Renomeado
  '1': [
    { id: 'msg1-1', text: 'Olá! Tudo bem por aí?', timestamp: Date.now() - 120000, senderId: 'amigo1', type: 'incoming' },
    { id: 'msg1-2', text: 'Oi! Tudo ótimo, e com você?', timestamp: Date.now() - 110000, senderId: 'currentUser', type: 'outgoing', status: 'read' },
  ],
  'group1': [
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
  const [allChats, setAllChats] = useState<Chat[]>(initialMockChats);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [currentUserId] = useState<string>('currentUser');
  const [showArchivedView, setShowArchivedView] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewChatView, setShowNewChatView] = useState<boolean>(false); // Novo estado
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>(initialMockMessages);


  const availableContacts: User[] = Object.values(mockUsers).filter(user => user.id !== currentUserId);

  const activeUserChats = allChats.filter(chat => !chat.isArchived);
  const archivedUserChats = allChats.filter(chat => chat.isArchived);

  const handleSelectChat = (chat: Chat) => {
    const chatMessages = messages[chat.id] || [];
    // Adiciona mensagem placeholder se não houver mensagens (apenas para UI)
    if (chatMessages.length === 0 && !messages[chat.id]) {
        // Não adiciona placeholder se o chat foi recém-criado, pois isso é feito em handleStartNewChat
    }
    setActiveChat({ ...chat, messages: chatMessages });
    setShowNewChatView(false); // Garante que sai da vista de novo chat
    setShowArchivedView(false); // Garante que sai da vista de arquivados se selecionar um chat da lista principal

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
    setShowNewChatView(false); // Garante que outra vista da sidebar está fechada
    setActiveChat(null);
    setSearchTerm('');
  };

  const handleToggleNewChatView = () => {
    setShowNewChatView(prev => !prev);
    setShowArchivedView(false); // Garante que outra vista da sidebar está fechada
    setActiveChat(null);
    setSearchTerm(''); // Limpa a pesquisa ao entrar na vista de novo chat
  };

  const handleStartNewChat = (contact: User) => {
    // Para chats 1-1, o ID do chat pode ser o ID do outro utilizador
    // Para uma lógica mais robusta, os IDs dos chats 1-1 poderiam ser uma combinação ordenada dos IDs dos utilizadores
    const existingChat = allChats.find(chat =>
      chat.type === 'user' &&
      chat.participants &&
      chat.participants.some(p => p.id === contact.id) &&
      chat.participants.some(p => p.id === currentUserId)
    );

    if (existingChat) {
      handleSelectChat(existingChat); // Abre o chat existente
    } else {
      // Cria um novo chat 1-1
      const newChatId = contact.id; // Simplificação: ID do chat é o ID do contacto
      const newChat: Chat = {
        id: newChatId, // Para chats 1-1, usamos o ID do contato como ID do chat
        type: 'user',
        name: contact.name,
        avatarUrl: contact.avatarUrl,
        lastMessage: undefined, // Ou uma mensagem de sistema "Chat iniciado"
        unreadCount: 0,
        lastActivity: Date.now(),
        isArchived: false,
        participants: [mockUsers[currentUserId], contact],
      };
      setAllChats(prevChats => [newChat, ...prevChats].sort((a,b) => (b.lastActivity || 0) - (a.lastActivity || 0)));
      setMessages(prevMessages => ({ ...prevMessages, [newChatId]: [] })); // Inicia com array de mensagens vazio
      handleSelectChat(newChat); // Abre o novo chat
    }
    setShowNewChatView(false); // Fecha a vista de Novo Chat
  };

  const toggleArchiveChatStatus = (chatId: string) => {
    // ... (lógica de toggleArchiveChatStatus como antes)
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
    // ... (lógica de handleSendMessage como antes, mas atualizando o 'messages' state)
    if (!activeChat || activeChat.id !== chatId) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`, text: messageText, timestamp: Date.now(),
      senderId: currentUserId, type: 'outgoing', status: 'sent',
    };

    // Atualiza mensagens do chat ativo
    setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    // Atualiza o state 'messages' global
    setMessages(prevMsgs => ({
        ...prevMsgs,
        [chatId]: [...(prevMsgs[chatId] || []), newMessage]
    }));


    let chatWasArchived = false;
    setAllChats(prevAllChats => prevAllChats.map(c => {
        if (c.id === chatId) {
            chatWasArchived = !!c.isArchived;
            return { ...c, lastMessage: newMessage, lastActivity: newMessage.timestamp, isArchived: false, unreadCount: 0 };
        }
        return c;
    }).sort((a,b) => (b.lastActivity || 0) - (a.lastActivity || 0))
    );

    if (chatWasArchived && showArchivedView) setShowArchivedView(false);

    setTimeout(() => {
      if (activeChatRef.current && activeChatRef.current.id === chatId) {
        const contactForReply = allChats.find(c => c.id === chatId);
        let replySenderId = 'otherUser'; let replySenderName: string | undefined = undefined;
        if(contactForReply?.type === 'user') replySenderId = contactForReply.participants?.find(p=>p.id !== currentUserId)?.id || 'otherUser';
        else if (contactForReply?.type === 'group' && contactForReply.participants) {
            const otherParticipant = contactForReply.participants.find(p => p.id !== currentUserId);
            if(otherParticipant) { replySenderId = otherParticipant.id; replySenderName = otherParticipant.name; }
        }
        const replyMessage: Message = {
          id: `reply-${Date.now()}`, text: `Ok: "${messageText.substring(0, 20)}..."`, timestamp: Date.now(),
          senderId: replySenderId, type: 'incoming', userName: replySenderName,
        };
        setActiveChat(prev => prev && prev.id === chatId ? { ...prev, messages: [...prev.messages, replyMessage] } : prev);
        setMessages(prevMsgs => ({
            ...prevMsgs,
            [chatId]: [...(prevMsgs[chatId] || []), replyMessage]
        }));

        let repliedChatWasArchivedBeforeUpdate = false;
        setAllChats(prevAllChats => prevAllChats.map(c => {
            if (c.id === chatId) {
                repliedChatWasArchivedBeforeUpdate = !!c.isArchived;
                const newUnreadCount = (showArchivedView && c.isArchived) || (activeChatRef.current?.id !== c.id) ? (c.unreadCount || 0) + 1 : 0;
                return { ...c, lastMessage: replyMessage, unreadCount: newUnreadCount, lastActivity: replyMessage.timestamp, isArchived: false };
            }
            return c;
        }).sort((a,b) => (b.lastActivity || 0) - (a.lastActivity || 0)));
        if (repliedChatWasArchivedBeforeUpdate && showArchivedView) { /* setShowArchivedView(false); */ }
      }
    }, 1500 + Math.random() * 1000);
  };

  const activeChatRef = useRef(activeChat);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  const listToDisplayInitially = showArchivedView ? archivedUserChats : (showNewChatView ? [] : activeUserChats); // Se showNewChatView, ChatList não recebe chats
  const currentFilteredChats = searchTerm && !showNewChatView // Só pesquisar se não estiver na vista de novo chat
    ? listToDisplayInitially.filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : listToDisplayInitially;

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-800">
      <div className="flex h-full w-full overflow-hidden shadow-2xl md:h-[95%] md:w-[95%] md:max-w-6xl md:rounded-lg">
        <Sidebar
          archivedChatsCount={archivedUserChats.length > 0 ? archivedUserChats.length : 0}
          onSelectChat={handleSelectChat}
          activeChatId={activeChat?.id}
          onToggleArchivedView={handleToggleArchivedView}
          showArchived={showArchivedView}
          currentDisplayedChats={currentFilteredChats}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          showNewChatView={showNewChatView} // Nova prop
          onToggleNewChatView={handleToggleNewChatView} // Nova prop
          availableContacts={availableContacts} // Nova prop
          onStartNewChat={handleStartNewChat} // Nova prop
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