import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faLock } from '@fortawesome/free-solid-svg-icons';

const InitialScreen: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#222E35] p-8 text-center text-gray-300">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png"
        alt="WhatsApp Logo"
        className="mb-8 h-64 w-64 opacity-10"
        onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if logo fails
      />
      <h2 className="mb-2 text-3xl font-light text-gray-200">Mantenha seu celular conectado</h2>
      <p className="mb-1 text-sm text-gray-400">O WhatsApp conecta ao seu celular para sincronizar suas mensagens.</p>
      <p className="mb-8 text-sm text-gray-400">Para reduzir o uso de dados, conecte seu celular a uma rede Wi-Fi.</p>
      <hr className="mb-8 w-1/2 border-gray-600/50" />
      <p className="text-sm text-gray-500">
        <FontAwesomeIcon icon={faLaptop} className="mr-2" /> O WhatsApp está disponível para Windows.
        <a href="#" className="text-teal-400 hover:text-teal-300"> Baixe aqui.</a>
      </p>
      <p className="mt-auto text-xs text-gray-600">
        <FontAwesomeIcon icon={faLock} className="mr-1" /> Criptografia de ponta a ponta
      </p>
    </div>
  );
};

export default InitialScreen;