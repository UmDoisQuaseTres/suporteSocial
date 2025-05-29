import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faXmark, faUser, faUsers, faPhone, faBellSlash, faStar,
  faPhotoFilm, faLink, faFileLines, faBan, faTrashAlt, faRightFromBracket,
  faUserShield // Ícone para admin
} from '@fortawesome/free-solid-svg-icons';
import type { Chat, User } from '../../types';

interface ContactInfoPanelProps {
  chatInfo: Chat;
  onClose: () => void;
  panelWidthClass: string;
  // currentUserId é necessário para identificar "Você" na lista de participantes e o outro contacto
  currentUserId: string;
}

const InfoPanelMenuItem: React.FC<{
  icon: IconDefinition;
  text: string;
  subtext?: string;
  colorClass?: string;
  onClick?: () => void;
  hasToggle?: boolean; // Para simular um toggle visual
}> = ({ icon, text, subtext, colorClass = "text-whatsapp-text-secondary", onClick, hasToggle }) => (
  <div
    className={`flex items-center p-4 ${onClick ? 'cursor-pointer hover:bg-whatsapp-active-chat' : 'cursor-default'}`}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} className={`mr-6 w-5 text-xl ${colorClass}`} /> {/* Aumentado mr */}
    <div className="flex-1">
      <span className="text-sm text-whatsapp-text-primary">{text}</span>
      {subtext && <p className="text-xs text-whatsapp-text-secondary">{subtext}</p>}
    </div>
    {hasToggle && ( // Mock de um toggle
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
        <input type="checkbox" name="toggle" id={`toggle-${text}`} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer opacity-0"/>
        <label htmlFor={`toggle-${text}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
      </div>
    )}
  </div>
);

// Estilos para o mock do toggle (adicione ao seu CSS global ou <style> no App se precisar)
/*
.toggle-checkbox:checked + .toggle-label {
  background-color: #00A884; // WhatsApp Green
}
.toggle-checkbox:checked + .toggle-label:after {
  content: '';
  display: block;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 1.25rem;
  transition: .2s;
}
.toggle-label:after {
  content: '';
  display: block;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  background: #ffffff;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
  transition: .2s;
}
*/


const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({ chatInfo, onClose, panelWidthClass, currentUserId }) => {
  const isGroup = chatInfo.type === 'group';
  const contactUser = isGroup ? null : chatInfo.participants?.find(p => p.id !== currentUserId);

  // Assumindo que o primeiro participante da lista é o admin do grupo (para mock)
  const groupAdminId = isGroup && chatInfo.participants && chatInfo.participants.length > 0 ? chatInfo.participants[0].id : null;

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
            src={chatInfo.avatarUrl || (contactUser?.avatarUrl || 'https://placehold.co/150x150/CCCCCC/000000?text=?')}
            alt={`${chatInfo.name} Avatar`}
            className="h-32 w-32 rounded-full md:h-40 md:w-40"
          />
          <h2 className="mt-4 text-xl font-semibold text-whatsapp-text-primary break-all">{chatInfo.name}</h2>
          {isGroup ? (
            <p className="text-sm text-whatsapp-text-secondary">{chatInfo.participants?.length || 0} participantes</p>
          ) : (
            <p className="mt-1 text-sm text-whatsapp-text-primary">
              {/* Simulação de número de telefone ou identificador */}
              {`~${contactUser?.id || chatInfo.id}`}
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

        <section className="px-2 py-3"> {/* Reduzido padding para lista de mídia */}
            <div className="flex justify-between items-center mb-2 px-4">
                 <h3 className="text-sm font-normal text-whatsapp-text-secondary">Mídia, links e docs</h3>
                 <button className="text-xs text-teal-400 hover:text-teal-300">0 {'>'}</button>
            </div>
            <div className="grid grid-cols-4 gap-0.5 px-3 md:grid-cols-3"> {/* Mais colunas para mídias menores */}
                {[1,2,3,4].map(i=>( // Placeholders
                    <div key={i} className="aspect-square bg-whatsapp-header-bg rounded-sm flex items-center justify-center">
                        {/* <FontAwesomeIcon icon={faPhotoFilm} className="text-2xl text-whatsapp-icon"/> */}
                    </div>
                ))}
            </div>
        </section>

        <hr className="mx-0 border-gray-700/20" />

        <section>
          <InfoPanelMenuItem icon={faBellSlash} text="Silenciar notificações" hasToggle={true} />
          <InfoPanelMenuItem icon={faStar} text="Mensagens favoritas" />
          {/* Mais itens podem ser adicionados aqui */}
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
                      {participant.id === groupAdminId && participant.id !== currentUserId && ( // Mostra "Admin" se for o admin e não for "Você"
                        <p className="text-xs text-teal-400">Admin do grupo</p>
                      )}
                       {participant.id === groupAdminId && participant.id === currentUserId && ( // Mostra "Você (Admin)"
                        <p className="text-xs text-teal-400">Admin do grupo</p>
                      )}
                       {/* Mock de status do participante */}
                       {participant.id !== currentUserId && <p className="text-xs text-whatsapp-text-secondary truncate">{participant.about || "Recado do participante..."}</p>}
                    </div>
                     {participant.id === groupAdminId && ( // Ícone de admin
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