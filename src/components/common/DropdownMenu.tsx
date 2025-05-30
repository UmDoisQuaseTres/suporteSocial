import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: IconDefinition;
  onClick: () => void;
  isDestructive?: boolean; // For items like "Delete"
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  menuPosition?: 'left' | 'right'; // To control alignment
  contentClasses?: string; // For additional styling of the dropdown content area
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  menuPosition = 'right',
  contentClasses = 'bg-whatsapp-header-bg border border-whatsapp-divider',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
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
  }, [isOpen]);

  return (
    <div className="relative">
      <div 
        ref={triggerRef} 
        onClick={toggleDropdown} 
        className="cursor-pointer" 
        aria-haspopup="true"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown(e as any);
          }
        }}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute z-50 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 ${contentClasses} ${
            menuPosition === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
          role="menu"
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.disabled) return;
                item.onClick();
                setIsOpen(false);
              }}
              disabled={item.disabled}
              className={`flex w-full items-center px-4 py-2.5 text-sm text-left
                ${item.isDestructive ? 'text-red-500 hover:bg-red-500/10' : 'text-whatsapp-text-primary hover:bg-whatsapp-active-chat'}
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              role="menuitem"
            >
              {item.icon && <FontAwesomeIcon icon={item.icon} className="mr-3 text-base" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu; 