# Runtime Environment & Secret Boundary

Status: planning document  
Phase: 12  
Scope: environment variables, runtime separation, secret boundary  
Implementation status: documentation and `.env.example` only

## 목적

Phase 12는 Creator Hub Agent OS가 실제 API, OAuth, GitHub, Cloudflare 연결로 확장되기 전에 runtime environment와 secret boundary를 정리하는 단계다.

현재 앱은 Vite 기반 frontend mock UI다. OpenAI, Perplexity, Anthropic, Google OAuth, GitHub, Cloudflare 연결은 아직 구현하지 않는다. 이 문서는 향후 구현 전에 어떤 값이 browser bundle에 노출될 수 있고, 어떤 값은 server-side runtime에만 있어야 하는지를 고정한다.

## 현재 runtime 상태

- 앱은 `vite` 기반 React frontend다.
- `npm run dev`, `npm run build`, `npm run preview` script를 사용한다.
- 현재 UI는 mock data 기반이다.
- 실제 API call, OAuth flow, secret storage, background job, queue worker는 없다.
- `.env.example`은 placeholder만 포함한다.
- `.env.local`은 생성하지 않는다.

## 환경 변수 분류

### Browser-exposed Vite variables

아래 변수는 `VITE_` prefix를 가진다. Vite에서는 `VITE_`로 시작하는 환경 변수가 browser bundle에 포함될 수 있다.

```env
VITE_APP_ENV=
VITE_APP_BASE_URL=
```

사용 목적:

- `VITE_APP_ENV`: local, staging, production 같은 공개 가능한 runtime label
- `VITE_APP_BASE_URL`: frontend app의 공개 base URL

주의:

- `VITE_` 변수는 secret이 아니다.
- 사용자에게 보여도 되는 값만 넣는다.
- API key, client secret, access token, deploy token은 절대 `VITE_` prefix를 붙이지 않는다.

### Server-side AI provider secrets

아래 값은 server-side runtime 또는 secure worker에서만 사용해야 한다.

```env
OPENAI_API_KEY=
PERPLEXITY_API_KEY=
ANTHROPIC_API_KEY=
```

역할:

- OpenAI API 호출
- Perplexity API 호출
- Anthropic / Claude API 호출

금지:

- frontend code에서 직접 사용 금지
- `VITE_OPENAI_API_KEY` 같은 이름으로 변경 금지
- browser bundle에 포함 금지
- Git commit 금지

### Server-side OAuth credentials

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

역할:

- Google OAuth authorize flow 준비
- Google Drive, Docs, Sheets, YouTube 등 향후 Google 계열 서비스 접근 기반

주의:

- `GOOGLE_CLIENT_SECRET`은 절대 browser에 노출하면 안 된다.
- `GOOGLE_CLIENT_ID`는 OAuth provider 설정상 공개 identifier로 쓰일 수 있지만, 현재 구조에서는 server-side config로 관리한다.
- OAuth redirect, callback, token exchange는 아직 구현하지 않는다.

### Server-side GitHub automation credentials

```env
GITHUB_TOKEN=
GITHUB_REPOSITORY=
```

역할:

- GitHub Issue 생성
- GitHub Actions workflow dispatch
- branch, commit, PR automation 후보
- repository target 식별

주의:

- `GITHUB_TOKEN`은 frontend에 노출하면 안 된다.
- fine-grained token 또는 GitHub App 구조를 우선 검토한다.
- 초기 자동화는 PR 직접 생성보다 GitHub Issue-first flow가 안전하다.

### Server-side Cloudflare deployment credentials

```env
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_PROJECT_NAME=
CLOUDFLARE_API_TOKEN=
```

역할:

- Cloudflare Pages project 식별
- 배포 status 조회
- 향후 deployment trigger 또는 preview 조회

주의:

- `CLOUDFLARE_API_TOKEN`은 frontend에 노출하면 안 된다.
- production deployment trigger는 approval gate 이후에만 검토한다.
- 초기에는 Cloudflare Pages의 GitHub 연동 자동 배포를 기본 흐름으로 둔다.

## 절대 브라우저에 노출하면 안 되는 키

다음 값은 `VITE_` prefix를 붙이면 안 된다.

- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- future OAuth refresh token
- future OAuth access token
- future webhook secret
- future database URL
- future service role key

특히 OpenAI, Perplexity, GitHub, Cloudflare 키는 frontend에서 직접 사용하지 않는다. 실제 호출은 향후 server-side layer 또는 Cloudflare Worker에서 처리한다.

## local / production 환경 구분

### Local

Local development에서는 다음 기준을 따른다.

