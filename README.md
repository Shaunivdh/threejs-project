# 🌿 3js-project

> A React 19 + TypeScript + Vite portfolio experience built with Three.js through React Three Fiber.

![Portfolio preview](./docs/images/portfolio-hero.png)

I wanted this portfolio to feel more personal than a standard project list. I built the site as a small interactive journey through the places and decisions that shaped my career: growing up in the Netherlands, moving to London at 19, working in hospitality, taking the leap into software through a bootcamp in Barcelona, and eventually landing in Hove as a frontend React engineer.

---

## 🪴 Project Overview

The application is a browser-based 3D portfolio scene. It uses a `Canvas` from `@react-three/fiber` as the main rendering surface and composes the world from modular scene objects under `src/components/`.

### 🌱 Core Features

- A 3D environment made from reusable props such as trees, flowers, furniture, and regional scene elements.
- A moving airplane and waypoint system used to surface contextual content.
- Camera follow/parallax behavior tied to scene movement.
- A HUD with social links, music playback, and a contact trigger.
- A modal contact form that sends messages through EmailJS.

---

## 🌳 Tech Stack

- `react` 19 and `react-dom` 19 for the UI shell
- `vite` 7 for local development, bundling, and preview
- `typescript` 5 for static typing
- `three` for 3D primitives and rendering internals
- `@react-three/fiber` for Three.js integration in React
- `@react-three/drei` for helpers such as `Environment` and GLTF utilities
- `@react-three/postprocessing` and `postprocessing` for visual effects
- `zustand` for lightweight state management support
- `@emailjs/browser` for client-side contact form delivery
- `vitest`, `@testing-library/react`, and `jsdom` for unit/integration tests
- `@playwright/test` for browser-level end-to-end testing

---

## 🌿 Architecture

### 🌾 Application Entry

- `src/main.tsx` mounts the React app.
- `src/App.tsx` owns the main shell:
  - Creates the R3F `Canvas`
  - Mounts the HUD and popup UI
  - Controls modal state and scene readiness
  - Switches behavior based on device/input detection

### 🌳 Scene Composition

- `src/components/Scene.tsx` is the primary world assembly layer.
- The scene combines lighting, postprocessing, environment setup, and world objects.
- Major groups are organized by location/theme:
  - `src/components/netherlands/`
  - `src/components/uk/`
  - `src/components/codeop/`
  - `src/components/brighton/`
  - `src/components/waypoints/`

### 🍃 Interaction Model

- `FlightWaypoints` manages waypoint-triggered content and airplane motion.
- `Scene` exposes callbacks such as `onBeaconEnter`, `onBeaconExit`, and `onReady` to communicate back to `App`.
- `App` renders popups and modal content in response to scene events.
- The waypoint copy in `src/components/waypoints/FlightWaypoints.tsx` matters as much as the visuals, because it is what gives the whole scene its meaning.

### 🌼 Forms and External Services

- `src/components/forms/ContactForm.tsx` handles validation and sends messages using EmailJS.
- The current implementation contains the EmailJS service ID, template ID, and public key directly in source.
- For production hardening, those values should be moved to environment variables and documented in a future setup section.

---

## 🌱  Development

### 🌿 Prerequisites

- Node.js 20+ recommended
- npm (a `package-lock.json` is present, so npm is the intended package manager)

### 🌾 Install Dependencies

```bash
npm install
```
🌿 Start the Dev Server
npm run dev
🌱 Create a Production Build
npm run build
🌿 Preview the Production Build
npm run preview

### 🌵 Available Scripts

npm run dev — start Vite in development mode
npm run build — run TypeScript project build checks, then build with Vite
npm run typecheck — run TypeScript without emitting files
npm run lint — run ESLint across the project
npm run preview — serve the built app locally
npm run test — run Vitest in watch mode
npm run test:run — run Vitest once
npm run test:ui — open the Vitest UI
npm run e2e — run Playwright tests
npm run e2e:ui — open Playwright UI mode

### 🌸 Testing Notes
🧪 Unit / Component Tests
Vitest is configured inside vite.config.ts.
Tests run in a jsdom environment.
Shared test setup is loaded from src/tests/setup.ts.
src/tests/Scene.test.tsx validates core rendering expectations for the scene, including platform rendering and postprocessing toggles.

### 🎭 End-to-End Tests

Playwright is configured in playwright.config.ts.

The configured test directory is ./tests.

The Playwright web server builds the app and serves it on http://127.0.0.1:4173.

If no tests/ directory exists yet, add Playwright specs there before relying on the e2e scripts.

### 🌲 Rendering and Asset Notes

The app relies on React Three Fiber for declarative scene composition.

Scene polish comes from Environment, custom lighting, and postprocessing passes such as bloom, vignette, color adjustments, and tone mapping.

Static assets live under src/assets/, including icon SVGs and the bundled audio track.

### 🌴 GLTF Optimization
npx @gltf-transform/cli resize public/models/codeop/palm_tree.glb public/models/codeop/palm_tree.512.glb --width 512 --height 512

---

## 🎵 Music Credit
Music from #Uppbeat 
https://uppbeat.io/t/walz/misguided
