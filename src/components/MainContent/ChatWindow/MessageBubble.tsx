import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import type { Message, MessageStatus } from '../../../types'; // Certifique-se que o caminho está correto

interface MessageBubbleProps {
  message: Message;
  currentUserId: string; // Para determinar se a mensagem é 'outgoing' ou 'incoming'
}

const formatMessageTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUserId }) => {
  const isOutgoing = message.senderId === currentUserId || message.type === 'outgoing'; // type é mais fiável se definido no App.tsx

  const renderStatusIcon = (status?: MessageStatus) => {
    if (!status) return null;
    switch (status) {
      case 'read':
        return <FontAwesomeIcon icon={faCheckDouble} className="text-xs text-blue-400" />;
      case 'delivered':
        return <FontAwesomeIcon icon={faCheckDouble} className="text-xs text-whatsapp-text-secondary" />;
      case 'sent':
        return <FontAwesomeIcon icon={faCheck} className="text-xs text-whatsapp-text-secondary" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex mb-1 ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs rounded-lg p-2 px-3 shadow lg:max-w-md ${
          isOutgoing
            ? 'bg-whatsapp-outgoing-bubble text-whatsapp-text-primary rounded-br-none'
            : 'bg-whatsapp-incoming-bubble text-whatsapp-text-primary rounded-tl-none'
        }`}
      >
        {/* Nome do remetente para mensagens de grupo recebidas */}
        {!isOutgoing && message.userName && (
          <p className="mb-1 text-xs font-semibold text-teal-400">{message.userName}</p>
        )}

        {/* Conteúdo da mensagem (imagem ou texto) */}
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Imagem enviada"
            className="mb-1 h-auto w-full max-w-[280px] cursor-pointer rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Evita loop de erro
              target.src = 'https://placehold.co/300x200/CCCCCC/000000?text=Erro+ao+carregar';
            }}
          />
        )}
        {message.text && <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>}

        {/* Hora e status da mensagem */}
        <div className={`mt-1 flex items-center ${isOutgoing ? 'justify-end' : 'justify-end'}`}> {/* Hora sempre à direita dentro do balão */}
          <span className="mr-1 text-xs text-whatsapp-text-secondary/80">
            {formatMessageTimestamp(message.timestamp)}
          </span>
          {isOutgoing && renderStatusIcon(message.status)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;