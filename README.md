# 🎮 2048 — Unique 5x5 Edition

A modern, visually rich take on the classic 2048 puzzle game — built with React + Vite, featuring a 5x5 grid, warm wooden-floor theme, smooth tile animations, dynamic sound effects, and voice praise. No login, no backend, no paid APIs — runs entirely in the browser.

🔗 **Live local dev:** `npm run dev` → http://localhost:5173

---

## ✨ Features

- **5x5 grid** — a harder twist on the classic 4x4 2048
- **Smooth tile animations** — sliding, pop-in on spawn, pulse on merge
- **Warm wooden-floor theme** — custom color-coded tiles (bronze → copper → gold progression)
- **Sound effects** — move/merge tones generated via Web Audio API (no audio files), with cascading multi-merge chimes
- **Voice praise** — spoken "Nice!", "Incredible!" etc. on big merges, using the browser's built-in Speech Synthesis API
- **Independent sound controls** — toggle SFX and Voice separately, both on by default
- **Persistent high score** — saved in `localStorage`, no account needed
- **Game-over / win overlay** — shows final score, best score, highest tile reached, and move count, with confetti celebration effects
- **Zero cost** — no paid APIs, no backend, no authentication

## 🛠️ Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) — fast dev server and build tooling
- Plain CSS (no framework) — custom theme, animations, glassmorphism/wood textures
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — procedurally generated sound effects (no audio assets)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) — voice praise (browser built-in, free)
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) — win/loss celebration effects
- `localStorage` — persists high score across sessions

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (comes with Node)

### Installation

```bash
git clone https://github.com/manojnager/2048-GAME.git
cd 2048-GAME
npm install
```

### Run locally

```bash
npm run dev
```
Open the printed local URL (usually `http://localhost:5173`) in your browser.

### Build for production

```bash
npm run build
```
Output goes to the `dist/` folder — deployable to any static host (Vercel, Netlify, GitHub Pages, etc).

## 🎯 How to Play

- Use **arrow keys** (↑ ↓ ← →) to slide tiles.
- Tiles with the same number merge into one when they collide.
- Reach the **2048 tile** to win.
- Game ends when the board is full and no more merges are possible.
- Your **best score** is saved automatically in your browser.

## 📁 Project Structure