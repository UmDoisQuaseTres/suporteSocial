# SuporteSocial - Clone do WhatsApp

Este projeto é uma interface de usuário (UI) inspirada no WhatsApp, desenvolvida com React, TypeScript, Vite e Tailwind CSS. O objetivo é simular a experiência visual e algumas das interações básicas do popular aplicativo de mensagens.

O desenvolvimento partiu de um template Vite + React + TS [cite: suportesocial-master/README.md] e foi customizado para criar uma réplica funcional da interface do WhatsApp, utilizando dados mocados para popular as conversas e contatos.

<!-- Exemplo:
![Visão Geral do Chat](URL_DA_SUA_IMAGEM_AQUI)
-->

## 🌟 Funcionalidades Implementadas

O projeto replica diversas características da interface do WhatsApp, incluindo:

* **Layout Geral:**
    * **Sidebar (Barra Lateral):** Lista de conversas, busca e acesso a conversas arquivadas e criação de novas conversas. [cite: suportesocial-master/src/components/Sidebar/Sidebar.tsx, suportesocial-master/src/App.tsx]
    * **MainContent (Conteúdo Principal):** Exibe a janela de chat ativa ou uma tela inicial. [cite: suportesocial-master/src/components/MainContent/MainContent.tsx]
    * **ContactInfoPanel (Painel de Informações):** Mostra detalhes do contato ou grupo selecionado. [cite: suportesocial-master/src/components/ContactInfoPanel/ContactInfoPanel.tsx]

* **Sidebar Detalhada:**
    * **Cabeçalho da Sidebar:** Avatar do usuário, ícones para comunidades, status, nova conversa e menu. [cite: suportesocial-master/src/components/Sidebar/SidebarHeader.tsx]
    * **Busca de Conversas:** Filtra a lista de conversas. [cite: suportesocial-master/src/components/Sidebar/ChatSearch.tsx]
    * **Item de Arquivadas:** Mostra o número de conversas arquivadas e não lidas, permitindo acesso a elas. [cite: suportesocial-master/src/components/Sidebar/ArchivedItem.tsx]
    * **Lista de Conversas (`ChatList`):**
        * Renderiza `ChatListItem` para cada conversa. [cite: suportesocial-master/src/components/Sidebar/ChatList.tsx]
        * Cada item exibe avatar [cite: suportesocial-master/src/components/common/Avatar.tsx], nome, última mensagem [cite: suportesocial-master/src/components/Sidebar/LastMessagePreview.tsx], timestamp [cite: suportesocial-master/src/utils/date.ts] e status (não lido, silenciado) [cite: suportesocial-master/src/components/Sidebar/ChatListItemStatusIcons.tsx].
        * Permite arquivar/desarquivar conversas ao pairar o mouse. [cite: suportesocial-master/src/components/Sidebar/ChatListItem.tsx]
    * **Visão de Nova Conversa (`NewChatView`):**
        * Busca de contatos. [cite: suportesocial-master/src/components/Sidebar/NewChatView.tsx]
        * Lista de contatos disponíveis para iniciar uma nova conversa. [cite: suportesocial-master/src/components/Sidebar/ContactListItem.tsx]

* **Janela de Chat (`ChatWindow`):**
    * **Cabeçalho do Chat (`ChatHeader`):** Avatar, nome do contato/grupo, status (online, participantes) e ações (arquivar, pesquisar, mais opções). [cite: suportesocial-master/src/components/MainContent/ChatWindow/ChatHeader.tsx]
    * **Área de Mensagens (`MessageArea`):**
        * Exibe mensagens agrupadas por data. [cite: suportesocial-master/src/components/MainContent/ChatWindow/MessageArea.tsx]
        * Scroll automático para a última mensagem.
        * Balões de mensagem (`MessageBubble`) diferenciados para enviadas e recebidas. [cite: suportesocial-master/src/components/MainContent/ChatWindow/MessageBubble.tsx]
        * Exibe nome do remetente em grupos.
        * Suporte visual para mensagens com imagem (placeholder).
        * Metadados da mensagem (`MessageMeta`): timestamp e status de entrega (enviado, entregue, lido). [cite: suportesocial-master/src/components/MainContent/ChatWindow/MessageMeta.tsx, suportesocial-master/src/utils/uiHelpers.tsx]
    * **Input de Mensagem (`MessageInput`):**
        * Campo para digitar mensagens.
        * Botão para enviar mensagem ou (visualmente) para gravar áudio.
        * Picker de Emojis. [cite: suportesocial-master/src/components/MainContent/ChatWindow/MessageInput.tsx]
        * Menu de anexos (com itens como Documento, Câmera, Galeria - interface). [cite: suportesocial-master/src/components/MainContent/ChatWindow/AttachmentMenuItem.tsx]
        * Feedback visual para contatos bloqueados. [cite: suportesocial-master/src/components/MainContent/ChatWindow/MessageInput.tsx]

