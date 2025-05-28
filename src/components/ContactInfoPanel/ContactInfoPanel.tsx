import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUser, faUsers, faPhone, faBellSlash, faStar, faPhotoFilm, faLink, faFileLines } from '@fortawesome/free-solid-svg-icons';
import type { Chat, User } from '../../types'; // Adicionado User

interface ContactInfoPanelProps {
  chatInfo: Chat; // Recebe o objeto Chat completo
  onClose: () => void;
  panelWidthClass: string;
}

// Componente auxiliar para itens de menu no painel
const InfoPanelMenuItem: React.FC<{ icon: any; text: string; colorClass?: string; onClick?: () => void }> = ({ icon, text, colorClass = "text-whatsapp-text-secondary", onClick }) => (
  <div
    className={`flex cursor-pointer items-center p-4 hover:bg-whatsapp-active-chat ${onClick ? '' : 'cursor-default'}`}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} className={`mr-5 w-5 text-xl ${colorClass}`} />
    <span className="text-sm text-whatsapp-text-primary">{text}</span>
  </div>
);

const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({ chatInfo, onClose, panelWidthClass }) => {
  const isGroup = chatInfo.type === 'group';
  // Para chat 1-1, o "contacto" é o outro participante.
  // Assumindo que currentUserId é 'currentUser' (esta info deveria vir de um contexto/prop global)
  const contactUser = isGroup ? null : chatInfo.participants?.find(p => p.id !== 'currentUser');

  return (
    <aside className={`flex h-full flex-col border-l border-gray-700/50 bg-whatsapp-sidebar-bg text-whatsapp-text-primary ${panelWidthClass}`}>
      {/* Cabeçalho do Painel */}
      <header className="flex h-[60px] items-center bg-whatsapp-header-bg p-3">
        <button onClick={onClose} className="mr-6 text-xl text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2 className="text-lg font-medium">
          {isGroup ? "Dados do grupo" : "Dados do contato"}
        </h2>
      </header>

      {/* Corpo do Painel */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {/* Secção de Avatar e Nome */}
        <section className="flex flex-col items-center p-6">
          <img
            src={chatInfo.avatarUrl || (contactUser?.avatarUrl || 'https://placehold.co/150x150/CCCCCC/000000?text=?')}
            alt={`${chatInfo.name} Avatar`}
            className="h-40 w-40 rounded-full" // Avatar maior
          />
          <h2 className="mt-4 text-xl font-medium text-whatsapp-text-primary">{chatInfo.name}</h2>
          {isGroup ? (
            <p className="text-sm text-whatsapp-text-secondary">{chatInfo.participants?.length || 0} participantes</p>
          ) : (
            <p className="text-sm text-whatsapp-text-secondary">{contactUser?.name || chatInfo.name}</p> // Fallback para nome do chat se contactUser não encontrado
          )}
           {/* Mock de número de telefone/status para usuário */}
          {!isGroup && contactUser && (
            <>
              <p className="mt-1 text-sm text-whatsapp-text-primary">~{contactUser.id}@whatsapp.clone</p>
              <p className="mt-2 text-center text-xs text-whatsapp-text-secondary">
                "Disponível" {/* Mock status */}
              </p>
            </>
          )}
        </section>

        <hr className="mx-4 border-gray-700/50" />

        {/* Secção de Mídia (Placeholder) */}
        <section className="p-4">
            <div className="flex justify-between items-center mb-2">
                 <h3 className="text-sm font-normal text-whatsapp-text-secondary">Mídia, links e docs</h3>
                 <button className="text-xs text-teal-400 hover:text-teal-300">0 {'>'}</button> {/* Placeholder */}
            </div>
            <div className="grid grid-cols-3 gap-1">
                {/* Placeholders para mídia */}
                <div className="aspect-square bg-whatsapp-header-bg rounded flex items-center justify-center"><FontAwesomeIcon icon={faPhotoFilm} className="text-2xl text-whatsapp-icon"/></div>
                <div className="aspect-square bg-whatsapp-header-bg rounded"></div>
                <div className="aspect-square bg-whatsapp-header-bg rounded"></div>
            </div>
        </section>

        <hr className="mx-4 border-gray-700/50" />

        {/* Opções (Placeholders) */}
        <section>
          <InfoPanelMenuItem icon={faBellSlash} text="Silenciar notificações" />
          <InfoPanelMenuItem icon={faStar} text="Mensagens favoritas" />
          {isGroup && <InfoPanelMenuItem icon={faUsers} text={`${chatInfo.participants?.length || 0} Participantes`} />}
          {!isGroup && <InfoPanelMenuItem icon={faUser} text="Ver contato no catálogo" />}
        </section>

        <hr className="mx-4 border-gray-700/50" />

        {/* Ações de Perigo (Placeholders) */}
        <section className="my-2">
          {!isGroup && <InfoPanelMenuItem icon={faUser} text="Bloquear contato" colorClass="text-red-500" />}
          <InfoPanelMenuItem icon={faUser /* ou faTrash */} text="Apagar conversa" colorClass="text-red-500" />
          {isGroup && <InfoPanelMenuItem icon={faUser /* ou faDoorOpen */} text="Sair do grupo" colorClass="text-red-500" />}
        </section>

      </div>
    </aside>
  );
};

export default ContactInfoPanel;