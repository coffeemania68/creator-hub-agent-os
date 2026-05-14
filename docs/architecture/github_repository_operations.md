# GitHub Repository Operations

Status: planning document  
Phase: 16  
Scope: repository push, branch strategy, branch protection preparation, PR flow  
Implementation status: documentation only

## 목적

이 문서는 Creator Hub Agent OS를 실제 GitHub repository 운영 구조로 전환하기 전 필요한 push, branch, PR, review, branch protection 기준을 정리한다.

Phase 16에서는 실제 GitHub API 호출, repository 생성, branch protection 적용, GitHub Actions 추가, Cloudflare deployment 연결을 하지 않는다. 이 문서는 운영 준비 기준만 정의한다.

## 권장 branch 구조

```text
main
develop
feature/*
hotfix/*
```

## branch 역할

### `main`

역할:

- production-ready branch
- Cloudflare Pages production deployment 후보 branch
- CI 통과 후 merge되는 안정 branch

운영 기준:

- 직접 push를 제한하는 것을 권장한다.
- PR review 후 merge한다.
- branch protection 적용 후보 1순위다.
- Cloudflare Pages production 연결 시 `main`을 기준 branch로 둔다.

### `develop`

역할:

- integration branch
- 여러 feature 작업을 production 전 모으는 후보 branch
- Cloudflare preview 또는 staging 연결 후보 branch

운영 기준:

- project 규모가 작을 때는 optional로 운영할 수 있다.
- `feature/*` branch는 먼저 `develop`으로 들어가고, 안정화 후 `main`으로 올리는 흐름을 권장한다.
- `develop`도 CI required check 후보에 포함한다.

### `feature/*`

역할:

- phase별 기능, 문서, UI, type, mock data 작업 branch

예시:

```text
feature/phase16-github-operations
feature/task-schema-types
feature/artifact-detail-drawer
```

운영 기준:

- 하나의 branch는 하나의 목적만 가진다.
- unrelated baseline page를 수정하지 않는다.
- PR description에 변경 목적, 파일 목록, 검증 결과를 적는다.

### `hotfix/*`

역할:

- production issue 또는 build-breaking issue를 빠르게 수정하는 branch

예시:

```text
hotfix/build-error
hotfix/route-crash
```

운영 기준:

- `main`에서 branch를 만들고 `main`으로 PR을 연다.
- 수정 범위를 최소화한다.
- hotfix 후 필요하면 `develop`에도 반영한다.

## local -> develop -> main 흐름

권장 흐름:

1. local에서 feature branch 생성
2. 작업
3. `npm run lint`
4. `npm run build`
5. secret 포함 여부 확인
6. remote feature branch push
7. PR 생성
8. CI 통과 확인
9. review
10. `develop` merge
11. 필요 시 preview 확인
12. `develop` -> `main` PR
13. CI 통과 확인
14. review
15. `main` merge

작은 문서-only 변경은 `feature/*` -> `main` 직접 PR도 가능하다. 단, CI 통과와 review는 유지한다.

## repository push 전 체크리스트

push 전 확인:

- `npm run lint` 통과
- `npm run build` 통과
- 실제 secret 포함 여부 확인
- `.env.local` 제외 여부 확인
- `.env` 제외 여부 확인
- `.env.example`에 placeholder만 있는지 확인
- `dist/`, `.vite/`, `node_modules/`가 포함되지 않았는지 확인
- 변경 범위가 phase 요청과 맞는지 확인
- 기존 baseline 역할을 침범하지 않았는지 확인
- 실제 API/OAuth/backend behavior를 실수로 추가하지 않았는지 확인

secret 체크 대상:

- OpenAI, Perplexity, Anthropic API key
- Google OAuth client secret
- GitHub token
- Cloudflare API token
- OAuth access/refresh token
- webhook secret
- database URL 또는 service role key

## PR 생성 기준

PR은 다음 경우 생성한다.

- `main` 또는 `develop`에 반영할 모든 변경
- UI baseline에 영향이 있는 변경
- architecture 문서 추가/수정
- CI/workflow 변경
- env/template 변경
- mock data 또는 shared type 변경

PR description 포함 항목:

- 목적
- 생성/수정 파일 목록
- 영향받는 route 또는 문서
- baseline 영향 여부
- 실제 API/OAuth/backend 동작 추가 여부
- secret exposure 여부
- `npm run lint` 결과
- `npm run build` 결과

UI 변경 PR 추가 항목:

- desktop/mobile 확인 여부
- screenshot 또는 짧은 시각 확인 메모

문서-only PR 추가 항목:

- planning-only인지 implementation-ready인지 명시

## PR naming convention

권장 PR title:

```text
Phase 16: Document GitHub repository operations
Phase 15: Add CI foundation
Docs: Update runtime environment boundary
UI: Refine Studio Teams layout
Fix: Resolve workflow route phase label
```

형식 후보:

```text
<Type>: <short action>
Phase <number>: <short outcome>
```

Type 후보:

- `Phase`
- `Docs`
- `UI`
- `Types`
- `Data`
- `CI`
- `Fix`
- `Chore`

## commit message convention 초안

권장 commit message:

```text
docs: add GitHub repository operations guide
ci: add lint and build workflow
docs: baseline phase 15 CI foundation
ui: refine sidebar navigation groups
fix: align route phase metadata
chore: update env ignore rules
```

형식:

```text
<type>: <short imperative summary>
```

type 후보:

- `docs`
- `ci`
- `ui`
- `types`
- `data`
- `fix`
- `chore`
- `refactor`

규칙:

- 한 commit은 가능한 한 하나의 목적을 가진다.
- secret 값, token, credential은 commit message에 쓰지 않는다.
- 큰 phase 작업은 여러 commit으로 나누되 PR description에서 묶어 설명한다.

