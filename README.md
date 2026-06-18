# AppPulse Sentinel 🚀

AppPulse é uma plataforma de monitoramento de saúde de aplicações (Uptime & Performance) projetada para desenvolvedores e equipes de operações que buscam clareza e robustez visual. 

Este projeto foi construído com foco em **UI/UX Pro Max**, combinando uma arquitetura fullstack sólida com uma interface moderna, acessível e profissional.

## 🛠 Stack Tecnológica

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **React Router 6** (Navegação & Rotas Protegidas)
- **Context API** (Gestão de Estado de Autenticação)
- **Recharts** (Dashboards e Gráficos de Latência)
- **Lucide React** (Ícones Vetoriais)
- **CSS Modules/Glassmorphism** (Design moderno e responsivo)

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** (Persistência com `pg` nativo)
- **JWT** (Autenticação Stateless)
- **Bcryptjs** (Segurança de Credenciais)
- **Node-cron** (Engine de monitoramento periódico)
- **p-limit** (Controle de concorrência para deploy em instâncias gratuitas)

## ✨ Funcionalidades Principais

- 🔐 **Autenticação Segura**: Fluxo completo de login com JWT e controle de acesso por perfis (Admin, Operador, Visualizador).
- 📊 **Dashboard Executivo**: Visão geral de uptime, aplicações degradadas, incidentes abertos e performance média.
- 📡 **Monitoramento em Tempo Real**: Verificação automática de URLs com registro de tempo de resposta e códigos HTTP.
- ⚠️ **Gestão de Incidentes**: Fluxo de abertura, investigação e resolução de falhas operacionais.
- ⚙️ **Configuração Dinâmica**: Defina intervalos de check, timeouts e status esperados por aplicação.
- 🏗 **UI/UX Refinada**: Skeleton loaders para carregamento suave, acessibilidade ARIA completa e design responsivo.

## 📁 Estrutura do Projeto

```text
apppulse/
├── frontend/          # React App (Vite)
├── backend/           # Node.js API (Express)
├── database/          # Scripts SQL (Schema, Seed, Drop)
└── README.md          # Documentação
```

## 🚀 Como Rodar Localmente

### 1. Banco de Dados
- Tenha um PostgreSQL rodando localmente.
- Crie um banco chamado `apppulse`.
- Execute os scripts na ordem: `database/schema.sql` e depois `database/seed.sql`.

### 2. Backend
- Entre na pasta `backend`.
- Instale as dependências: `npm install`.
- Crie um arquivo `.env` baseado no `.env.example`:
  ```env
  PORT=10000
  DATABASE_URL=postgresql://usuario:senha@localhost:5432/apppulse
  JWT_SECRET=sua_chave_secreta
  FRONTEND_URL=http://localhost:5173
  MONITOR_CRON=*/5 * * * *
  ```
- Inicie: `npm run dev`.

### 3. Frontend
- Entre na pasta `frontend`.
- Instale as dependências: `npm install`.
- Crie um arquivo `.env`:
  ```env
  VITE_API_URL=http://localhost:10000/api
  ```
- Inicie: `npm run dev`.

## ☁️ Deploy no Render (Plano Gratuito)

### 1. Render PostgreSQL
- Crie uma nova instância de **PostgreSQL**.
- Após criada, copie a **Internal Database URL**.

### 2. Render Web Service (Backend)
- Crie um novo **Web Service**.
- Conecte seu repositório GitHub.
- Configurações:
  - **Root Directory**: `backend`
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`
- Adicione as **Environment Variables**:
  - `DATABASE_URL`: (URL do seu Render Postgres)
  - `JWT_SECRET`: (Uma string aleatória longa)
  - `FRONTEND_URL`: (URL que o Render vai gerar para o seu Static Site)
  - `NODE_ENV`: `production`

### 3. Render Static Site (Frontend)
- Crie um novo **Static Site**.
- Configurações:
  - **Root Directory**: `frontend`
  - **Build Command**: `npm run build`
  - **Publish Directory**: `dist`
- Adicione a **Environment Variable**:
  - `VITE_API_URL`: (URL gerada pelo Render para o seu Backend) + `/api`

## 👥 Usuários de Teste (Seed)
- **Admin**: `admin@apppulse.com` / `123456`
- **Operador**: `operador@apppulse.com` / `123456`
- **Visualizador**: `viewer@apppulse.com` / `123456`

---
Desenvolvido com ❤️ para portfólio de engenharia de software.