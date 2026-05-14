# Phase 6 Settings / Integrations Baseline

Status: locked baseline  
Routes: `/connections`, `/settings`  
Primary file: `src/pages/IntegrationsPage.tsx`

## 화면 목적

Settings / Integrations는 Creator Hub Agent OS의 연결 준비 상태를 확인하는 foundation 화면이다. 실제 OAuth 로그인, API 호출, secret 저장을 수행하는 화면이 아니라, 앞으로 어떤 provider를 연결할 수 있고 어떤 환경 변수가 필요한지 한눈에 확인하는 mock 관리 화면이다.

이 화면은 개발자 설정 페이지처럼 복잡하면 안 된다. 사용자는 `무엇이 연결되어 있는지`, `무엇이 아직 준비가 필요한지`, `어떤 키가 필요할지`를 빠르게 확인할 수 있어야 한다.

## 유지해야 할 레이아웃 구조

- 기존 `AppShell`, `Sidebar`, `TopBar`, `MobileBottomNav` 안에서 렌더링한다.
- `/connections`와 `/settings`는 모두 `IntegrationsPage`를 렌더링한다.
- 페이지 내부는 데스크톱 기준 `main integrations grid + right settings sidebar` 2열 구조를 유지한다.
  - 메인 영역: Integration Readiness summary, service card grid
  - 우측 사이드바: Environment required keys, Auth Boundary
- 메인 영역의 최대 폭은 기존 Dashboard/Artifacts 계열과 맞춰 `max-w-[1440px]` 안에서 정리한다.
- service card grid는 `md` 이상에서 2열, 매우 넓은 화면에서 3열까지 확장한다.
- 모바일에서는 summary, service cards, settings sidebar가 자연스럽게 세로 스택되어야 한다.
- Dashboard, PM Workspace, Studio Teams, Artifacts의 파일과 레이아웃은 Settings / Integrations 작업 중 수정하지 않는다.

## 서비스 카드 구조

현재 표시하는 service provider는 다음 6개다.

- Google
- OpenAI
- Perplexity
- Claude
- YouTube
- Naver

각 서비스 카드는 다음 정보를 유지한다.

- provider initial badge
- provider name
- auth type: `OAuth` 또는 `API Key`
- status badge
- usage label
- env key 목록
- note
- mock `Connect` 또는 `Disconnect` 버튼

버튼은 실제 연결을 수행하지 않는다. 현재 단계에서는 future action을 시각적으로 표현하는 mock control이다.

## mock connection 상태 규칙

현재 상태 타입은 `IntegrationStatus`에서 관리한다.

- `connected`
- `disconnected`
- `needs-setup`
- `mock-mode`

상태 표시 규칙:

- `connected`: mock 상 연결된 것처럼 보이는 상태
- `disconnected`: 아직 연결되지 않은 placeholder 상태
- `needs-setup`: 환경 변수 또는 OAuth 설정이 필요함을 표시하는 상태
- `mock-mode`: 실제 provider 호출 없이 mock으로만 준비된 상태

상태 label, badge tone, icon은 각각 `statusLabel`, `statusTone`, `statusIcon`에서 매핑한다.

## API Key / OAuth 구분 규칙

`IntegrationService.authType`은 다음 두 값만 사용한다.

- `API Key`
- `OAuth`

API Key provider:

- OpenAI
- Perplexity
- Claude
- Naver

OAuth provider:

- Google
- YouTube

API Key는 `.env.example`에 필요한 변수명을 보여주기 위한 구조다. UI는 key 값을 입력받거나 저장하지 않는다.

OAuth는 future client id/secret 준비 상태를 보여주기 위한 구조다. 실제 로그인, redirect, callback 처리는 없다.

## .env.example 구조

`.env.example`은 Phase 6에서 필요한 mock 환경 변수 목록을 기록한다.

현재 구조:

```env
OPENAI_API_KEY=
PERPLEXITY_API_KEY=
ANTHROPIC_API_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=

NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

주의 사항:

- 실제 secret 값은 넣지 않는다.
- 앱은 현재 `.env.example` 값을 읽거나 검증하지 않는다.
- secret 저장, 암호화, 서버 전달은 구현하지 않는다.

## mock data 연결 구조

Settings / Integrations는 `src/data/mockData.ts`의 `integrationServices`를 사용한다.

관련 타입:

- `IntegrationStatus`
- `IntegrationProvider`
- `IntegrationService`

`IntegrationService` 필드:

- `id`
- `provider`
- `status`
- `authType`
- `envVars`
- `usageLabel`
- `note`

기존 Dashboard에서 사용하는 `connections` mock data는 유지한다. Dashboard의 AI 연결 현황은 간단한 provider readiness preview이며, Settings / Integrations의 상세 연결 준비 구조와 분리한다.

## 실제 구현 금지 항목

현재 Phase 6 baseline에는 다음 기능을 구현하지 않는다.

- 실제 로그인
- 실제 OAuth flow
- 실제 OAuth redirect
- 실제 OAuth callback 처리
- 실제 API 호출
- 실제 API key 입력
- 실제 API key 저장
- DB 저장
- secret 암호화
- secret manager 연동
- Firebase 연결
- Supabase 연결
- backend endpoint 연결
- provider health check
- token refresh
- 권한 scope 요청
- 계정 프로필 조회

## Dashboard / PM Workspace / Studio Teams / Artifacts와 역할 차이

Dashboard는 전체 제작 현황을 요약하는 관제 화면이다. 연결 상태는 작은 preview 수준으로만 보여준다.

PM Workspace는 사용자가 PM Supervisor에게 지시하고 산출물을 승인/재생성하는 작업실이다. provider 연결 설정을 이 화면에서 다루지 않는다.

Studio Teams는 AI 직원 조직도와 에이전트 상태를 보여주는 화면이다. provider key나 OAuth 설정을 다루지 않는다.

Artifacts는 생성된 결과물을 확인/정리하는 보관함이다. cloud export나 storage 연결은 future phase이며 현재 Settings / Integrations에서만 준비 상태를 보여준다.

Settings / Integrations는 provider 연결 준비 상태, 필요한 환경 변수, auth boundary를 설명하는 foundation 화면이다.

## 향후 실제 연결 단계에서 확장할 내용

다음 항목은 향후 실제 연결 단계에서 검토할 수 있지만, 현재 baseline에는 구현하지 않는다.

- secure API key input
- encrypted secret storage
- backend secret proxy
- OAuth authorize redirect
- OAuth callback route
- token exchange
- refresh token 관리
- provider별 scope 선택
- connection test
- provider health check
- connected account profile
- permission audit
- disconnect mutation
- reconnect flow
- Google Drive export
- YouTube upload metadata push
- Naver Blog draft publish
- OpenAI/Claude/Perplexity model call routing

확장 시에도 Dashboard, PM Workspace, Studio Teams, Artifacts의 baseline 역할을 침범하지 않아야 한다.
