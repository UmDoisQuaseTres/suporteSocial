import type { Chat, Message, User } from './types';

export const mockUsers: { [id: string]: User } = {
  'currentUser': { id: 'currentUser', name: 'Eu', avatarUrl: 'https://placehold.co/40x40/FFFFFF/000000?text=EU', about: 'Eu sou o usuário atual' },
  'amigo1': { id: 'amigo1', name: 'Amigo 1', avatarUrl: 'https://placehold.co/50x50/25D366/FFFFFF?text=A1', about: 'Amigo 1 é um amigo de longa data' },
  'user2': { id: 'user2', name: 'João', avatarUrl: 'https://placehold.co/50x50/FBC531/FFFFFF?text=J', about: 'Apenas João.' },
  'user3': { id: 'user3', name: 'Colega de Trabalho', avatarUrl: 'https://placehold.co/50x50/3498DB/FFFFFF?text=C2', about: 'Colega gente boa.' },
  'promoBot': { id: 'promoBot', name: 'Promo Bot', avatarUrl: 'https://placehold.co/50x50/E74C3C/FFFFFF?text=N' },
  'tiaMaria': { id: 'tiaMaria', name: 'Tia Maria', avatarUrl: 'https://placehold.co/50x50/AAAAAA/FFFFFF?text=TM', about: 'Adoro a família!'},
  'amigo2': { id: 'amigo2', name: 'Amigo Distante', avatarUrl: 'https://placehold.co/50x50/8E44AD/FFFFFF?text=A2', about: 'Viajando o mundo.'},
  'chefe': { id: 'chefe', name: 'Chefe', avatarUrl: 'https://placehold.co/50x50/34495E/FFFFFF?text=C', about: 'Work hard, play hard.'},
};

export const initialMockChats: Chat[] = [
  {
    id: '1', type: 'user', name: mockUsers['amigo1'].name, avatarUrl: mockUsers['amigo1'].avatarUrl,
    lastMessage: { id: 'm1', text: 'Ok, combinado!', timestamp: Date.now() - 100000, senderId: 'currentUser', type: 'outgoing', status: 'read'},
    unreadCount: 0, lastActivity: Date.now() - 100000, isArchived: false, participants: [mockUsers['currentUser'], mockUsers['amigo1']],
    isMuted: false, isBlocked: false,
  },
  {
    id: 'group1', type: 'group', name: 'Grupo da Família', avatarUrl: 'https://placehold.co/50x50/FBC531/FFFFFF?text=G',
    lastMessage: { id: 'm2', text: 'Foto nova!', timestamp: Date.now() - 86400000, senderId: 'user2', type: 'incoming', userName: mockUsers['user2'].name, mediaType: 'image', imageUrl: '...'},
    unreadCount: 0, lastActivity: Date.now() - 86400000, participants: [mockUsers['user2'], mockUsers['currentUser'], mockUsers['tiaMaria']], isArchived: false,
    isMuted: true,
  },
  {
    id: '3', type: 'user', name: mockUsers['user3'].name, avatarUrl: mockUsers['user3'].avatarUrl,
    lastMessage: { id: 'm3', text: 'Áudio (0:15)', timestamp: Date.now() - 172800000, senderId: 'user3', type: 'incoming', mediaType: 'audio' },
    unreadCount: 1, lastActivity: Date.now() - 172800000, isArchived: true, participants: [mockUsers['currentUser'], mockUsers['user3']],
    isMuted: false, isBlocked: true,
  },
];

export const initialMockMessages: { [chatId: string]: Message[] } = {
  '1': [ { id: 'msg1-1', text: 'Olá! Tudo bem por aí?', timestamp: Date.now() - 120000, senderId: 'amigo1', type: 'incoming' }, { id: 'msg1-2', text: 'Ok, combinado!', timestamp: Date.now() - 100000, senderId: 'currentUser', type: 'outgoing', status: 'read' },],
  'group1': [ { id: 'msg2-1', text: 'Alguém viu meu óculos?', userName: mockUsers['tiaMaria'].name, timestamp: Date.now() - 90000000, senderId: 'tiaMaria', type: 'incoming' }, { id: 'msg2-2', text: 'Foto nova!', userName: mockUsers['user2'].name, imageUrl: 'https://placehold.co/300x200/RANDOM/FFFFFF?text=Foto+Grupo', mediaType:'image', timestamp: Date.now() - 86400000, senderId: 'user2', type: 'incoming' }, ],
  '3': [ { id: 'msg3-1', text: 'Este é um chat arquivado.', timestamp: Date.now() - 180000000, senderId: 'user3', type: 'incoming' }, { id: 'msg3-2', text: 'Entendido.', timestamp: Date.now() - 179000000, senderId: 'currentUser', type: 'outgoing', status: 'delivered' }, ],
};
