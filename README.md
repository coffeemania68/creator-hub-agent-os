# Creator Hub Agent OS

Creator Hub Agent OS is a Vite + React mock operating interface for managing creator projects, PM commands, AI employee roles, workflow maps, artifacts, integrations, projects, and command templates.

The current app is intentionally mock-first. It does not call real AI APIs, OAuth providers, GitHub, Cloudflare, Firebase, Supabase, or any backend service.

## Current Status

- Frontend: Vite, React, TypeScript, Tailwind CSS
- Data: static mock data in `src/data/mockData.ts`
- Routing: local route metadata in `src/app/routes.tsx`
- Shell: shared `AppShell`, `Sidebar`, `TopBar`, `MobileBottomNav`
- Runtime: browser-only mock UI
- API/OAuth/backend: not implemented

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## App Structure

```text
src/
  app/
    App.tsx
    routes.tsx
  components/
    shell/
    ui/
  data/
    mockData.ts
  pages/
  types/
    creatorHub.ts
  main.tsx
  styles.css
```

Primary routes:

- `/dashboard` - Home Dashboard
- `/projects` - Projects
- `/pm` - PM Workspace
- `/commands` - Command Templates
- `/teams` - Studio Teams
- `/workflows` - Workflows
- `/artifacts` - Artifacts
- `/connections` - Integrations
- `/settings` - Settings

## Documentation

Baseline documents live in:

```text
docs/baselines/
```

Architecture documents live in:

```text
docs/architecture/
```

Important architecture docs:

- `docs/architecture/api_automation_architecture.md`
- `docs/architecture/runtime_environment.md`
- `docs/architecture/task_schema_and_endpoint_contract.md`
- `docs/architecture/repository_structure.md`
- `docs/architecture/deployment_foundation.md`

## Environment

Use `.env.example` as the template. Do not put real secrets in `.env.example`.

Only `VITE_` variables may be exposed to the browser bundle. API keys, OAuth client secrets, GitHub tokens, and Cloudflare tokens must stay server-side in a future worker/backend layer.

Do not commit local secret files such as `.env.local`.

## Deployment Direction

The intended deployment target is Cloudflare Pages for the static frontend.

Default build settings:

- Build command: `npm run build`
- Output directory: `dist`
- Node/package manager: use the repository lockfile and Cloudflare default Node runtime unless a future deployment document pins a version

Future API automation should live outside the browser bundle, most likely in a Cloudflare Worker, a small Node API service, or GitHub Actions-based automation runner.

## CI

GitHub Actions CI lives at `.github/workflows/ci.yml`. It runs `npm ci`, `npm run lint`, and `npm run build` on pushes and pull requests targeting `main` or `develop`.

The CI workflow does not use secrets, call provider APIs, create GitHub issues or PRs, or trigger Cloudflare deployments.

## Not Implemented

The following are not implemented in the current app:

- Real AI/API calls
- Real OAuth login
- Secret storage
- GitHub Issue/PR automation
- GitHub Actions workflow files
- Cloudflare API integration
- Database persistence
- Background jobs or queues
- File upload/download/share

The current repository is a UI and architecture foundation for those later phases.
