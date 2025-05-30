import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Re-using the same item interface as DropdownMenu for consistency
export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: IconDefinition;
  onClick: () => void;
  isDestructive?: boolean;
  disabled?: boolean;
  isToggle?: boolean; // For items like Pin/Mute that show a state
  isActive?: boolean; // If isToggle, this indicates current state
}

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: ContextMenuItem[];
  position: { x: number; y: number };
  contentClasses?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  onClose,
  items,
  position,
  contentClasses = 'bg-whatsapp-header-bg border border-whatsapp-divider shadow-xl',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={`fixed z-[60] w-56 rounded-md py-1 focus:outline-none ${contentClasses}`}
      style={{ top: position.y, left: position.x }}
      role="menu"
      // Add onContextMenu to prevent browser default context menu from appearing on right-click of this menu
      onContextMenu={(e) => e.preventDefault()} 
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (item.disabled) return;
            item.onClick();
            onClose(); // Close menu after action
          }}
          disabled={item.disabled}
          className={`flex w-full items-center justify-between px-4 py-2.5 text-sm text-left
            ${item.isDestructive ? 'text-red-500 hover:bg-red-500/10' : 'text-whatsapp-text-primary hover:bg-whatsapp-active-chat'}
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          role="menuitem"
        >
          <div className="flex items-center">
            {item.icon && <FontAwesomeIcon icon={item.icon} className="mr-3 text-base" />}
            {item.label}
          </div>
          {/* Optional: Could add a checkmark or other indicator for isToggle && isActive here */}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu; 