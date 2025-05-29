import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { Message } from '../../../types';

interface MessageAreaProps {
  messages: Message[];
  currentUserId: string; // Removido pois MessageBubble já usa message.type
  onStartReply: (message: Message) => void;
  onStartForward: (message: Message) => void;
  onToggleStarMessage: (messageId: string) => void;
  messageToHighlightId?: string | null;
  clearMessageToHighlight?: () => void;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, currentUserId, onStartReply, onStartForward, onToggleStarMessage, messageToHighlightId, clearMessageToHighlight }) => { // currentUserId ainda pode ser útil se MessageBubble não for alterado
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const highlightedMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
        // Para scroll suave em novos chats ou ao carregar muitos,
        // pode ser melhor usar scrollIntoView({ block: 'end' }) na primeira vez
        // e behavior: 'smooth' para novas mensagens individuais.
        // Por agora, mantemos 'smooth'.
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (messageToHighlightId && highlightedMessageRef.current) {
      highlightedMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center' 
      });
      if (clearMessageToHighlight) {
        clearMessageToHighlight();
      }
    } else if (!messageToHighlightId) {
      const timer = setTimeout(() => {
          scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, messageToHighlightId, clearMessageToHighlight]);

  const groupedMessages: { [date: string]: Message[] } = (messages || []).reduce((acc, msg) => { // Adicionado (messages || []) para segurança
    const dateKey = new Date(msg.timestamp).toLocaleDateString('pt-PT', {day: '2-digit', month: 'long', year: 'numeric'});
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(msg);
    return acc;
  }, {} as { [date: string]: Message[] });


  return (
    <div
      className="chat-scrollbar flex-1 overflow-y-auto p-4 md:p-6 space-y-2"
    >
      {Object.entries(groupedMessages).map(([date, msgsInDate]) => (
        <React.Fragment key={date}>
          <div className="my-3 flex justify-center">
            {/* ESTILO DO SEPARADOR DE DATA ATUALIZADO */}
            <span className="rounded-lg bg-whatsapp-date-pill-bg px-2.5 py-1 text-xs font-medium text-whatsapp-text-secondary shadow-sm">
              {date === new Date().toLocaleDateString('pt-PT', {day: '2-digit', month: 'long', year: 'numeric'}) ? 'Hoje' : date}
            </span>
          </div>
          {/* Passando currentUserId para MessageBubble se ele ainda precisar */}
          {msgsInDate.map((message) => (
            <div 
              key={message.id} 
              id={`message-${message.id}`}
              ref={message.id === messageToHighlightId ? highlightedMessageRef : null}
            >
              <MessageBubble 
                message={message} 
                onStartReply={onStartReply}
                onStartForward={onStartForward}
                onToggleStarMessage={onToggleStarMessage}
                isHighlighted={message.id === messageToHighlightId}
              />
            </div>
          ))}
        </React.Fragment>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageArea;