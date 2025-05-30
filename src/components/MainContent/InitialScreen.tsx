import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faLock } from '@fortawesome/free-solid-svg-icons';

const InitialScreen: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-whatsapp-chat-bg p-8 text-center text-whatsapp-text-secondary">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png"
        alt="WhatsApp Logo"
        className="mb-8 h-64 w-64 opacity-10"
        onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if logo fails
      />
      <h2 className="mb-2 text-3xl font-light text-whatsapp-text-primary">Mantenha seu celular conectado</h2>
      <p className="mb-1 text-sm">O WhatsApp conecta ao seu celular para sincronizar suas mensagens.</p>
      <p className="mb-8 text-sm">Para reduzir o uso de dados, conecte seu celular a uma rede Wi-Fi.</p>
      <hr className="mb-8 w-1/2 border-whatsapp-divider" />
      <p className="text-sm text-whatsapp-text-secondary">
        <FontAwesomeIcon icon={faLaptop} className="mr-2" /> O WhatsApp está disponível para Windows.
        <a href="#" className="text-whatsapp-light-green hover:text-whatsapp-green"> Baixe aqui.</a>
      </p>
      <p className="mt-auto text-xs text-whatsapp-text-secondary/80">
        <FontAwesomeIcon icon={faLock} className="mr-1" /> Criptografia de ponta a ponta
      </p>
    </div>
  );
};

export default InitialScreen;