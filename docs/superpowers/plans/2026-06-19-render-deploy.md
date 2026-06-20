# Render Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the full AppPulse Sentinel application (Frontend React app, Backend Node/Express API) using your existing Render PostgreSQL database isolated under the `apppulse` schema namespace.

**Architecture:** A separated services deployment containing a shared PostgreSQL database instance, a Render Web Service for the backend Node.js API, and a Render Static Site for the frontend React/Vite client application. The database connection pool and migration scripts will dynamically set the search path to `apppulse` to isolate tables.

**Tech Stack:** Node.js, Express, React, Vite, TypeScript, PostgreSQL (`pg`), Render Cloud Platform.

---

### Task 1: Update Code for Schema Isolation

**Files:**
- Modify: `backend/src/database/connection.ts`
- Modify: `backend/migrate.js`

- [ ] **Step 1: Configure backend connection pool to use `apppulse` schema**
  Modify `backend/src/database/connection.ts` to execute `SET search_path TO apppulse, public;` on every client connection.
  
  ```typescript
  import { Pool } from 'pg';
  import dotenv from 'dotenv';

  dotenv.config();

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  // Forçar o uso do schema apppulse isolado
  pool.on('connect', (client) => {
    client.query('SET search_path TO apppulse, public;');
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),
    pool,
  };
  ```

- [ ] **Step 2: Update migration script `backend/migrate.js`**
  Modify `backend/migrate.js` to create and set the active schema before executing the SQL files.
  
  ```javascript
  const { Client } = require('pg');
  const fs = require('fs');
  const path = require('path');

  const connectionString = process.env.MIGRATE_DATABASE_URL;

  if (!connectionString) {
    console.error('Erro: A variável de ambiente MIGRATE_DATABASE_URL não foi definida.');
    process.exit(1);
  }

  async function runMigration() {
    console.log('Iniciando conexão com o banco de dados remoto...');
    
    const client = new Client({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      console.log('Conectado com sucesso ao PostgreSQL na Render!');

      // Criar e definir o schema isolado
      console.log('Garantindo existência do schema "apppulse"...');
      await client.query('CREATE SCHEMA IF NOT EXISTS apppulse;');
      await client.query('SET search_path TO apppulse;');

      // Carregar schema e seed
      const schemaPath = path.join(__dirname, '../database/schema.sql');
      const seedPath = path.join(__dirname, '../database/seed.sql');

      console.log(`Lendo arquivo de Schema: ${schemaPath}`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');

      console.log(`Lendo arquivo de Seed: ${seedPath}`);
      const seedSql = fs.readFileSync(seedPath, 'utf8');

      console.log('Executando criação do schema (tabelas)...');
      await client.query(schemaSql);
      console.log('Schema criado com sucesso!');

      console.log('Populando banco com os dados iniciais (seed)...');
      await client.query(seedSql);
      console.log('Dados populados com sucesso!');

    } catch (error) {
      console.error('Erro durante a migração:', error);
      process.exit(1);
    } finally {
      await client.end();
      console.log('Conexão encerrada com o banco de dados.');
    }
  }

  runMigration();
  ```

- [ ] **Step 3: Commit code changes**
  Run:
  ```powershell
  git add backend/src/database/connection.ts backend/migrate.js
  git commit -m "feat: add schema isolation for database sharing"
  ```
  Expected: Code changes committed successfully.

---

### Task 2: Execute Migration Against Existing Database

- [ ] **Step 1: Obtain External Database URL**
  Obtain the **External Database URL** of your existing database from the Render PostgreSQL console settings page.

- [ ] **Step 2: Run migration command**
  Run the migration in PowerShell pointing to the existing database:
  ```powershell
  $env:MIGRATE_DATABASE_URL="SUA_EXTERNAL_DATABASE_URL_EXISTENTE"
  node backend/migrate.js
  ```
  Expected: Output showing schemas and tables created under the `apppulse` namespace.

---

### Task 3: Deploy Backend on Render

- [ ] **Step 1: Push changes to GitHub**
  Push all commits to GitHub:
  ```powershell
  git push origin main
  ```

- [ ] **Step 2: Create Web Service on Render**
  1. Click **New** > **Web Service** on Render.
  2. Select your connected repository.
  3. Settings:
     * **Name:** `apppulse-backend`
     * **Language:** `Node`
     * **Branch:** `main`
     * **Root Directory:** `backend`
     * **Build Command:** `npm install && npm run build`
     * **Start Command:** `npm start`
     * **Instance Type:** `Free`
  4. Environment Variables:
     * `NODE_ENV`: `production`
     * `DATABASE_URL`: *(O **Internal Database URL** do seu PostgreSQL existente)*
     * `JWT_SECRET`: *(Sua frase secreta aleatória)*
     * `PORT`: `10000`
  5. Click **Create Web Service**. Save the backend URL (e.g., `https://apppulse-backend.onrender.com`).

---

### Task 4: Deploy Frontend on Render

- [ ] **Step 1: Create Static Site on Render**
  1. Click **New** > **Static Site**.
  2. Configure settings:
     * **Name:** `apppulse-frontend`
     * **Branch:** `main`
     * **Root Directory:** `frontend`
     * **Build Command:** `npm run build`
     * **Publish Directory:** `dist`
  3. Environment Variable:
     * `VITE_API_URL`: *(Sua URL do Backend + `/api`)*
  4. Click **Create Static Site**. Save the frontend URL.

---

### Task 5: Final Cross-Configuration and Testing

- [ ] **Step 1: Configure FRONTEND_URL on Backend Web Service**
  1. In Render, go to your **apppulse-backend** Web Service > **Environment**.
  2. Add:
     * **Key:** `FRONTEND_URL`
     * **Value:** *(A URL do seu frontend gerada na Task 4)*
  3. Save changes.

- [ ] **Step 2: Access and test the live application**
  1. Open the frontend URL in your browser.
  2. Login with: `admin@apppulse.com` / `123456`.
  3. Verify dashboard and monitored services.