- `.env.example`은 placeholder template으로만 유지한다.
- `.env.local`은 repository에 만들거나 commit하지 않는다.
- 실제 secret 값이 필요한 시점이 오면 developer local machine에만 `.env.local`을 둔다.
- `.env.local`은 `.gitignore` 대상이어야 한다.
- 현재 Phase 12에서는 `.env.local`을 생성하지 않는다.

Local에서 허용되는 값:

- `VITE_APP_ENV=local`
- `VITE_APP_BASE_URL=http://localhost:5173`

위 값은 예시일 뿐이며 `.env.example`에는 실제 값을 넣지 않는다.

### Production

Production에서는 다음 기준을 따른다.

- frontend public variable은 hosting provider env로 설정한다.
- secret은 frontend build-time env에 넣지 않는다.
- OpenAI, Perplexity, Anthropic, Google, GitHub, Cloudflare credential은 server-side runtime 또는 secret manager에 둔다.
- 배포 로그에 secret이 출력되지 않도록 한다.
- secret rotation 기준을 별도로 둔다.

Production에서 검토할 runtime:

- Cloudflare Pages for frontend hosting
- Cloudflare Workers for secure API proxy
- GitHub Actions for CI and automation runner

## Cloudflare Pages / Workers secret 관리 초안

### Cloudflare Pages

Cloudflare Pages는 frontend 정적 배포를 담당한다.

Pages에 넣을 수 있는 값:

- `VITE_APP_ENV`
- `VITE_APP_BASE_URL`

Pages에 넣지 말아야 할 값:

- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_TOKEN`
- `CLOUDFLARE_API_TOKEN`

주의: Pages build 환경에 secret을 넣으면 build process에서 사용될 수 있고, 잘못 참조하면 browser bundle에 포함될 위험이 있다. frontend에서 필요 없는 secret은 Pages build env에 두지 않는다.

### Cloudflare Workers

Cloudflare Workers는 향후 secure server-side layer 후보로 둔다.

Workers에 둘 수 있는 secret 후보:

- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_TOKEN`
- `CLOUDFLARE_API_TOKEN`

Workers의 역할 후보:

- AI draft generation endpoint
- OAuth callback and token exchange
- GitHub Issue creation endpoint
- deployment status proxy
- audit log write endpoint

Workers 구현 전 필요 결정:

- endpoint 인증 방식
- user/session model
- rate limit
- audit log 저장 위치
- provider별 permission scope

## GitHub Actions secrets 후보

GitHub Actions는 CI와 automation runner 역할을 맡을 수 있다.

후보 secrets:

- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_TOKEN` 또는 GitHub App credential
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PROJECT_NAME`
- `CLOUDFLARE_API_TOKEN`

사용 후보:

- lint/build/test
- workflow dispatch 기반 task 처리
- generated artifact validation
- PR 생성 전 verification
- Cloudflare deployment status check

주의:

- Actions log에 secret이 출력되지 않도록 한다.
- PR from fork에서 secret 사용을 제한한다.
- production deployment는 manual approval 또는 protected environment를 사용한다.
- GitHub Actions에서 생성한 결과는 Creator Hub에 다시 표시하기 전에 review gate를 거친다.

## 금지 규칙

Phase 12 기준으로 다음을 금지한다.

- 실제 API 호출 구현
- 실제 OAuth 구현
- 실제 Google callback route 구현
- 실제 GitHub API 호출
- 실제 Cloudflare API 호출
- `.env.local` 생성
- 실제 secret 값 입력
- frontend에서 API key 사용
- `VITE_` prefix가 붙은 secret variable 추가
- secret 값을 mock data에 넣기
- secret 값을 documentation 예시로 넣기
- build output에 secret 포함

## 다음 단계 후보

1. server-side runtime 선택

Cloudflare Workers, Node API server, GitHub Actions 중심 구조 중 어떤 runtime을 첫 구현 대상으로 삼을지 결정한다.

2. task schema 설계

PM Workspace command, Command Template, Artifact, GitHub Issue를 연결하는 공통 task schema를 정의한다.

3. secure endpoint contract 작성

AI draft generation, GitHub Issue creation, deployment status lookup 같은 endpoint의 request/response contract를 문서화한다.

4. approval gate 설계

AI 생성물, GitHub Issue, PR, deployment가 자동으로 이어지기 전에 사용자 승인 지점을 명확히 정의한다.

5. GitHub Issue-first automation

가장 작은 실제 자동화 후보는 PR 자동 생성이 아니라 GitHub Issue 생성이다. 이 흐름은 위험이 낮고 사용자가 작업 단위를 검토하기 쉽다.