## squash merge 여부

권장:

- `feature/*` -> `develop`: squash merge 권장
- `feature/*` -> `main`: squash merge 권장
- `develop` -> `main`: merge commit 또는 squash merge 중 repository 운영 방식에 따라 선택
- `hotfix/*` -> `main`: squash merge 권장

기준:

- phase 단위 작업은 하나의 읽기 쉬운 commit으로 남기는 것이 좋다.
- commit history를 세밀하게 남겨야 하는 큰 refactor는 merge commit도 가능하다.
- 어떤 방식을 쓰든 CI 통과 후 merge한다.

## force push 제한 후보

권장 제한:

- `main`: force push 금지
- `develop`: force push 금지 권장
- `feature/*`: PR review 전까지 개인 branch에서만 허용 가능
- `hotfix/*`: force push 최소화

branch protection 적용 후에는 `main`과 `develop`의 force push를 비활성화하는 것을 권장한다.

## protected branch 후보

1순위:

- `main`

2순위:

- `develop`

후보 규칙:

- Require a pull request before merging
- Require approvals
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require conversation resolution before merging
- Restrict force pushes
- Restrict deletions

운영 초기에는 `main`에 먼저 적용하고, `develop`은 팀 규모와 PR 흐름이 안정된 뒤 적용해도 된다.

## CI required check 후보

현재 workflow job:

```text
lint-build
```

Required check 후보:

```text
Lint and build
```

기준:

- `npm ci`
- `npm run lint`
- `npm run build`

CI required check는 `main`에 우선 적용한다. `develop`에도 적용하면 integration branch 품질을 더 안정적으로 유지할 수 있다.

## PR review 기준

Reviewer는 다음을 확인한다.

- CI가 통과했는가?
- local `npm run lint` / `npm run build` 결과가 기록되어 있는가?
- baseline 문서와 충돌하지 않는가?
- unrelated page를 수정하지 않았는가?
- mock-only phase에서 실제 API/OAuth/backend가 추가되지 않았는가?
- secret이 source, docs, workflow, mock data에 들어가지 않았는가?
- `.env.local`, `.env`, `dist/`, `node_modules/`가 포함되지 않았는가?
- UI 변경이면 모바일 layout이 깨지지 않는가?

## GitHub Issues 사용 방향

초기 GitHub Issues는 planning과 task tracking에 사용한다.

Issue 후보:

- phase planning
- bug report
- UI regression
- architecture decision
- future API integration task
- Cloudflare deployment setup task

Issue label 후보:

- `phase`
- `docs`
- `ui`
- `ci`
- `architecture`
- `mock`
- `future-api`
- `deployment`
- `blocked`

현재 금지:

- Creator Hub UI에서 실제 GitHub Issue 자동 생성
- API를 통한 Issue 생성
- Actions에서 자동 Issue 생성

Future automation에서는 `docs/architecture/task_schema_and_endpoint_contract.md`의 GitHub Issue-first flow를 기준으로 검토한다.

## future GitHub automation 연결 위치

후보 위치:

```text
.github/workflows/
```

Future 후보:

- Issue-first automation workflow
- generated artifact validation
- PR checklist validation
- deployment verification
- release notes generation

현재 Phase 16에서는 추가 workflow를 만들지 않는다. 기존 Phase 15 CI workflow만 유지한다.

## Cloudflare Pages와의 연결 위치

Cloudflare Pages 연결 후보:

- GitHub repository integration
- production branch: `main`
- preview branch: `develop` 또는 PR preview
- build command: `npm run build`
- output directory: `dist`

주의:

- Phase 16에서는 Cloudflare Pages 연결을 실제로 설정하지 않는다.
- Cloudflare API token을 repository에 넣지 않는다.
- Cloudflare deployment trigger workflow를 만들지 않는다.
- Cloudflare Pages 배포 기준은 `docs/architecture/deployment_foundation.md`를 따른다.

## GitHub repository 초기 운영 규칙

초기 운영 규칙:

- README, `.gitignore`, `.env.example`, docs, source를 포함해 첫 push 전 lint/build를 통과시킨다.
- `main`을 기본 branch로 둔다.
- 필요하면 `develop` branch를 만든다.
- CI가 GitHub에서 통과하는지 첫 PR로 확인한다.
- branch protection은 CI 성공 후 `main`에 우선 적용한다.
- secrets는 repository settings에 넣기 전까지 사용하지 않는다.
- GitHub Actions는 Phase 15 CI 하나만 유지한다.
- Cloudflare Pages 연결은 별도 deployment setup phase에서 진행한다.

## 금지사항

Phase 16에서는 다음을 하지 않는다.

- 실제 GitHub API 호출
- 실제 GitHub repository 생성
- 실제 branch protection 적용
- 실제 GitHub Actions 추가
- 실제 deployment 연결
- 실제 Cloudflare Pages 연결
- 실제 Cloudflare API 호출
- 실제 OAuth 구현
- 실제 backend 생성
- 실제 DB 연결
- secret 값 입력 또는 저장
- Creator Hub UI에서 GitHub Issue/PR 자동 생성

## 완료 기준

Phase 16 문서화 완료 기준:

- GitHub repository 운영 문서가 존재한다.
- branch 역할과 흐름이 정리되어 있다.
- push 전 체크리스트가 있다.
- PR/commit convention이 있다.
- branch protection 후보가 있다.
- CI required check 후보가 있다.
- GitHub Issues 사용 방향이 있다.
- Cloudflare Pages 연결 위치가 문서화되어 있다.
- `npm run lint`가 통과한다.
- `npm run build`가 통과한다.
