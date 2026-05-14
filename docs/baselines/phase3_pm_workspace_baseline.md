# Phase 3 PM Workspace Baseline

Status: locked baseline  
Route: `/pm`  
Primary file: `src/pages/PMWorkspacePage.tsx`

## 화면 목적

PM Workspace는 사용자가 PM Supervisor에게 지시하고, 생성된 산출물을 확인/승인/재생성하는 작업실이다. Dashboard처럼 전체 현황을 요약하는 화면이 아니라, 선택된 PM 작업 세션의 `명령 -> 생성물 -> 승인/수정` 흐름을 보여주는 화면이다.

PM Supervisor는 사용자의 명령을 받아 에이전트에게 작업을 배정하고, 산출물은 우측 승인 패널에서 검토한다.

## 유지해야 할 레이아웃 구조

- 기존 `AppShell`, `Sidebar`, `TopBar`, `MobileBottomNav` 안에서 렌더링한다.
- 데스크톱 기준 2열 구조를 유지한다.
  - 좌측/중앙: PM Supervisor 채팅과 프로젝트 스레드
  - 우측: 승인 대기 산출물 패널
- 채팅 영역 구조:
  1. PM Supervisor session header
  2. 사용자 메시지
  3. PM Supervisor 응답
  4. quick command chips
  5. composer 입력창
- 하단 프로젝트 스레드 구조:
  - 프로젝트
  - 최근 메시지
  - 담당 에이전트
  - 진행률
  - 상태/Open 액션
- 우측 승인 패널 구조:
  1. 승인 대기 산출물 제목
  2. artifact preview
  3. 산출물 설명
  4. 수정 요청 메모
  5. 승인/재생성 버튼
  6. Download / Save to Project / Share mock actions
  7. Version History
  8. Error / Status Log
- 모바일에서는 중앙 채팅, 프로젝트 스레드, 승인 패널이 세로로 쌓인다.

## 핵심 컴포넌트

- `PMWorkspacePage`
- `PMHeader`
- `ChatPanel`
- `ChatMessage`
- `ProjectThreads`
- `ThreadRow`
- `ApprovalPanel`
- `ActionIcon`
- `InfoBox`
- `AgentAvatar`
- `MiniPreview`
- 공용 UI: `Badge`, `ProgressBar`

## mock data 연결

PM Workspace는 다음 mock data를 사용한다.

- `pmMessages`: 사용자 명령과 PM Supervisor 응답
- `pmThreads`: 프로젝트 스레드 목록
- `approvalArtifact`: 우측 승인 대기 산출물
- `artifacts`: 승인 대상 artifact의 버전/메타 참조
- `projects`: 프로젝트명, 진행률, 상태
- `agents`: 스레드/작업 담당 에이전트

추가 타입:

- `PMMessage`
- `ApprovalArtifact`

실제 AI 호출, API 호출, OAuth, Firebase, Supabase, 백엔드 연결은 없다.

## 수정 금지/주의 사항

- PM Workspace의 현재 구조는 Phase 3 baseline으로 유지한다.
- 기능 추가보다 UX 안정화를 우선한다.
- `PM Supervisor 채팅 중심 레이아웃`을 다른 dashboard형 레이아웃으로 바꾸지 않는다.
- 우측 승인 대기 산출물 패널을 제거하지 않는다.
- quick command chips와 composer 입력창은 유지한다.
- 프로젝트 스레드 패널은 유지한다.
- version history / status log 구조는 유지한다.
- PM Workspace에서 여러 프로젝트 병렬 작업 개념을 다루더라도, 현재 baseline에서는 선택된 작업 세션을 중심으로 표시한다.

## 다음 Phase에서 건드리면 안 되는 파일 또는 영역

- `src/pages/PMWorkspacePage.tsx`: Studio Teams 구현 중 수정 금지
- PM Workspace 전용 mock data 의미 변경 금지:
  - `pmMessages`
  - `pmThreads`
  - `approvalArtifact`
- `src/app/routes.tsx`의 `/pm` 연결은 유지
- Dashboard와 PM Workspace는 Studio Teams 작업 중 수정하지 않는다.

다음 Phase는 Studio Teams 구현이며, PM Workspace는 baseline으로 둔다.
