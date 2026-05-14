# Pre-Push Security & Repository Audit

Status: audit document  
Phase: 18  
Scope: pre-GitHub-push repository safety check  
Implementation status: audit/documentation only

## 목적

Phase 18은 Creator Hub Agent OS를 GitHub에 첫 push하기 전에 secret, 불필요 파일, build artifact, local-only 데이터, 공개 노출 위험 요소를 점검하는 단계다.

이번 단계에서는 실제 GitHub push, API 연결, secret 생성, Cloudflare deploy, UI 수정, repository 정리를 수행하지 않는다. 이 문서는 현재 repository 상태를 기록하고 push 전 조치가 필요한 항목을 분리한다.

## 감사 기준

확인한 기준 파일:

- `.gitignore`
- `.env.example`
- `docs/architecture/runtime_environment.md`
- `docs/architecture/github_repository_operations.md`
- `package.json`

추가 확인:

- `docs/architecture/cloudflare_pages_setup.md`는 현재 존재하지 않음
- `.github/workflows/ci.yml`
- `README.md`
- `src/data/mockData.ts`
- repository root 파일 목록
- local backup/export 후보 파일

## 현재 repository 공개 가능 여부

판단: **조건부 가능 / 현재 workspace 전체를 그대로 `git add .` 후 공개 push하는 것은 비권장**

이유:

- 실제 API key, OAuth secret, GitHub token, Cloudflare token처럼 보이는 값은 발견되지 않았다.
- `.env.example`은 placeholder-only 상태다.
- `.env`, `.env.local`은 현재 존재하지 않는다.
- 그러나 root와 `data/` 폴더에 legacy/local/export 성격의 파일이 남아 있다.
- 일부 파일에는 `D:\Projects\...`, `file:///C:/Users/...`, YouTube Studio URL, 개인 작업 경로, 공모전/작업 메모가 포함되어 있다.
- `dist/`와 `node_modules/`는 존재하지만 `.gitignore` 대상이다.

따라서 공개 push 전에는 intended source set만 선별하거나, legacy/export/local files를 repository 밖으로 이동 또는 ignore 처리해야 한다.

## 포함되면 안 되는 파일 목록

GitHub 공개 repository에 포함하지 않아야 하는 파일/폴더:

- `.env`
- `.env.local`
- `.env.*.local`
- `node_modules/`
- `dist/`
- `.vite/`
- `.DS_Store`
- `Thumbs.db`
- local cache files
- temp files
- local backup files
- local export JSON
- recovery scan text files
- machine-specific scripts

현재 발견된 push 주의 후보:

- `AGENT_RECOVERY_SCAN.txt`
- `검색결과_복구대상.txt`
- `app.js.bak-20260512-084217`
- `app.js.bak-archive-sync-20260512-090546`
- `backup_hub.bat`
- `backup_hub.ps1`
- `run_hub.bat`
- `creator-hub-2026-05-07 (1).json`
- `creator-hub-2026-05-07.json`
- `creator-hub-2026-05-09.json`
- `creator-hub-2026-05-10.before-ai-contests.json`
- `creator-hub-2026-05-10.json`
- `data/creator-hub-2026-05-09.json`
- `data/codex_prompts.json`
- `data/projects.json`
- `data/recovered_agents_as_prompts.json`
- `data/remotion_glossary.json`
- legacy root `app.js`
- legacy root `styles.css`
- legacy root `index.html`, if not intended as the Vite entry

주의: `index.html`은 Vite 앱 entry로 필요할 수 있으므로 legacy 여부를 확인한 뒤 판단해야 한다. 현재 repo에는 Vite `src/` 구조와 root legacy `app.js/styles.css`도 함께 있어 push 범위 검토가 필요하다.

## secret scan 기준

검색한 후보 문자열:

- `TODO`
- `FIXME`
- `HACK`
- `HARDCODED`
- `SECRET`
- `TOKEN`
- `API_KEY`
- `CLIENT_SECRET`
- `PRIVATE_KEY`
- `PASSWORD`
- `BEGIN RSA`
- `BEGIN OPENSSH`
- `BEGIN PRIVATE`
- `sk-...`
- `ghp_...`
- `github_pat_...`
- Slack token pattern
- Google API key pattern

결과:

- 실제 key/token 형식의 값은 발견되지 않았다.
- `.env.example`, architecture docs, baseline docs, mock UI에는 env variable 이름이 문서 목적으로 등장한다.
- `src/data/mockData.ts`와 `src/pages/IntegrationsPage.tsx`에는 env var 이름만 들어 있으며 실제 값은 없다.

문서상 env var 이름은 허용 가능하지만, 실제 credential 값은 절대 추가하면 안 된다.

## `.gitignore` 체크 결과

현재 `.gitignore`가 제외하는 항목:

- `AGENT_RECOVERY_SCAN.txt`
- `검색결과_복구대상.txt`
- `.DS_Store`
- `Thumbs.db`
- `.vscode/`
- `*.tmp`
- `*.bak`
- `node_modules/`
- `dist/`
- `.vite/`
- `.env`
- `.env.local`
- `.env.*.local`

보완 필요:

- `app.js.bak-20260512-084217` 같은 `*.bak-*` 형식은 현재 `*.bak` 패턴에 걸리지 않는다.
- root `creator-hub-*.json` export files는 ignore 대상이 아니다.
- `data/creator-hub-*.json` export file도 ignore 대상이 아니다.
- `backup_hub.bat`, `backup_hub.ps1`, `run_hub.bat` 같은 local operation script는 ignore 대상이 아니다.
- `data/codex_prompts.json`, `data/recovered_agents_as_prompts.json`, `data/remotion_glossary.json`, `data/projects.json`는 local paths와 user workflow prompts를 포함하므로 공개 여부를 별도 판단해야 한다.

Phase 18에서는 `.gitignore`를 수정하지 않았다. push 전 별도 cleanup phase에서 보완하는 것을 권장한다.

## frontend 노출 위험 변수 체크

현재 `.env.example`의 browser-exposed 변수:

```env
VITE_APP_ENV=
VITE_APP_BASE_URL=
```

현재 `.env.example`의 server-side secret 후보:

```env
OPENAI_API_KEY=
PERPLEXITY_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_TOKEN=
GITHUB_REPOSITORY=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_PROJECT_NAME=
CLOUDFLARE_API_TOKEN=
```

결과:

- secret 후보에 `VITE_` prefix가 붙어 있지 않다.
- `VITE_` 변수에는 secret이 들어가면 안 된다는 규칙이 문서화되어 있다.
- 현재 frontend source에서 실제 secret 값을 읽는 구현은 없다.

## VITE_ 규칙 재확인

Vite에서는 `VITE_` prefix가 붙은 변수가 browser bundle에 노출될 수 있다.

허용:

- `VITE_APP_ENV`
- `VITE_APP_BASE_URL`

금지:

- `VITE_OPENAI_API_KEY`
- `VITE_PERPLEXITY_API_KEY`
- `VITE_ANTHROPIC_API_KEY`
- `VITE_GOOGLE_CLIENT_SECRET`
- `VITE_GITHUB_TOKEN`
- `VITE_CLOUDFLARE_API_TOKEN`

OpenAI, Perplexity, GitHub, Cloudflare, OAuth credential은 future worker/backend에서만 사용해야 한다.

## mock data 내부 secret 여부 점검

확인 결과:

- `src/data/mockData.ts`에는 실제 provider key/token이 없다.
- env var 이름은 mock integration readiness 표시 목적으로만 사용된다.
- `src/data/mockData.ts`는 공개 push 기준에서 큰 secret 위험은 낮다.

주의:

- root legacy `app.js`와 `data/*.json`에는 개인 local path, external service URL, prompt 내용, 작업 메모가 포함되어 있다.
- 이 파일들은 현재 Vite app의 핵심 mock data와 분리해서 공개 포함 여부를 판단해야 한다.

## README local-only path 점검

현재 `README.md`에는 과도한 local-only Windows path가 없다.

결과:

- README는 현재 Vite/React mock app 기준으로 정리되어 있다.
- `D:\Projects\...` 같은 개인 경로는 README에서 발견되지 않았다.
- README 기준 public push 위험은 낮다.

## build artifact 포함 여부 체크

현재 local filesystem 상태:

- `node_modules/`: 존재
- `dist/`: 존재
- `.vite/`: 없음
- `.env`: 없음
- `.env.local`: 없음

판단:

- `node_modules/`와 `dist/`는 존재하지만 `.gitignore` 대상이다.
- `git add .` 전에는 ignore 적용 여부를 다시 확인해야 한다.
- build output은 공개 repository에 포함하지 않는다.

## TODO/FIXME/HARDCODED 후보 점검

검색 결과:

- `TODO`, `FIXME`, `HARDCODED SECRET` 등 명시적 위험 마커는 주요 Vite `src/` 구현에서 발견되지 않았다.
- `SECRET`, `TOKEN`, `API_KEY`, `CLIENT_SECRET`은 문서와 `.env.example`에서 규칙 설명 및 placeholder 이름으로 등장한다.
- root legacy `app.js`와 backup files는 많은 local task/prompt 문자열을 포함한다.

판단:

- 현재 app source 기준 secret 위험은 낮다.
- repository 전체 기준으로는 legacy/local files가 공개 전 정리 대상이다.

## GitHub push 전 최종 checklist

push 전 반드시 확인:

- `npm run lint` 통과
- `npm run build` 통과
- `.env` 없음
- `.env.local` 없음
- `.env.example`에 실제 값 없음
- `node_modules/` 미포함
- `dist/` 미포함
- `.vite/` 미포함
- root `creator-hub-*.json` 미포함 또는 공개 가능성 검토 완료
- `data/creator-hub-*.json` 미포함 또는 공개 가능성 검토 완료
- `app.js.bak-*` 미포함
- recovery scan text files 미포함
- local backup scripts 미포함
- legacy `app.js/styles.css/index.html` 포함 여부 결정
- `data/codex_prompts.json` 공개 여부 결정
- `data/projects.json` 공개 여부 결정
- `data/recovered_agents_as_prompts.json` 공개 여부 결정
- `data/remotion_glossary.json` 공개 여부 결정
- `D:\Projects\...` path 포함 파일 공개 여부 검토
- `file:///C:/Users/...` path 포함 파일 공개 여부 검토
- YouTube channel/studio URL 포함 파일 공개 여부 검토
- actual key/token regex scan 재실행
- `git status --short`로 intended files만 staged 되었는지 확인

권장 staged set:

- `src/`
- `docs/baselines/`
- `docs/architecture/`
- `.github/workflows/ci.yml`
- `.env.example`
- `.gitignore`
- `README.md`
- package/config files required by Vite

단, docs 안에도 local path가 일부 포함되어 있으므로 공개 repo가 완전 public일 경우 docs local path 노출 허용 여부를 별도로 결정한다.

## Cloudflare deploy 전 checklist

Cloudflare Pages 연결 전 확인:

- `docs/architecture/cloudflare_pages_setup.md` 작성 또는 복구
- Cloudflare Pages project 생성 기준 확정
- production branch `main` 확정
- build command `npm run build` 확인
- output directory `dist` 확인
- `VITE_APP_ENV`, `VITE_APP_BASE_URL`만 Pages env에 넣기
- `OPENAI_API_KEY`, `GITHUB_TOKEN`, `CLOUDFLARE_API_TOKEN` 같은 secret을 Pages build env에 넣지 않기
- preview branch 또는 PR preview 전략 결정
- CI 통과 후 deploy하도록 운영 기준 확정
- worker/backend secret 분리 계획 확정

## future backend 분리 필요성

실제 API/OAuth/GitHub/Cloudflare 연결은 frontend bundle에 넣으면 안 된다.

future backend 또는 worker가 필요한 영역:

- OpenAI API call
- Perplexity API call
- Anthropic API call
- Google OAuth callback and token exchange
- GitHub Issue creation
- GitHub PR automation
- Cloudflare deployment status lookup
- audit log persistence
- task/artifact persistence

후보 위치:

- `workers/creator-hub-api/`
- `server/`
- `.github/workflows/` for CI/automation runner only

## 감사 결론

현재 Vite/React app source와 architecture docs 자체에는 실제 secret이 발견되지 않았다.

다만 현재 repository workspace 전체에는 legacy/local/export 파일이 함께 남아 있어, **전체를 그대로 공개 push하면 local path, 작업 메모, export data가 노출될 가능성이 있다.**

권장 판단:

- Private repository: cleanup 전 push 가능성은 있으나, 그래도 legacy/export 파일 제외 권장.
- Public repository: cleanup 전 push 비권장.
- 첫 push 전 `.gitignore` 보완 또는 intended files만 명시적으로 staging하는 절차 필요.

## Phase 18에서 하지 않은 것

- 실제 GitHub push
- 실제 GitHub repository 생성
- 실제 Cloudflare deploy
- 실제 secret 생성
- 실제 API 연결
- UI 수정
- `.gitignore` 수정
- legacy/local file 삭제
- build artifact 삭제

이 문서는 audit 결과 기록이며 정리 작업은 별도 cleanup phase에서 수행한다.
