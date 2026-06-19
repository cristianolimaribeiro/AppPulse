# DevOps/Fintech High-Fidelity Dashboard Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the AppPulse Sentinel dashboard and navigation structure to match a premium DevOps/Fintech visual standard with asymmetrical grids, pulsing status indicators, custom tooltips, and refined hover controls.

**Architecture:** Define custom CSS tokens in `index.css`, refine flex/grid layout properties in `Layout.css` and `Dashboard.css`, and update the TSX markup in pages to utilize modular styling classes.

**Tech Stack:** React, TypeScript, CSS Variables, Recharts, Lucide Icons, Vite.

---

### Task 1: Base CSS Tokens and Animations Update

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Update design tokens in index.css**
  
  Under the `:root` selector, adjust the color variables, shadows, and margins to fit the DevOps theme:
  ```css
  :root {
    color-scheme: dark;
    --header-height: 72px;
    --sidebar-width: 260px;

    /* Ultra Deep Dark Palette */
    --bg-main: #090a0f;
    --bg-card: #11131c;
    --bg-sidebar: #0d0e14;
    --bg-header: rgba(13, 14, 20, 0.85);

    --primary: #3b82f6;
    --primary-glow: rgba(59, 130, 246, 0.15);
    --primary-hover: #60a5fa;

    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --text-dim: #64748b;

    --border: rgba(255, 255, 255, 0.04);
    --border-bright: rgba(255, 255, 255, 0.08);

    /* Status Glowing Colors */
    --status-online: #10b981;
    --status-online-glow: rgba(16, 185, 129, 0.1);
    --status-degraded: #f59e0b;
    --status-degraded-glow: rgba(245, 158, 11, 0.1);
    --status-offline: #ef4444;
    --status-offline-glow: rgba(239, 68, 68, 0.1);
    --status-maintenance: #8b5cf6;
    --status-maintenance-glow: rgba(139, 92, 246, 0.1);
    --status-unknown: #4b5563;

    /* Elevation */
    --shadow-card: 0 12px 40px -12px rgba(0, 0, 0, 0.5);
    --radius-xl: 16px;
    --radius-lg: 10px;
    --glass: blur(16px);
    --transition-smooth: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  ```

- [ ] **Step 2: Add pulsing status dot keyframes and class rules in index.css**
  
  Add these classes at the end of the file:
  ```css
  /* Pulsing Status Dot */
  .status-dot-container {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
  }

  .status-dot {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .status-dot::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: status-pulse 2s infinite ease-in-out;
  }

  .status-dot.online { background-color: var(--status-online); }
  .status-dot.online::after { box-shadow: 0 0 0 var(--status-online); }
  
  .status-dot.degraded { background-color: var(--status-degraded); }
  .status-dot.degraded::after { box-shadow: 0 0 0 var(--status-degraded); }
  
  .status-dot.offline { background-color: var(--status-offline); }
  .status-dot.offline::after { box-shadow: 0 0 0 var(--status-offline); }
  
  .status-dot.maintenance { background-color: var(--status-maintenance); }
  .status-dot.maintenance::after { box-shadow: 0 0 0 var(--status-maintenance); }

  @keyframes status-pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 6px rgba(255, 255, 255, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }

  /* Specific pulse shadows per status */
  .status-dot.online::after { animation-name: online-pulse-key; }
  .status-dot.degraded::after { animation-name: degraded-pulse-key; }
  .status-dot.offline::after { animation-name: offline-pulse-key; }

  @keyframes online-pulse-key {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }

  @keyframes degraded-pulse-key {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
  }

  @keyframes offline-pulse-key {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }

  /* Text Link Buttons */
  .btn-text-premium {
    color: var(--primary);
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: var(--transition-smooth);
    cursor: pointer;
  }

  .btn-text-premium span {
    transition: var(--transition-smooth);
  }

  .btn-text-premium:hover {
    color: var(--primary-hover);
  }

  .btn-text-premium:hover span {
    transform: translateX(4px);
  }

  /* Latency Highlight Colors */
  .latency-low { color: var(--status-online); font-weight: 600; }
  .latency-med { color: var(--status-degraded); font-weight: 600; }
  .latency-high { color: var(--status-offline); font-weight: 700; animation: text-glowing-red 2s infinite; }

  @keyframes text-glowing-red {
    0% { opacity: 0.8; }
    50% { opacity: 1; text-shadow: 0 0 8px rgba(239, 68, 68, 0.3); }
    100% { opacity: 0.8; }
  }
  ```

