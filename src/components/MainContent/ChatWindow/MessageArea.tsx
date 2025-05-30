import React, { useEffect, useRef, useMemo, useState } from 'react';
import MessageBubble from './MessageBubble';
import type { Message } from '../../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface MessageAreaProps {
  messages: Message[];
  currentUserId: string; // Removido pois MessageBubble já usa message.type
  onStartReply: (message: Message) => void;
  onStartForward: (message: Message) => void;
  onToggleStarMessage: (messageId: string) => void;
  messageToHighlightId?: string | null;
  clearMessageToHighlight?: () => void;
  chatSearchTerm?: string;
  onJumpToMessage?: (messageId: string) => void;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, currentUserId, onStartReply, onStartForward, onToggleStarMessage, messageToHighlightId, clearMessageToHighlight, chatSearchTerm, onJumpToMessage }) => { // currentUserId ainda pode ser útil se MessageBubble não for alterado
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const highlightedMessageRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);

  const filteredMessages = useMemo(() => {
    if (!chatSearchTerm) {
      return messages;
    }
    return messages.filter(msg => 
      msg.text?.toLowerCase().includes(chatSearchTerm.toLowerCase())
    );
  }, [messages, chatSearchTerm]);

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Scroll handler to show/hide the button
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Show button if scrolled up more than, say, 300px from the bottom
      const threshold = 300;
      const isScrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > threshold;
      setShowScrollToBottomButton(isScrolledUp);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (messageToHighlightId && highlightedMessageRef.current) {
      highlightedMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center' 
      });
      if (clearMessageToHighlight) {
        clearMessageToHighlight();
      }
      setIsInitialLoad(false); 
      // After highlighting, check scroll position to potentially show the button
      const timer = setTimeout(handleScroll, 300); // Check after scroll animation
      return () => clearTimeout(timer);
    } else if (!chatSearchTerm) { 
      if (isInitialLoad && messages.length > 0) {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ block: 'end' }); // Use 'auto' for initial load
        }
        setIsInitialLoad(false);
        setShowScrollToBottomButton(false); // Should be at bottom, hide button
      } else if (!isInitialLoad && messages.length > 0) {
        const container = scrollContainerRef.current;
        let shouldScrollSmoothly = true;
        if (container) {
          // If user is scrolled up significantly, don't auto-scroll unless they are close to bottom
          const nearBottomThreshold = container.clientHeight * 1.5; // e.g., 1.5 times viewport height
          if (container.scrollHeight - container.scrollTop - container.clientHeight > nearBottomThreshold) {
            shouldScrollSmoothly = false;
            setShowScrollToBottomButton(true); // A new message arrived and user is scrolled up
          }
        }
        if (shouldScrollSmoothly) {
          const timer = setTimeout(() => {
            scrollToBottom('smooth');
            // After auto-scrolling, re-evaluate button visibility
            const scrollCheckTimer = setTimeout(handleScroll, 350); // Allow smooth scroll to finish
            return () => clearTimeout(scrollCheckTimer);
          }, 100);
          return () => clearTimeout(timer);
        } 
      }
    }
  }, [messages, messageToHighlightId, clearMessageToHighlight, chatSearchTerm, isInitialLoad]);

  useEffect(() => {
    setIsInitialLoad(true);
    setShowScrollToBottomButton(false); // Reset when messages array changes (new chat)
  }, [messages]);

  const groupedMessages: { [date: string]: Message[] } = (filteredMessages || []).reduce((acc, msg) => { // Adicionado (filteredMessages || []) para segurança
    const dateKey = new Date(msg.timestamp).toLocaleDateString('pt-PT', {day: '2-digit', month: 'long', year: 'numeric'});
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(msg);
    return acc;
  }, {} as { [date: string]: Message[] });


  return (
    <div className="relative flex-1"> {/* Added relative positioning for the button */}
      <div
        ref={scrollContainerRef} // Attach ref here
        className="chat-scrollbar h-full overflow-y-auto p-4 md:p-6 space-y-2"
        onScroll={handleScroll} // Added for immediate feedback on scroll
      >
        {chatSearchTerm && filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center text-whatsapp-text-secondary">
            <FontAwesomeIcon icon={faSearch} className="mb-4 text-4xl text-whatsapp-icon/50" />
            <p className="text-sm">Nenhuma mensagem encontrada para "{chatSearchTerm}".</p>
          </div>
        )}
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
                  searchTermToHighlight={chatSearchTerm}
                  onJumpToMessage={onJumpToMessage}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={messagesEndRef} />
      {showScrollToBottomButton && (
        <button
          onClick={() => scrollToBottom('smooth')} // Smooth scroll when button is clicked
          className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-whatsapp-header-bg text-whatsapp-icon shadow-lg hover:bg-whatsapp-input-bg focus:outline-none focus:ring-2 focus:ring-whatsapp-light-green focus:ring-offset-2 focus:ring-offset-whatsapp-chat-bg"
          title="Rolar para baixo"
        >
          <FontAwesomeIcon icon={faChevronDown} className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default MessageArea;