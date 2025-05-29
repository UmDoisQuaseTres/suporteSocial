import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark, faUser, faUsers, faPhone, faBellSlash, faStar, faBell,
  faPhotoFilm, faLink, faFileLines, faBan, faTrashAlt, faRightFromBracket,
  faUserShield, faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import type { Chat, User } from '../../types';
import InfoPanelMenuItem from './InfoPanelMenuItem';
import Avatar from '../common/Avatar';

interface ContactInfoPanelProps {
  chatInfo: Chat;
  onClose: () => void;
  panelWidthClass: string;
  currentUserId: string;
  onToggleMuteChat: (chatId: string) => void;
  onToggleBlockChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onExitGroup: (chatId: string) => void;
}

const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({
  chatInfo, onClose, panelWidthClass, currentUserId,
  onToggleMuteChat, onToggleBlockChat, onDeleteChat, onExitGroup
}) => {
  const isGroup = chatInfo.type === 'group';
  const contactUser = isGroup ? null : chatInfo.participants?.find(p => p.id !== currentUserId);
  const groupAdminId = isGroup && chatInfo.participants && chatInfo.participants.length > 0 ? chatInfo.participants[0].id : null;

  const handleMuteToggle = () => {
    onToggleMuteChat(chatInfo.id);
  };

  const handleBlockToggle = () => { 
    if (chatInfo.type === 'user') { 
      onToggleBlockChat(chatInfo.id); 
    }
  };
  const handleDeleteChatClick = () => {
    if (window.confirm(`Tem a certeza que quer apagar a conversa com ${chatInfo.name}? Esta ação não pode ser desfeita.`)) { onDeleteChat(chatInfo.id); }
  };
  const handleExitGroupClick = () => {
    if (window.confirm(`Tem a certeza que quer sair do grupo "${chatInfo.name}"?`)) { onExitGroup(chatInfo.id); }
  };

  return (
    <aside className={`flex h-full flex-col border-l border-gray-700/50 bg-whatsapp-sidebar-bg text-whatsapp-text-primary ${panelWidthClass}`}>
      <header className="flex h-[60px] items-center bg-whatsapp-header-bg p-3">
        <button onClick={onClose} className="mr-6 text-lg text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2 className="text-lg font-medium">
          {isGroup ? "Dados do grupo" : "Dados do contato"}
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {/* Secção Avatar e Nome */}
        <section className="flex flex-col items-center p-4 text-center">
          <Avatar 
            src={chatInfo.avatarUrl || contactUser?.avatarUrl}
            name={chatInfo.name}
            sizeClasses="h-24 w-24"
            fallbackText={chatInfo.name.charAt(0)}
          />
          <h2 className="mt-3 text-xl font-semibold text-whatsapp-text-primary break-all">{chatInfo.name}</h2>
          {isGroup ? (
            <p className="text-sm text-whatsapp-text-secondary">
              {chatInfo.participants?.length || 0} participante{ (chatInfo.participants?.length || 0) !== 1 ? 's' : ''}
            </p>
          ) : (
            <p className="mt-1 text-sm text-whatsapp-text-primary">
              {contactUser?.id ? `~${contactUser.id}` : `ID: ${chatInfo.id}`}
            </p>
          )}
        </section>

        {/* Secção Recado */}
        {!isGroup && contactUser?.about && (
          <>
            <hr className="mx-0 border-gray-700/10" />
            <section className="px-4 py-3">
              <h3 className="mb-1 text-xs font-normal text-whatsapp-text-secondary">Recado</h3>
              <p className="text-sm text-whatsapp-text-primary">{contactUser.about}</p>
            </section>
          </>
        )}
        
        <hr className="mx-0 border-gray-700/10" />

        {/* Secção Mídia */}
        <section className="px-2 py-3">
            <div className="flex justify-between items-center mb-2 px-4">
                 <h3 className="text-sm font-normal text-whatsapp-text-secondary">Mídia, links e docs</h3>
                 <button className="text-xs text-whatsapp-text-secondary hover:text-teal-300">0 &gt;</button>
            </div>
            <div className="grid grid-cols-3 gap-1 px-3">
                {[1,2,3].map(i=>(
                    <div key={i} className="aspect-square bg-whatsapp-header-bg rounded-md flex items-center justify-center">
                        {/* <FontAwesomeIcon icon={faPhotoFilm} className="text-2xl text-whatsapp-icon"/> */}
                    </div>
                ))}
            </div>
        </section>

        <hr className="mx-0 border-gray-700/10" />

        {/* Secção Opções */}
        <section>
          <InfoPanelMenuItem
            icon={chatInfo.isMuted ? faBell : faBellSlash}
            text={chatInfo.isMuted ? "Notificações ativadas" : "Silenciar notificações"}
            subtext={chatInfo.isMuted ? "Toque para silenciar" : "Toque para reativar som"}
            hasToggle={true}
            isToggled={!!chatInfo.isMuted}
            onToggle={handleMuteToggle}
            colorClass={chatInfo.isMuted ? "text-yellow-500" : "text-whatsapp-text-secondary"}
          />
          <InfoPanelMenuItem icon={faStar} text="Mensagens favoritas" />
        </section>

        {/* Secção Participantes (Grupos) */}
        {isGroup && chatInfo.participants && (
          <>
            <hr className="mx-0 border-gray-700/10" />
            <section className="px-1 py-3">
              <h3 className="mb-1 px-5 text-sm font-normal text-whatsapp-text-secondary">
                {chatInfo.participants.length} Participante{chatInfo.participants.length !== 1 ? 's' : ''}
              </h3>
              <div className="max-h-60 overflow-y-auto chat-scrollbar">
                {chatInfo.participants.map(participant => (
                  <div key={participant.id} className="flex cursor-pointer items-center px-4 py-2.5 hover:bg-whatsapp-active-chat">
                    <Avatar 
                        src={participant.avatarUrl}
                        name={participant.name}
                        sizeClasses="h-10 w-10"
                        className="mr-4"
                        fallbackText={participant.name.charAt(0)}
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
        
        <hr className="mx-0 border-gray-700/10" />

        {/* Secção Ações de Perigo */}
        <section className="py-2">
          {!isGroup && contactUser && (
            <InfoPanelMenuItem
              icon={chatInfo.isBlocked ? faUserCheck : faBan}
              text={chatInfo.isBlocked ? `Desbloquear ${contactUser.name}` : `Bloquear ${contactUser.name}`}
              colorClass="text-red-500"
              onClick={handleBlockToggle}
            />
          )}
          <InfoPanelMenuItem
            icon={faUserShield}
            text={isGroup ? "Reportar grupo" : "Reportar contacto"}
            colorClass="text-red-500"
            onClick={() => console.log(`Reportar: ${chatInfo.id} (${chatInfo.name})`)}
          />
          <InfoPanelMenuItem
            icon={faTrashAlt}
            text={`Apagar conversa`}
            colorClass="text-red-500"
            onClick={handleDeleteChatClick}
          />
          {isGroup && (
            <InfoPanelMenuItem
              icon={faRightFromBracket}
              text="Sair do grupo"
              colorClass="text-red-500"
              onClick={handleExitGroupClick}
            />
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