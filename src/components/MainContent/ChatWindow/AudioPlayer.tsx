import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

interface AudioPlayerProps {
  audioUrl: string;
  duration?: number; // Duration in seconds
  isOutgoing: boolean;
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, duration, isOutgoing }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [totalDuration, setTotalDuration] = useState(duration || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        if (duration === undefined || duration === 0) {
          setTotalDuration(audio.duration);
        }
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleEnded);

      // Set initial duration if available from props
      if (duration && duration > 0) setTotalDuration(duration);

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl, duration]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const time = Number(event.target.value);
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newVolume = Number(event.target.value);
      audio.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const playerColorClass = isOutgoing ? 'text-gray-300' : 'text-whatsapp-text-secondary';
  const progressBgClass = isOutgoing ? 'bg-whatsapp-green' : 'bg-whatsapp-light-green';
  const thumbColorClass = isOutgoing ? 'bg-gray-200' : 'bg-white'; // More distinct thumb
  const rangeThumbClass = isOutgoing ? 'range-thumb-outgoing' : 'range-thumb-incoming'; // New class for thumb styling

  return (
    <div className={`flex items-center w-full max-w-xs p-1.5 space-x-1.5 rounded-md ${isOutgoing ? 'bg-black/10' : 'bg-black/20'}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata"></audio>
      <button onClick={togglePlayPause} className={`p-1.5 text-lg ${playerColorClass} hover:text-gray-100`}>
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </button>
      <div className="flex-1 flex items-center">
        <input 
          type="range"
          min="0"
          max={totalDuration || 0}
          value={currentTime}
          onChange={handleSeek}
          className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer range-sm ${progressBgClass} ${rangeThumbClass}`}
          style={{
            // Basic styling for the track. More advanced styling for thumb might need pseudo-elements or a library.
            // For a simple colored thumb, Tailwind doesn't directly support range input thumb styling easily without plugins or CSS.
          }}
        />
      </div>
      <span className={`text-xs w-auto px-1 ${playerColorClass}`}>
        {formatTime(currentTime)} / {formatTime(totalDuration)}
      </span>
      {/* Volume control can be added here if desired */}
      {/* 
      <button onClick={toggleMute} className={`p-1 text-sm ${playerColorClass} hover:text-gray-100`}>
        <FontAwesomeIcon icon={isMuted || volume === 0 ? faVolumeMute : faVolumeUp} />
      </button>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        value={volume}
        onChange={handleVolumeChange}
        className={`w-16 h-1.5 rounded-lg appearance-none cursor-pointer range-sm ${progressBgClass}`}
      />
      */}
    </div>
  );
};

export default AudioPlayer; 