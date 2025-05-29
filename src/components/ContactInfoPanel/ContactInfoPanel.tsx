import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'; // Import type
import {
  faXmark, faUser, faUsers, faPhone, faBellSlash, faStar, faBell, // Adicionado faBell
  faPhotoFilm, faLink, faFileLines, faBan, faTrashAlt, faRightFromBracket,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';
import type { Chat, User } from '../../types'; // Assegure que 'User' esteja na sua types.ts

interface ContactInfoPanelProps {
  chatInfo: Chat;
  onClose: () => void;
  panelWidthClass: string;
  currentUserId: string;
  onToggleMuteChat: (chatId: string) => void; // <-- Nova prop
}

interface InfoPanelMenuItemProps {
  icon: IconDefinition;
  text: string;
  subtext?: string;
  colorClass?: string;
  onClick?: () => void;
  hasToggle?: boolean;
  isToggled?: boolean; // Para estado do toggle
  onToggle?: () => void; // Para ação do toggle
}

const InfoPanelMenuItem: React.FC<InfoPanelMenuItemProps> = ({
  icon, text, subtext, colorClass = "text-whatsapp-text-secondary",
  onClick, hasToggle, isToggled, onToggle
}) => (
  <div
    className={`flex items-center p-4 ${onClick || onToggle ? 'cursor-pointer hover:bg-whatsapp-active-chat' : 'cursor-default'}`}
    onClick={onClick || onToggle} // Se onToggle existir, ele será o onClick
  >
    <FontAwesomeIcon icon={icon} className={`mr-6 w-5 text-xl ${colorClass}`} />
    <div className="flex-1">
      <span className="text-sm text-whatsapp-text-primary">{text}</span>
      {subtext && <p className="text-xs text-whatsapp-text-secondary">{subtext}</p>}
    </div>
    {hasToggle && (
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        {/* Input checkbox real para controlar o estado do toggle */}
        <input
          type="checkbox"
          name={`toggle-${text.replace(/\s+/g, '-')}`} // ID único
          id={`toggle-${text.replace(/\s+/g, '-')}`}
          checked={isToggled}
          onChange={onToggle} // Ação de clique já está no div pai
          className="toggle-checkbox absolute block h-6 w-6 cursor-pointer opacity-0" // Escondido, mas funcional
        />
        <label
          htmlFor={`toggle-${text.replace(/\s+/g, '-')}`}
          className={`toggle-label block h-6 w-6 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out
            ${isToggled ? 'bg-whatsapp-light-green border-whatsapp-light-green' : 'bg-gray-600 border-gray-500'}
          `}
        >
          {/* Pseudo-elemento para o círculo interno (pode ser estilizado com :after no CSS) */}
          <span className={`absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
            ${isToggled ? 'translate-x-full' : ''}
          `}></span>
        </label>
      </div>
    )}
  </div>
);


const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({ chatInfo, onClose, panelWidthClass, currentUserId, onToggleMuteChat }) => {
  const isGroup = chatInfo.type === 'group';
  const contactUser = isGroup ? null : chatInfo.participants?.find(p => p.id !== currentUserId);
  const groupAdminId = isGroup && chatInfo.participants && chatInfo.participants.length > 0 ? chatInfo.participants[0].id : null;

  const handleMuteToggle = () => {
    onToggleMuteChat(chatInfo.id);
  };

  return (
    <aside className={`flex h-full flex-col border-l border-gray-700/50 bg-whatsapp-sidebar-bg text-whatsapp-text-primary ${panelWidthClass}`}>
      <header className="flex h-[60px] items-center bg-whatsapp-header-bg p-3">
        <button onClick={onClose} className="mr-6 text-xl text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2 className="text-lg font-medium">
          {isGroup ? "Dados do grupo" : "Dados do contato"}
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto chat-scrollbar">
        <section className="flex flex-col items-center p-6 text-center">
          <img
            src={chatInfo.avatarUrl || (contactUser?.avatarUrl || `https://placehold.co/150x150/CCCCCC/000000?text=${chatInfo.name.charAt(0)}`)}
            alt={`${chatInfo.name} Avatar`}
            className="h-32 w-32 rounded-full object-cover md:h-40 md:w-40"
          />
          <h2 className="mt-4 text-xl font-semibold text-whatsapp-text-primary break-all">{chatInfo.name}</h2>
          {isGroup ? (
            <p className="text-sm text-whatsapp-text-secondary">{chatInfo.participants?.length || 0} participantes</p>
          ) : (
            <p className="mt-1 text-sm text-whatsapp-text-primary">
              {contactUser?.id ? `~${contactUser.id}` : `ID: ${chatInfo.id}`}
            </p>
          )}
        </section>

        {!isGroup && contactUser?.about && (
          <>
            <hr className="mx-0 border-gray-700/20" />
            <section className="px-6 py-4">
              <h3 className="mb-1 text-xs font-normal text-teal-400">Recado</h3>
              <p className="text-sm text-whatsapp-text-primary">{contactUser.about}</p>
            </section>
          </>
        )}
        
        <hr className="mx-0 border-gray-700/20" />

        <section className="px-2 py-3">
            <div className="flex justify-between items-center mb-2 px-4">
                 <h3 className="text-sm font-normal text-whatsapp-text-secondary">Mídia, links e docs</h3>
                 <button className="text-xs text-teal-400 hover:text-teal-300">0 &gt;</button>
            </div>
            <div className="grid grid-cols-4 gap-0.5 px-3 md:grid-cols-3">
                {[1,2,3,4].map(i=>(
                    <div key={i} className="aspect-square bg-whatsapp-header-bg rounded-sm flex items-center justify-center">
                        {/* <FontAwesomeIcon icon={faPhotoFilm} className="text-2xl text-whatsapp-icon"/> */}
                    </div>
                ))}
            </div>
        </section>

        <hr className="mx-0 border-gray-700/20" />

        <section>
          <InfoPanelMenuItem
            icon={chatInfo.isMuted ? faBell : faBellSlash} // Ícone muda com o estado
            text={chatInfo.isMuted ? "Reativar som das notificações" : "Silenciar notificações"}
            hasToggle={true}
            isToggled={!!chatInfo.isMuted} // Passa o estado atual do mute
            onToggle={handleMuteToggle} // Chama a função ao clicar
            colorClass={chatInfo.isMuted ? "text-yellow-500" : "text-whatsapp-text-secondary"} // Cor diferente se silenciado
          />
          <InfoPanelMenuItem icon={faStar} text="Mensagens favoritas" />
        </section>

        {isGroup && chatInfo.participants && (
          <>
            <hr className="mx-0 border-gray-700/20" />
            <section className="px-1 py-3">
              <h3 className="mb-1 px-5 text-sm font-normal text-whatsapp-text-secondary">
                {chatInfo.participants.length} Participante{chatInfo.participants.length === 1 ? '' : 's'}
              </h3>
              <div className="max-h-60 overflow-y-auto chat-scrollbar">
                {chatInfo.participants.map(participant => (
                  <div key={participant.id} className="flex cursor-pointer items-center p-3 px-5 hover:bg-whatsapp-active-chat">
                    <img
                      src={participant.avatarUrl || `https://placehold.co/40x40/CCCCCC/000000?text=${participant.name.charAt(0)}`}
                      alt={participant.name}
                      className="mr-4 h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-whatsapp-text-primary">{participant.id === currentUserId ? "Você" : participant.name}</p>
                      {participant.id === groupAdminId && participant.id !== currentUserId && (
                        <p className="text-xs text-teal-400">Admin do grupo</p>
                      )}
                       {participant.id === groupAdminId && participant.id === currentUserId && (
                        <p className="text-xs text-teal-400">Admin do grupo</p>
                      )}
                       {participant.id !== currentUserId && <p className="text-xs text-whatsapp-text-secondary truncate">{participant.about || "Recado do participante..."}</p>}
                    </div>
                     {participant.id === groupAdminId && (
                        <FontAwesomeIcon icon={faUserShield} className="ml-2 text-teal-400" title="Admin do grupo"/>
                     )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        
        <hr className="mx-0 border-gray-700/20" />

        <section className="py-2">
          {!isGroup && contactUser && (
            <InfoPanelMenuItem icon={faBan} text={`Bloquear ${contactUser.name}`} colorClass="text-red-500" onClick={() => alert(`Bloquear ${contactUser.name} (não implementado)`)} />
          )}
          <InfoPanelMenuItem icon={faTrashAlt} text={`Apagar conversa`} colorClass="text-red-500" onClick={() => alert(`Apagar conversa com ${chatInfo.name} (não implementado)`)} />
          {isGroup && (
            <InfoPanelMenuItem icon={faRightFromBracket} text="Sair do grupo" colorClass="text-red-500" onClick={() => alert(`Sair do grupo ${chatInfo.name} (não implementado)`)} />
          )}
        </section>
        <div className="p-4 text-center text-xs text-whatsapp-text-secondary">
            Criado por IA para {chatInfo.name} em {new Date().toLocaleDateString()}
        </div>
      </div>
    </aside>
  );
};

export default ContactInfoPanel;