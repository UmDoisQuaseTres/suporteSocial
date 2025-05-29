import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faPlus, faMicrophone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker, { type EmojiClickData, Theme, EmojiStyle } from 'emoji-picker-react'; // Importações do emoji-picker-react

interface MessageInputProps {
  chatId: string;
  onSendMessage: (chatId: string, messageText: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Estado para controlar o seletor de emojis
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null); // Ref para o container do emoji picker

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    // Insere o emoji na posição atual do cursor ou no final
    const textarea = inputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + emojiData.emoji + text.substring(end);
      setInputText(newText);
      // Foca e move o cursor para depois do emoji inserido
      // O delay é para dar tempo ao React de atualizar o valor do input
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emojiData.emoji.length;
        adjustTextareaHeight();
      }, 0);
    } else {
      setInputText((prevText) => prevText + emojiData.emoji);
    }
    // setShowEmojiPicker(false); // Opcional: fechar o picker após selecionar um emoji
  };

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(chatId, inputText.trim());
      setInputText('');
      setShowEmojiPicker(false); // Fecha o emoji picker ao enviar
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const toggleEmojiPicker = (event: React.MouseEvent) => {
    event.stopPropagation(); // Impede que o clique feche o picker imediatamente se ele estiver aberto
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Efeito para fechar o emoji picker ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        // Adicionalmente, verifica se o clique não foi no botão de toggle
        !(event.target instanceof HTMLElement && event.target.closest('.emoji-toggle-button'))
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);


  return (
    <footer className="relative flex items-end space-x-2 border-t border-gray-700/50 bg-whatsapp-header-bg p-3 md:space-x-3">
      {/* Container do Emoji Picker posicionado absolutamente */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-full mb-2 left-0 z-20"> {/* Posiciona acima do input */}
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            theme={Theme.DARK} // Tema escuro para combinar com a UI
            emojiStyle={EmojiStyle.NATIVE} // Para usar emojis nativos do sistema, mais leve
            lazyLoadEmojis={true}
            height={350}
            width="100%" // Ajusta à largura do container da sidebar se precisar ou valor fixo
            // width={320}
            searchDisabled // Desabilitar pesquisa se não quiser
            // previewConfig={{ showPreview: false }} // Desabilitar preview do emoji se quiser
          />
        </div>
      )}

      <button
        title="Emojis"
        onClick={toggleEmojiPicker}
        className="emoji-toggle-button p-2 text-xl text-whatsapp-icon hover:text-gray-200" // Adicionada classe para o useEffect
      >
        <FontAwesomeIcon icon={faSmile} />
      </button>
      <button title="Anexar" className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <textarea
        ref={inputRef}
        value={inputText}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Digite uma mensagem"
        className="message-input-scrollbar max-h-24 flex-1 resize-none overflow-y-auto rounded-lg bg-whatsapp-input-bg px-4 py-2 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none"
        rows={1}
        onClick={() => setShowEmojiPicker(false)} // Fecha o picker se clicar no textarea
      />
      <button
        title={inputText.trim() ? "Enviar" : "Microfone"}
        onClick={inputText.trim() ? handleSend : () => alert('Funcionalidade de microfone não implementada.')}
        className="flex h-10 w-10 items-center justify-center p-2 text-xl text-whatsapp-icon hover:text-gray-200"
      >
        <FontAwesomeIcon icon={inputText.trim() ? faPaperPlane : faMicrophone} />
      </button>
    </footer>
  );
};

export default MessageInput;