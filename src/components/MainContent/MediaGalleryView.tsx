import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPhotoFilm, faLink, faFileLines, faFileImage, faFileVideo, faFileAudio } from '@fortawesome/free-solid-svg-icons';
import type { Message, Chat } from '../../types';

interface MediaGalleryViewProps {
  chatInfo: Chat;
  chatMessages: Message[];
  onClose: () => void;
  // onItemClick?: (message: Message) => void; // For future: navigate to message in chat
}

const MediaGalleryView: React.FC<MediaGalleryViewProps> = ({
  chatInfo,
  chatMessages,
  onClose,
  // onItemClick,
}) => {
  const mediaMessages = (chatMessages || []).filter(
    msg => msg.imageUrl || msg.videoUrl || msg.audioUrl || (msg.mediaType === 'document' && msg.fileName)
  ).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Show newest first

  const renderMediaItem = (message: Message) => {
    let icon = faFileImage;
    let previewContent: React.ReactNode;
    let title = message.text || message.fileName || 'Media Item';

    if (message.imageUrl) {
      icon = faFileImage;
      previewContent = <img src={message.imageUrl} alt={title} className="h-full w-full object-cover" />;
    } else if (message.videoUrl) {
      icon = faFileVideo;
      previewContent = <FontAwesomeIcon icon={faFileVideo} className="text-4xl text-whatsapp-icon" />;
    } else if (message.audioUrl) {
      icon = faFileAudio;
      previewContent = <FontAwesomeIcon icon={faFileAudio} className="text-4xl text-whatsapp-icon" />;
    } else if (message.mediaType === 'document' && message.fileName) {
      icon = faFileLines;
      previewContent = <FontAwesomeIcon icon={faFileLines} className="text-4xl text-whatsapp-icon" />;
      title = message.fileName;
    } else {
      // Fallback for unknown or non-displayable media
      previewContent = <FontAwesomeIcon icon={faPhotoFilm} className="text-4xl text-whatsapp-icon" />;
    }

    return (
      <div 
        key={message.id} 
        className="group relative aspect-square bg-whatsapp-input-bg rounded-lg overflow-hidden shadow-md cursor-pointer"
        // onClick={() => onItemClick && onItemClick(message)}
      >
        <div className="h-full w-full flex items-center justify-center">
          {previewContent}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-xs text-white truncate">{title}</p>
          <p className="text-xs text-gray-300">{new Date(message.timestamp).toLocaleDateString('pt-PT', { day:'2-digit', month:'short' })}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-whatsapp-sidebar-bg text-whatsapp-text-primary w-full">
      <header className="flex h-[60px] items-center bg-whatsapp-header-bg p-3 text-whatsapp-text-primary sticky top-0 z-10 border-b border-gray-700/50">
        <button onClick={onClose} className="mr-6 text-xl text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="flex flex-col">
            <h2 className="text-lg font-medium">Mídia, links e docs</h2>
            <p className="text-xs text-whatsapp-text-secondary">{chatInfo.name}</p>
        </div>
      </header>

      {mediaMessages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <FontAwesomeIcon icon={faPhotoFilm} className="mb-4 text-5xl text-whatsapp-icon/30" />
          <p className="text-lg text-whatsapp-text-primary">Nenhuma mídia para mostrar</p>
          <p className="text-sm text-whatsapp-text-secondary">
            Mídias, links e documentos compartilhados nesta conversa aparecerão aqui.
          </p>
        </div>
      ) : (
        // TODO: Add Tabs for "Media", "Docs", "Links"
        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3">
            {mediaMessages.map(renderMediaItem)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGalleryView; 