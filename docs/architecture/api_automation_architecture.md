# API & Automation Architecture

Status: planning document  
Phase: 11  
Scope: API, OAuth, GitHub, GitHub Actions, Cloudflare Pages automation architecture  
Implementation status: documentation only

## 현재 상태: mock UI 기반 OS

Creator Hub Agent OS는 현재 mock data 기반의 운영 UI다. Dashboard, PM Workspace, Studio Teams, Artifacts, Settings / Integrations, Workflows, Projects, Command Templates는 실제 API, OAuth, backend, queue, file storage와 연결되어 있지 않다.

현재 앱의 역할은 다음과 같다.

- 운영자가 프로젝트 상태를 확인한다.
- PM Supervisor에게 내릴 작업 명령 흐름을 UI로 표현한다.
- AI 직원, 산출물, 워크플로우, 연결 상태를 mock data로 보여준다.
- 실제 자동화 전에 화면 구조와 역할 경계를 고정한다.

Phase 11은 이 mock UI를 실제 자동 워크플로우로 확장하기 전에 필요한 외부 서비스 구조를 설계하는 단계다. 이 문서에서는 구현하지 않고 연결 방식, 책임 분리, 금지 항목, 우선순위만 정의한다.

## 실제 자동화를 위해 필요한 구성요소

### Google OAuth

역할:

- 사용자의 Google 계정 인증
- 향후 Google Drive, Docs, Sheets, YouTube 등 Google 계열 서비스 접근 권한 위임
- 사용자별 연결 상태 관리

주의:

- 현재 Phase 11에서는 실제 로그인 flow를 구현하지 않는다.
- OAuth token, refresh token, client secret 저장 구조는 아직 구현하지 않는다.
- Settings / Integrations 화면은 mock connection 상태만 유지한다.

### OpenAI API

역할:

- PM Workspace 명령을 기반으로 AI 초안 생성
- 스크립트, 블로그 초안, Substack 초안, 이미지 프롬프트, 명령 템플릿 확장 등 생성형 작업 처리
- 향후 agent별 system instruction과 workflow stage별 prompt 실행

주의:

- 현재 앱 내부에서 OpenAI API를 직접 호출하지 않는다.
- API key는 frontend에 노출하면 안 된다.
- 실제 구현 시 server-side endpoint 또는 secure worker layer가 필요하다.

### Perplexity API

역할:

- 리서치 기반 초안 작성
- 최신 정보 확인이 필요한 프로젝트 조사
- 공모전, 트렌드, 레퍼런스 조사 workflow stage 지원

주의:

- 현재 검색/리서치 UI는 mock 상태다.
- 실제 Perplexity API 호출, 결과 저장, citation 관리 기능은 구현하지 않는다.

### GitHub API

역할:

- Creator Hub 작업을 GitHub Issue로 생성
- AI가 생성한 산출물 또는 코드 변경 요청을 branch/commit/PR 흐름으로 연결
- 프로젝트별 작업 로그, PR 상태, reviewer approval 상태를 Creator Hub에 다시 표시

주의:

- 현재 GitHub Issue, branch, PR 생성은 구현하지 않는다.
- GitHub token 저장, repository write permission, webhook 처리는 아직 설계 단계다.

### GitHub Actions

역할:

- PR 생성 후 lint/build/test 자동 실행
- 콘텐츠 빌드, 정적 파일 생성, preview artifact 생성
- 승인된 작업을 배포 pipeline으로 넘기는 automation runner

주의:

- Creator Hub에서 직접 background job을 실행하지 않는다.
- 실제 자동 실행은 GitHub Actions 같은 외부 runner에 위임하는 구조가 안전하다.

### Cloudflare Pages

역할:

- 승인된 main branch 또는 release branch를 자동 배포
- preview deployment 제공
- 향후 Creator Hub에서 배포 상태를 조회해 Dashboard / Projects / Artifacts에 표시

주의:

- 현재 Cloudflare Pages 연결은 구현하지 않는다.
- 배포 token, project id, account id, webhook 설정은 아직 저장하지 않는다.

## ChatGPT Pro와 OpenAI API Key 차이

ChatGPT Pro와 OpenAI API Key는 서로 다른 사용 경로다.

ChatGPT Pro:

- chatgpt.com에서 사용하는 개인 구독 상품이다.
- 사용자가 ChatGPT UI에서 대화, 파일 분석, 도구 사용을 할 수 있게 한다.
- Creator Hub 웹앱 내부에서 자동으로 API 호출 권한을 제공하지 않는다.
- ChatGPT Pro 구독이 있다고 해서 웹앱 backend가 OpenAI API를 호출할 수 있는 것은 아니다.

OpenAI API Key:

- 개발자가 애플리케이션에서 OpenAI API를 호출하기 위해 사용하는 별도 credential이다.
- usage-based billing과 project/API key 관리가 필요하다.
- frontend에 직접 노출하면 안 되며, server-side 또는 worker-side에서 관리해야 한다.
- Creator Hub의 실제 AI 자동화에는 ChatGPT Pro가 아니라 OpenAI API Key 기반 구조가 필요하다.

## Codex의 위치

Codex는 Creator Hub 웹앱 내부 기능이 아니다. Codex는 이 프로젝트를 개발, 수정, 검증하는 별도 개발 도구다.

구분:

- Creator Hub Agent OS: 사용자가 브라우저에서 보는 운영 웹앱
- Codex: 로컬 프로젝트 파일을 수정하고 lint/build를 실행하는 개발 보조 도구
- OpenAI API: 웹앱 또는 backend가 실제 AI 생성 작업에 호출할 수 있는 API

따라서 Creator Hub 안에 "Codex 실행" 기능을 넣는 것은 현재 architecture scope가 아니다. 향후 개발 자동화가 필요하면 GitHub Issue, PR, Actions 중심으로 설계한다.

