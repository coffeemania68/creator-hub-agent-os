# Repository Structure Overview

Status: planning document  
Phase: 14  
Scope: repository layout, source ownership, documentation map, mock-to-real migration direction  
Implementation status: documentation only

## 목적

이 문서는 Creator Hub Agent OS repository의 현재 구조와 향후 실제 API, GitHub, Cloudflare, worker/backend 연결 전까지 유지해야 할 source ownership 기준을 정리한다.

Phase 14에서는 실제 backend, GitHub Actions, Cloudflare API, OAuth, database 연결을 만들지 않는다. 현재 frontend mock OS를 GitHub repository와 배포 가능한 정적 앱으로 관리하기 위한 기반 문서다.

## 현재 앱 구조

```text
creator-hub-agent-os/
  .env.example
  .gitignore
  README.md
  package.json
  package-lock.json
  vite.config.ts
  tsconfig*.json
  tailwind.config.js
  postcss.config.js
  eslint.config.js
  index.html
  src/
    app/
    components/
    data/
    pages/
    types/
    main.tsx
    styles.css
  docs/
    baselines/
    architecture/
```

## Source directory roles

### `src/app`

Application composition and route metadata.

- `App.tsx`: top-level app entry for the shell and current route rendering.
- `routes.tsx`: route list, route labels, phase metadata, route-to-page mapping.

Rules:

- Route phase labels must match baseline documents.
- New pages should be wired here only after their baseline scope is clear.
- Route metadata is navigation metadata, not backend state.

### `src/components/shell`

Shared Creator Hub Agent OS shell.

- `AppShell.tsx`: page frame.
- `Sidebar.tsx`: desktop navigation.
- `TopBar.tsx`: top header and mock search.
- `MobileBottomNav.tsx`: mobile navigation.

Rules:

- Keep AppShell structure stable.
- Do not add page-specific dashboards to the Sidebar.
- Mobile bottom nav should stay compact and route-focused.

### `src/components/ui`

Reusable small UI primitives.

- `Badge.tsx`
- `Card.tsx`
- `ProgressBar.tsx`

Rules:

- Keep primitives generic.
- Do not add page-specific business logic here.
- Shared badge behavior should stay consistent across mobile and desktop.

### `src/pages`

Route-level screens.

Current page files:

- `DashboardPage.tsx`
- `PMWorkspacePage.tsx`
- `StudioTeamsPage.tsx`
- `ArtifactsPage.tsx`
- `IntegrationsPage.tsx`
- `WorkflowsPage.tsx`
- `ProjectsPage.tsx`
- `CommandTemplatesPage.tsx`
- `EmptyPage.tsx`

Rules:

- Each page owns its own layout and mock UI behavior.
- Existing baseline pages should not be changed during unrelated phases.
- New real automation should replace mock status carefully, not blur page responsibilities.

### `src/data`

Static mock data.

- `mockData.ts`: current projects, agents, workflows, artifacts, integrations, command templates, PM data.

Rules:

- Mock data is not persistence.
- Do not put real secrets or tokens here.
- Future real data should come through a server-side layer or worker, not direct provider calls from the browser.

### `src/types`

Shared TypeScript domain types.

- `creatorHub.ts`: Project, Agent, WorkflowRun, Artifact, IntegrationService, CommandTemplate, PM-related types.

Rules:

- Add type-only future contracts here only in a dedicated implementation phase.
- Architecture-only candidates should remain in `docs/architecture` until implementation begins.

## Pages and routes role map

- `/dashboard`: overall production control summary.
- `/projects`: MVP project portfolio.
- `/pm`: PM Supervisor command and approval workspace.
- `/commands`: reusable PM command template library.
- `/teams`: AI employee board.
- `/workflows`: workflow map and stage visibility.
- `/artifacts`: generated output library.
- `/connections`: integration readiness.
- `/settings`: settings/integrations foundation.

The pages are separate OS work surfaces. They should not duplicate each other's core responsibility.

## Baseline document location

Locked UI and role baselines live in:

```text
docs/baselines/
```

Current baseline set:

- `phase2_dashboard_baseline.md`
- `phase3_pm_workspace_baseline.md`
- `phase4_studio_teams_baseline.md`
- `phase5_artifacts_baseline.md`
- `phase6_settings_integrations_baseline.md`
- `phase7_workflows_baseline.md`
- `phase8_projects_temporary_baseline.md`
- `phase9_command_templates_baseline.md`
- `phase10_navigation_ux_baseline.md`

Rules:

- Read the relevant baseline before changing a page.
- Do not modify unrelated baseline pages during a new phase.
- If a page becomes real-data-backed later, preserve its documented role.

## Architecture document location

Architecture and future implementation planning live in:

```text
docs/architecture/
```

Current architecture set:

- `api_automation_architecture.md`
- `runtime_environment.md`
- `task_schema_and_endpoint_contract.md`
- `repository_structure.md`
- `deployment_foundation.md`

Rules:

- Architecture documents may describe future types, endpoints, workers, and automation.
- Architecture documents do not mean the feature is implemented.
- Keep implementation status explicit.

## Mock to real migration direction

Migration should happen in small stages.

1. Preserve current mock UI and baselines.
2. Add type-only contracts when needed.
3. Add mock adapters before real provider calls.
4. Add server-side or worker endpoints.
5. Route real data through server-side boundaries.
6. Keep approval gates before GitHub PR or deployment automation.
7. Replace mock state with real status only after tests and review.

Important boundary:

- Browser UI must not call OpenAI, Perplexity, GitHub, Cloudflare, or OAuth token endpoints directly.
- Provider secrets must stay outside the frontend bundle.

## Future worker/backend location candidates

No backend exists in Phase 14. Future candidates:

```text
workers/
  creator-hub-api/
    src/
      index.ts
```

Cloudflare Worker candidate for:

- AI draft generation proxy
- GitHub Issue creation
- OAuth callback and token exchange
- deployment status proxy
- audit log endpoint

```text
server/
  src/
    index.ts
```

Node API server candidate for:

- local-first backend development
- heavier server-side validation
- future database integration

```text
.github/
  workflows/
```

GitHub Actions candidate for:

- CI validation
- workflow dispatch automation
- PR checks
- deployment checks

Phase 14 does not create these directories. They are location candidates only.

## Repository hygiene rules

- Keep generated build output out of git: `dist/`, `.vite/`.
- Keep dependencies out of git: `node_modules/`.
- Keep local secrets out of git: `.env`, `.env.local`, `.env.*.local`.
- Keep `.env.example` as placeholder-only documentation.
- Do not commit real API keys, OAuth secrets, tokens, or Cloudflare credentials.

## PR review 기본 규칙

Every PR should answer:

- Which page, shell, type, data, or document changed?
- Which baseline is affected?
- Was `npm run lint` run?
- Was `npm run build` run?
- Does the change add any real API/OAuth/backend behavior?
- Does the change expose any secret to the browser?

For UI PRs:

- Include before/after screenshots when practical.
- Verify mobile stacking if page layout changed.

For architecture/document PRs:

- Make clear whether the document is planning-only or implementation-ready.
- Do not add code behavior unless the phase explicitly asks for it.
