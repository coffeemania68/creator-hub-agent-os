# Phase 8 Projects Temporary Baseline

Status: temporary baseline  
Route: `/projects`  
Primary file: `src/pages/ProjectsPage.tsx`

## 기준 파일 상태

현재 `D:\Projects\creator-hub-agent-os-design\07_projects` 폴더에는 `screen.png`, `code.html`, `DESIGN.md` 같은 디자인 기준 파일이 없다.

또한 `D:\Projects\creator-hub-agent-os-design\08_settings` 폴더도 비어 있으므로 이번 Phase 8 Projects 작업에는 사용하지 않는다.

따라서 현재 Projects 화면은 디자인 기준 파일을 반영한 최종 baseline이 아니라, 기존 Creator Hub Agent OS의 AppShell/UI 패턴을 바탕으로 만든 임시 baseline이다.

## 화면 목적

Projects 화면은 4개 MVP 프로젝트를 한 곳에서 확인하는 portfolio board다. Dashboard처럼 전체 운영 신호를 요약하는 관제 화면도 아니고, PM Workspace처럼 작업을 지시하는 화면도 아니다.

이 화면의 목적은 각 프로젝트의 목적, 도메인, 진행률, 현재 단계, 담당 agent 수, 산출물 수, workflow stage 진행 상황을 빠르게 비교하는 것이다.

현재 표시하는 프로젝트:

- 지혜샘 시니어 라이프
- 시크40
- 공모전
- 스티커랩

## 임시 baseline 성격

현재 `/projects` 구현은 다음 기준으로 만들어졌다.

- 기존 `AppShell`, `Sidebar`, `TopBar`, `MobileBottomNav` 구조 유지
- 기존 Dashboard / Artifacts / Workflows 계열의 2열 레이아웃 패턴 참고
- 기존 `Card`, `Badge`, `ProgressBar` 공용 UI 사용
- 기존 mock data만 사용
- 실제 생성, 삭제, 편집, 배포 기능 없이 mock portfolio 현황만 표시

나중에 `07_projects` 디자인 기준 파일이 생기면 이 임시 baseline은 재검토해야 한다. 특히 화면 정보 밀도, 카드 구조, 프로젝트 상세 진입 방식, 우측 패널 구성은 디자인 기준이 생긴 뒤 다시 맞춰야 한다.

## 유지해야 할 구조

- `/projects` route는 `ProjectsPage`를 렌더링한다.
- 페이지 내부는 데스크톱 기준 `main project board + right project sidebar` 2열 구조를 유지한다.
  - 메인 영역: Project Toolbar, project card grid
  - 우측 사이드바: Portfolio Status, Recent Updates, Project Boundary
- 메인 영역의 최대 폭은 기존 Dashboard/Artifacts/Workflows 계열과 맞춰 `max-w-[1440px]` 안에서 정리한다.
- 프로젝트 카드는 데스크톱에서 2열 grid로 표시한다.
- 모바일에서는 toolbar, project cards, sidebar가 자연스럽게 세로 스택되어야 한다.

## Project Toolbar 구조

Toolbar는 다음 요소를 유지한다.

- `Project Portfolio` eyebrow
- `MVP production lines` heading
- `Mock project board` badge
- search input
- status filter chips
- priority filter chips

검색은 local state와 mock data 기반이며 외부 검색 API를 호출하지 않는다.

상태 필터:

- `all`
- `ideation`
- `active`
- `review`
- `rendering`
- `completed`

priority 필터:

- `all`
- `high`
- `medium`
- `low`

## Project Card 구조

각 프로젝트 카드는 다음 정보를 표시한다.

- 프로젝트 visual gradient band
- project shortName
- project name
- domain
- status badge
- next action
- current stage
- progress bar
- agent count
- artifact count
- workflow stage completion count
- channel tags
- mock `Open` button

`Open` 버튼은 실제 navigation, detail open, mutation을 수행하지 않는 mock control이다.

## mock data 연결 구조

Projects 화면은 기존 mock data를 조합해 표시한다.

- `projects`: 프로젝트 기본 정보, 진행률, 상태, currentStage, activeAgentIds, nextAction, channels, priority, visualTheme, updatedAt
- `agents`: 프로젝트별 active agent count 계산
- `artifacts`: 프로젝트별 artifact count 계산
- `workflowRuns`: 프로젝트별 completed stage count 계산

현재 Phase 8 temporary baseline에서는 새로운 mock type이나 data structure를 추가하지 않는다.

## 우측 Sidebar 구조

우측 패널은 프로젝트 portfolio 상태를 요약한다.

- `Portfolio Status`
  - 현재 필터 결과 project count
  - active project count
  - high priority project count
- `Recent Updates`
  - `updatedAt` 기준 프로젝트 목록
  - project shortName, status badge, nextAction
- `Project Boundary`
  - 실제 생성, 삭제, 배포 기능이 없다는 안내

## 기존 페이지 미수정 원칙

현재 Projects 구현 중 다음 화면은 수정하지 않았다.

- Dashboard
- PM Workspace
- Studio Teams
- Artifacts
- Settings / Integrations
- Workflows

Settings / Integrations는 Phase 6 baseline을 유지한다. `08_settings` 폴더가 비어 있으므로 이번 단계에서 사용하지 않는다.

## 향후 재검토 필요 항목

`07_projects` 디자인 기준 파일이 추가되면 다음 항목을 재검토한다.

- project card density
- visual band 사용 여부
- project detail 진입 방식
- right sidebar 구성
- filter 위치와 종류
- 프로젝트별 timeline 또는 artifact preview 포함 여부
- Dashboard와 정보 중복 정도
- Workflows / Artifacts와 deep link 연결 방식
- 모바일 카드 높이와 정보 우선순위

현재 문서는 최종 디자인 baseline이 아니라 임시 baseline이다.