## 가능한 자동화 흐름

아래 흐름은 향후 구현 가능한 high-level automation path다. 현재 Phase 11에서는 구현하지 않는다.

1. Creator Hub 작업 생성

PM Workspace 또는 Command Templates에서 작업 요청을 만든다. 요청에는 프로젝트, 목표, 대상 agent, 필요한 산출물 유형, priority, due date가 포함된다.

2. AI 초안 생성

server-side automation layer가 OpenAI API 또는 Perplexity API를 호출해 초안을 생성한다. 결과는 Artifact 후보로 저장되고 review 상태가 된다.

3. GitHub Issue 생성

작업이 코드, 콘텐츠 배포, 사이트 변경과 연결되는 경우 GitHub API로 Issue를 생성한다. Issue에는 Creator Hub task id, project id, artifact id가 연결된다.

4. GitHub Action 실행

Issue label, workflow dispatch, PR event 등을 통해 GitHub Actions가 실행된다. Actions는 lint/build/test, 콘텐츠 빌드, preview 생성 같은 검증을 담당한다.

5. PR 생성

자동화가 파일 변경을 만들 수 있는 단계에서는 branch를 생성하고 PR을 연다. PR description에는 작업 목적, 생성 artifact, 검증 결과, rollback note가 포함되어야 한다.

6. 사용자가 승인

사용자는 GitHub PR 또는 Creator Hub의 승인 UI에서 결과를 확인한다. 승인 전에는 main branch merge나 production deployment가 자동으로 진행되지 않아야 한다.

7. Cloudflare 자동 배포

PR merge 후 Cloudflare Pages가 main branch를 감지해 자동 배포한다. 배포 결과 URL과 status는 GitHub status 또는 Cloudflare API를 통해 다시 Creator Hub에 표시할 수 있다.

## 당장 구현하지 말아야 할 것

Phase 11에서는 다음을 구현하지 않는다.

- 실제 OAuth 로그인
- 실제 Google OAuth callback
- 실제 OpenAI API 호출
- 실제 Perplexity API 호출
- 실제 GitHub API 호출
- 실제 GitHub Issue 생성
- 실제 GitHub PR 생성
- 실제 GitHub Actions dispatch
- 실제 Cloudflare Pages 연결
- secret 저장
- token 저장
- API key 저장
- background job
- queue worker
- database persistence
- artifact file upload/download
- 자동 merge
- 자동 production deployment 승인

이 단계에서는 architecture boundary를 문서화하는 것만 허용한다.

## 다음 구현 우선순위 제안

### 1. Environment boundary 정리

가장 먼저 `.env.example`과 Settings / Integrations baseline을 기준으로 어떤 credential이 필요한지 확정한다.

후보:

- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_APP_ID` 또는 `GITHUB_TOKEN`
- `GITHUB_REPOSITORY`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PROJECT_NAME`

구현 전 결정할 것:

- frontend env와 server-side secret의 경계
- local development와 production secret 관리 방식
- secret을 절대 browser bundle에 넣지 않는 규칙

### 2. Backend 또는 worker layer 설계

OpenAI API, Perplexity API, GitHub API, Cloudflare API를 안전하게 호출하려면 frontend가 아니라 server-side layer가 필요하다.

후보 구조:

- Cloudflare Workers
- Vercel/Netlify functions
- 별도 Node API server
- GitHub Actions workflow dispatch 중심의 최소 backend

초기에는 가장 작은 server-side proxy와 audit log 설계부터 검토한다.

### 3. Task schema 확정

PM Workspace 명령을 실제 automation으로 넘기려면 공통 task schema가 필요하다.

필요 필드 후보:

- task id
- project id
- command template id
- target agent id
- requested artifact type
- source context
- status
- approval state
- linked GitHub issue number
- linked PR number
- linked artifact ids

### 4. GitHub Issue first flow

가장 안전한 첫 자동화는 직접 PR을 만드는 것이 아니라 GitHub Issue를 생성하는 것이다.

이유:

- 사용자가 작업 단위를 검토할 수 있다.
- 자동 코드 변경 전에 discussion과 labeling이 가능하다.
- GitHub Actions, PR, deployment로 이어지는 흐름을 작게 시작할 수 있다.

### 5. AI draft generation mock-to-real bridge

OpenAI API를 바로 전체 workflow에 연결하지 말고, 선택된 command template 하나를 server-side endpoint로 보내 draft artifact 하나를 생성하는 작은 흐름부터 구현한다.

초기 후보:

- PM Workspace command 입력
- OpenAI API 초안 생성
- Artifact draft 생성
- 사용자 review 상태로 표시

### 6. Approval gate

자동화가 PR 생성, merge, deployment로 이어지기 전에는 명확한 승인 gate가 필요하다.

기준:

- AI output은 항상 review 상태로 시작한다.
- PR 생성은 사용자 승인 후 실행한다.
- production deployment는 merge 또는 별도 release approval 이후 진행한다.

## 유지해야 할 역할 분리

- Dashboard: 전체 운영 상태 확인
- PM Workspace: 작업 명령과 승인 흐름
- Studio Teams: AI 직원 구성과 상태
- Workflows: 작업 흐름 지도
- Artifacts: 생성 결과물 보관함
- Projects: 프로젝트 포트폴리오
- Command Templates: 반복 작업 명령 라이브러리
- Settings / Integrations: 외부 서비스 연결 준비 상태

API와 automation이 추가되어도 각 화면의 역할은 유지해야 한다. 실제 연결은 화면 역할을 흐리게 만드는 방향이 아니라, 기존 mock 상태를 real status로 대체하는 방향이어야 한다.
