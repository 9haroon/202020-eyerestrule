# Implementation Plan: Eye Rest Rule Web Application

**Branch**: `001-build-web-application` | **Date**: 2026-04-02 | **Spec**: `/specs/001-build-web-application/spec.md`
**Input**: Feature specification from `/specs/001-build-web-application/spec.md`

## Summary

The project aims to develop a client-side web application enforcing the 20-20-20 eye rest rule. Utilizing Next.js 16 with the App Router, the application will feature a customizable timer, visual and audible notifications for breaks, and persistence of user settings via browser Local Storage, without reliance on a backend API for its core functionality.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js (latest LTS)
**Primary Dependencies**: React 18, Next.js 16 (App Router)
**Storage**: Web Browser Local Storage
**Testing**: Jest, React Testing Library
**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Single-page Web Application (SPA) with Next.js for routing/rendering
**Performance Goals**: Fast initial load (Core Web Vitals), smooth UI animations, immediate timer response. Notifications must be delivered without perceptible delay.
**Constraints**: Client-side only. No external API calls for core timer logic or settings.
**Scale/Scope**: Single user, single browser tab application. Focus on robust timer logic and UI responsiveness.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

*   **I. Backend-Mediated AI (No Client Secrets)**: Aligned. This feature does not involve AI or secrets.
*   **II. Agreed Production Stack**: Next.js 16 (App Router) is aligned. However, the explicit requirement for "no backend api" and "local storage as a data storage" deviates from using `task-generator-app` for API and `Supabase` for database persistence. This is a deliberate simplification for this specific client-side utility and is detailed in "Complexity Tracking".
*   **III. Security & Safe Content**: Aligned. User input for intervals is numeric, eliminating XSS risks. No `dangerouslySetInnerHTML` will be used. No AI JSON to validate, and no authentication model needed for this client-side-only utility.
*   **IV. Type Safety & Code Hygiene**: Aligned. TypeScript will be used strictly. Code formatting will adhere to project standards (Prettier/ESLint). Styling will be build-time (e.g., Tailwind CSS or CSS Modules).
*   **V. API Contracts & AI Governance**: Aligned. This feature has no backend APIs or AI interactions.
*   **VI. Spec Kit Path A**: Aligned for the development process using Spec Kit itself, not for the application's runtime.
*   **VII. Constitution-Once UI**: Aligned. This principle applies to the Spec Kit UI, not the feature being developed.
*   **VIII. Code Quality Standards**: Aligned. Will use ESLint and Prettier, integrate into CI.
*   **IX. Testing Standards**: Aligned. Unit tests for timer logic, integration tests for component interactions, and basic end-to-end tests will be planned.
*   **X. User Experience Consistency**: Aligned. UI/UX will prioritize consistency, accessibility (WCAG 2.1 AA), and responsiveness. Assumed basic design system for prototyping.
*   **XI. Performance Requirements**: Aligned. Focus on meeting Core Web Vitals and ensuring responsive interactions.

## Project Structure

### Documentation (this feature)

