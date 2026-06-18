# Fix Layout Errors after UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the CSS/layout issues across Layout, Applications, Application Details, Incidents, Users, and Login pages to ensure a premium dark-themed UX/UI with correct sizing, alignments, loading states, and dark form controls.

**Architecture:** Define global CSS vars, style the sidebar layout structure (`.main-wrapper`), introduce global CSS utility rules for form controls (inputs, selects, textareas, labels), skeleton loaders, tables, and modal overlay systems in `index.css`. Migrate page-specific light components to modern dark palette equivalents.

**Tech Stack:** React, TypeScript, CSS Variables, Vite.

---

### Task 1: Sizing and Main Wrapper Layout

**Files:**
- Modify: `frontend/src/index.css:1-36`
- Modify: `frontend/src/components/Layout.css:70-91`

- [ ] **Step 1: Define CSS layout tokens in index.css**
  
  Add layout tokens under the `:root` block:
  ```css
  --header-height: 72px;
  --sidebar-width: 260px;
  ```

- [ ] **Step 2: Add styles for main-wrapper and update sidebar layout in Layout.css**
  
  Ensure `.main-wrapper` displays as flex so the sidebar and the content align side-by-side:
  ```css
  .main-wrapper {
    display: flex;
    flex: 1;
    position: relative;
    min-height: calc(100vh - var(--header-height));
  }
  ```
  And update `.sidebar` to be sticky or correct its layout structure.

- [ ] **Step 3: Commit changes**
  
  ```bash
  git add frontend/src/index.css frontend/src/components/Layout.css
  git commit -m "style: fix main layout flex structure and height/width variables"
  ```

---

### Task 2: Define Global Forms, Modals, Skeletons, and Table Styles

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Add container, form-control, table, skeleton, and modal rules to index.css**
  
  Append these styles to the end of `frontend/src/index.css`:
  ```css
  /* Layout Containers */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  /* Form Controls */
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
    text-align: left;
  }

  .input-group label {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="url"],
  input[type="number"],
  select,
  textarea {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    color: var(--text-main);
    font-family: inherit;
    font-size: 14px;
    transition: var(--transition-smooth);
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-glow);
    background: rgba(255, 255, 255, 0.05);
  }

  select option {
    background: var(--bg-card);
    color: var(--text-main);
  }

  .btn-outline {
    background: transparent;
    border: 1px solid var(--border-bright);
    color: var(--text-main);
  }

  .btn-outline:hover {
    background: var(--border);
    border-color: var(--text-dim);
    color: white;
  }

  /* Tables */
  .table-container {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow-x: auto;
    box-shadow: var(--shadow-card);
    margin-bottom: 24px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  table th {
    background: rgba(255, 255, 255, 0.02);
    color: var(--text-muted);
    padding: 16px 24px;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--border-bright);
  }

  table td {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    color: var(--text-main);
    font-size: 14px;
    vertical-align: middle;
  }

  table tr:last-child td {
    border-bottom: none;
  }

  table tr:hover td {
    background: rgba(255, 255, 255, 0.01);
  }

  /* Modals */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 11, 16, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.2s ease-out;
  }

  .modal {
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: var(--bg-card);
    border: 1px solid var(--border-bright);
    border-radius: var(--radius-xl);
    padding: 32px;
    box-shadow: var(--shadow-card);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* Loading & Skeleton states */
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    font-size: 16px;
    color: var(--text-muted);
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    color: var(--text-dim);
    text-align: center;
    gap: 16px;
  }

  .empty-state p {
    font-size: 15px;
    color: var(--text-muted);
  }

  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 25%,
      rgba(255, 255, 255, 0.08) 37%,
      rgba(255, 255, 255, 0.03) 63%
    );
    background-size: 400% 100%;
    animation: skeleton-shimmer 1.4s ease infinite;
    border-radius: var(--radius-lg);
  }

  @keyframes skeleton-shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  ```

- [ ] **Step 2: Commit changes**
  
  ```bash
  git add frontend/src/index.css
  git commit -m "style: define global form controls, table container, modal overlay, skeletons, and loading states"
  ```

---

### Task 3: Users Page Style Import

**Files:**
- Modify: `frontend/src/pages/Users.tsx:1-5`

- [ ] **Step 1: Import Users.css explicitly**
  
  Add `import './Users.css';` at the top of `Users.tsx`:
  ```typescript
  import React, { useEffect, useState } from 'react';
  import api from '../services/api';
  import { User } from '../types';
  import { UserPlus, ToggleLeft, ToggleRight, Edit } from 'lucide-react';
  import './Users.css';
  ```

- [ ] **Step 2: Commit changes**
  
  ```bash
  git add frontend/src/pages/Users.tsx
  git commit -m "style: import Users.css explicitly in Users.tsx"
  ```

---

### Task 4: Dark Theme Form Filters in Applications page

**Files:**
- Modify: `frontend/src/pages/Applications.css`

- [ ] **Step 1: Remove hardcoded light-theme styles from Applications.css**
  
  Locate and clean up the light mode rules (like `background: #f1f5f9;` or `background: white;`) for search-input and filters-bar select, letting them inherit the global styles defined in index.css. Also fix hover backgrounds:
  ```css
  .btn-icon:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    color: var(--primary);
  }
  ```

- [ ] **Step 2: Commit changes**
  
  ```bash
  git add frontend/src/pages/Applications.css
  git commit -m "style: convert Applications filters and search to dark theme styles"
  ```

---

### Task 5: Refactor Application Details View Layout CSS

**Files:**
- Modify: `frontend/src/pages/ApplicationDetails.css`

- [ ] **Step 1: Update borders and badges to dark mode styling**
  
  Update `.info-item` border bottom, `.active-maint`, and tab buttons in `ApplicationDetails.css` to use dark theme colors:
  ```css
  .active-maint {
    background: var(--status-maintenance) !important;
    color: white !important;
    border-color: var(--status-maintenance) !important;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  .tab-btn:hover {
    color: var(--text-main);
    background: rgba(255, 255, 255, 0.03);
  }

  .tab-btn.active {
    background: var(--bg-card);
    border-color: var(--border);
    color: var(--primary);
    font-weight: 600;
  }
  ```

- [ ] **Step 2: Commit changes**
  
  ```bash
  git add frontend/src/pages/ApplicationDetails.css
  git commit -m "style: optimize ApplicationDetails layout border and tab controls for dark mode"
  ```

---

### Task 6: Modern Dark Theme Login Screen styling

**Files:**
- Modify: `frontend/src/pages/Login.css`

- [ ] **Step 1: Clean up Login.css to match premium dark styling**
  
  Modify `frontend/src/pages/Login.css`:
  ```css
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, var(--bg-card) 0%, var(--bg-main) 100%);
    padding: 20px;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 40px;
    box-shadow: var(--shadow-card);
  }
  ```
  (Ensure input labels and form validation error alerts look appropriate by using matching styling, such as `.login-error { background: rgba(255, 82, 82, 0.1); color: var(--status-offline); }`).

- [ ] **Step 2: Commit changes**
  
  ```bash
  git add frontend/src/pages/Login.css
  git commit -m "style: modernize login screen with cohesive dark mode design"
  ```

---

### Task 7: Build Verification

**Files:**
- None

- [ ] **Step 1: Compile the frontend codebase**
  
  Run: `fnm use 20; npm run build` in `D:\AppPulse\AppPulse\frontend`
  Expected: Build succeeds with 0 compile errors.
