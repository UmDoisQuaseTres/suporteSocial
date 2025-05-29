import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatHeader from '../ChatHeader';
import type { ActiveChat } from '../../../../types';

const mockChat: ActiveChat = {
  id: 'test-chat-1',
  type: 'user',
  name: 'Test User',
  avatarUrl: 'test-avatar.jpg',
  lastActivity: Date.now(),
  messages: [],
  participants: [
    { id: 'currentUser', name: 'Current User' },
    { id: 'otherUser', name: 'Other User' },
  ],
};

describe('ChatHeader', () => {
  const defaultProps = {
    chat: mockChat,
    onToggleArchiveStatus: vi.fn(),
    onShowContactInfo: vi.fn(),
    onClearChatMessages: vi.fn(),
    onDeleteChat: vi.fn(),
    chatSearchTerm: '',
    onChatSearchChange: vi.fn(),
    onToggleChatSearch: vi.fn(),
    isChatSearchActive: false,
  };

  it('renders chat name correctly', () => {
    render(<ChatHeader {...defaultProps} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows search input when search is active', () => {
    render(<ChatHeader {...defaultProps} isChatSearchActive={true} />);
    expect(screen.getByPlaceholderText('Pesquisar mensagens...')).toBeInTheDocument();
  });

  it('calls onShowContactInfo when header is clicked', () => {
    render(<ChatHeader {...defaultProps} />);
    fireEvent.click(screen.getByText('Test User'));
    expect(defaultProps.onShowContactInfo).toHaveBeenCalledWith(mockChat);
  });

  it('calls onToggleArchiveStatus when archive button is clicked', () => {
    render(<ChatHeader {...defaultProps} />);
    fireEvent.click(screen.getByTitle(/Arquivar Conversa/));
    expect(defaultProps.onToggleArchiveStatus).toHaveBeenCalledWith(mockChat.id);
  });

  it('shows correct status for group chat', () => {
    const groupChat: ActiveChat = {
      ...mockChat,
      type: 'group',
      participants: [
        { id: 'user1', name: 'User 1' },
        { id: 'user2', name: 'User 2' },
        { id: 'user3', name: 'User 3' },
      ],
    };
    
    render(<ChatHeader {...defaultProps} chat={groupChat} />);
    expect(screen.getByText('3 participantes')).toBeInTheDocument();
  });

  it('handles search term changes', () => {
    render(<ChatHeader {...defaultProps} isChatSearchActive={true} />);
    const searchInput = screen.getByPlaceholderText('Pesquisar mensagens...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(defaultProps.onChatSearchChange).toHaveBeenCalledWith('test search');
  });

  it('confirms before deleting chat', () => {
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);
    
    render(<ChatHeader {...defaultProps} />);
    fireEvent.click(screen.getByText('Apagar conversa'));
    
    expect(window.confirm).toHaveBeenCalled();
    expect(defaultProps.onDeleteChat).toHaveBeenCalledWith(mockChat.id);
    
    window.confirm = originalConfirm;
  });
}); 