# Deployment Foundation

Status: planning document  
Phase: 14  
Scope: GitHub repository flow, Cloudflare Pages readiness, environment loading, deployment review rules  
Implementation status: documentation only

## 목적

이 문서는 Creator Hub Agent OS를 GitHub repository와 Cloudflare Pages 배포 흐름에 연결하기 위한 foundation을 정리한다.

Phase 14에서는 실제 Cloudflare API 연결, GitHub Actions 생성, OAuth 구현, backend 생성, database 연결을 하지 않는다. 이 문서는 향후 repository와 deployment를 안정적으로 운영하기 위한 기준이다.

## 현재 배포 대상

현재 앱은 Vite static frontend다.

Production build:

```bash
npm run build
```

Build output:

```text
dist/
```

Preview command:

```bash
npm run preview
```

Cloudflare Pages에 올릴 수 있는 형태는 정적 build output이다.

## Cloudflare Pages 기본 배포 기준

Cloudflare Pages 설정 후보:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root
- Install command: `npm install` 또는 Cloudflare 기본 install flow

Public environment variables 후보:

- `VITE_APP_ENV`
- `VITE_APP_BASE_URL`

Cloudflare Pages에 넣지 말아야 할 값:

- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_TOKEN`
- `CLOUDFLARE_API_TOKEN`

중요:

- Pages는 frontend hosting layer다.
- Provider secret은 Pages browser bundle에 들어가면 안 된다.
- 실제 API 호출은 향후 Cloudflare Worker 또는 server-side layer에서 처리한다.

## local -> preview -> production 흐름

### Local

목적: 개발자가 mock UI와 문서 변경을 검증한다.

Commands:

```bash
npm install
npm run dev
npm run lint
npm run build
```

Local 규칙:

- `.env.example`은 placeholder만 둔다.
- `.env.local`은 생성하더라도 commit하지 않는다.
- Phase 14에서는 `.env.local`을 생성하지 않는다.
- 실제 secret 없이 lint/build가 통과해야 한다.

### Preview

목적: Pull Request 또는 develop branch 변경을 production 전에 확인한다.

후보 흐름:

1. feature branch에서 PR 생성
2. reviewer가 baseline 영향 확인
3. lint/build 결과 확인
4. Cloudflare Pages preview deployment 확인
5. UI 변경이면 데스크톱/모바일 화면 확인

Phase 14에서는 GitHub Actions 또는 Cloudflare preview automation을 생성하지 않는다.

### Production

목적: 검증된 `main` branch를 production site로 배포한다.

후보 흐름:

1. feature branch -> PR
2. PR review
3. `develop` 또는 `main`으로 merge
4. `main` branch update
5. Cloudflare Pages가 GitHub repository를 감지해 static build 배포

Production 규칙:

- production deployment는 `main` 기준으로 둔다.
- secret이 frontend build에 포함되지 않아야 한다.
- 실제 automation이 생기기 전까지 deployment는 static frontend만 대상으로 한다.

## GitHub branch 전략 초안

### `main`

역할:

- production-ready branch
- Cloudflare Pages production deployment 기준 branch
- lint/build가 통과한 상태만 merge

규칙:

- 직접 push를 피한다.
- PR review 후 merge한다.
- 실제 deployment config가 생기면 protected branch로 둔다.

### `develop`

역할:

- integration branch
- 여러 feature 작업을 production 전 검토하는 후보 branch
- Cloudflare preview 또는 staging 배포 후보

규칙:

- 기능이 커지기 전까지는 optional branch로 둘 수 있다.
- develop을 쓰는 경우 main merge 전 lint/build를 다시 확인한다.

### `feature/*`

역할:

- phase별 작업 branch
- 문서, UI, type, mock data 같은 단위 작업

예시:

```text
feature/phase14-deployment-foundation
feature/task-schema-types
feature/github-issue-first-prototype
```

규칙:

- 범위를 작게 유지한다.
- unrelated baseline page를 수정하지 않는다.
- PR description에 변경 범위와 검증 결과를 적는다.

## PR review 기본 규칙

PR은 다음 항목을 포함해야 한다.

- 변경 목적
- 수정 파일 목록
- 영향받는 route 또는 document
- baseline 영향 여부
- 실제 API/OAuth/backend 동작 추가 여부
- secret exposure 여부
- `npm run lint` 결과
- `npm run build` 결과

Merge 전 확인:

- UI 변경이면 desktop/mobile 화면이 깨지지 않는지 확인한다.
- 문서 변경이면 implementation status가 명확한지 확인한다.
- `.env.example`에는 실제 값이 없는지 확인한다.
- `VITE_` prefix가 secret에 붙지 않았는지 확인한다.

## env loading 규칙

Vite frontend:

- `VITE_` prefix가 붙은 변수만 browser bundle에 노출될 수 있다.
- 현재 후보는 `VITE_APP_ENV`, `VITE_APP_BASE_URL`뿐이다.

Server-side future runtime:

- AI/API/OAuth/GitHub/Cloudflare secret은 Worker 또는 backend runtime에서만 읽는다.
- frontend source에서 `OPENAI_API_KEY`, `GITHUB_TOKEN`, `CLOUDFLARE_API_TOKEN` 같은 값을 참조하지 않는다.

Files:

- `.env.example`: placeholder template
- `.env.local`: local-only, never commit
- Cloudflare Pages env: public frontend values only
- Cloudflare Workers secrets: future server-side secrets
- GitHub Actions secrets: future CI/automation secrets

## lint/build 기준

Required commands:

```bash
npm run lint
npm run build
```

Current build pipeline:

- TypeScript project build
- Vite production build
- output to `dist/`

No deployment should be treated as production-ready unless both commands pass.

## Mock to real migration deployment direction

Phase 14 deployment foundation supports the following migration path:

1. Static frontend deployment on Cloudflare Pages.
2. Keep mock UI stable with baseline documents.
3. Add type-only contracts when needed.
4. Add mock adapters for task/artifact flow.
5. Add Cloudflare Worker or server-side endpoint for provider calls.
6. Store secrets only in Worker/backend/GitHub secret stores.
7. Add GitHub Issue-first automation.
8. Add PR/deployment automation only after approval gates exist.

## Future worker/backend 후보 위치

No backend is created in Phase 14.

Cloudflare Worker candidate:

```text
workers/creator-hub-api/
```

Potential responsibilities:

- `POST /api/tasks/draft`
- `POST /api/artifacts/draft`
- `POST /api/github/issues`
- OAuth callback
- provider health/status proxy
- deployment status lookup

Node server candidate:

```text
server/
```

Potential responsibilities:

- local backend development
- database-backed task persistence
- audit logs
- heavier validation

GitHub Actions candidate:

```text
.github/workflows/
```

Potential responsibilities:

- lint/build checks
- preview validation
- workflow dispatch jobs
- GitHub Issue-first automation support
- deployment verification

These paths are candidates only. They should not be created until an implementation phase explicitly asks for them.

## 금지사항

Phase 14에서는 다음을 금지한다.

- 실제 Cloudflare API 연결
- 실제 GitHub Actions workflow 생성
- 실제 OAuth 구현
- 실제 backend 생성
- 실제 DB 연결
- 실제 secret 값 입력
- Cloudflare token commit
- GitHub token commit
- frontend에서 provider API key 참조
- automatic PR generation
- automatic production deployment trigger

## 배포 준비 완료 기준

Phase 14 기준 준비 완료 조건:

- README가 현재 Vite/React app 구조를 설명한다.
- repository structure 문서가 source ownership을 설명한다.
- deployment foundation 문서가 Cloudflare Pages 기준과 branch 전략을 설명한다.
- `.env.example`은 placeholder-only 상태다.
- `.gitignore`가 local env secret 파일을 제외한다.
- `npm run lint`가 통과한다.
- `npm run build`가 통과한다.
