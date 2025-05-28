import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble, faClock } from '@fortawesome/free-solid-svg-icons'; // Adicionado faClock para 'pending'
import type { Message, MessageStatus } from '../../../types';

interface MessageBubbleProps {
  message: Message;
  // currentUserId já está implícito pelo message.type se definido corretamente no App.tsx ao criar a mensagem
}

const formatMessageTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isOutgoing = message.type === 'outgoing';

  const renderStatusIcon = (status?: MessageStatus) => {
    if (!status) return null;
    // Ícones e classes de cor para status da mensagem
    const iconProps = "text-xs ml-1"; // Espaçamento à esquerda do ícone
    switch (status) {
      case 'read':
        return <FontAwesomeIcon icon={faCheckDouble} className={`${iconProps} text-sky-400`} />; // Azul para lido
      case 'delivered':
        return <FontAwesomeIcon icon={faCheckDouble} className={`${iconProps} text-whatsapp-text-secondary/80`} />; // Cinza para entregue
      case 'sent':
        return <FontAwesomeIcon icon={faCheck} className={`${iconProps} text-whatsapp-text-secondary/80`} />; // Cinza para enviado
      case 'pending':
        return <FontAwesomeIcon icon={faClock} className={`${iconProps} text-whatsapp-text-secondary/80`} />; // Cinza para pendente
      default:
        return null;
    }
  };

  return (
    <div className={`flex mb-1 ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-xs rounded-lg px-2.5 py-1.5 shadow md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${ // Aumentado max-width e ajustado padding
          isOutgoing
            ? 'bg-whatsapp-outgoing-bubble text-whatsapp-text-primary rounded-br-none'
            : 'bg-whatsapp-incoming-bubble text-whatsapp-text-primary rounded-tl-none'
        }`}
      >
        {/* Nome do remetente para mensagens de grupo recebidas */}
        {!isOutgoing && message.userName && (
          <p className="mb-0.5 text-xs font-semibold text-teal-400">{message.userName}</p> // Ajustado margin e cor
        )}

        {/* Conteúdo da mensagem (imagem ou texto) */}
        {message.imageUrl && (
          <div className="mt-1 mb-1.5"> {/* Espaçamento para imagem */}
            <img
              src={message.imageUrl}
              alt={message.text || "Imagem enviada"} // Usa o texto como alt se disponível
              className="h-auto max-h-80 w-full cursor-pointer rounded-md object-cover" // object-cover e max-h
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/300x200/CCCCCC/000000?text=Erro';
              }}
            />
          </div>
        )}

        {/* Adicionar um div para o texto principal para melhor controle de espaçamento com o timestamp */}
        {message.text && (
            <p className="text-sm whitespace-pre-wrap break-words" style={{paddingRight: isOutgoing ? '4.5rem' : '0' }}> {/* Adiciona padding à direita no texto se for outgoing para não sobrepor o timestamp/status */}
                {message.text}
            </p>
        )}

        {/* Container para Hora e Status (posicionado absolutamente se outgoing e com texto) */}
        <div
          className={`mt-1 flex items-center ${isOutgoing && message.text ? 'absolute bottom-1.5 right-2.5' : (isOutgoing ? 'justify-end' : 'justify-end ml-auto') }`} // Posicionamento
        >
          <span className={`text-xs ${isOutgoing ? 'text-gray-300/70' : 'text-whatsapp-text-secondary/80'}`}> {/* Cor do timestamp ajustada */}
            {formatMessageTimestamp(message.timestamp)}
          </span>
          {isOutgoing && renderStatusIcon(message.status)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;