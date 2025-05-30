import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hideCloseButton = false,
}) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on overlay click
    >
      <div 
        className={`relative rounded-lg bg-whatsapp-sidebar-bg text-whatsapp-text-primary shadow-2xl flex flex-col ${sizeClasses[size]} w-full mx-auto transform transition-all duration-300 ease-in-out scale-95 group-[.open]:scale-100`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        {title && (
          <header className="flex items-center justify-between p-4 border-b border-whatsapp-divider">
            <h3 className="text-lg font-semibold text-whatsapp-text-primary">{title}</h3>
            {!hideCloseButton && (
              <button 
                onClick={onClose} 
                className="text-whatsapp-icon hover:text-whatsapp-light-green focus:outline-none p-1 rounded-full hover:bg-whatsapp-hover-dark"
                aria-label="Close modal"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            )}
          </header>
        )}
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
        {/* Footer can be added here if needed, or passed as part of children */}
      </div>
    </div>
  );
};

export default Modal; 