- [ ] **Step 3: Commit changes**
  
  ```bash
  git add frontend/src/index.css
  git commit -m "style: define base DevOps visual tokens and pulsing state classes"
  ```

---

### Task 2: Sidebar and Header Visual Redesign

**Files:**
- Modify: `frontend/src/components/Layout.css`
- Modify: `frontend/src/components/Layout.tsx`

- [ ] **Step 1: Update navigation link styles in Layout.css**
  
  Change layout rules for `.nav-item` to use left border lines and translateX transition:
  ```css
  .nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    color: var(--text-muted);
    font-weight: 600;
    font-size: 15px;
    border-left: 3px solid transparent;
    transition: var(--transition-smooth);
  }

  .nav-item:hover {
    background: transparent;
    color: var(--text-main);
    transform: translateX(4px);
  }

  .nav-item.active {
    background: rgba(59, 130, 246, 0.05);
    color: #ffffff;
    border-left: 3px solid var(--primary);
    box-shadow: none;
  }
  ```
  And define header logo animations:
  ```css
  .logo-icon {
    color: var(--primary);
    filter: drop-shadow(0 0 8px var(--primary-glow));
    animation: logo-pulse 4s infinite ease-in-out;
  }

  @keyframes logo-pulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px var(--primary-glow)); }
    50% { transform: scale(1.06); filter: drop-shadow(0 0 14px rgba(59, 130, 246, 0.4)); }
  }
  ```

- [ ] **Step 2: Commit changes**
  
  ```bash
  git add frontend/src/components/Layout.css
  git commit -m "style: modernize sidebar hover animations, active states and logo pulse animations"
  ```

---

### Task 3: Dashboard Layout Grid Overhaul

**Files:**
- Modify: `frontend/src/pages/Dashboard.css`
- Modify: `frontend/src/pages/Dashboard.tsx`

- [ ] **Step 1: Restructure grids in Dashboard.css**
  
  Refactor `.stats-grid`, `.charts-grid`, and `.dashboard-bottom-grid` in `Dashboard.css`:
  ```css
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: 1.2fr 1.2fr 0.8fr;
    gap: 24px;
    margin-bottom: 32px;
  }

  .dashboard-bottom-grid {
    display: grid;
    grid-template-columns: 1.2fr 1.8fr;
    gap: 24px;
  }

  @media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-grid { grid-template-columns: 1fr; }
    .dashboard-bottom-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 600px) {
    .stats-grid { grid-template-columns: 1fr; }
  }
  ```

- [ ] **Step 2: Reorder layouts in Dashboard.tsx**
  
  Arrange components in `Dashboard.tsx` to match the newly restructured grids.

- [ ] **Step 3: Commit changes**
  
  ```bash
  git add frontend/src/pages/Dashboard.css frontend/src/pages/Dashboard.tsx
  git commit -m "style: structure dashboard grid into asymmetrical layout rows"
  ```

---

### Task 4: Metric KPI Cards Visual Redesign

**Files:**
- Modify: `frontend/src/pages/Dashboard.tsx`
- Modify: `frontend/src/pages/Dashboard.css`

- [ ] **Step 1: Style metrics inside Dashboard.css**
  
  ```css
  .stat-card {
    background: var(--bg-card);
    padding: 24px;
    border-radius: var(--radius-xl);
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: var(--shadow-card);
  }

  .stat-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .stat-card-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .stat-card-icon-wrapper {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-card-icon-wrapper.online { background: rgba(16, 185, 129, 0.08); color: var(--status-online); }
  .stat-card-icon-wrapper.degraded { background: rgba(245, 158, 11, 0.08); color: var(--status-degraded); }
  .stat-card-icon-wrapper.offline { background: rgba(239, 68, 68, 0.08); color: var(--status-offline); }
  .stat-card-icon-wrapper.incidents { background: rgba(255, 255, 255, 0.04); color: white; }

  .stat-card-value {
    font-size: 32px;
    font-weight: 800;
    color: white;
    margin-top: 12px;
    line-height: 1;
  }

  .stat-card-footer {
    font-size: 12px;
    font-weight: 500;
    margin-top: 12px;
    display: flex;
    align-items: center;
  }
  ```

