import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faPlus, faMicrophone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface MessageInputProps {
  chatId: string; // ID do chat ativo para enviar a mensagem
  onSendMessage: (chatId: string, messageText: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Redefine a altura
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // Ajusta à altura do conteúdo
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);


  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(chatId, inputText.trim());
      setInputText('');
      // Focar no input novamente após o envio pode ser desejável em alguns casos
      // inputRef.current?.focus();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Impede a quebra de linha
      handleSend();
    }
  };

  return (
    <footer className="flex items-end space-x-2 border-t border-gray-700/50 bg-whatsapp-header-bg p-3 md:space-x-3">
      <button className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
        <FontAwesomeIcon icon={faSmile} />
      </button>
      <button className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <textarea
        ref={inputRef}
        value={inputText}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Digite uma mensagem"
        className="message-input-scrollbar max-h-24 flex-1 resize-none overflow-y-auto rounded-lg bg-whatsapp-input-bg px-4 py-2 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none"
        rows={1} // Começa com uma linha
      />
      <button
        onClick={inputText.trim() ? handleSend : () => alert('Funcionalidade de microfone não implementada.')}
        className="flex h-10 w-10 items-center justify-center p-2 text-xl text-whatsapp-icon hover:text-gray-200"
      >
        <FontAwesomeIcon icon={inputText.trim() ? faPaperPlane : faMicrophone} />
      </button>
    </footer>
  );
};

export default MessageInput;