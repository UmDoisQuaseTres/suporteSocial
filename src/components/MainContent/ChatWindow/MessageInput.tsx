import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSmile, faPlus, faMicrophone, faPaperPlane, faLock,
  faFileAlt, faCamera, faImage,
  faStopCircle, faTrashAlt,
  faVideo
} from '@fortawesome/free-solid-svg-icons';
import ImportedEmojiPicker, { type EmojiClickData, Theme, EmojiStyle } from 'emoji-picker-react';
import AttachmentMenuItem from './AttachmentMenuItem';
import ReplyPreview from './ReplyPreview';
import type { Message } from '../../../types'; // Ensure Message type is imported

interface MessageInputProps {
  chatId: string;
  onSendMessage: (chatId: string, messageContent: { 
    text?: string; 
    imageUrl?: string; 
    fileName?: string;
    audioUrl?: string;
    videoUrl?: string; 
    duration?: number;
    mediaType?: 'image' | 'document' | 'audio' | 'video';
    replyToMessageId?: string;
    replyToMessagePreview?: string;
    replyToSenderName?: string;
  }) => void;
  isChatBlocked?: boolean;
  onOpenContactInfo?: () => void;
  replyingTo?: Message | null; 
  onCancelReply?: () => void; 
  replyingToSenderNamePreview?: string; 
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  chatId, 
  onSendMessage, 
  isChatBlocked, 
  onOpenContactInfo, 
  replyingTo, 
  onCancelReply,
  replyingToSenderNamePreview
}) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null); 
  const documentInputRef = useRef<HTMLInputElement>(null); 
  const videoInputRef = useRef<HTMLInputElement>(null); 
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false); 
  const attachmentMenuRef = useRef<HTMLDivElement>(null); 
  const attachmentButtonRef = useRef<HTMLButtonElement>(null); 

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
    if (isRecording) { 
      stopRecordingAndSend();
      return;
    }
    if (inputText.trim() || replyingTo) { // Allow sending even if only replying (e.g. forwarding a message with a reply)
      onSendMessage(chatId, { 
        text: inputText.trim() || undefined, 
        ...(replyingTo && { // Add reply context if present
          replyToMessageId: replyingTo.id,
          replyToMessagePreview: replyingTo.text || (replyingTo.mediaType ? replyingTo.mediaType.charAt(0).toUpperCase() + replyingTo.mediaType.slice(1) : 'Mídia'),
          replyToSenderName: replyingToSenderNamePreview || (replyingTo.senderId === 'currentUser' ? 'Você' : 'Usuário') // Fallback if preview name not available
        })
      }); 
      setInputText(''); 
      if (onCancelReply) onCancelReply(); // Clear reply state after sending
      setShowEmojiPicker(false); 
      setShowAttachmentMenu(false); 
    } 
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleSend(); } };
  
  const toggleEmojiPicker = (event: React.MouseEvent) => { event.stopPropagation(); setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false); };
  const toggleAttachmentMenu = (event: React.MouseEvent) => { event.stopPropagation(); setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) &&
          attachmentButtonRef.current && !attachmentButtonRef.current.contains(event.target as Node) && 
          !(event.target instanceof HTMLElement && event.target.closest('.emoji-toggle-button'))) { 
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node) &&
          emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) && 
          !(event.target instanceof HTMLElement && event.target.closest('.attachment-toggle-button'))) { 
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
        onSendMessage(chatId, { 
          imageUrl, 
          text: inputText.trim() || undefined, 
          mediaType: 'image',
          ...(replyingTo && { 
            replyToMessageId: replyingTo.id,
            replyToMessagePreview: replyingTo.text || (replyingTo.mediaType ? replyingTo.mediaType.charAt(0).toUpperCase() + replyingTo.mediaType.slice(1) : 'Mídia'),
            replyToSenderName: replyingToSenderNamePreview || (replyingTo.senderId === 'currentUser' ? 'Você' : 'Usuário')
          })
        });
        setInputText(''); 
        if (onCancelReply) onCancelReply();
        setShowAttachmentMenu(false); 
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const videoUrl = reader.result as string;
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElement.src); 
          const duration = videoElement.duration;
          onSendMessage(chatId, { 
            videoUrl, 
            text: inputText.trim() || undefined, 
            mediaType: 'video', 
            duration, 
            ...(replyingTo && { 
              replyToMessageId: replyingTo.id,
              replyToMessagePreview: replyingTo.text || (replyingTo.mediaType ? replyingTo.mediaType.charAt(0).toUpperCase() + replyingTo.mediaType.slice(1) : 'Mídia'),
              replyToSenderName: replyingToSenderNamePreview || (replyingTo.senderId === 'currentUser' ? 'Você' : 'Usuário')
            })
          });
          setInputText('');
          if (onCancelReply) onCancelReply();
          setShowAttachmentMenu(false);
        };
        videoElement.onerror = () => {
          console.error("Error loading video metadata for duration.");
          onSendMessage(chatId, { 
            videoUrl, 
            text: inputText.trim() || undefined, 
            mediaType: 'video', 
            ...(replyingTo && { 
              replyToMessageId: replyingTo.id,
              replyToMessagePreview: replyingTo.text || (replyingTo.mediaType ? replyingTo.mediaType.charAt(0).toUpperCase() + replyingTo.mediaType.slice(1) : 'Mídia'),
              replyToSenderName: replyingToSenderNamePreview || (replyingTo.senderId === 'currentUser' ? 'Você' : 'Usuário')
            })
          });
          setInputText('');
          if (onCancelReply) onCancelReply();
          setShowAttachmentMenu(false);
        }
        videoElement.src = URL.createObjectURL(file); 
      };
      reader.readAsDataURL(file); 
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSendMessage(chatId, { 
        fileName: file.name, 
        text: inputText.trim() || undefined, 
        mediaType: 'document',
        ...(replyingTo && { 
          replyToMessageId: replyingTo.id,
          replyToMessagePreview: replyingTo.text || (replyingTo.mediaType ? replyingTo.mediaType.charAt(0).toUpperCase() + replyingTo.mediaType.slice(1) : 'Mídia'),
          replyToSenderName: replyingToSenderNamePreview || (replyingTo.senderId === 'currentUser' ? 'Você' : 'Usuário')
        })
      });
      setInputText(''); 
      if (onCancelReply) onCancelReply();
      setShowAttachmentMenu(false); 
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleAttachmentOptionClick = (option: string) => {
    if (option === 'Galeria') {
      imageInputRef.current?.click();
    } else if (option === 'Documento') {
      documentInputRef.current?.click();
    } else if (option === 'Câmera') {
      console.log("Opção 'Câmera' selecionada. Usando o seletor de imagem por enquanto.");
      imageInputRef.current?.click(); 
    } else if (option === 'Vídeo') {
      videoInputRef.current?.click(); 
    } else {
      console.log(`${option} selecionado.`);
    }
    setShowAttachmentMenu(false); 
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); 
        const audioUrl = URL.createObjectURL(audioBlob);
        const finalDuration = recordingDuration;
        onSendMessage(chatId, { 
          audioUrl, 
          mediaType: 'audio', 
          duration: finalDuration,
          ...(replyingTo && { 
            replyToMessageId: replyingTo.id,
            replyToMessagePreview: replyingTo.text || (replyingTo.mediaType ? replyingTo.mediaType.charAt(0).toUpperCase() + replyingTo.mediaType.slice(1) : 'Mídia'),
            replyToSenderName: replyingToSenderNamePreview || (replyingTo.senderId === 'currentUser' ? 'Você' : 'Usuário')
          })
        });
        if (onCancelReply) onCancelReply();
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
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); 
        mediaRecorderRef.current.onstop = null; 
        mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if(recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setRecordingStartTime(null);
    setRecordingDuration(0);
    audioChunksRef.current = [];
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const mainButtonAction = () => {
    if (inputText.trim() && !isRecording) {
      handleSend();
    } else if (!isRecording && !inputText.trim() && replyingTo) { // Allow sending reply even if input is empty (e.g. replying with just a forward)
      handleSend();
    } else if (!isRecording) {
      startRecording();
    } else { 
      stopRecordingAndSend();
    }
  };

  const getMainButtonIcon = () => {
    if (isRecording) return faStopCircle; 
    if (inputText.trim() || replyingTo) return faPaperPlane;
    return faMicrophone;
  };

  const getMainButtonTitle = () => {
    if (isRecording) return "Enviar Gravação";
    if (inputText.trim() || replyingTo) return "Enviar";
    return "Gravar Áudio";
  }

  if (isChatBlocked) {
    return (
      <footer className="flex flex-col items-center justify-center space-y-1 border-t border-gray-700/50 bg-whatsapp-header-bg p-3 text-center">
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
    <footer className="relative flex flex-col border-t border-gray-700/50 bg-whatsapp-header-bg">
      {replyingTo && onCancelReply && replyingToSenderNamePreview && (
        <div className="px-2 pt-2">
          <ReplyPreview 
            repliedMessageText={replyingTo.text || (replyingTo.mediaType ? replyingTo.mediaType.charAt(0).toUpperCase() + replyingTo.mediaType.slice(1) : 'Mídia')}
            repliedMessageSenderName={replyingToSenderNamePreview} 
            isOutgoingBubble={false} 
            onCancelReply={onCancelReply}
            isContextInInput={true}
          />
        </div>
      )}
      <div className="flex items-end space-x-2 p-2 md:space-x-3">
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          style={{ display: 'none' }}
          onChange={handleImageSelect}
        />
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          style={{ display: 'none' }}
          onChange={handleVideoSelect}
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx" 
          ref={documentInputRef}
          style={{ display: 'none' }}
          onChange={handleDocumentSelect}
        />
        {showAttachmentMenu && (
          <div ref={attachmentMenuRef} className="absolute bottom-full mb-2 left-0 z-20 bg-whatsapp-header-bg p-3 rounded-lg shadow-xl border border-gray-700/50">
            <div className="grid grid-cols-3 gap-3">
              <AttachmentMenuItem icon={faFileAlt} text="Documento" colorClass="bg-purple-500" onClick={() => handleAttachmentOptionClick('Documento')} />
              <AttachmentMenuItem icon={faCamera} text="Câmera" colorClass="bg-red-500" onClick={() => handleAttachmentOptionClick('Câmera')} />
              <AttachmentMenuItem icon={faImage} text="Galeria" colorClass="bg-pink-500" onClick={() => handleAttachmentOptionClick('Galeria')} />
              <AttachmentMenuItem icon={faVideo} text="Vídeo" colorClass="bg-orange-500" onClick={() => handleAttachmentOptionClick('Vídeo')} /> 
            </div>
          </div>
        )}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-full mb-2 left-0 z-20">
            <ImportedEmojiPicker
              onEmojiClick={handleEmojiClick} autoFocusSearch={false}
              theme={Theme.DARK} emojiStyle={EmojiStyle.NATIVE}
              lazyLoadEmojis={true} height={350} width={320} 
            />
          </div>
        )}
        <button
          ref={attachmentButtonRef} 
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
          onClick={() => { setShowEmojiPicker(false); setShowAttachmentMenu(false); }}
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
      </div>
    </footer>
  );
};

export default MessageInput;