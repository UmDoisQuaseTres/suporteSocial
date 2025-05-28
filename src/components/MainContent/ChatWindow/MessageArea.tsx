import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { Message } from '../../../types'; // Certifique-se que o caminho está correto

interface MessageAreaProps {
  messages: Message[];
  currentUserId: string;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Rola sempre que as mensagens mudam

  // Agrupar mensagens por data
  const groupedMessages: { [date: string]: Message[] } = messages.reduce((acc, msg) => {
    const dateKey = new Date(msg.timestamp).toLocaleDateString('pt-PT', {day: '2-digit', month: 'long', year: 'numeric'});
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(msg);
    return acc;
  }, {} as { [date: string]: Message[] });


  return (
    <div
      className="chat-scrollbar flex-1 overflow-y-auto bg-cover bg-center p-4 md:p-6 space-y-2"
      style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}
    >
      {Object.entries(groupedMessages).map(([date, msgsInDate]) => (
        <React.Fragment key={date}>
          <div className="my-3 flex justify-center">
            <span className="rounded-full bg-whatsapp-incoming-bubble/80 px-3 py-1 text-xs text-whatsapp-text-secondary shadow">
              {date === new Date().toLocaleDateString('pt-PT', {day: '2-digit', month: 'long', year: 'numeric'}) ? 'Hoje' : date}
            </span>
          </div>
          {msgsInDate.map((message) => (
            <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />
          ))}
        </React.Fragment>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageArea;