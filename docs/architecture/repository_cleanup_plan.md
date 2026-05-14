# Phase 19 Repository Cleanup Plan

## Purpose

This document defines the safe cleanup boundary before the first GitHub push for Creator Hub Agent OS. Phase 19 is cleanup and staging preparation only: no GitHub push, no Cloudflare deploy, no API connection, no UI change, and no destructive file removal.

## Cleanup Classification Rules

- `keep`: source, documentation, configuration, and mock UI files required for the current Vite app.
- `archive`: legacy, local-only, recovery, backup, or export files that may still be personally useful but should not be part of the repository source set.
- `ignore`: files and patterns that should be excluded from future staging because they are generated, local, private, or obsolete.
- `remove`: files that can be deleted only after archive review or explicit owner approval. No files are removed in Phase 19.

## Source Set To Keep

The first safe push should be limited to the current app source and operating documentation:

- `.env.example`
- `.gitignore`
- `.github/workflows/ci.yml`
- `README.md`
- `package.json`
- `package-lock.json`
- `eslint.config.js`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`
- `src/`
- `docs/baselines/`
- `docs/architecture/`

`index.html` is part of the Vite entrypoint and remains in the keep set.

## Cleanup Target Summary

| Path or Pattern | Classification | Reason |
| --- | --- | --- |
| `AGENT_RECOVERY_SCAN.txt` | archive / ignore | Local recovery scan output, not app source. |
| `/*.txt` | archive / ignore | Root-level text scratch files, including recovery result files, are not app source. |
| `CONTEST_HUB_LINK_AUDIT.md` | archive / ignore | Local audit artifact, not baseline architecture documentation. |
| `app.js.bak-*` | archive / ignore | Legacy backup snapshots. |
| `backup_hub.*` | archive / ignore | Machine-specific backup scripts. |
| `run_hub.bat` | archive / ignore | Machine-specific local launcher. |
| `creator-hub-*.json` | archive / ignore | Local export snapshots. |
| `data/creator-hub-*.json` | archive / ignore | Local export snapshots inside `data/`. |
| `data/codex_prompts.json` | private-only / ignore | Prompt archive data should not be public source. |
| `data/projects.json` | private-only / ignore | Local project export should not be public source unless reviewed. |
| `data/recovered_agents_as_prompts.json` | private-only / ignore | Recovery-derived prompt data, not app source. |
| `data/remotion_glossary.json` | private-only / ignore | Local reference export, not current Vite app source. |
| `/app.js` | archive / ignore candidate | Legacy standalone root app file outside current Vite source tree. |
| `/styles.css` | archive / ignore candidate | Legacy standalone root stylesheet outside current Vite source tree. |

## Ignore Additions And Reasons

The `.gitignore` now blocks local recovery files, backup snapshots, export JSON files, private prompt/reference exports, machine-specific scripts, and legacy standalone root files. These rules reduce the risk of using `git add .` during the first repository setup.

Important limitation: `.gitignore` does not remove files that are already tracked by Git. If `/app.js`, `/styles.css`, or any export file is already tracked in the current repository history, they must be reviewed and explicitly archived or untracked in a separate cleanup step before a public push.

Current tracked local/legacy candidates found during Phase 19:

- `CONTEST_HUB_LINK_AUDIT.md`
- `/app.js`
- `/styles.css`
- `backup_hub.bat`
- `backup_hub.ps1`
- `run_hub.bat`
- `data/codex_prompts.json`
- `data/projects.json`
- `data/recovered_agents_as_prompts.json`
- `data/remotion_glossary.json`

These files are ignored for future accidental adds, but because they are already tracked, they still require an explicit archive or untrack decision before a public repository push.

## Public Push Allowed Scope

Public push is acceptable only when the staged set is limited to the keep source set and no local recovery/export/private files are included. The repository should be treated as not ready for a full `git add .` push until ignored legacy files and any already tracked legacy files are reviewed.

Recommended first staged set:

```bash
git add .env.example .gitignore README.md package.json package-lock.json
git add eslint.config.js vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json
git add tailwind.config.js postcss.config.js index.html src docs .github/workflows/ci.yml
git status --short
```

Avoid `git add .` until the cleanup status is confirmed.

## Private-Only Recommended Files

The following categories should remain local, private, or archived outside the public source set:

- prompt exports
- recovered prompt or agent exports
- local project JSON exports
- backup scripts
- recovery scan text files
- legacy standalone app snapshots
- machine-specific launch scripts

## Legacy Root File Handling

Legacy root files are handled by role:

- `index.html`: keep because it is the Vite app entrypoint.
- `/app.js`: archive or untrack later because current app code lives under `src/`.
- `/styles.css`: archive or untrack later because current app styling lives under `src/`.
- `app.js.bak-*`: archive outside the repository or leave ignored locally.

No legacy root files are deleted in Phase 19.

## First Push Recommendation

Before the first push:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Confirm `git status --short` contains only the intended source set.
4. Confirm no `.env.local`, `node_modules`, `dist`, backup files, recovery files, or local export JSON files are staged.
5. If the target repository will be public, review Git history for already tracked legacy/export files before pushing.

## Current Public Push Judgment

The current Vite source, baseline documents, architecture documents, and mock data source are suitable for public push when staged intentionally. A full workspace push remains risky until legacy root files, export JSON files, recovery files, and any already tracked local artifacts are excluded or explicitly archived.