* **Painel de Informações do Contato/Grupo (`ContactInfoPanel`):**
    * Avatar e nome do contato/grupo.
    * Recado (para usuários) e número de participantes (para grupos).
    * Seção de Mídia, links e docs (placeholder visual).
    * Opções de menu (`InfoPanelMenuItem`):
        * Silenciar/Ativar notificações (com toggle).
        * Mensagens favoritas (item visual).
        * Bloquear/Desbloquear contato.
        * Apagar conversa.
        * Sair do grupo.
    * Lista de participantes do grupo (`ParticipantList` e `ParticipantListItem`), indicando administradores. [cite: suportesocial-master/src/components/ContactInfoPanel/ParticipantList.tsx, suportesocial-master/src/components/ContactInfoPanel/ParticipantListItem.tsx]

* **Gerenciamento de Estado e Lógica:**
    * Zustand Store:
        * Gerencia todo o estado da aplicação de forma centralizada
        * Mantém estado dos chats, mensagens, seleção de chat ativo
        * Controla estados de UI como visualizações e painéis
        * Implementa todas as ações (envio de mensagens, arquivamento, bloqueio, etc.)
        * Utiliza dados mocados para simular backend
    * Tipos de dados definidos em `src/types/index.ts`. [cite: suportesocial-master/src/types/index.ts]

* **Componentes Comuns e Utilitários:**
    * `Avatar`: Componente reutilizável para exibir avatares com fallback para iniciais ou placeholder. [cite: suportesocial-master/src/components/common/Avatar.tsx]
    * `uiHelpers`: Funções para renderizar ícones de status de mensagem e ícones de mídia. [cite: suportesocial-master/src/utils/uiHelpers.tsx]
    * `date`: Funções para formatar timestamps e horas de mensagens. [cite: suportesocial-master/src/utils/date.ts]

* **Tela Inicial:** Exibida quando nenhuma conversa está selecionada. [cite: suportesocial-master/src/components/MainContent/InitialScreen.tsx]

## 🛠️ Tecnologias

* **React 19** [cite: suportesocial-master/package.json]
* **TypeScript** [cite: suportesocial-master/package.json]
* **Vite** (Build Tool e Servidor de Desenvolvimento) [cite: suportesocial-master/vite.config.ts]
* **Tailwind CSS** (Framework CSS Utilitário) [cite: suportesocial-master/tailwind.config.js]
    * Configurado com PostCSS e Autoprefixer. [cite: suportesocial-master/postcss.config.js]
    * Tema customizado com cores do WhatsApp. [cite: suportesocial-master/tailwind.config.js]
* **ESLint** (Linting de Código) [cite: suportesocial-master/eslint.config.js]
    * Plugins: `@typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
* **Font Awesome** (Ícones) [cite: suportesocial-master/package.json]
* **emoji-picker-react** (Seletor de Emojis) [cite: suportesocial-master/package.json]

## 🚀 Como Executar

**Requisitos:**
* Node.js (>=18.0.0 recomendado, conforme `vite/package.json` e `eslint/package.json`)
* npm, yarn ou pnpm

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/umdoisquasetres/suportesocial.git](https://github.com/umdoisquasetres/suportesocial.git)
    cd suportesocial
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    # yarn install
    # ou
    # pnpm install
    ```
    [cite: suportesocial-master/package.json]

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    [cite: suportesocial-master/package.json]
    O projeto estará disponível em `http://localhost:5173` (ou outra porta, se esta estiver ocupada).

**Outros Scripts (definidos em `package.json` [cite: suportesocial-master/package.json]):**

* `npm run build`: Compila o projeto para produção (saída em `dist/`).
* `npm run lint`: Executa o ESLint para verificar o código.
* `npm run preview`: Inicia um servidor local para visualizar a build de produção.

## 📂 Estrutura do Projeto

A estrutura do projeto organiza os componentes por funcionalidade principal (`Sidebar`, `MainContent`, `ContactInfoPanel`) e reutilizáveis (`common`). Hooks, tipos e utilitários possuem suas próprias pastas para melhor organização.

## 💡 Possíveis Melhorias Futuras

* Integração com backend real (ex: Firebase, WebSocket) para persistência de dados e comunicação em tempo real.
* Autenticação de usuários.
* Funcionalidade completa de upload e exibição de mídias.
* Notificações push.
* Testes unitários e de integração.
* Otimizações de performance.
* Melhorias de acessibilidade.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir *issues* para reportar bugs ou sugerir novas funcionalidades. Pull Requests também são apreciados.

1.  Faça um Fork do projeto.
2.  Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`).
3.  Faça commit das suas alterações (`git commit -m 'Adiciona NovaFuncionalidade'`).
4.  Faça push para a sua branch (`git push origin feature/NovaFuncionalidade`).
5.  Abra um Pull Request.cls
