# Phase 20 First GitHub Push Guide

## Purpose

This guide lists the commands and checks for the first GitHub push of Creator Hub Agent OS. Phase 20 is documentation only: no actual remote creation, no remote connection, no commit, and no push is performed.

The repository is a Vite + React mock UI and architecture foundation. The first push should include only the safe source set defined in `docs/architecture/repository_cleanup_plan.md`.

## Pre-Push Baseline Checks

Run these commands before staging:

```bash
git status --short
npm run lint
npm run build
```

Check that the output does not include staged local-only files such as:

- `.env`
- `.env.local`
- `node_modules/`
- `dist/`
- root `creator-hub-*.json`
- `data/creator-hub-*.json`
- recovery text files
- backup files
- machine-specific scripts
- legacy root `/app.js`
- legacy root `/styles.css`

## Important Staging Rule

Do not use `git add .` for the first public push until the tracked legacy/local files are explicitly reviewed.

Reason: `.gitignore` blocks future accidental adds, but it does not remove files that are already tracked. Phase 19 found tracked local/legacy candidates that still require an archive or untrack decision before a public repository push.

## Recommended Safe Staging Commands

Use explicit staging for the current source set:

```bash
git add .env.example .gitignore README.md package.json package-lock.json
git add eslint.config.js vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json
git add tailwind.config.js postcss.config.js index.html
git add src docs .github/workflows/ci.yml
git status --short
```

After staging, review the status carefully. Only source, configuration, documentation, and CI files should be staged.

If unwanted tracked legacy/local files appear as staged, unstage them before committing:

```bash
git restore --staged app.js styles.css backup_hub.bat backup_hub.ps1 run_hub.bat
git restore --staged CONTEST_HUB_LINK_AUDIT.md
git restore --staged data/codex_prompts.json data/projects.json
git restore --staged data/recovered_agents_as_prompts.json data/remotion_glossary.json
git status --short
```

These commands only unstage files. They do not delete local files.

## First Commit Command

Recommended first commit message:

```bash
git commit -m "Initialize Creator Hub Agent OS foundation"
```

If Git reports that there is nothing to commit, check whether the intended source set was already committed in the local repository.

## Branch Structure

Recommended branch model:

- `main`: production-ready baseline
- `develop`: integration branch for upcoming phases
- `feature/*`: focused feature or documentation work
- `hotfix/*`: urgent fixes after production use begins

For first repository setup, confirm the current branch:

```bash
git branch --show-current
```

If the repository should start on `main`:

```bash
git branch -M main
```

After `main` is pushed, create `develop` locally:

```bash
git switch -c develop
```

## Remote Origin Setup

Create the GitHub repository manually in GitHub first. Do not include secrets or generated files in the repository.

Then connect the local repository to the GitHub remote:

```bash
git remote add origin https://github.com/<owner>/<repo>.git
git remote -v
```

If `origin` already exists, inspect it before changing anything:

```bash
git remote -v
```

Only replace the remote after confirming the old value is wrong:

```bash
git remote set-url origin https://github.com/<owner>/<repo>.git
git remote -v
```

## Push Commands

Push `main`:

```bash
git push -u origin main
```

Create and push `develop`:

```bash
git switch -c develop
git push -u origin develop
```

If `develop` already exists locally:

```bash
git switch develop
git push -u origin develop
```

## Final Confirmation Before Push

Run this immediately before the actual push:

```bash
git status --short
npm run lint
npm run build
```

Confirm:

- no `.env` or `.env.local`
- no `node_modules/`
- no `dist/`
- no root export JSON files
- no recovery text files
- no backup snapshots
- no machine-specific scripts
- no tracked legacy/local files included unless intentionally approved
- only the intended source set is committed

## GitHub Checks After Push

After the user manually pushes:

1. Open the GitHub repository.
2. Confirm source files and docs are visible.
3. Confirm ignored local/export files are not visible.
4. Open the Actions tab.
5. Confirm CI starts for `main` or `develop`.
6. Confirm CI runs:
   - checkout
   - setup-node
   - `npm ci`
   - `npm run lint`
   - `npm run build`
7. Confirm no secret is requested or used by CI.

## CI Verification

The current CI workflow is validation-only. It must remain separate from Cloudflare deployment until a later deployment phase.

Expected CI behavior:

- runs on pushes and pull requests targeting `main` or `develop`
- uses no repository secrets
- does not call OpenAI, GitHub APIs, Cloudflare APIs, OAuth providers, Firebase, Supabase, or any backend
- does not create issues, pull requests, deployments, or background jobs

## Public Push Warning

For a public repository, do not push the full existing workspace or full existing history without reviewing tracked legacy/local files. If the existing Git history already contains private local artifacts, consider one of these before public release:

- create a clean fresh repository with only the safe source set
- explicitly archive and untrack legacy/local files
- keep the first remote private until the history is reviewed

The safest first public push is a clean source-only commit containing the recommended staged set above.
