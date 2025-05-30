import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark, faUser, faUsers, faPhone, faBellSlash, faStar, faBell,
  faPhotoFilm, faLink, faFileLines, faBan, faTrashAlt, faRightFromBracket,
  faUserShield, faUserCheck,
  faLock,
  faFileAudio, faFileVideo, faFileImage,
  faPencilAlt,
  faSave, faTimesCircle,
  faUserPlus,
  faSquareCheck, faSquare,
  faUserMinus,
  faEllipsisV,
  faUserGraduate,
  faUserTie,
  faCamera
} from '@fortawesome/free-solid-svg-icons';
import type { Chat, User, Message } from '../../types';
import InfoPanelMenuItem from './InfoPanelMenuItem';
import Avatar from '../common/Avatar';
import useStore from '../../store/useStore';
import DropdownMenu, { type DropdownMenuItem } from '../common/DropdownMenu';

interface ContactInfoPanelProps {
  chatInfo: Chat;
  chatMessages: Message[];
  onClose: () => void;
  panelWidthClass: string;
  currentUserId: string;
  onToggleMuteChat: (chatId: string) => void;
  onToggleBlockChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onExitGroup: (chatId: string) => void;
  onShowMediaGallery: (chat: Chat) => void;
  onShowStarredMessages: () => void;
}

// A simple visual separator component
const SectionSeparator: React.FC = () => <hr className="mx-0 my-1 border-gray-700/10" />;

