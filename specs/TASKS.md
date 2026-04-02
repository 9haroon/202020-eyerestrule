```markdown
---
description: "Task list template for feature implementation"
---

# Tasks: Eye Rest Rule Web Application

**Input**: Design documents from `/specs/001-build-web-application/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create base project directory structure for `frontend/`
- [ ] T002 Initialize Next.js 16 project with TypeScript in `frontend/` by running `npx create-next-app@latest frontend --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"`
- [ ] T003 [P] Configure global CSS in `frontend/src/app/(main)/globals.css`
- [ ] T004 [P] Create root layout for Next.js App Router in `frontend/src/app/(main)/layout.tsx`
- [ ] T005 [P] Add favicon to `frontend/src/app/favicon.ico`
- [ ] T006 [P] Configure Jest for unit testing in `frontend/jest.config.ts`
- [ ] T007 [P] Configure Playwright for E2E testing in `frontend/playwright.config.ts`
- [ ] T008 [P] Review and adjust Next.js configuration in `frontend/next.config.mjs`
- [ ] T009 [P] Review and adjust TypeScript configuration in `frontend/tsconfig.json`
- [ ] T010 [P] Configure CI workflow to run tests and linting in `.github/workflows/ci.yml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 [P] Define TypeScript types for `TimerConfiguration` and `TimerState` in `frontend/src/types/timer.d.ts`
- [ ] T012 [P] Create general utilities for time formatting in `frontend/src/lib/utils.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Core Timer Functionality (Priority: P1) 🎯 MVP

**Goal**: Implement the fundamental 20-minute work, 20-second break cycle with visual and audible notifications, and basic controls.

**Independent Test**: This can be fully tested by starting the timer, observing the countdown, receiving a notification after 20 minutes, and being able to acknowledge, reset, or stop the timer. It delivers the essential eye-rest reminder value.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US1] Unit test for `useTimer` hook covering core countdown, phase transitions, and control logic in `frontend/tests/unit/hooks/useTimer.test.ts`

### Implementation for User Story 1

- [ ] T014 [US1] Create the `useTimer` custom hook (MVP, hardcoded intervals) in `frontend/src/hooks/useTimer.ts`
- [ ] T015 [US1] Create `TimerDisplay` component to show countdown in `frontend/src/components/TimerDisplay.tsx`
- [ ] T016 [P] [US1] Create `ControlButtons` component (Start, Pause, Reset) in `frontend/src/components/ControlButtons.tsx`
- [ ] T017 [US1] Create `NotificationOverlay` component for break alerts in `frontend/src/components/NotificationOverlay.tsx`
- [ ] T018 [US1] Implement main timer page, integrating `useTimer`, `TimerDisplay`, `ControlButtons`, and `NotificationOverlay` in `frontend/src/app/(main)/page.tsx`
- [ ] T019 [US1] Integrate HTML Audio API for audible alerts in `frontend/src/hooks/useTimer.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Customizing Break Intervals (Priority: P2)

**Goal**: Allow users to configure work and break intervals.

**Independent Test**: This can be fully tested by navigating to settings, changing the work interval and break duration, saving these settings, and then starting the timer to verify that the new intervals are accurately reflected in the countdowns and notifications.

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create settings page layout and route in `frontend/src/app/settings/page.tsx`
- [ ] T021 [P] [US2] Create `SettingsForm` component with input fields for work and break durations in `frontend/src/components/SettingsForm.tsx`
- [ ] T022 [US2] Modify `useTimer` hook to accept and apply configurable work and break intervals, replacing hardcoded values in `frontend/src/hooks/useTimer.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Persistence of Settings (Priority: P3)

**Goal**: Ensure custom eye-rest rule settings are remembered across browser sessions.

**Independent Test**: This can be fully tested by setting custom work and break intervals, closing and then reopening the browser (or the specific application tab), and verifying that the previously saved custom intervals are automatically applied when the application loads.

### Tests for User Story 3

- [ ] T023 [P] [US3] Integration test for `SettingsForm` interaction with `localStorage` and `useTimer` updates in `frontend/tests/integration/components/TimerDisplay.test.tsx`
- [ ] T024 [P] [US3] E2E test to verify custom settings persistence after browser refresh/reopen in `frontend/tests/e2e/timerFlow.spec.ts`

### Implementation for User Story 3

- [ ] T025 [P] [US3] Create `localStorage` utility module for `TimerConfiguration` (get/set operations) in `frontend/src/lib/localStorage.ts`
- [ ] T026 [US3] Integrate `localStorage` utility into `useTimer` hook to load and save `TimerConfiguration` in `frontend/src/hooks/useTimer.ts`
- [ ] T027 [US3] Integrate `localStorage` utility into `SettingsForm` component to load and save `TimerConfiguration` in `frontend/src/components/SettingsForm.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T028 [P] Improve accessibility (ARIA attributes, keyboard navigation, color contrast) across all relevant components (`frontend/src/components/`).
- [ ] T029 [P] Optimize UI responsiveness for various screen sizes across `frontend/src/app/` and `frontend/src/components/`
- [ ] T030 Refine UI/UX with polished design elements, animations, and transitions across the application.
- [ ] T031 Document edge case handling for browser tab close/sleep in `frontend/src/hooks/useTimer.ts` and `frontend/src/app/(main)/page.tsx`.
- [ ] T032 Ensure final linting, type-checking, and tests run successfully in the CI/CD pipeline (`.github/workflows/ci.yml`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Unit test for useTimer hook covering core countdown, phase transitions, and control logic in frontend/tests/unit/hooks/useTimer.test.ts"

# Launch all models for User Story 1 together:
Task: "Create the useTimer custom hook (MVP, hardcoded intervals) in frontend/src/hooks/useTimer.ts"
Task: "Create TimerDisplay component to show countdown in frontend/src/components/TimerDisplay.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
```