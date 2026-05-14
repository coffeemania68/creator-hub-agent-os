# Phase 4 Studio Teams Baseline

Status: locked baseline  
Route: `/teams`  
Primary file: `src/pages/StudioTeamsPage.tsx`

## 화면 목적

Studio Teams는 Creator Hub Agent OS의 AI employee board다. 사용자가 실제 작업을 지시하는 화면이 아니라, 제작팀에 어떤 AI 직원이 있고 각 직원이 어떤 팀/역할/상태에 속하는지 확인하는 현황판이다.

이 화면은 Dashboard보다 실행 정보가 적고, PM Workspace보다 명령 기능이 적어야 한다. Studio Teams의 목적은 에이전트 조직 구조를 빠르게 확인하는 것이다.

## 유지해야 할 레이아웃 구조

- 기존 `AppShell`, `Sidebar`, `TopBar`, `MobileBottomNav` 안에서 렌더링한다.
- 페이지 내부는 데스크톱 기준 `main team board + right PM sidebar` 2열 구조를 유지한다.
  - 메인 영역: 팀별 에이전트 그룹
  - 우측 사이드바: PM Supervisor 정보와 읽기 전용 PM Chat 안내
- 메인 영역은 상단 Overview Stats 없이 바로 팀별 그룹으로 시작한다.
- 데스크톱에서 에이전트 카드는 팀 섹션 안에서 최대 2열로 배치한다.
- 모바일에서는 메인 팀 그룹과 PM 사이드바가 자연스럽게 세로 스택되어야 한다.
- Dashboard, PM Workspace의 레이아웃이나 라우트 구조는 Studio Teams 정리 중 수정하지 않는다.

## 팀별 그룹 구조

현재 Studio Teams의 메인 영역은 `productionTeamOrder` 순서대로 렌더링한다.

1. `Content Team`
2. `Visual Team`
3. `Commerce Team`
4. `Operation Team`

각 팀 섹션은 다음 구조만 유지한다.

- 팀 이름
- 해당 팀의 에이전트 수 badge
- 팀에 속한 에이전트 카드 목록

팀 설명 문구는 표시하지 않는다.

`PM Supervisor`는 메인 팀 목록에서 제외하고 우측 사이드바에서만 표시한다.

## 에이전트 카드 최소 정보 규칙

에이전트 카드는 현황판용 최소 정보만 보여준다.

- 에이전트 아이콘
- 에이전트 이름
- 역할
- 상태 badge
- 팀 badge

에이전트 카드에는 다음 정보를 표시하지 않는다.

- capability 설명 문장
- current task
- command examples
- recent outputs
- progress bar
- engine/model label
- primary tool
- skills list
- 실행 버튼 또는 입력창

## 제거한 요소 목록

Phase 4 baseline에서 제거된 요소는 다음과 같다.

- 상단 Overview Stats 4개 카드
  - `Agents`
  - `Teams`
  - `Working`
  - `Standby / Review`
- 팀 제목 아래 설명 문구
- 에이전트 카드 하단 capability 설명 문구
- PM Chat 입력창
- PM Chat `Send` 버튼
- 실제 명령 실행 UI
- 실제 AI/API/OAuth/Firebase/Supabase/backend 연결

## 우측 PM Sidebar 구조

우측 사이드바는 Studio Teams의 PM 안내 패널이며, 실행용 채팅창이 아니다.

유지하는 정보:

- `PM Supervisor`
- PM Supervisor 이름
- `Lead Manager`
- `Status / Always On`
- `Team / Strategy Team`
- `Capability / 작업을 분석하고 알맞은 AI 직원에게 배정합니다.`
- `PM Chat`
- `지금은 Studio Teams 현황판입니다. 실제 작업 지시는 PM Workspace에서 이어집니다.`
- `오늘 가동 가능한 에이전트만 보여줘`

입력창과 전송 버튼은 두지 않는다.

## mock data 연결 구조

Studio Teams는 `src/data/mockData.ts`의 `studioAgents`를 사용한다.

주요 연결 방식:

- `studioAgents[0]`을 PM Supervisor로 사용한다.
- 메인 팀 섹션은 `studio-pm-supervisor`를 제외한 에이전트만 그룹별로 표시한다.
- 팀 이름은 `teamLabels`에서 매핑한다.
- 팀 순서는 `productionTeamOrder`에서 관리한다.
- 상태 텍스트는 `statusLabel`에서 매핑한다.
- 상태 badge tone은 `statusTone`에서 매핑한다.
- 에이전트 아이콘은 `agentIcons`에서 매핑한다.

실제 API 호출, OAuth, Firebase, Supabase, 백엔드 저장소, 실시간 연결은 없다. 모든 데이터는 mock UI용 정적 데이터다.

## Dashboard / PM Workspace와 역할 차이

Dashboard는 전체 제작 현황을 요약하는 관제 화면이다. 프로젝트 KPI, 대표 프로젝트, 승인 대기, 워크플로우, 최근 산출물, 메모, PM Quick Command를 다룬다.

PM Workspace는 실제 작업 지시와 산출물 검토 흐름을 보여주는 작업실이다. PM Supervisor 채팅, 프로젝트 스레드, 승인 패널, composer 입력창은 PM Workspace의 책임이다.

Studio Teams는 AI 직원 조직도와 상태 현황만 보여준다. 작업 지시, 산출물 승인, 실행 로그, 세부 설정은 이 화면의 책임이 아니다.

## 향후 확장 가능 영역

다음 항목은 향후 Phase에서 검토할 수 있지만, 현재 baseline에는 구현하지 않는다.

- 에이전트 상세 패널
- 에이전트별 profile page
- skill tree
- 작업 로그
- 팀/에이전트 필터
- 상태별 정렬
- 에이전트별 recent outputs
- workflow 연결 표시
- readiness/progress 지표
- 권한/override control
- PM Workspace로 넘기는 deep link
- 실제 AI agent orchestration 연결

확장 시에도 Dashboard와 PM Workspace의 baseline 역할을 침범하지 않아야 한다.
