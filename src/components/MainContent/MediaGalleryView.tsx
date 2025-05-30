import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPhotoFilm, faLink, faFileLines, faFileImage, faFileVideo, faFileAudio } from '@fortawesome/free-solid-svg-icons';
import type { Message, Chat } from '../../types';

interface MediaGalleryViewProps {
  chatInfo: Chat;
  chatMessages: Message[];
  onClose: () => void;
  // onItemClick?: (message: Message) => void; // For future: navigate to message in chat
}

type TabCategory = 'Media' | 'Docs' | 'Links';

const MediaGalleryView: React.FC<MediaGalleryViewProps> = ({
  chatInfo,
  chatMessages,
  onClose,
  // onItemClick,
}) => {
  const [activeTab, setActiveTab] = useState<TabCategory>('Media');

  const filteredMessages = (chatMessages || []).filter(msg => {
    if (activeTab === 'Media') {
      return msg.imageUrl || msg.videoUrl || msg.audioUrl; // Include audio in Media for now
    }
    if (activeTab === 'Docs') {
      return msg.mediaType === 'document' && msg.fileName;
    }
    if (activeTab === 'Links') {
      // Basic link detection (can be improved with regex)
      return msg.text && (msg.text.includes('http://') || msg.text.includes('https://'));
    }
    return false;
  }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const renderMediaItem = (message: Message) => {
    let icon = faFileImage;
    let previewContent: React.ReactNode;
    let title = message.text || message.fileName || 'Media Item';
    let date = new Date(message.timestamp).toLocaleDateString('pt-PT', { day:'2-digit', month:'short' });

    if (activeTab === 'Links' && message.text) {
        icon = faLink;
        previewContent = (
            <div className="p-4 text-center">
                <FontAwesomeIcon icon={faLink} className="text-4xl text-whatsapp-icon mb-2" />
                <p className="text-xs text-blue-400 hover:underline break-all">{message.text}</p>
            </div>
        );
        title = message.text; // Full text as title for link
    } else if (message.imageUrl) {
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
        className={`group relative aspect-square bg-whatsapp-input-bg rounded-lg overflow-hidden shadow-md ${activeTab === 'Links' ? '' : 'cursor-pointer'}`}
        // onClick={() => onItemClick && onItemClick(message)}
      >
        <div className="h-full w-full flex items-center justify-center">
          {previewContent}
        </div>
        {activeTab !== 'Links' && (
             <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-xs text-white truncate">{title}</p>
                <p className="text-xs text-gray-300">{date}</p>
            </div>
        )}
      </div>
    );
  };

  const TabButton: React.FC<{label: TabCategory}> = ({ label }) => (
    <button
        onClick={() => setActiveTab(label)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
            ${activeTab === label 
                ? 'bg-whatsapp-light-green text-white' 
                : 'text-whatsapp-text-secondary hover:bg-whatsapp-header-bg hover:text-whatsapp-text-primary'}
        `}
    >
        {label}
    </button>
  );

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

      {/* Tabs */}
      <div className="flex space-x-2 p-3 border-b border-gray-700/50 bg-whatsapp-header-bg">
        <TabButton label="Media" />
        <TabButton label="Docs" />
        <TabButton label="Links" />
      </div>

      {filteredMessages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <FontAwesomeIcon 
            icon={activeTab === 'Media' ? faPhotoFilm : activeTab === 'Docs' ? faFileLines : faLink} 
            className="mb-4 text-5xl text-whatsapp-icon/30" 
          />
          <p className="text-lg text-whatsapp-text-primary">Nenhum item em "{activeTab}"</p>
          <p className="text-sm text-whatsapp-text-secondary">
            {activeTab === 'Links' 
                ? 'Links compartilhados nesta conversa aparecerão aqui.' 
                : 'Mídias e documentos compartilhados nesta conversa aparecerão aqui.'}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          <div className={`grid ${activeTab === 'Links' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'} gap-2 md:gap-3`}>
            {filteredMessages.map(renderMediaItem)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGalleryView; 