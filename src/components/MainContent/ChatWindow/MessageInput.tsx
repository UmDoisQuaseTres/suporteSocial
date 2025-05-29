import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmile, faPlus, faMicrophone, faPaperPlane, faLock,
  faFileAlt, faCamera, faImage // Ícones para o menu de anexos
} from '@fortawesome/free-solid-svg-icons';
import ImportedEmojiPicker, { type EmojiClickData, Theme, EmojiStyle } from 'emoji-picker-react';

interface MessageInputProps {
  chatId: string;
  onSendMessage: (chatId: string, messageText: string) => void;
  isChatBlocked?: boolean;
  onOpenContactInfo?: () => void;
}

// Novo componente para os itens do menu de anexo
interface AttachmentMenuItemProps {
  icon: any; // IconDefinition
  text: string;
  onClick: () => void;
  colorClass?: string;
}

const AttachmentMenuItem: React.FC<AttachmentMenuItemProps> = ({ icon, text, onClick, colorClass = "bg-blue-500" }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 space-y-1.5 rounded-lg hover:bg-whatsapp-active-chat w-20 h-20 transition-colors duration-150"
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
      <FontAwesomeIcon icon={icon} className="text-white text-lg" />
    </div>
    <span className="text-xs text-whatsapp-text-secondary">{text}</span>
  </button>
);


const MessageInput: React.FC<MessageInputProps> = ({ chatId, onSendMessage, isChatBlocked, onOpenContactInfo }) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false); // Novo estado para o menu de anexos
  const attachmentMenuRef = useRef<HTMLDivElement>(null); // Ref para o menu de anexos
  const attachmentButtonRef = useRef<HTMLButtonElement>(null); // Ref para o botão de anexos (+)

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => { setInputText(event.target.value); adjustTextareaHeight(); };
  const adjustTextareaHeight = () => { if (inputRef.current) { inputRef.current.style.height = 'auto'; inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; } };
  useEffect(() => { adjustTextareaHeight(); }, [inputText]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = inputRef.current;
    if (textarea) {
      const start = textarea.selectionStart; const end = textarea.selectionEnd; const text = textarea.value;
      const newText = text.substring(0, start) + emojiData.emoji + text.substring(end);
      setInputText(newText);
      setTimeout(() => { textarea.focus(); textarea.selectionStart = textarea.selectionEnd = start + emojiData.emoji.length; adjustTextareaHeight(); }, 0);
    } else { setInputText((prevText) => prevText + emojiData.emoji); }
  };
  const handleSend = () => { if (inputText.trim()) { onSendMessage(chatId, inputText.trim()); setInputText(''); setShowEmojiPicker(false); setShowAttachmentMenu(false); } };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleSend(); } };
  
  const toggleEmojiPicker = (event: React.MouseEvent) => { event.stopPropagation(); setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false); };
  const toggleAttachmentMenu = (event: React.MouseEvent) => { event.stopPropagation(); setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); };

  // Efeito para fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) &&
          attachmentButtonRef.current && !attachmentButtonRef.current.contains(event.target as Node) && // Não fechar se clicar no botão de anexo de novo
          !(event.target instanceof HTMLElement && event.target.closest('.emoji-toggle-button'))) { // Não fechar se clicar no botão de emoji de novo
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node) &&
          emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) && // Não fechar se clicar no emoji picker
          !(event.target instanceof HTMLElement && event.target.closest('.attachment-toggle-button'))) { // Não fechar se clicar no botão de anexo de novo
        setShowAttachmentMenu(false);
      }
    };

    if (showEmojiPicker || showAttachmentMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [showEmojiPicker, showAttachmentMenu]);

  const handleAttachmentOptionClick = (option: string) => {
    console.log(`${option} selecionado.`);
    setShowAttachmentMenu(false);
    // Aqui você poderia, no futuro, abrir um seletor de arquivos ou câmera
    // Por agora, apenas fechamos o menu e logamos.
    // Poderia também adicionar um placeholder no input: setInputText(`Anexar ${option}: `);
  };


  if (isChatBlocked) {
    return (
      <footer className="flex flex-col items-center justify-center space-y-1 border-t border-gray-700/50 bg-whatsapp-header-bg p-3 text-center"> {/* Ajustado space-y */}
        <FontAwesomeIcon icon={faLock} className="text-xl text-whatsapp-text-secondary" />
        <p className="text-sm text-whatsapp-text-secondary">Você bloqueou este contacto.</p>
        {onOpenContactInfo && (
          <button onClick={onOpenContactInfo} className="mt-1 text-xs text-teal-400 hover:text-teal-300 focus:outline-none">
            Toque para ver os dados do contacto e desbloquear.
          </button>
        )}
      </footer>
    );
  }

  return (
    <footer className="relative flex items-end space-x-2 border-t border-gray-700/50 bg-whatsapp-header-bg p-3 md:space-x-3">
      {/* Menu de Anexos */}
      {showAttachmentMenu && (
        <div ref={attachmentMenuRef} className="absolute bottom-full mb-2 left-0 z-20 bg-whatsapp-header-bg p-3 rounded-lg shadow-xl border border-gray-700/50">
          <div className="grid grid-cols-3 gap-3">
            <AttachmentMenuItem icon={faFileAlt} text="Documento" colorClass="bg-purple-500" onClick={() => handleAttachmentOptionClick('Documento')} />
            <AttachmentMenuItem icon={faCamera} text="Câmera" colorClass="bg-red-500" onClick={() => handleAttachmentOptionClick('Câmera')} />
            <AttachmentMenuItem icon={faImage} text="Galeria" colorClass="bg-pink-500" onClick={() => handleAttachmentOptionClick('Galeria')} />
            {/* Adicionar mais opções como Áudio, Localização, Contacto se desejar */}
          </div>
        </div>
      )}

      {/* Seletor de Emojis */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-full mb-2 left-0 z-20"> {/* Ajustado left para o EmojiPicker também */}
          <ImportedEmojiPicker
            onEmojiClick={handleEmojiClick} autoFocusSearch={false}
            theme={Theme.DARK} emojiStyle={EmojiStyle.NATIVE}
            lazyLoadEmojis={true} height={350} width={320} // Largura fixa para o picker
          />
        </div>
      )}
      
      <button
        ref={attachmentButtonRef} // Ref para o botão de anexo
        title="Anexar"
        onClick={toggleAttachmentMenu}
        className="attachment-toggle-button p-2 text-xl text-whatsapp-icon hover:text-gray-200"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <button
        title="Emojis"
        onClick={toggleEmojiPicker}
        className="emoji-toggle-button p-2 text-xl text-whatsapp-icon hover:text-gray-200"
      >
        <FontAwesomeIcon icon={faSmile} />
      </button>
      <textarea
        ref={inputRef} value={inputText} onChange={handleInputChange}
        onKeyPress={handleKeyPress} placeholder="Digite uma mensagem"
        className="message-input-scrollbar max-h-24 flex-1 resize-none overflow-y-auto rounded-lg bg-whatsapp-input-bg px-4 py-2 text-sm text-whatsapp-text-primary placeholder-whatsapp-text-secondary focus:outline-none"
        rows={1}
        onClick={() => { setShowEmojiPicker(false); setShowAttachmentMenu(false); }} // Fecha ambos os menus
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