```text
specs/001-build-web-application/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

**Structure Decision**: The "Web application" structure is chosen, focusing on the `frontend` part since there's no backend for this feature.

```text
frontend/
├── src/
│   ├── app/                      # Next.js App Router root
│   │   ├── (main)/
│   │   │   ├── page.tsx          # Main timer page
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── settings/
│   │   │   └── page.tsx          # Settings page for customization
│   │   └── favicon.ico
│   ├── components/
│   │   ├── TimerDisplay.tsx      # Displays countdown
│   │   ├── NotificationOverlay.tsx # Full-screen break notification
│   │   └── ControlButtons.tsx    # Start, Pause, Reset buttons
│   ├── hooks/
│   │   └── useTimer.ts           # Custom hook for timer logic and state
│   ├── lib/
│   │   ├── localStorage.ts       # Utility for localStorage operations
│   │   └── utils.ts              # General utilities (e.g., time formatting)
│   ├── types/
│   │   └── timer.d.ts            # TypeScript types for TimerConfiguration, TimerState
│   └── services/                 # (Optional, for future expansion)
├── public/                       # Static assets
├── tests/
│   ├── unit/
│   │   └── hooks/useTimer.test.ts
│   ├── integration/
│   │   └── components/TimerDisplay.test.tsx
│   └── e2e/
│       └── timerFlow.spec.ts     # Playwright/Cypress tests
├── jest.config.ts
├── playwright.config.ts (or cypress.config.ts)
├── next.config.mjs
├── package.json
├── tsconfig.json
```

## Complexity Tracking

| Violation (Constitution Principle) | Why Needed | Simpler Alternative Rejected Because |
|------------------------------------|------------|-------------------------------------|
| II. Agreed Production Stack (no `task-generator-app` API, no `Supabase` DB) | This feature (client-side eye rest timer) is a self-contained utility. Introducing a full backend API (`task-generator-app`) and database (`Supabase`) would add significant, unnecessary overhead and complexity for its simple requirements, disproportionate to the value provided. The core timer logic and settings are entirely client-side. | Building a separate microservice and managing a Supabase instance for a feature that only needs to store a few user preferences (e.g., work/break durations) would drastically increase development time, deployment complexity, and maintenance burden. The performance and functionality benefits of a full backend are not required for this specific, isolated client-side utility. |
| Persistence off `localStorage` for production | As per the previous point, a full `Supabase` integration is overkill for this feature's simple local persistence needs. `localStorage` is sufficient for storing user preferences for this client-side-only utility. | The alternative of migrating all settings persistence to a `Supabase` database would necessitate the introduction of a backend API for read/write operations, an authentication system, and additional database schema management, which is explicitly avoided by the "no backend api" requirement for this feature. `localStorage` provides adequate persistence for this specific use case without added infrastructure. |

---

## System Architecture and Major Components

The application will be a client-side web application built with **Next.js 16 and the App Router**. It will consist of the following major components:

1.  **Next.js App Router Structure**:
    *   **Root Layout (`layout.tsx`)**: Provides the shared UI across the application, including global styles and potential navigation (if extended).
    *   **Main Timer Page (`app/(main)/page.tsx`)**: The primary interface displaying the current timer (work or break), countdown, and control buttons.
    *   **Settings Page (`app/settings/page.tsx`)**: A dedicated page for users to customize work and break intervals.

2.  **Core Components**:
    *   **`TimerDisplay.tsx`**: Renders the current time remaining, adapting its display based on whether it's a work or break phase.
    *   **`ControlButtons.tsx`**: Contains buttons for "Start," "Pause," and "Reset" the timer. These buttons will interact with the core timer logic.
    *   **`NotificationOverlay.tsx`**: A full-screen or prominent banner component that appears when a break is due. It will include the break countdown and a clear call to action to return to work.
    *   **`SettingsForm.tsx`**: A component within the settings page for inputting and saving custom work and break durations.

3.  **State Management & Logic**:
    *   **`useTimer.ts` (Custom React Hook)**: This will be the central logic unit, encapsulating:
        *   Timer state (`isActive`, `isPaused`, `currentPhase`, `remainingTimeSeconds`).
        *   Functions for starting, pausing, resetting, and updating the timer.
        *   Logic for transitioning between work and break phases.
        *   Integration with browser's `setInterval` or `setTimeout` for accurate timing.
        *   Handling audible alerts (e.g., HTML Audio API).
    *   **Context API (Optional, for global state)**: If more complex state sharing is needed, React Context could be used, but a custom hook combined with prop drilling or direct component state should be sufficient initially.

4.  **Local Storage Integration (`lib/localStorage.ts`)**:
    *   A utility module to handle reading from and writing to `localStorage`.
    *   Will manage persistence for `TimerConfiguration` (custom work/break intervals).
    *   Will be integrated into the `useTimer` hook and `SettingsForm` component to load/save preferences.

## Data Model and Integrations

The application will primarily manage two key entities, `TimerConfiguration` and `TimerState`, stored locally in the browser's `localStorage`.

### Key Entities:

1.  **`TimerConfiguration`**:
    *   **Purpose**: Stores user-defined preferences for the timer intervals.
    *   **Structure**:
        ```typescript
        interface TimerConfiguration {
          workIntervalMinutes: number; // Default: 20
          breakDurationSeconds: number; // Default: 20
        }
        ```
    *   **Persistence**: Stored in `localStorage` under a designated key (e.g., `'eye-rest-timer-config'`).
    *   **Integration**:
        *   Loaded by the `useTimer` hook on initialization to set default or custom intervals.
        *   Updated by the `SettingsForm` component when the user saves new preferences.

2.  **`TimerState`**:
    *   **Purpose**: Represents the current operational state of the running timer. This state is ephemeral and not persisted across sessions, but rather managed in-memory by the `useTimer` hook.
    *   **Structure**:
        ```typescript
        type TimerPhase = 'work' | 'break';

        interface TimerState {
          isActive: boolean;
          isPaused: boolean;
          currentPhase: TimerPhase;
          remainingTimeSeconds: number;
        }
        ```
    *   **Persistence**: **Not persisted** in `localStorage`. This is dynamic, in-memory state. If the browser tab is closed, the timer resets.
    *   **Integration**:
        *   Managed internally by the `useTimer` custom hook.
        *   Exposed by `useTimer` to `TimerDisplay`, `NotificationOverlay`, and `ControlButtons` for rendering and user interaction.

### Integrations:

*   **`localStorage`**: Direct integration for `TimerConfiguration` persistence. All read/write operations will be encapsulated in a dedicated utility module (`lib/localStorage.ts`) to centralize logic and error handling.
*   **Browser's `Audio` API**: For playing audible alerts when a break is due or over.
*   **Browser's `Notification` API (Optional/Future)**: Could be explored for system-level notifications even when the tab is not in focus, but `NotificationOverlay` is the primary visual notification for the MVP.

## API Surfaces (High-Level)

Given that this is a client-side-only application with no backend, there are no external HTTP API surfaces to define.

The "API" in this context refers to the internal interface of the `useTimer` custom hook, which will expose the following:

```typescript
interface UseTimerResult {
  timerState: TimerState; // Current state of the timer
  workIntervalMinutes: number; // Current configured work interval
  breakDurationSeconds: number; // Current configured break duration
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}
```
The `SettingsForm` component will directly interact with the `localStorage` utility functions to save and load `TimerConfiguration`.

## Phased Delivery Plan and Risks

### Phase 1: Core Timer Functionality (User Story 1 - P1)

**Goal**: Implement the fundamental 20-minute work, 20-second break cycle with visual and audible notifications, and basic controls.

**Tasks**:
1.  **Next.js Project Setup**: Initialize a new Next.js 16 project with TypeScript.
2.  **Base UI**: Create `app/(main)/page.tsx` for the main timer display and `ControlButtons.tsx`.
3.  **`useTimer` Hook (MVP)**:
    *   Implement `setInterval` for countdown.
    *   Manage `currentPhase` (`work`/`break`) and `remainingTimeSeconds`.
    *   Implement `startTimer`, `pauseTimer`, `resetTimer`.
    *   Hardcode 20-min work, 20-sec break intervals initially.
4.  **`TimerDisplay` Component**: Integrate with `useTimer` to show `remainingTimeSeconds`.
5.  **`NotificationOverlay` Component**: Trigger display when `currentPhase` transitions to `break`.
6.  **Audible Alert**: Integrate HTML Audio API to play a sound when break starts and ends.
7.  **Basic Styling**: Implement minimal styling to make the UI functional and readable.
8.  **Unit Tests for `useTimer`**: Cover core countdown, phase transitions, and control logic.

**Risks**:
*   **Browser Backgrounding Issues**: `setInterval` accuracy can degrade when tabs are in the background or device sleeps. May need to rely on `Date.now()` and calculate elapsed time upon refocus/wake to maintain accuracy.
*   **Notification Overwhelm**: Ensuring the audible/visual notifications are effective but not overly intrusive.

### Phase 2: Customization and Persistence (User Stories 2 & 3 - P2, P3)

**Goal**: Allow users to configure work and break intervals and ensure these settings persist across sessions.

**Tasks**:
1.  **`localStorage` Utility**: Create `lib/localStorage.ts` for `get` and `set` operations for `TimerConfiguration`.
2.  **Update `useTimer`**:
    *   Modify to load `TimerConfiguration` from `localStorage` on initialization.
    *   Expose a way to update `workIntervalMinutes` and `breakDurationSeconds`.
3.  **Settings Page (`app/settings/page.tsx`)**: Create a new page with a `SettingsForm` component.
4.  **`SettingsForm` Component**:
    *   Read current `TimerConfiguration` from `localStorage`.
    *   Provide input fields for `workIntervalMinutes` and `breakDurationSeconds`.
    *   Save updated `TimerConfiguration` to `localStorage` when submitted.
5.  **Integration Tests**: Test `SettingsForm` interaction with `localStorage` and `useTimer` updates.
6.  **E2E Tests**: Verify custom settings persist after browser refresh/reopen.

**Risks**:
*   **`localStorage` Limits/Security**: While fine for this simple use case, `localStorage` is not designed for large data or sensitive information. This is acknowledged and justified in Complexity Tracking.
*   **Race Conditions**: Ensuring `useTimer` correctly picks up updated settings from `localStorage` without unexpected behavior.

### Phase 3: Polish and Edge Cases

**Goal**: Refine UI/UX, address known edge cases, and ensure overall stability and accessibility.

**Tasks**:
1.  **Accessibility (A11y)**:
    *   Add ARIA attributes to interactive elements.
    *   Ensure keyboard navigation.
    *   Verify color contrast ratios.
2.  **Responsiveness**: Optimize UI for various screen sizes (mobile, tablet, desktop).
3.  **Detailed UI/UX**: Implement more polished design elements, animations, and transitions.
4.  **Edge Case Handling**:
    *   **Browser Tab Close/Sleep**: Document the behavior (timer resets on close, re-calculates on refocus/wake for backgrounded tabs) or implement more sophisticated state saving (e.g., last known timestamp) if required and feasible without a backend. For MVP, reset on close is acceptable.
    *   **Multiple Tabs**: Default behavior will be independent timers per tab. Document this clearly to the user.
    *   **Ignoring Notifications**: Ensure visual notification persists until acknowledged, and the work timer doesn't restart until the break is explicitly completed.
5.  **Final Testing**: Comprehensive unit, integration, and e2e testing.
6.  **CI/CD Integration**: Ensure linting, type-checking, and tests run automatically.

**Risks**:
*   **Complex Timer Logic for Backgrounding**: Accurately tracking time across browser backgrounding and sleep modes can be intricate without server-side arbitration.
*   **Notification Fatigue**: Balancing effective reminders with user experience.
