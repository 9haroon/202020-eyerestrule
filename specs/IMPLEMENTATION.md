# Implementation Outline: Eye Rest Rule Web Application

This document provides a high-level roadmap for developing the eye rest web application based on the project specifications (`/specs/001-build-web-application/`).

## 1. Repository Layout
The project follows a standard Next.js App Router structure within the `frontend` directory:

*   `src/app/(main)/`: Contains the main timer page and layout.
*   `src/app/settings/`: Contains the settings configuration page.
*   `src/components/`: Shared UI components (Timer, Overlays, Controls).
*   `src/hooks/`: Core logic encapsulation (specifically `useTimer.ts`).
*   `src/lib/`: Utilities for persistence (`localStorage.ts`) and general helpers.
*   `src/types/`: TypeScript interface definitions (`timer.d.ts`).

## 2. Local Development Setup
1.  **Environment**: Ensure Node.js (latest LTS) is installed.
2.  **Install**: Navigate to the `frontend` directory and run `npm install`.
3.  **Run**: Use `npm run dev` to start the development server.
4.  **Test**: Execute `npm test` (Jest) for unit/integration tests and `npx playwright test` for E2E scenarios.

## 3. High-Level Implementation Phases

### Phase 1: Core Timer Functionality (Priority P1)
*   Build the main timer interface.
*   Implement `useTimer.ts` logic (countdown, state management).
*   Implement visual (full-screen overlay) and audible (Audio API) notifications.
*   Add unit tests for timer transitions.

### Phase 2: Customization & Persistence (Priority P2/P3)
*   Build the settings page for interval adjustment.
*   Integrate `localStorage` for saving `TimerConfiguration`.
*   Update `useTimer.ts` to initialize from stored settings.

### Phase 3: Polish & Edge Cases
*   Ensure accessibility (ARIA attributes) and responsiveness across devices.
*   Document tab-behavior (timer reset/restart logic).
*   Finalize E2E tests for settings persistence and session re-loading.

## 4. Concrete Next Steps
1.  **Initialize Project**: Verify `frontend/package.json` dependencies (React 18, Next.js 16+).
2.  **Define Types**: Create `frontend/src/types/timer.d.ts` to solidify `TimerState` and `TimerConfiguration` interfaces.
3.  **Draft Hook**: Create `frontend/src/hooks/useTimer.ts`. Start with the basic state machine (Work -> Break) using hardcoded values.
4.  **UI Scaffolding**: Develop `frontend/src/components/TimerDisplay.tsx` and `frontend/src/app/(main)/page.tsx` to hook into the state.
5.  **Persistence Layer**: Implement `frontend/src/lib/localStorage.ts` to facilitate the transition to Phase 2.