import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmile, faPlus, faMicrophone, faPaperPlane, faLock,
  faFileAlt, faCamera, faImage,
  faStopCircle, faTrashAlt // Added icons for recording controls
} from '@fortawesome/free-solid-svg-icons';
import ImportedEmojiPicker, { type EmojiClickData, Theme, EmojiStyle } from 'emoji-picker-react';
import AttachmentMenuItem from './AttachmentMenuItem'; // Import the new component

interface MessageInputProps {
  chatId: string;
  onSendMessage: (chatId: string, messageContent: { 
    text?: string; 
    imageUrl?: string; 
    fileName?: string;
    audioUrl?: string; // Added audioUrl
    duration?: number; // Added duration
    mediaType?: 'image' | 'document' | 'audio'; // Added audio to mediaType
  }) => void;
  isChatBlocked?: boolean;
  onOpenContactInfo?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId, onSendMessage, isChatBlocked, onOpenContactInfo }) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden image input
  const documentInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden document input
  
  // States for audio recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

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
  const handleSend = () => { 
    if (isRecording) { // If recording, stop and send
      stopRecordingAndSend();
      return;
    }
    if (inputText.trim()) { 
      onSendMessage(chatId, { text: inputText.trim() }); 
      setInputText(''); 
      setShowEmojiPicker(false); 
      setShowAttachmentMenu(false); 
    } 
  };
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        // Send image with current inputText as caption. Clear input text.
        onSendMessage(chatId, { imageUrl, text: inputText.trim() || undefined, mediaType: 'image' });
        setInputText(''); // Clear text input after sending image
        setShowAttachmentMenu(false); // Close attachment menu
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value so the same file can be selected again if needed
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For documents, we just send the file name and type. No local preview like images for now.
      // A real implementation would upload the file and get a URL.
      onSendMessage(chatId, { 
        fileName: file.name, 
        text: inputText.trim() || undefined, // Use current input text as caption
        mediaType: 'document' 
      });
      setInputText(''); // Clear text input after selecting document
      setShowAttachmentMenu(false); // Close attachment menu
    }
    // Reset file input value
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleAttachmentOptionClick = (option: string) => {
    if (option === 'Galeria') {
      imageInputRef.current?.click();
    } else if (option === 'Documento') {
      documentInputRef.current?.click(); // Trigger document file input
    } else {
      console.log(`${option} selecionado.`);
    }
    setShowAttachmentMenu(false); // Ensure menu closes
  };

  const updateRecordingDuration = () => {
    if (recordingStartTime) {
      setRecordingDuration(Math.round((Date.now() - recordingStartTime) / 1000));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // or audio/ogg, etc.
        const audioUrl = URL.createObjectURL(audioBlob);
        const finalDuration = recordingDuration;
        onSendMessage(chatId, { audioUrl, mediaType: 'audio', duration: finalDuration });
        
        // Clean up stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecordingStartTime(Date.now());
      setIsRecording(true);
      setRecordingDuration(0);
      if(recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(updateRecordingDuration, 1000) as unknown as number;
      setShowEmojiPicker(false); 
      setShowAttachmentMenu(false);

    } catch (err) {
      console.error("Error starting recording: ", err);
      alert("Não foi possível iniciar a gravação. Verifique as permissões do microfone.");
    }
  };

  const stopRecordingAndSend = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if(recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setRecordingStartTime(null);
      // onSendMessage is called in onstop handler of MediaRecorder
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // Stop stream first
        mediaRecorderRef.current.onstop = null; // Prevent onstop from firing and sending
        mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if(recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setRecordingStartTime(null);
    setRecordingDuration(0);
    audioChunksRef.current = [];
  };

  useEffect(() => {
    // Cleanup timer if component unmounts while recording
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Main send button / mic button logic
  const mainButtonAction = () => {
    if (inputText.trim() && !isRecording) {
      handleSend();
    } else if (!isRecording) {
      startRecording();
    } else { // isRecording
      stopRecordingAndSend();
    }
  };

  const getMainButtonIcon = () => {
    if (isRecording) return faStopCircle; // Or faPaperPlane if we want send icon while recording
    if (inputText.trim()) return faPaperPlane;
    return faMicrophone;
  };

  const getMainButtonTitle = () => {
    if (isRecording) return "Enviar Gravação";
    if (inputText.trim()) return "Enviar";
    return "Gravar Áudio";
  }

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
    <footer className="relative flex items-end space-x-2 border-t border-gray-700/50 bg-whatsapp-header-bg p-2 md:space-x-3">
      {/* Hidden File Input for Images */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: 'none' }}
        onChange={handleImageSelect}
      />
      {/* Hidden File Input for Documents */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx" // Common document types
        ref={documentInputRef}
        style={{ display: 'none' }}
        onChange={handleDocumentSelect}
      />
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
        className="attachment-toggle-button p-2 text-lg text-whatsapp-icon hover:text-gray-200"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <button
        title="Emojis"
        onClick={toggleEmojiPicker}
        className="emoji-toggle-button p-2 text-lg text-whatsapp-icon hover:text-gray-200"
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
      {isRecording ? (
        <div className="flex flex-1 items-center text-sm text-whatsapp-text-secondary">
            <FontAwesomeIcon icon={faMicrophone} className="mr-2 text-red-500 animate-pulse" />
            Gravando... {Math.floor(recordingDuration / 60).toString().padStart(2, '0')}:{ (recordingDuration % 60).toString().padStart(2, '0')}
            <button 
              title="Cancelar Gravação"
              onClick={cancelRecording}
              className="ml-auto p-2 text-lg text-red-500 hover:text-red-400"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
        </div>
      ) : (
        <button
          title={getMainButtonTitle()}
          onClick={mainButtonAction}
          className="flex h-10 w-10 items-center justify-center p-2 text-lg text-whatsapp-icon hover:text-gray-200"
        >
          <FontAwesomeIcon icon={getMainButtonIcon()} />
        </button>
      )}
    </footer>
  );
};

export default MessageInput;