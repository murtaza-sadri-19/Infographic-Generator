# Infographik — Animated Infographic Generator

[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)](https://vitejs.dev/)

**Infographik** is a web application that transforms structured datasets into animated, presentation-ready infographics and charts in real time.

---

## Features

- **Split-Screen Studio**: Live data table editor on the left with an interactive 16:9 presentation canvas on the right.
- **3 Animated Visualization Templates**:
  - **Animated Bar Chart**: Ranked comparisons and temporal bars with smooth entrance easing.
  - **Animated Counter**: Aggregated metric count-up with spring physics and staggered category badge chips.
  - **Animated Donut Chart**: Proportional breakdowns and percentage slices with interactive tooltips and legend.
- **CSV Import with RFC 4180 Support**:
  - Paste comma-separated data with automatic type detection (numbers, strings).
  - Handles quoted values with embedded commas (e.g. `"Smartphones, Global",92`).
- **Interactive Playback Controls**:
  - Play, Pause, Replay, and Fullscreen toggle via floating presentation HUD.
  - Respects OS-level accessibility (`prefers-reduced-motion`).
- **Data Persistence**: Changes and custom datasets are automatically preserved in browser `localStorage` via Zustand.
- **Dark Mode Support**: Seamless transition between Dark, Light, and System themes.
- **Delightful Processing Feedback**: Animated SVG chart doodles, progressing skeleton loaders, and whimsical progress messages during dataset transitions.
- **Non-blocking Toast Notifications**: Instant feedback for imports, row additions, deletions, and error reporting without annoying modal alerts.
- **Structured Logging & Error Boundaries**: Leveled logging (`debug`, `info`, `warn`, `error`) and graceful React render error recovery.

---

## CSV Data Format

Paste standard CSV text with a header row. Quoted fields and commas inside quotes are fully supported:

```csv
Category,Value
"Smartphones, Global",92
"Laptops & PCs",78
Tablets,45
Wearables,30
```

---

## Project Structure

```
src/
├── components/
│   ├── animations/          # PresentationCanvas, PlaybackControls, Skeletons
│   ├── common/              # ToastProvider, ProcessingOverlay, ErrorBoundary
│   ├── layout/              # AppShell, Header, EditorSplit
│   └── visualizations/      # AnimatedBarChart, AnimatedCounter, AnimatedDonutChart
├── lib/
│   ├── data/                # Zustand store, CSV parser, Adapter, Validation
│   ├── logger.ts            # Leveled console logging utility
│   └── theme.ts             # Theme management store
└── types/
    ├── data.ts              # Tabular data interfaces
    └── index.ts             # Canonical visualization contracts
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```
