import React, { useState, useEffect } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  alt?: string;
  sizeClasses: string; // e.g., "h-10 w-10"
  className?: string; // For additional classes like margins, flex-shrink, etc.
  fallbackText?: string; // Optional: Text for placeholder if src is missing/fails (e.g., "?" or initials)
  // Default placeholder is the first char of 'name'
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  alt,
  sizeClasses,
  className = '',
  fallbackText,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const generateInitials = (nameString: string): string => {
    if (!nameString) return '?';
    const parts = nameString.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const placeholderFinalText = fallbackText || generateInitials(name);
  const placeholderUrl = `https://placehold.co/100x100/CCCCCC/000000?text=${encodeURIComponent(placeholderFinalText)}`;

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false); // Reset error state when src prop changes
  }, [src]);

  const handleError = () => {
    if (!hasError) { // Prevent infinite loop if placeholder also fails (though unlikely for placehold.co)
      setHasError(true);
      setCurrentSrc(placeholderUrl);
    }
  };

  const finalSrc = hasError || !currentSrc ? placeholderUrl : currentSrc;
  const finalAlt = alt || `${name} Avatar`;

  return (
    <img
      src={finalSrc}
      alt={finalAlt}
      className={`rounded-full object-cover ${sizeClasses} ${className}`}
      onError={handleError}
    />
  );
};

export default Avatar;
