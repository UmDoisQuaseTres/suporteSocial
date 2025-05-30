/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Certifique-se que .ts e .tsx estão incluídos
  ],
  theme: {
    extend: {
      backgroundImage: {
        'whatsapp-chat-pattern': "url(\"data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23182229' fill-opacity='0.2'%3E%3Cpath d='M10 10 Q15 0 20 10 T30 10 Q35 20 30 30 T20 30 Q15 40 10 30 T0 30 Q5 20 10 10z'/%3E%3Ccircle cx='50' cy='10' r='3'/%3E%3Ccircle cx='10' cy='50' r='2'/%3E%3Cpath d='M40 40 L60 60 M50 40 L60 50 M40 50 L50 60' stroke-width='1' stroke='%23182229' stroke-opacity='0.2'/%3E%3Cpath d='M5 20 L25 20 M15 10 L15 30' stroke-width='1' stroke='%23182229' stroke-opacity='0.2'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%' height='100%' fill='url(%23p)'/%3E%3C/svg%3E\")",
      },
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
        'whatsapp-date-pill-bg': '#182229',
        'whatsapp-divider': '#2A3942', // Cor para divisórias e bordas sutis
      }
    },
  },
  plugins: [],
}