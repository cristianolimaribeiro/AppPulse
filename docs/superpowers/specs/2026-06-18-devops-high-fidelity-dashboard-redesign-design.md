# Specification: DevOps/Fintech High-Fidelity Dashboard Overhaul

**Date:** 2026-06-18  
**Topic:** Dashboard & Navigation Redesign  
**Status:** Approved  

---

## 1. Goal

Transform the AppPulse Sentinel dashboard and layout components from a generic, amateur template (Bootstrap/Shadcn block default look) into a premium, high-fidelity DevOps/Fintech analytical interface. The redesign focuses on details: visual depth, advanced typography, custom chart styling, pulsing status dots, conditional latency values, and clean asymmetrical alignments.

---

## 2. Design System Tokens (index.css)

All primary, neutral, and status colors must be optimized for dark theme legibility and visual glow effects.

```css
:root {
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

  /* Sizing */
  --radius-xl: 16px;
  --radius-lg: 10px;
  
  --shadow-card: 0 12px 40px -12px rgba(0, 0, 0, 0.5);
  --glass: blur(16px);
  --transition-smooth: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 3. Component Specifications

### 3.1. Sidebar Navigation (Layout.css / Layout.tsx)
- **Visuals:** Replace blocky pills with a sleek left vertical indicator bar.
- **Active State:** The active menu item gets `color: #ffffff`, a soft transparent blue background (`background: rgba(59, 130, 246, 0.05)`), and a 3px wide vertical bar on the left edge (`border-left: 3px solid var(--primary)`).
- **Hover State:** Inactive links shift text color from `#64748b` to `#94a3b8` and translate horizontally by `4px` with a transition duration of `0.2s`.
- **Logo animation:** Add a soft pulse keyframe scale animation to the logo icon on page load.

### 3.2. Top KPI Cards (Dashboard.css / Dashboard.tsx)
- **Structure:**
  - Metric label at the top: small text (`11px`), bold (`font-weight: 700`), uppercase, muted (`color: var(--text-dim)`).
  - Metric value centered below label: large (`32px`), bold (`font-weight: 800`), white (`color: #ffffff`), line-height 1.
  - Icon in top right corner: small circle (`width: 32px; height: 32px; border-radius: 50%`) with background of corresponding `status-glow` and colored icon.
  - Context indicator at the bottom: details of the metric (e.g. `100% de Uptime` or `3 ativos` in matching colors).

### 3.3. Charts Customization (Dashboard.css / ApplicationDetails.tsx)
- **Status Donut Chart:**
  - Draw a central metric in the middle of the donut hole.
  - Central metric shows the raw numbers: e.g., large bold text `6 / 9` and small label `Serviços Online` directly underneath.
  - Legends are formatted as small dot colored indicators without bulky borders.
- **Latency Area Chart:**
  - Area stroke uses `#3b82f6` (2px).
  - Area fill uses a linear gradient that fades from blue (`opacity: 0.15` at top) to fully transparent (`opacity: 0` at bottom).
  - Cartesian grid horizontal lines styled as `rgba(255, 255, 255, 0.02)`.
  - Tooltip customized with glassmorphism: background `#11131c`, border `1px solid rgba(255, 255, 255, 0.08)`, blur `blur(12px)`, and high-contrast white text values.
- **Environment Bar Chart:**
  - Apply border-radius to the top of the bar elements (`radius={[8, 8, 0, 0]}`).
  - Add gradient fill matching the primary theme.

### 3.4. Tables Layout (Dashboard.css / Incidents.tsx / Applications.tsx)
- **Pulsing Status Dots:**
  - Replace solid box badges in tables with a pulsing dot indicator.
  - A tiny circle (`width: 8px; height: 8px; border-radius: 50%`) with a background matching the status, and an animation that scales a secondary circular shadow from `scale(1)` to `scale(2.5)` with `opacity` fading out.
  - Text next to the dot should be lowercase (e.g. `• online` or `• offline`).
- **Latency Formatting:**
  - Time columns should render latency time values colored dynamically:
    - Green for fast latency: `< 50ms`.
    - Orange for medium/degraded latency: `50ms - 200ms`.
    - Pulsing red for high/offline latency: `> 200ms`.
- **Text Action Links:**
  - Action items (such as "VER TODOS" or "Ver Detalhes") must look like clean buttons without underlines, styled with primary blue color and showing an arrow/chevron on hover (`Ver todos →` or `Detalhes →`). On hover, translate the chevron horizontally by 3px.

---

## 4. Layout Grid Positioning (Dashboard.css)

Reorganize the `Dashboard.tsx` grid:
1. **Metric Row:** 4 columns of metric cards.
2. **Charts Grid:** Desktop screens (>1024px) utilize a balanced 3-column layout:
   - `grid-template-columns: 1.2fr 1.2fr 0.8fr`
   - Card 1: Status Distribution (Donut)
   - Card 2: Environment Distribution (Bar)
   - Card 3: Response Time Metric Card (Highlighted card with sparkline)
3. **Tables Grid:** Desktop screens (>1024px) display "Incidentes Recentes" and "Últimas Verificações" side-by-side:
   - `grid-template-columns: 1.2fr 1.8fr;` (asymmetrical layout grid to prioritize details).

---

## 5. Verification Plans

1. Verify that all components render correctly in the browser without overlaps.
2. Ensure select inputs are fully visible (contrast test: light text on dark background).
3. Compile package:
   ```bash
   cd frontend
   fnm use 24.14.1
   npm run build
   ```
   Expectation: Build compiles cleanly into static production chunks.
