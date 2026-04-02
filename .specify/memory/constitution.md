

# Ideva Kit Constitution

## Core Principles

### I. Backend-Mediated AI (No Client Secrets)
All AI orchestration and secrets MUST remain server-side. The browser MUST NOT receive or bundle API keys, and MUST NOT call AI providers directly. All AI flows (Spec Kit steps, chat, and any other features) MUST go through **task-generator-app** or another designated backend. Rationale: production security, auditability, rate limiting, and consistent versioning of prompts and outputs.

### II. Agreed Production Stack
The production application MUST use the agreed stack: **Next.js 16 (App Router)** for the frontend, **task-generator-app** for API and AI orchestration, and **Supabase** for database (and optionally auth). Authentication MUST be implemented either via **Supabase Auth** or within the Next.js application; the choice MUST be documented and applied consistently. The MVP in `ideva-ai-workspace-v10/` is a draft and MUST be ported or reimplemented onto this stack for production.

### III. Security &amp; Safe Content
User-supplied and AI-derived content that is rendered as HTML MUST be sanitized before injection (e.g. markdown output, Marketing text layers). MUST NOT use `dangerouslySetInnerHTML` without a sanitization step. All AI JSON responses MUST be validated with a runtime schema (server-side in production). An authentication and authorization model MUST be in place before production; security MUST NOT be UI-only.

### IV. Type Safety &amp; Code Hygiene
TypeScript MUST be used with strict discipline: no `any` type, no non-null assertion operator (`!`), no casts to `unknown as T`. Strings MUST use double quotes; prefer template literals or `.join()` over concatenation. Production builds MUST be deterministic: MUST NOT rely on CDN-delivered Tailwind or other runtime-injected CSS for core styling; use a build-time styling approach and define all used utilities (e.g. custom scrollbar, motion classes) in the codebase.

### V. API Contracts &amp; AI Governance
API contracts for the Spec Kit workflow (step endpoints, chat, documents, tasks, projects) and for any other UI modules MUST be defined and versioned. AI usage MUST be authenticated, rate-limited, and logged. AI outputs MUST be treated as versioned artifacts: inputs, prompt version, model version, output, and status MUST be capturable for audit and reproducibility.

### VI. Spec Kit Path A — Bash Scripts as Canonical Source of Truth
The backend MUST invoke Spec Kit steps by shelling out to the canonical bash runner scripts in `.specify/scripts/bash/` (e.g. `run-specify.sh`, `run-plan.sh`, `run-tasks.sh`, `run-constitution.sh`) — this is **Path A**. The backend MUST NOT build independent Gemini prompts for Spec Kit steps in Python; context assembly, prompt structure, model invocation, and output file layout MUST remain in the bash scripts so that API-driven runs are identical to local Cursor slash command runs. Each step handler MUST call `run_bash_script(".sh", ...)` (from `app.services.speckit.cli`), read the output file path from the returned JSON envelope, and persist the result to Supabase. `SPEC_KIT_REPO_ROOT` MUST be set in every deploy environment so the workspace provisioning layer can copy `.specify/templates/` and `.specify/scripts/bash/` into each project's workspace. Rationale: single source of truth for prompts prevents drift between local and API flows; outputs remain reproducible regardless of invocation path.

### VII. Constitution-Once UI — Project Setup Gate
The constitution step MUST run at most once per project and MUST be treated as a project setup action, not a repeatable workflow step. The UI MUST separate constitution from the main 4-step workflow (specify → plan → tasks → implement) and display it as a "Project principles" setup banner. Once constitution is established, the banner MUST show a "View principles" affordance only — no re-run button. All four main workflow steps MUST be gated on `constitutionIsDone`; the stepper and run/view controls MUST remain disabled until constitution is complete. Rationale: constitution is the stable foundation that all downstream steps depend on; allowing arbitrary re-runs mid-project risks invalidating in-progress specs and plans.

### VIII. Code Quality Standards
All code MUST adhere to established project code quality standards. This includes consistent formatting enforced by tools (e.g., Prettier, ESLint with specific rules, Black, Go fmt), static analysis for common pitfalls and security vulnerabilities (e.g., SonarQube, Bandit, SAST tools), and code reviews focused on maintainability, readability, and adherence to design patterns. Automated checks MUST be integrated into the CI/CD pipeline to prevent merge of non-compliant code.

### IX. Testing Standards
A comprehensive testing strategy MUST be implemented across the project. This includes unit tests for all critical business logic and components (with a defined minimum coverage target), integration tests for API contracts and inter-service communication, and end-to-end tests for critical user flows. Tests MUST be automated, reliable, and run in the CI/CD pipeline. Test data MUST be managed to ensure reproducibility and prevent flakiness.

### X. User Experience Consistency
The user interface and experience MUST maintain consistency across all modules and features. This requires strict adherence to a defined design system, including components, typography, color palettes, and interaction patterns. Accessibility (WCAG 2.1 AA) and responsiveness across target devices MUST be core considerations from design to implementation. UI/UX reviews MUST be part of the development lifecycle to ensure a cohesive and intuitive user experience.

### XI. Performance Requirements
Applications and services MUST meet defined performance targets for responsiveness, load times, and resource utilization. Key performance indicators (KPIs) such as Core Web Vitals (LCP, FID, CLS) for frontend, and average/p95 latency for backend APIs, MUST be monitored and optimized. Performance testing (load testing, stress testing) MUST be conducted for critical paths to ensure scalability and stability under expected and peak loads.

## Technology Stack &amp; Constraints

-   **Frontend**: Next.js 16, App Router. No client-side Gemini or secret injection.
-   **Backend**: task-generator-app (separate service); exposes Spec Kit step endpoints, chat, and CRUD for projects, documents, task_lists, and tasks; secrets (e.g. Gemini) kept in backend only. Spec Kit steps invoke bash runner scripts via `run_bash_script()` (Path A); `SPEC_KIT_REPO_ROOT` MUST be set in every deploy environment.
-   **Database**: Supabase (PostgreSQL and Supabase services). Persistence MUST migrate off localStorage for production.
-   **Auth**: Either Supabase Auth or auth implemented in Next.js; decision MUST be documented.
-   **Design**: Style and theme MUST be defined via design tokens in the codebase (e.g. per PROJECT_DESCRIPTION.md or design doc when defined); minimum font sizes and contrast rules MUST be defined where all-caps or small text is used. Constitution is displayed as a "Project principles" setup banner (separate from the 4-step stepper); workflow steps are gated on `constitutionIsDone`.

## Development &amp; Quality Gates

-   All PRs and reviews MUST verify compliance with this constitution, including the newly added principles for code quality, testing, UX, and performance. Plan documents MUST include a **Constitution Check** section filled from this file; violations MUST be justified in a Complexity Tracking table or resolved before merge.
-   New features MUST align with the agreed stack and MUST NOT reintroduce client-side secrets or unsanitized HTML injection.
-   Use CLAUDE.md (or equivalent project guidance) for day-to-day development; constitution principles override local conventions when in conflict.

## Governance

This constitution supersedes ad-hoc practices for the Ideva Kit product and its production path. Amendments REQUIRE documentation of the change, version bump (semantic: MAJOR for incompatible principle removals/redefinitions, MINOR for new principles or material expansion, PATCH for clarifications and typos), and update of **Last Amended** (ISO date). Compliance MUST be re-checked in plans and specs after any amendment. Intentionally deferred placeholders (e.g. auth provider choice) MUST be tracked until resolved.

**Version**: 1.3.0 | **Ratified**: 2025-02-28 | **Last Amended**: 2026-04-02