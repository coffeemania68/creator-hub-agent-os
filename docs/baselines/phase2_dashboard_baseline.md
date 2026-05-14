# Phase 2 Dashboard Baseline

Status: locked baseline  
Route: `/dashboard`  
Primary file: `src/pages/DashboardPage.tsx`

## 화면 목적

Home Dashboard는 Creator Hub Agent OS의 제작 관제센터다. 사용자가 PM Workspace로 들어가기 전에 4개 MVP 프로젝트의 상태, 대표 프로젝트 진행률, 승인 대기, 워크플로우 상태, 최근 산출물, 메모, PM Quick Command를 한 화면에서 확인하는 역할을 한다.

이 화면은 단순 프로젝트 관리 대시보드가 아니라 AI 콘텐츠 제작 운영 OS의 현재 상태판이다.

## 유지해야 할 레이아웃 구조

- 기존 `AppShell`, `Sidebar`, `TopBar`, `MobileBottomNav` 안에서 렌더링한다.
- Dashboard 내부에는 별도의 중복 타이틀/검색바를 두지 않는다. 상단 제목과 검색은 `TopBar` 한 세트만 사용한다.
- 메인 레이아웃은 데스크톱 기준 `main content + right operations panel` 구조를 유지한다.
- 메인 콘텐츠 순서:
  1. KPI 카드 4개
  2. 대표 프로젝트 카드: 지혜샘
  3. 보조 프로젝트 카드 3개: 시크40, 공모전, 스티커랩
  4. 최근 산출물 프리뷰
  5. 아이디어 메모장
- 우측 패널 순서:
  1. 승인 대기
  2. 워크플로우 상태
  3. AI 연결 현황
  4. 최근 미디어
  5. PM Quick Command
- 모바일에서는 모든 카드가 자연스럽게 세로 스택되어야 한다.

## 핵심 컴포넌트

- `DashboardPage`
- `MetricCard`
- `FeaturedProjectCard`
- `CompactProjectCard`
- `RecentArtifactsPanel`
- `MemoPanel`
- `ApprovalPanel`
- `WorkflowPanel`
- `ConnectionPanel`
- `RecentMediaPanel`
- `QuickCommandPanel`
- 공용 UI: `Card`, `Badge`, `ProgressBar`

## mock data 연결

Dashboard는 다음 mock data를 사용한다.

- `projects`: 4개 MVP 프로젝트와 진행률, 상태, 다음 행동
- `dashboardMetrics`: KPI 카드
- `workflowRuns`: 대표 프로젝트 단계 진행률
- `agentQueue`: 우측 워크플로우 상태
- `agents`: 워크플로우 담당 에이전트 표시
- `artifacts`: 최근 산출물 프리뷰
- `connections`: AI 연결 현황 placeholder

실제 API, OAuth, Firebase, Supabase, 백엔드 연결은 없다.

## 수정 금지/주의 사항

- Dashboard의 현재 정보 구조는 Phase 2 baseline으로 유지한다.
- 중복 타이틀/검색바를 다시 추가하지 않는다.
- `Publish / Repurpose Agent`를 Dashboard 별도 큰 섹션으로 다시 만들지 않는다. 관련 작업은 queue나 세부 페이지에서 다룬다.
- 최근 산출물 프리뷰는 텍스트를 카드 밖으로 빼지 않고 이미지/미디어 카드 내부 오버레이로 유지한다.
- PM Quick Command 문구는 짧게 유지한다.
- Dashboard는 요약/관제 화면이며, PM 채팅 기능을 이 화면 안에 확장하지 않는다.

## 다음 Phase에서 건드리면 안 되는 파일 또는 영역

- `src/pages/DashboardPage.tsx`: Studio Teams 구현 중 수정 금지
- Dashboard 관련 mock data의 의미 변경 금지:
  - `projects`
  - `dashboardMetrics`
  - `workflowRuns`
  - `artifacts`
  - `connections`
- `src/components/shell/TopBar.tsx`의 Dashboard 상단 표시 구조 변경 금지

Studio Teams 구현 시 Dashboard route와 Dashboard UI는 baseline으로 둔다.
