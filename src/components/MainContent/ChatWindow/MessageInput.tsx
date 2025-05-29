import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faPlus, faMicrophone, faPaperPlane, faLock } from '@fortawesome/free-solid-svg-icons'; // Adicionado faLock
import ImportedEmojiPicker, { type EmojiClickData, Theme, EmojiStyle } from 'emoji-picker-react';

interface MessageInputProps {
  chatId: string;
  onSendMessage: (chatId: string, messageText: string) => void;
  isChatBlocked?: boolean; // Nova prop
  onOpenContactInfo?: () => void; // Nova prop
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId, onSendMessage, isChatBlocked, onOpenContactInfo }) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => { /* ...como antes... */
    setInputText(event.target.value);
    adjustTextareaHeight();
  };
  const adjustTextareaHeight = () => { /* ...como antes... */
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };
  useEffect(() => { adjustTextareaHeight(); }, [inputText]);

  const handleEmojiClick = (emojiData: EmojiClickData) => { /* ...como antes... */
    const textarea = inputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + emojiData.emoji + text.substring(end);
      setInputText(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emojiData.emoji.length;
        adjustTextareaHeight();
      }, 0);
    } else {
      setInputText((prevText) => prevText + emojiData.emoji);
    }
  };
  const handleSend = () => { /* ...como antes... */
    if (inputText.trim()) {
      onSendMessage(chatId, inputText.trim());
      setInputText('');
      setShowEmojiPicker(false);
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => { /* ...como antes... */
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };
  const toggleEmojiPicker = (event: React.MouseEvent) => { /* ...como antes... */
    event.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };
  useEffect(() => { /* ...lógica para fechar emoji picker ao clicar fora, como antes... */
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) && !(event.target instanceof HTMLElement && event.target.closest('.emoji-toggle-button'))) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) { document.addEventListener('mousedown', handleClickOutside); }
    else { document.removeEventListener('mousedown', handleClickOutside); }
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [showEmojiPicker]);

  if (isChatBlocked) {
    return (
      <footer className="flex flex-col items-center justify-center space-x-2 border-t border-gray-700/50 bg-whatsapp-header-bg p-3 text-center">
        <FontAwesomeIcon icon={faLock} className="mb-2 text-xl text-whatsapp-text-secondary" />
        <p className="text-sm text-whatsapp-text-secondary">
          Você bloqueou este contacto.
        </p>
        {onOpenContactInfo && (
          <button
            onClick={onOpenContactInfo}
            className="mt-1 text-xs text-teal-400 hover:text-teal-300 focus:outline-none"
          >
            Toque para ver os dados do contacto e desbloquear.
          </button>
        )}
      </footer>
    );
  }

  return (
    <footer className="relative flex items-end space-x-2 border-t border-gray-700/50 bg-whatsapp-header-bg p-3 md:space-x-3">
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-full mb-2 left-0 z-20">
          <ImportedEmojiPicker
            onEmojiClick={handleEmojiClick} autoFocusSearch={false}
            theme={Theme.DARK}
            emojiStyle={EmojiStyle.NATIVE}
            lazyLoadEmojis={true} height={350} width="100%"
          />
        </div>
      )}
      <button title="Emojis" onClick={toggleEmojiPicker} className="emoji-toggle-button p-2 text-xl text-whatsapp-icon hover:text-gray-200">
        <FontAwesomeIcon icon={faSmile} />
      </button>
      <button title="Anexar" className="p-2 text-xl text-whatsapp-icon hover:text-gray-200">
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <textarea
        ref={inputRef} value={inputText} onChange={handleInputChange}
        onKeyPress={handleKeyPress} placeholder="Digite uma mensagem"
        className="message-input-scrollbar max-h-24 flex-1 resize-none overflow-y-auto rounded-lg bg-whatsapp-input-bg px-4 py-2 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none"
        rows={1} onClick={() => setShowEmojiPicker(false)}
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