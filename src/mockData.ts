import type { Chat, Message, User } from './types';

export const mockUsers: { [id: string]: User } = {
  'currentUser': { id: 'currentUser', name: 'Eu', avatarUrl: 'https://placehold.co/40x40/FFFFFF/000000?text=EU', about: 'Eu sou o usuário atual' },
  'user1': { id: 'user1', name: 'Alice Freeman', avatarUrl: 'https://i.pravatar.cc/150?img=1', about: 'Frontend Developer' },
  'amigo1': { id: 'amigo1', name: 'Amigo 1', avatarUrl: 'https://placehold.co/50x50/25D366/FFFFFF?text=A1', about: 'Amigo 1 é um amigo de longa data' },
  'user2': { id: 'user2', name: 'João', avatarUrl: 'https://placehold.co/50x50/FBC531/FFFFFF?text=J', about: 'Apenas João.' },
  'user3': { id: 'user3', name: 'Colega de Trabalho', avatarUrl: 'https://placehold.co/50x50/3498DB/FFFFFF?text=C2', about: 'Colega gente boa.' },
  'user4': { id: 'user4', name: 'David Hall', avatarUrl: 'https://i.pravatar.cc/150?img=4', about: 'Musician' },
  'user5': { id: 'user5', name: 'Eva Chen', avatarUrl: 'https://i.pravatar.cc/150?img=5', about: 'Photographer' },
  'promoBot': { id: 'promoBot', name: 'Promo Bot', avatarUrl: 'https://placehold.co/50x50/E74C3C/FFFFFF?text=N' },
  'tiaMaria': { id: 'tiaMaria', name: 'Tia Maria', avatarUrl: 'https://placehold.co/50x50/AAAAAA/FFFFFF?text=TM', about: 'Adoro a família!'},
  'amigo2': { id: 'amigo2', name: 'Amigo Distante', avatarUrl: 'https://placehold.co/50x50/8E44AD/FFFFFF?text=A2', about: 'Viajando o mundo.'},
  'chefe': { id: 'chefe', name: 'Chefe', avatarUrl: 'https://placehold.co/50x50/34495E/FFFFFF?text=C', about: 'Work hard, play hard.'},
};

export const initialMockChats: Omit<Chat, 'messages' | 'lastMessage' | 'unreadCount' | 'lastActivity' | 'isArchived' | 'isMuted' | 'isPinned' | 'isMarkedUnread' | 'typingUserIds'>[] = [
  {
    id: 'chat1',
    type: 'user',
    name: 'Alice Freeman',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    participants: [mockUsers.currentUser, mockUsers.user1],
    isBlocked: false,
  },
  {
    id: 'chat2',
    type: 'user',
    name: 'Bobby Marley',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    participants: [mockUsers.currentUser, mockUsers.user2],
    isBlocked: true,
  },
  {
    id: 'group1',
    type: 'group',
    name: 'Design Team',
    avatarUrl: 'https://placehold.co/50x50/3498DB/FFFFFF?text=DT',
    participants: [mockUsers.currentUser, mockUsers.user1, mockUsers.user3],
    groupAdmins: [mockUsers.currentUser.id, mockUsers.user1.id],
    createdBy: mockUsers.currentUser.id,
    description: 'Grupo para discutir todas as coisas relacionadas ao design. Novas ideias bem-vindas!'
  },
  {
    id: 'chat3',
    type: 'user',
    name: mockUsers['user3'].name,
    avatarUrl: mockUsers['user3'].avatarUrl,
    participants: [mockUsers.currentUser, mockUsers.user3],
    isBlocked: true,
  },
  {
    id: 'group2',
    type: 'group',
    name: 'Gaming Squad',
    avatarUrl: 'https://placehold.co/50x50/E74C3C/FFFFFF?text=GS',
    participants: [mockUsers.currentUser, mockUsers.user2, mockUsers.user4, mockUsers.user5],
    groupAdmins: [mockUsers.user2.id],
    createdBy: mockUsers.user2.id,
    description: 'Só para gamers! Vamos marcar a próxima sessão.'
  },
  {
    id: 'chat5',
    type: 'user',
    name: mockUsers['promoBot'].name,
    avatarUrl: mockUsers['promoBot'].avatarUrl,
    participants: [mockUsers.currentUser, mockUsers['promoBot']],
    isBlocked: false,
  },
];

export const initialMockMessages: { [chatId: string]: Message[] } = {
  'chat1': [
    { id: 'msg1-1', text: 'Olá! Tudo bem por aí?', timestamp: Date.now() - 120000, senderId: 'amigo1', type: 'incoming' },
    { id: 'msg1-2', text: 'Ok, combinado!', timestamp: Date.now() - 100000, senderId: 'currentUser', type: 'outgoing', status: 'read' },
  ],
  'group1': [
    { id: 'msg2-1', text: 'Alguém viu meu óculos?', userName: mockUsers['tiaMaria'].name, timestamp: Date.now() - 90000000, senderId: 'tiaMaria', type: 'incoming' },
    { id: 'msg2-2', text: 'Foto nova!', userName: mockUsers['user2'].name, imageUrl: 'https://placehold.co/300x200/RANDOM/FFFFFF?text=Foto+Grupo', mediaType:'image', timestamp: Date.now() - 86400000, senderId: 'user2', type: 'incoming' },
  ],
  'chat3': [
    { id: 'msg3-1', text: 'Este é um chat arquivado.', timestamp: Date.now() - 180000000, senderId: 'user3', type: 'incoming' },
    { id: 'msg3-2', text: 'Entendido.', timestamp: Date.now() - 179000000, senderId: 'currentUser', type: 'outgoing', status: 'delivered' },
  ],
};