- [ ] **Step 2: Update the React markup of metrics in Dashboard.tsx**
  
  Implement the `.stat-card-header`, `.stat-card-title`, and `.stat-card-footer` HTML structure for the four cards in `Dashboard.tsx`.
  Add trend text tags at the bottom, e.g. `100% operacional` or `Sem falhas ativas`.

- [ ] **Step 3: Commit changes**
  
  ```bash
  git add frontend/src/pages/Dashboard.css frontend/src/pages/Dashboard.tsx
  git commit -m "style: restructure top metrics cards with custom titles and trend indicators"
  ```

---

### Task 5: Custom Chart Render Overhaul

**Files:**
- Modify: `frontend/src/pages/Dashboard.tsx`
- Modify: `frontend/src/pages/ApplicationDetails.tsx`

- [ ] **Step 1: Custom Donut Chart (Dashboard.tsx)**
  
  Inject a custom HTML layout overlay in the center of the donut:
  ```tsx
  {/* Add a central text widget overlay */}
  <div className="donut-center-widget" style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    pointerEvents: 'none'
  }}>
    <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
      {apps.filter(a => a.current_status === 'online').length} / {apps.length}
    </div>
    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      Ativos
    </div>
  </div>
  ```
  Wrap the PieChart container in a `position: relative` parent div to absolute-position the central widget.
  Set the Pie chart outerRadius to `80` and innerRadius to `65`.

- [ ] **Step 2: Custom Tooltips and Cartesian stroke color (ApplicationDetails.tsx)**
  
  Verify CartesianGrid uses `stroke="var(--border)"` and tooltips have custom options (already done in previous check, verify output).

- [ ] **Step 3: Commit changes**
  
  ```bash
  git add frontend/src/pages/Dashboard.tsx frontend/src/pages/ApplicationDetails.tsx
  git commit -m "style: implement central donut text overlay and custom chart properties"
  ```

---

### Task 6: Tables Formatting and Status Indicators

**Files:**
- Modify: `frontend/src/pages/Dashboard.tsx`
- Modify: `frontend/src/pages/Incidents.tsx`
- Modify: `frontend/src/pages/Applications.tsx`

- [ ] **Step 1: Implement Pulsing dots in Dashboard.tsx tables**
  
  In the "Últimas Verificações" and "Incidentes Recentes" tables of `Dashboard.tsx`, replace the solid badge components with a status dot indicator:
  ```tsx
  <div className="status-dot-container">
    <span className={`status-dot ${status_val}`}></span>
    <span style={{ color: `var(--status-${status_val})` }}>{status_val}</span>
  </div>
  ```

- [ ] **Step 2: Implement Latency dynamic coloring in Dashboard.tsx**
  
  Color code responses inside the "Últimas Verificações" table:
  ```tsx
  const getLatencyClass = (ms: number) => {
    if (ms < 50) return 'latency-low';
    if (ms < 200) return 'latency-med';
    return 'latency-high';
  };
  ```

- [ ] **Step 3: Implement clean chevrons/text buttons**
  
  Update "VER TODOS" and "Ver Detalhes" links in tables to use:
  ```tsx
  <Link to="..." className="btn-text-premium">
    Ver Todos <span>→</span>
  </Link>
  ```

- [ ] **Step 4: Update other table pages (Incidents.tsx / Applications.tsx)**
  
  Replace solid badges with pulsing dot status containers in `Incidents.tsx` and `Applications.tsx`.

- [ ] **Step 5: Commit changes**
  
  ```bash
  git add frontend/src/pages/Dashboard.tsx frontend/src/pages/Incidents.tsx frontend/src/pages/Applications.tsx
  git commit -m "style: style table status dots and dynamic response latency colors"
  ```

---

### Task 7: Build Verification

**Files:**
- None

- [ ] **Step 1: Run project's compilation script**
  
  Run: `fnm use 24.14.1; npm run build` in `frontend/` directory.
  Expected: Build succeeds with 0 compile errors.
