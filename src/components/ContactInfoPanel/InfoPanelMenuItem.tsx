import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface InfoPanelMenuItemProps {
  icon: IconDefinition;
  text: string;
  subtext?: string;
  colorClass?: string;
  onClick?: () => void;
  hasToggle?: boolean;
  isToggled?: boolean;
  onToggle?: () => void;
}

const InfoPanelMenuItem: React.FC<InfoPanelMenuItemProps> = ({
  icon, 
  text, 
  subtext, 
  colorClass = "text-whatsapp-text-secondary",
  onClick, 
  hasToggle, 
  isToggled, 
  onToggle
}) => {
  const handleItemClick = () => {
    if (onToggle) {
      onToggle();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`flex items-center px-4 py-3 ${onToggle || onClick ? 'cursor-pointer hover:bg-whatsapp-active-chat' : 'cursor-default'}`}
      onClick={handleItemClick}
    >
      <FontAwesomeIcon icon={icon} className={`mr-4 w-5 text-lg ${colorClass}`} />
      <div className="flex-1">
        <span className="text-sm text-whatsapp-text-primary">{text}</span>
        {subtext && <p className="text-xs text-whatsapp-text-secondary">{subtext}</p>}
      </div>
      {hasToggle && (
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={`toggle-${text.replace(/\s+/g, '-')}`}
            checked={!!isToggled}
            onChange={onToggle}
            className="sr-only peer"
          />
          <div
            className={`w-11 h-[22px] rounded-full peer-focus:outline-none transition-colors duration-200 ease-in-out
              ${isToggled ? 'bg-whatsapp-light-green' : 'bg-gray-500 peer-hover:bg-gray-600'}`
            }
          >
            <div
              className={`w-[16px] h-[16px] m-[3px] bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
                ${isToggled ? 'translate-x-[19px]' : ''}`
            }></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanelMenuItem; 