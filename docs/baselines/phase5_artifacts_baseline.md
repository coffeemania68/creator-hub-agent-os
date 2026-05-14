# Phase 5 Artifacts Baseline

Status: locked baseline  
Route: `/artifacts`  
Primary file: `src/pages/ArtifactsPage.tsx`

## 화면 목적

Artifacts는 Creator Hub Agent OS의 결과물 보관함이다. 사용자가 작업을 실행하거나 PM에게 지시하는 화면이 아니라, 이미 생성된 산출물을 확인하고 상태별로 정리하는 화면이다.

이 화면은 `파일 탐색기 + 제작 산출물 관리`에 가깝다. 설명형 대시보드보다 compact해야 하며, 리스트/정렬/상태 확인이 우선이다.

## 유지해야 할 레이아웃 구조

- 기존 `AppShell`, `Sidebar`, `TopBar`, `MobileBottomNav` 안에서 렌더링한다.
- `/artifacts` route는 `ArtifactsPage`를 렌더링한다.
- 페이지 내부는 데스크톱 기준 `main artifact library + right library sidebar` 2열 구조를 유지한다.
  - 메인 영역: 검색, 상태 필터, 프로젝트 필터, artifact card grid
  - 우측 사이드바: Library Status, Recent Updates
- 메인 영역의 최대 폭은 기존 Dashboard 계열과 맞춰 `max-w-[1440px]` 안에서 정리한다.
- artifact grid는 `md` 이상에서 2열, 매우 넓은 화면에서 3열까지 확장한다.
- 모바일에서는 검색/필터, 카드 목록, 사이드바가 자연스럽게 세로 스택되어야 한다.
- Dashboard, PM Workspace, Studio Teams의 파일과 레이아웃은 Artifacts 구현 중 수정하지 않는다.

## artifact 카드/리스트 규칙

Artifact 카드는 보관함에서 빠르게 식별할 수 있는 최소 메타데이터를 보여준다.

필수 표시 정보:

- 산출물 이름
- 프로젝트명 또는 프로젝트 shortName
- artifact 타입
- 상태 badge
- 버전
- 생성 agent
- 마지막 수정 시간
- metadata format 보조 정보

카드 표현 규칙:

- 카드 상단에는 icon, title, project, status badge를 둔다.
- 카드 본문에는 `Type`, `Version`, `Created By`, `updatedAt`, `metadata.format`을 compact하게 배치한다.
- 상태 badge tone은 `statusTone`으로 관리한다.
- 타입별 icon과 화면 표시명은 `typeIcon`, `typeLabel`에서 매핑한다.
- 카드 안에 실제 download/share/upload/action 버튼은 두지 않는다.

## 필터/검색/mock 상태 구조

현재 필터와 검색은 mock data 기반의 클라이언트 UI다.

상태 필터:

- `all`
- `draft`
- `review`
- `approved`
- `archived`

프로젝트 필터:

- `All Projects`
- `지혜샘`
- `시크40`
- `공모전`
- `스티커랩`

검색 구조:

- 검색 입력은 local state로만 관리한다.
- 검색 대상은 artifact title, type label, project name, project shortName, agent name이다.
- 외부 검색 API나 서버 요청은 없다.

우측 사이드바:

- `Library Status`는 현재 필터 결과 수를 표시한다.
- `Review`, `Approved` 요약 카운트는 전체 mock artifact 기준으로 계산한다.
- `Recent Updates`는 `updatedAt` 기준 최신 4개 artifact를 보여준다.

## mock data 연결 구조

Artifacts는 다음 mock data를 사용한다.

- `artifacts`: 보관함에 표시할 산출물 목록
- `projects`: artifact의 프로젝트명/shortName 조회
- `agents`: 생성 agent 이름 조회

관련 타입:

- `Artifact`
- `ArtifactType`
- `ArtifactStatus`
- `ProjectId`

현재 `ArtifactStatus`는 Phase 5 기준으로 다음 상태만 사용한다.

- `draft`
- `review`
- `approved`
- `archived`

`Artifact`는 다음 필드를 화면에서 사용한다.

- `id`
- `projectId`
- `type`
- `title`
- `status`
- `agentId`
- `version`
- `createdAt`
- `updatedAt`
- `metadata`

실제 API 호출, OAuth, Firebase, Supabase, 백엔드 저장소, 클라우드 파일 시스템, 실시간 동기화는 없다. 모든 데이터는 mock UI용 정적 데이터다.

## Dashboard / PM Workspace / Studio Teams와 역할 차이

Dashboard는 전체 제작 현황을 요약하는 관제 화면이다. KPI, 프로젝트 진행률, 승인 대기, 워크플로우, 최근 산출물 프리뷰를 한 화면에서 보여준다.

PM Workspace는 사용자가 PM Supervisor에게 지시하고, 산출물 승인/재생성 흐름을 확인하는 작업실이다. composer 입력창, 승인 패널, quick command는 PM Workspace의 책임이다.

Studio Teams는 AI 직원 조직도와 상태 현황을 보여주는 AI employee board다. 에이전트 구조와 역할을 보여주지만 산출물 보관함은 아니다.

Artifacts는 생성된 결과물을 보관/확인/정리하는 라이브러리다. 실행, 지시, 승인 워크플로우의 중심 화면이 아니라 결과물 목록을 관리하는 화면이다.

## 제거/미구현한 기능

현재 Phase 5 baseline에는 다음 기능을 구현하지 않는다.

- 실제 파일 업로드
- 실제 다운로드 기능
- 실제 공유 기능
- 실제 삭제 기능
- 실제 archive mutation
- 실제 승인 mutation
- 클라우드 저장소 연결
- Google Drive, Dropbox, Notion, Supabase Storage 같은 외부 파일 연결
- Firebase, Supabase, OAuth, backend 연결
- 실시간 동기화
- 서버 검색
- 파일 미리보기 렌더러
- 버전 diff viewer
- drag and drop upload
- bulk action

## 향후 확장 가능 영역

다음 항목은 향후 Phase에서 검토할 수 있지만, 현재 baseline에는 구현하지 않는다.

- artifact detail drawer
- full preview modal
- version history timeline
- text/image/video 타입별 전문 preview
- artifact compare view
- 승인/보관/복원 action
- 프로젝트별 folder view
- tag system
- advanced sort
- bulk selection
- PM Workspace deep link
- workflow stage 연결 표시
- cloud export integration
- 실제 storage/provider 연결

확장 시에도 Dashboard, PM Workspace, Studio Teams의 baseline 역할을 침범하지 않아야 한다.
