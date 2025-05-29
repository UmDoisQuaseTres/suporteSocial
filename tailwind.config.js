/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Certifique-se que .ts e .tsx estão incluídos
  ],
  theme: {
    extend: {
      colors: { // Cores do WhatsApp que definimos anteriormente
        'whatsapp-green': '#075E54',
        'whatsapp-light-green': '#25D366',
        'whatsapp-chat-bg': '#0B141A', // Fundo do chat (escuro)
        'whatsapp-sidebar-bg': '#111B21', // Fundo da sidebar (escuro)
        'whatsapp-header-bg': '#202C33', // Fundo dos cabeçalhos (escuro)
        'whatsapp-input-bg': '#2A3942', // Fundo do input de mensagem
        'whatsapp-outgoing-bubble': '#005C4B', // Balão de mensagem enviada
        'whatsapp-incoming-bubble': '#202C33', // Balão de mensagem recebida (igual ao header no tema escuro)
        'whatsapp-text-primary': '#E9EDEF', // Texto principal (claro)
        'whatsapp-text-secondary': '#8696A0', // Texto secundário (cinza claro)
        'whatsapp-icon': '#AEBAC1', // Ícones
        'whatsapp-active-chat': '#2A3942', // Chat ativo ou hover
        'whatsapp-date-pill-bg': '#182229'
      }
    },
  },
  plugins: [],
}