const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({
  chatInfo, chatMessages, onClose, panelWidthClass, currentUserId,
  onToggleMuteChat, onToggleBlockChat, onDeleteChat, onExitGroup,
  onShowMediaGallery,
  onShowStarredMessages
}) => {
  const isGroup = chatInfo.type === 'group';
  const contactUser = isGroup ? null : chatInfo.participants?.find(p => p.id !== currentUserId);
  const groupAdmins = chatInfo.groupAdmins || [];
  const isCurrentUserAdmin = groupAdmins.includes(currentUserId);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editableName, setEditableName] = useState(chatInfo.name);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editableDescription, setEditableDescription] = useState(chatInfo.description || '');
  
  const [isAddingParticipants, setIsAddingParticipants] = useState(false);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<string[]>([]);

  const {
    updateGroupNameAndDescription,
    addParticipantsToGroup,
    removeParticipantFromGroup,
    availableContacts,
    showConfirmationDialog,
    promoteParticipantToAdmin,
    demoteAdminToParticipant,
    updateGroupAvatar
  } = useStore(state => ({
    updateGroupNameAndDescription: state.updateGroupNameAndDescription,
    addParticipantsToGroup: state.addParticipantsToGroup,
    removeParticipantFromGroup: state.removeParticipantFromGroup,
    availableContacts: state.availableContacts(),
    showConfirmationDialog: state.showConfirmationDialog,
    promoteParticipantToAdmin: state.promoteParticipantToAdmin,
    demoteAdminToParticipant: state.demoteAdminToParticipant,
    updateGroupAvatar: state.updateGroupAvatar,
  }));

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditableName(chatInfo.name);
    setIsEditingName(false);
    setEditableDescription(chatInfo.description || '');
    setIsEditingDescription(false);
    setIsAddingParticipants(false);
    setSelectedUsersToAdd([]);
  }, [chatInfo]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleToggleEditName = () => {
    if (!isEditingName) {
      setEditableName(chatInfo.name);
    }
    setIsEditingName(!isEditingName);
  };

  const handleSaveName = () => {
    if (isGroup && chatInfo.id && editableName.trim() && editableName.trim() !== chatInfo.name.trim()) {
      updateGroupNameAndDescription(chatInfo.id, editableName.trim(), undefined);
    }
    setIsEditingName(false);
  };

  const handleNameInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName();
    }
    if (e.key === 'Escape') {
      handleToggleEditName();
    }
  };

  const handleToggleEditDescription = () => {
    if (!isEditingDescription) {
      setEditableDescription(chatInfo.description || '');
    }
    setIsEditingDescription(!isEditingDescription);
  };

  const handleSaveDescription = () => {
    if (isGroup && chatInfo.id && editableDescription.trim() !== (chatInfo.description || '').trim()) {
      updateGroupNameAndDescription(chatInfo.id, undefined, editableDescription.trim());
    }
    setIsEditingDescription(false);
  };

  const handleChangeAvatar = () => {
    if (!isGroup || !isCurrentUserAdmin) return;
    const newAvatarUrl = prompt("Insira a nova URL da imagem para o avatar do grupo:", chatInfo.avatarUrl || '');
    if (newAvatarUrl && newAvatarUrl.trim() !== chatInfo.avatarUrl) {
        if (newAvatarUrl.startsWith('http://') || newAvatarUrl.startsWith('https://')) {
            updateGroupAvatar(chatInfo.id, newAvatarUrl.trim());
        } else {
            alert("URL do avatar inválida. Por favor, insira uma URL completa (http:// ou https://).");
        }
    }
  };

  const handleToggleAddParticipantsView = () => {
    setIsAddingParticipants(!isAddingParticipants);
    if (isAddingParticipants) {
        setSelectedUsersToAdd([]);
    }
  };

  const handleToggleUserSelection = (userId: string) => {
    setSelectedUsersToAdd(prev => 
        prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleAddSelectedParticipantsToGroup = () => {
    if (selectedUsersToAdd.length > 0) {
      addParticipantsToGroup(chatInfo.id, selectedUsersToAdd);
    }
    setIsAddingParticipants(false);
    setSelectedUsersToAdd([]);
  };

  const handleConfirmRemoveParticipant = (userIdToRemove: string, userNameToRemove: string) => {
    showConfirmationDialog({
      title: "Remover Participante",
      message: `Tem a certeza que quer remover ${userNameToRemove} do grupo?`,
      confirmText: "Remover",
      isDestructive: true,
      confirmButtonVariant: 'danger',
      onConfirm: () => removeParticipantFromGroup(chatInfo.id, userIdToRemove),
    });
  };
  
  const handlePromoteToAdmin = (userId: string, userName: string) => {
    showConfirmationDialog({
        title: "Promover a Admin",
        message: `Tem a certeza que quer tornar ${userName} um administrador deste grupo?`,
        confirmText: "Promover",
        confirmButtonVariant: 'success',
        onConfirm: () => promoteParticipantToAdmin(chatInfo.id, userId),
    });
  };

  const handleDemoteAdmin = (userId: string, userName: string) => {
    showConfirmationDialog({
        title: "Revogar Admin",
        message: `Tem a certeza que quer remover ${userName} como administrador deste grupo?`,
        confirmText: "Revogar",
        confirmButtonVariant: 'warning',
        onConfirm: () => demoteAdminToParticipant(chatInfo.id, userId),
    });
  };

  const usersNotInGroup = availableContacts.filter(
    user => !chatInfo.participants?.some(p => p.id === user.id)
  );

  const mediaItems = (chatMessages || []).filter(
    msg => msg.imageUrl || msg.videoUrl || msg.audioUrl || (msg.mediaType === 'document' && msg.fileName)
  );
  const mediaCount = mediaItems.length;
  const displayedMedia = mediaItems.slice(0, 3);

  const handleMuteToggle = () => {
    onToggleMuteChat(chatInfo.id);
  };

  const handleBlockToggle = () => { 
    if (chatInfo.type === 'user') { 
      onToggleBlockChat(chatInfo.id); 
    }
  };
  const handleDeleteChatClick = () => {
    showConfirmationDialog({
      title: "Apagar Conversa",
      message: `Tem a certeza que quer apagar a conversa com ${chatInfo.name}? Esta ação não pode ser desfeita.`,
      confirmText: "Apagar",
      isDestructive: true,
      confirmButtonVariant: 'danger',
      onConfirm: () => onDeleteChat(chatInfo.id),
    });
  };
  const handleExitGroupClick = () => {
    showConfirmationDialog({
      title: "Sair do Grupo",
      message: `Tem a certeza que quer sair do grupo "${chatInfo.name}"?`,
      confirmText: "Sair",
      isDestructive: true,
      confirmButtonVariant: 'danger',
      onConfirm: () => onExitGroup(chatInfo.id),
    });
  };
  
  const getParticipantMenuItems = (participant: User): DropdownMenuItem[] => {
    const items: DropdownMenuItem[] = [];
    const isTargetUserAdmin = groupAdmins.includes(participant.id);

    if (!isTargetUserAdmin) {
        items.push({
            id: 'promote-admin',
            label: 'Tornar admin do grupo',
            icon: faUserGraduate,
            onClick: () => handlePromoteToAdmin(participant.id, participant.name),
        });
    } else if (participant.id !== currentUserId) {
        items.push({
            id: 'demote-admin',
            label: 'Revogar admin do grupo',
            icon: faUserTie,
            onClick: () => handleDemoteAdmin(participant.id, participant.name),
        });
    }
    
    items.push({
        id: 'remove-participant',
        label: 'Remover do grupo',
        icon: faUserMinus,
        onClick: () => handleConfirmRemoveParticipant(participant.id, participant.name),
        isDestructive: true,
    });

    return items;
  };

  return (
    <aside className={`flex h-full flex-col border-l border-gray-700/50 bg-whatsapp-sidebar-bg text-whatsapp-text-primary ${panelWidthClass}`}>
      <header className="flex h-[60px] items-center bg-whatsapp-header-bg p-3">
        <button onClick={onClose} className="mr-6 text-lg text-whatsapp-icon hover:text-gray-200">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2 className="text-lg font-medium">
          {isAddingParticipants ? "Adicionar Participantes" : (isGroup ? "Dados do grupo" : "Dados do contato")}
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {!isAddingParticipants ? (
          <>
            {/* Secção Avatar e Nome */}
            <section className="flex flex-col items-center p-4 text-center">
              <div 
                className="relative group cursor-pointer"
                onClick={isGroup && isCurrentUserAdmin ? handleChangeAvatar : undefined}
                title={isGroup && isCurrentUserAdmin ? "Alterar foto do grupo" : undefined}
              >
                <Avatar 
                  src={chatInfo.avatarUrl || contactUser?.avatarUrl}
                  name={chatInfo.name}
                  sizeClasses="h-24 w-24"
                  fallbackText={isGroup ? chatInfo.name.charAt(0) : contactUser?.name.charAt(0) || '#' }
                />
                {isGroup && isCurrentUserAdmin && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <FontAwesomeIcon icon={faCamera} className="text-2xl text-white mb-1" />
                    <span className="text-xs text-white text-center">Alterar foto<br/>do grupo</span>
                  </div>
                )}
              </div>
              
              {isEditingName && isGroup && isCurrentUserAdmin ? (
                <div className="mt-3 w-full px-4">
                  <input 
                    ref={nameInputRef}
                    type="text" 
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                    onKeyDown={handleNameInputKeyDown}
                    className="w-full p-2 rounded-md bg-whatsapp-input-bg text-xl text-center text-whatsapp-text-primary focus:ring-1 focus:ring-whatsapp-light-green"
                  />
                  <div className="mt-2 flex justify-center space-x-2">
                      <button onClick={handleToggleEditName} className="px-3 py-1.5 text-xs rounded-md bg-gray-600 hover:bg-gray-500 text-white">
                          <FontAwesomeIcon icon={faTimesCircle} className="mr-1.5" /> Cancelar
                      </button>
                      <button onClick={handleSaveName} className="px-3 py-1.5 text-xs rounded-md bg-whatsapp-send-button-green hover:bg-whatsapp-send-button-green-hover text-white">
                          <FontAwesomeIcon icon={faSave} className="mr-1.5" /> Salvar
                      </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-center">
                    <h2 className="text-xl font-semibold text-whatsapp-text-primary break-all">{chatInfo.name}</h2>
                    {isGroup && isCurrentUserAdmin && (
                        <FontAwesomeIcon 
                            icon={faPencilAlt} 
                            className="ml-2 text-whatsapp-icon cursor-pointer hover:text-whatsapp-light-green"
                            onClick={handleToggleEditName} 
                            title="Editar nome do grupo"
                        />
                    )}
                </div>
              )}

              {isGroup ? (
                <p className="text-sm text-whatsapp-text-secondary mt-1">
                  {chatInfo.participants?.length || 0} participante{ (chatInfo.participants?.length || 0) !== 1 ? 's' : ''}
                </p>
              ) : (
                <p className="mt-1 text-sm text-whatsapp-text-secondary">
                  {contactUser?.about || (contactUser?.id ? `~${contactUser.id}` : `ID: ${chatInfo.id}`)}
                </p>
              )}
            </section>

            {/* Secção Descrição do Grupo (Grupos) / Recado (User) */}
            {isGroup && (
                <>
                    <SectionSeparator />
                    <section className="px-4 py-3">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-xs font-normal text-whatsapp-text-secondary">Descrição do grupo</h3>
                            {isCurrentUserAdmin && !isEditingDescription && (
                                <FontAwesomeIcon icon={faPencilAlt} className="text-whatsapp-icon cursor-pointer hover:text-whatsapp-light-green" onClick={handleToggleEditDescription} title="Editar descrição" />
                            )}
                        </div>
                        {isEditingDescription ? (
                            <div className="mt-1">
                                <textarea 
                                    value={editableDescription}
                                    onChange={(e) => setEditableDescription(e.target.value)}
                                    className="w-full p-2 rounded-md bg-whatsapp-input-bg text-sm text-whatsapp-text-primary focus:ring-1 focus:ring-whatsapp-light-green chat-scrollbar min-h-[60px] max-h-[120px]"
                                    rows={3}
                                    placeholder="Adicionar descrição do grupo"
                                />
                                <div className="mt-2 flex justify-end space-x-2">
                                    <button onClick={handleToggleEditDescription} className="px-3 py-1.5 text-xs rounded-md bg-gray-600 hover:bg-gray-500 text-white">
                                        <FontAwesomeIcon icon={faTimesCircle} className="mr-1.5" /> Cancelar
                                    </button>
                                    <button onClick={handleSaveDescription} className="px-3 py-1.5 text-xs rounded-md bg-whatsapp-send-button-green hover:bg-whatsapp-send-button-green-hover text-white">
                                        <FontAwesomeIcon icon={faSave} className="mr-1.5" /> Salvar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-whatsapp-text-primary whitespace-pre-wrap break-words">
                                {chatInfo.description || "Nenhuma descrição."}
                            </p>
                        )}
                    </section>
                </>
            )}
            {!isGroup && contactUser?.about && (
              <>
                <SectionSeparator />
                <section className="px-4 py-3">
                  <h3 className="mb-1 text-xs font-normal text-whatsapp-text-secondary">Recado</h3>
                  <p className="text-sm text-whatsapp-text-primary">{contactUser.about}</p>
                </section>
              </>
            )}
            
            <SectionSeparator />

            {/* Secção Mídia */}
            <section className="px-2 py-3">
                <div className="flex justify-between items-center mb-2 px-4">
                     <h3 className="text-sm font-normal text-whatsapp-text-secondary">Mídia, links e docs</h3>
                     <button 
                        onClick={() => onShowMediaGallery(chatInfo)}
                        className="text-xs text-whatsapp-text-secondary hover:text-teal-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={mediaCount === 0}
                     >
                        {mediaCount} &gt;
                     </button>
                </div>
                {mediaCount > 0 ? (
                  <div className="grid grid-cols-3 gap-1 px-3">
                      {displayedMedia.map(item => (
                          <div key={item.id} className="aspect-square bg-whatsapp-header-bg rounded-md flex items-center justify-center overflow-hidden">
                              {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.text || 'Imagem'} className="h-full w-full object-cover" />
                              ) : item.videoUrl ? (
                                  <FontAwesomeIcon icon={faFileVideo} className="text-2xl text-whatsapp-icon"/>
                              ) : item.audioUrl ? (
                                  <FontAwesomeIcon icon={faFileAudio} className="text-2xl text-whatsapp-icon"/>
                              ) : item.mediaType === 'document' ? (
                                  <FontAwesomeIcon icon={faFileLines} className="text-2xl text-whatsapp-icon"/>
                              ) : (
                                  <FontAwesomeIcon icon={faFileImage} className="text-2xl text-whatsapp-icon"/>
                              )}
                          </div>
                      ))}
                      {Array(Math.max(0, 3 - displayedMedia.length)).fill(null).map((_, index) => (
                        <div key={`placeholder-${index}`} className="aspect-square bg-whatsapp-header-bg rounded-md"></div>
                      ))}
                  </div>
                ) : (
                  <p className="px-4 text-xs text-whatsapp-text-secondary italic">Nenhuma mídia, link ou documento compartilhado ainda.</p>
                )}
            </section>

            <SectionSeparator />

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
              <InfoPanelMenuItem 
                icon={faStar} 
                text="Mensagens favoritas" 
                onClick={onShowStarredMessages}
              />
              <InfoPanelMenuItem
                icon={faLock}
                text="Criptografia"
                subtext="As mensagens são protegidas com criptografia."
                onClick={() => console.log("Encryption info clicked for chat:", chatInfo.id)}
              />
            </section>

            {/* Secção Participantes (Grupos) */}
            {isGroup && (
              <>
                <SectionSeparator />
                <section className="px-1 py-3">
                  <h3 className="mb-1 px-5 text-sm font-normal text-whatsapp-text-secondary">
                    {chatInfo.participants?.length} Participante{chatInfo.participants?.length !== 1 ? 's' : ''}
                  </h3>
                  {isCurrentUserAdmin && (
                    <InfoPanelMenuItem
                        icon={faUserPlus}
                        text="Adicionar participante"
                        onClick={handleToggleAddParticipantsView}
                        colorClass="text-teal-400 hover:text-teal-300"
                    />
                  )}
                  <div className="max-h-60 overflow-y-auto chat-scrollbar">
                    {chatInfo.participants?.map(participant => {
                      const participantMenuItems = isCurrentUserAdmin && participant.id !== currentUserId 
                                                  ? getParticipantMenuItems(participant)
                                                  : [];
                      return (
                        <div key={participant.id} className="group/participant flex items-center px-4 py-2.5 hover:bg-whatsapp-active-chat">
                          <Avatar 
                              src={participant.avatarUrl}
                              name={participant.name}
                              sizeClasses="h-10 w-10"
                              className="mr-4"
                              fallbackText={participant.name.charAt(0)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-whatsapp-text-primary truncate">{participant.id === currentUserId ? "Você" : participant.name}</p>
                            {groupAdmins.includes(participant.id) && (
                              <p className="text-xs text-teal-400">Admin do grupo</p>
                            )}
                             {participant.id !== currentUserId && <p className="text-xs text-whatsapp-text-secondary truncate">{participant.about || "Recado do participante..."}</p>}
                          </div>
                          <div className="flex items-center ml-auto space-x-2 flex-shrink-0">
                              {groupAdmins.includes(participant.id) && participant.id !== currentUserId && (
                                  <FontAwesomeIcon icon={faUserShield} className="text-teal-400" title="Admin do grupo"/>
                              )}
                              {isCurrentUserAdmin && participant.id !== currentUserId && participantMenuItems.length > 0 && (
                                <DropdownMenu
                                  trigger={
                                    <button
                                      className="p-1.5 rounded-full text-whatsapp-icon hover:bg-whatsapp-input-bg focus:outline-none opacity-0 group-hover/participant:opacity-100 focus:opacity-100"
                                      title="Opções do participante"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <FontAwesomeIcon icon={faEllipsisV} className="text-base" />
                                    </button>
                                  }
                                  items={participantMenuItems}
                                  menuPosition="left"
                                  contentClasses="bg-whatsapp-input-bg border border-whatsapp-divider shadow-xl"
                                />
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
            
            <SectionSeparator />

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
                text={isGroup ? "Reportar grupo" : "Reportar contato"}
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
          </>
        ) : ( 
          <section className="p-4">
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto chat-scrollbar mb-3">
                {usersNotInGroup.length > 0 ? usersNotInGroup.map(user => (
                    <div 
                        key={user.id} 
                        className="flex items-center p-2.5 hover:bg-whatsapp-hover-item rounded-md cursor-pointer mb-1"
                        onClick={() => handleToggleUserSelection(user.id)}
                    >
                        <FontAwesomeIcon 
                            icon={selectedUsersToAdd.includes(user.id) ? faSquareCheck : faSquare}
                            className={`mr-4 text-xl ${selectedUsersToAdd.includes(user.id) ? 'text-whatsapp-light-green' : 'text-whatsapp-icon'}`}
                        />
                        <Avatar src={user.avatarUrl} name={user.name} sizeClasses="h-10 w-10" className="mr-3" fallbackText={user.name.charAt(0)} />
                        <span className="text-sm text-whatsapp-text-primary">{user.name}</span>
                    </div>
                )) : (
                    <p className="text-sm text-whatsapp-text-secondary text-center py-4">Nenhum contato disponível para adicionar.</p>
                )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
                <button 
                    onClick={handleToggleAddParticipantsView} 
                    className="px-4 py-2 text-sm rounded-md bg-gray-600 hover:bg-gray-500 text-white"
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleAddSelectedParticipantsToGroup} 
                    className="px-4 py-2 text-sm rounded-md bg-whatsapp-send-button-green hover:bg-whatsapp-send-button-green-hover text-white disabled:opacity-60"
                    disabled={selectedUsersToAdd.length === 0}
                >
                    Adicionar ({selectedUsersToAdd.length})
                </button>
            </div>
          </section>
        )}
        
        <div className="pb-4"></div>
      </div>
    </aside>
  );
};

export default ContactInfoPanel;