# Project Rules & Architecture Guidelines

## Core Principles

> **Rule #1: Always Proper Design.** We use industry-standard design patterns to keep the project clean, scalable, maintainable, and decoupled.

---

## Architectural Blueprint (React + Anime.js Tactical System)

A minimal, game-like portfolio system inspired by **NieR: Automata** with a pastel beige palette and reactive Anime.js diamond stars.

```text
src/
├── main.jsx                          # React Root Entry Point
├── App.jsx                           # Tactical Archive UI & Layout Coordinator
├── style.css                         # Modular CSS Entrypoint
│
├── components/
│   ├── DiceIcon.jsx                  # Geometric Dice centerpiece & reset node
│   ├── DiceuCompanion.jsx            # Interactive 2.5D character companion & speech HUD
│   ├── ShurikenStar.jsx              # 4-point symmetric shuriken star (Anime.js)
│   ├── LimeInkText.jsx               # Thermal lime-ink word & block reveal effects
│   ├── PodLaserSurface.jsx           # NieR Pod 042 optical laser sweep surface
│   ├── Icons.jsx                     # Shared SVG system & module vector icons
│   ├── PortfolioEditor.jsx           # Secret configuration & content editor terminal
│   ├── layout/                       # HUD header/footer, constellation nav, dossier frame
│   ├── modules/                      # 6 Dossier module views + Archive detail & lightbox modal
│   └── editor/                       # Clearance gate, sidebar & CRUD module forms
│
├── hooks/
│   ├── useLaserTransition.js         # Constellation & laser scan state machine
│   ├── useSecretAccess.js            # Hash, hotkey & 5-click pip editor access
│   └── useSystemClock.js             # High-frequency HUD telemetry clock
│
├── data/
│   ├── portfolioData.json            # Single source of truth for profile & modules
│   └── portfolioStorage.js           # LocalStorage, custom event & disk persistence
│
├── styles/                           # Domain-split CSS (variables, base, layout, effects, modules, editor, diceu)
└── utils/
    ├── arrayUtils.js                 # Immutable array & module list CRUD helpers
    └── audio.js                      # Procedural Web Audio API sound synthesizer
```

---

## Design Standards

1. **Aesthetic Tone**:
   * Minimal, spacious, serene.
   * Pastel beige palette (`#ded8c7`), charcoal typography (`#3a362e`), and delicate framing lines.
2. **Tactile Feedback**:
   * Interactive 4-point diamond star animations powered by Anime.js (`outCubic`, `outQuad`).
   * Subtle procedural Web Audio clicks on hover and chimes on selection (muteable).
3. **Data Decoupling**:
   * All project cases, bio specs, skills, and links reside in `src/data/portfolioData.json`.
