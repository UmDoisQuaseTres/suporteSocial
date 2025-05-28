import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import type { Chat, ActiveChat, Message } from './types'; // Importe seus tipos

// Dados de exemplo (MOCK) - idealmente viriam de uma API ou estado global
const mockChats: Chat[] = [
  {
    id: '1',
    type: 'user',
    name: 'Amigo 1',
    avatarUrl: 'https://placehold.co/50x50/25D366/FFFFFF?text=A1',
    lastMessage: { id: 'm1', text: 'Ok, combinado!', timestamp: Date.now() - 100000, senderId: 'user1', type: 'outgoing', status: 'read'},
    unreadCount: 0,
    lastActivity: Date.now() - 100000,
  },
  {
    id: '2',
    type: 'group',
    name: 'Grupo da Família',
    avatarUrl: 'https://placehold.co/50x50/FBC531/FFFFFF?text=G',
    lastMessage: { id: 'm2', text: 'João: Foto nova!', timestamp: Date.now() - 86400000, senderId: 'user2', type: 'incoming', userName: 'João'},
    unreadCount: 3,
    lastActivity: Date.now() - 86400000,
  },
  {
    id: '3',
    type: 'user',
    name: 'Colega de Trabalho',
    avatarUrl: 'https://placehold.co/50x50/3498DB/FFFFFF?text=C2',
    lastMessage: { id: 'm3', text: 'Áudio (0:15)', timestamp: Date.now() - 172800000, senderId: 'user3', type: 'incoming' },
    unreadCount: 0,
    lastActivity: Date.now() - 172800000,
  },
];

const mockMessages: { [chatId: string]: Message[] } = {
  '1': [
    { id: 'msg1-1', text: 'Olá! Tudo bem por aí?', timestamp: Date.now() - 120000, senderId: 'amigo1', type: 'incoming' },
    { id: 'msg1-2', text: 'Oi! Tudo ótimo, e com você?', timestamp: Date.now() - 110000, senderId: 'currentUser', type: 'outgoing', status: 'read' },
  ],
  '2': [
    { id: 'msg2-1', text: 'Alguém viu meu óculos?', userName: 'Tia Maria', timestamp: Date.now() - 90000000, senderId: 'tiaMaria', type: 'incoming' },
    { id: 'msg2-2', text: 'Foto nova!', userName: 'João', imageUrl: 'https://placehold.co/300x200/RANDOM/FFFFFF?text=Foto+Grupo', timestamp: Date.now() - 86400000, senderId: 'joao', type: 'incoming' },
  ],
  '3': [], // Chat sem mensagens carregadas inicialmente
};


function App() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [currentUserId] = useState<string>('currentUser'); // ID do usuário logado

  const handleSelectChat = (chat: Chat) => {
    // Simula o carregamento de mensagens para o chat selecionado
    const messagesForSelectedChat = mockMessages[chat.id] || [];
    setActiveChat({ ...chat, messages: messagesForSelectedChat });

    // Marcar chat como lido (atualizar unreadCount para 0)
    setChats(prevChats => prevChats.map(c =>
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendMessage = (chatId: string, messageText: string): void => {
    if (!activeChat || activeChat.id !== chatId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: messageText,
      timestamp: Date.now(),
      senderId: currentUserId,
      type: 'outgoing',
      status: 'sent',
    };

    // Adicionar mensagem ao chat ativo na UI
    setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);

    // Atualizar lastMessage no chat da lista
    setChats(prevChats => prevChats.map(c =>
      c.id === chatId ? { ...c, lastMessage: newMessage, lastActivity: newMessage.timestamp } : c
    ).sort((a,b) => b.lastActivity - a.lastActivity) // Reordena chats
    );


    // TODO: Aqui você chamaria a API para enviar a mensagem
    console.log(`Enviando mensagem para ${chatId}: ${messageText}`);

    // Simular resposta (para demonstração)
    setTimeout(() => {
      if (activeChatRef.current && activeChatRef.current.id === chatId) { // Checa se o chat ainda está ativo
        const replyMessage: Message = {
          id: `reply-${Date.now()}`,
          text: `Resposta para: "${messageText.substring(0, 20)}..."`,
          timestamp: Date.now(),
          senderId: activeChatRef.current.id, // O "outro" usuário do chat
          type: 'incoming',
          userName: activeChatRef.current.type === 'group' ? 'Outro Membro' : undefined,
        };
        setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, replyMessage] } : null);
        setChats(prevChats => prevChats.map(c =>
          c.id === chatId ? { ...c, lastMessage: replyMessage, lastActivity: replyMessage.timestamp } : c
        ).sort((a,b) => b.lastActivity - a.lastActivity));
      }
    }, 1500);
  };

  // Usar ref para activeChat dentro do setTimeout para pegar o valor mais recente
  const activeChatRef = React.useRef(activeChat);
  React.useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);


  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-800">
      <div className="flex h-full w-full overflow-hidden shadow-2xl md:h-[95%] md:w-[95%] md:max-w-6xl md:rounded-lg">
        <Sidebar
          chats={chats}
          onSelectChat={handleSelectChat}
          activeChatId={activeChat?.id}
        />
        <MainContent
          activeChat={activeChat}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;