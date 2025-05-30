import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  // duration?: number; // Can be used later for custom controls
  isOutgoing: boolean; // For potential future styling differences
  caption?: string; // If we want to display caption directly with player
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, isOutgoing, caption }) => {
  return (
    <div className={`relative my-1.5 w-full max-w-xs md:max-w-sm ${isOutgoing ? 'ml-auto' : 'mr-auto'}`}>
      <video 
        src={videoUrl} 
        controls 
        preload="metadata"
        className="w-full rounded-md aspect-video object-cover"
        // poster={/* Optional: URL to a poster image */} 
      >
        Seu navegador não suporta a tag de vídeo.
      </video>
      {/* 
        // If caption needs to be displayed integrated with the player background (not common for WhatsApp)
        caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1.5 text-white text-xs">
          {caption}
        </div>
      ) */}
    </div>
  );
};

export default VideoPlayer; 