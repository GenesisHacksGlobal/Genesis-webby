# 👾 Genesis Easter Eggs Guide

Welcome to the official secret vault of the **Genesis Web Platform**! ⚡  
Hidden throughout the application are interactive Easter Eggs designed for curious developers, hackathon organizers, and secret seekers.

---

## 🎮 1. The Konami Code (`↑ ↑ ↓ ↓ ← → ← → B A`)

- **Trigger Method**: Press the following key sequence anywhere on the website (when not focused on a text input):
  ```
  [ArrowUp] -> [ArrowUp] -> [ArrowDown] -> [ArrowDown] -> [ArrowLeft] -> [ArrowRight] -> [ArrowLeft] -> [ArrowRight] -> [B] -> [A]
  ```
- **What Happens**:
  - 🎶 Synthesizes a retro 8-bit chiptune fanfare using the browser's Web Audio API.
  - 🌧️ Spawns a full-screen **Genesis Matrix Digital Rain** canvas overlay raining cyan & green binary hacker glyphs (`GENESIS01010101HACKATHON1337`).
  - 💻 Opens an interactive Cyberpunk Modal featuring Genesis ASCII art and an optional **"RGB Overclock"** button.

---

## 👾 2. The 1337 Elite Code (`1 3 3 7`)

- **Trigger Method**: Type `1337` anywhere on the site.
- **What Happens**:
  - 🏆 Triggers a retro Audio Fanfare.
  - 🔮 Opens the **1337 Elite Hacker Vault** modal granting secret organizer status and unlocking developer themes.

---

## ⚡ 3. RGB Overclock Mode (`r-g-b` / `o-v-e-r-c-l-o-c-k` / 7-Click Logo)

- **Unique Secret Codes**: 
  - Type `rgb` anywhere on the website.
  - OR Type `overclock` anywhere on the website.
  - OR Click the Genesis logo in the top navbar **7 times within 2.5 seconds**.
- **What Happens**:
  - 🎶 Plays a retro audio pulse.
  - 🌈 Activates **RGB Overclock Mode** — shifting all brand accent colors into a continuous 360° dynamic rainbow hue cycle across the entire website for 15 seconds!

---

## 💻 4. DevTools Console Secret Commands

- **Trigger Method**: Open Developer Tools (`F12` or `Cmd+Option+I` on Mac / `Ctrl+Shift+I` on Windows/Linux) and switch to the **Console** tab.
- **Available Console Commands**:
  - `window.genesisSecret()` — Executes the Secret Console Vault & plays retro audio.
  - `window.genesis.matrix()` — Manually launches the Matrix Digital Rain overlay.
  - `window.genesis.leet()` — Manually triggers the 1337 Vault popup.
  - `window.genesis.overclock()` — Manually triggers 15 seconds of RGB Overclock Mode.

---

## 🛠️ Architecture & Implementation

All Easter Eggs are managed by:
- **[EasterEggs.jsx](file:///mnt/Garvit%20Prakash/Projects/genisis-hack-website/genesis-hack-v2/Genesis-webby/frontend/src/shared/components/EasterEggs.jsx)**: Global listener for keyboard combinations, HTML5 Canvas Matrix rain renderer, and Web Audio API synthesizer.
- **[Navbar.jsx](file:///mnt/Garvit%20Prakash/Projects/genisis-hack-website/genesis-hack-v2/Genesis-webby/frontend/src/widgets/layout/Navbar.jsx)**: Rapid logo click counter handler.
- **[globals.css](file:///mnt/Garvit%20Prakash/Projects/genisis-hack-website/genesis-hack-v2/Genesis-webby/frontend/src/shared/styles/globals.css)**: `rgbShift` 360° keyframe animation.
