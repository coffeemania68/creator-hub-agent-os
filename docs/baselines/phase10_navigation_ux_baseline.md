# Phase 10 Navigation & UX Baseline

Status: locked baseline  
Scope: AppShell navigation, route metadata, shared shell hierarchy  
Primary files:

- `src/components/shell/Sidebar.tsx`
- `src/components/shell/MobileBottomNav.tsx`
- `src/components/shell/TopBar.tsx`
- `src/app/routes.tsx`
- `src/components/ui/Badge.tsx`

## Phase 10 목적

Phase 10은 새 기능을 추가하는 단계가 아니라, Phase 2부터 Phase 9까지 구현된 화면들이 하나의 Creator Hub Agent OS처럼 느껴지도록 navigation, hierarchy, spacing, badge behavior, shell density를 정리한 단계다.

이 baseline은 Dashboard, PM Workspace, Studio Teams, Artifacts, Settings / Integrations, Workflows, Projects, Command Templates의 본문 역할을 변경하지 않는다. 공통 shell에서 이동 구조와 표시 기준을 정리하는 것이 목적이다.

## Sidebar 그룹 구조

데스크톱 Sidebar는 `Creator Hub Agent OS` 브랜드, `Quick Production Brief` 버튼, route navigation, `OS Mode` 상태 영역으로 구성한다.

Sidebar route는 두 그룹으로 나눈다.

### Operate

운영자가 자주 진입하는 실행/관리 중심 화면이다.

- `/dashboard` - Dashboard
- `/projects` - Projects
- `/pm` - PM Workspace
- `/commands` - Commands

### Studio OS

제작 시스템, 산출물, 연결 설정을 관리하는 화면이다.

- `/teams` - Studio Teams
- `/workflows` - Workflows
- `/artifacts` - Artifacts
- `/connections` - Integrations
- `/settings` - Settings

각 route row에는 icon, label, phase 축약 표기(`P2`, `P3` 등)를 표시한다. Sidebar는 route 배열의 선언 순서에 의존하지 않고, 그룹별 `paths` 순서로 표시한다.

## 모바일 하단 nav 구조

모바일 하단 nav는 5개 주요 진입점만 노출한다.

- `/dashboard` - `Home`
- `/projects` - `Proj`
- `/pm` - `PM`
- `/commands` - `Cmd`
- `/settings` - `More`

이 구조는 모바일에서 모든 화면을 한 줄에 과도하게 노출하지 않고, 운영 흐름의 핵심 진입점만 유지하기 위한 기준이다. Studio Teams, Workflows, Artifacts, Integrations는 데스크톱 Sidebar 또는 이후 More/Settings 흐름에서 확장할 수 있다.

## TopBar 검색 문구 기준

TopBar의 공통 search placeholder는 다음 문구를 기준으로 유지한다.

```text
Search projects, commands, artifacts
```

검색 UI는 현재 mock control이며 실제 검색 API, backend query, 실시간 indexing과 연결하지 않는다. 문구는 Creator Hub Agent OS에서 가장 자주 찾는 단위인 projects, commands, artifacts를 중심으로 둔다.

## route phase 표기 기준

`src/app/routes.tsx`의 `phase` 값은 각 baseline 문서와 맞아야 한다.

- Dashboard: `Phase 2`
- PM Workspace: `Phase 3`
- Studio Teams: `Phase 4`
- Artifacts: `Phase 5`
- Integrations / Settings: `Phase 6`
- Workflows: `Phase 7`
- Projects: `Phase 8`
- Command Templates: `Phase 9`

Sidebar에서는 `Phase 2`를 `P2`처럼 축약해서 보여준다. route phase 표기는 기능 상태가 아니라 baseline ownership을 표시하는 navigation metadata다.

## Badge 모바일 줄바꿈 방지 규칙

공통 `Badge` 컴포넌트는 `whitespace-nowrap`를 유지한다.

목적:

- 좁은 카드, 모바일 layout, grid/list 전환 시 badge text가 두 줄로 갈라지는 것을 방지한다.
- 상태 badge가 카드 높이를 불필요하게 밀어내지 않도록 한다.
- draft, review, approved, queued, connected 같은 mock 상태 표시의 밀도를 통일한다.

긴 상태명을 추가해야 할 때는 badge 자체를 줄바꿈시키지 말고, 상태 label을 짧게 정리해야 한다.

## 제거한 shell utility 요소

Phase 10에서 Sidebar의 중복 보조 위젯을 제거했다.

제거한 요소:

- `Studio Activity`
- `Recent Active`
- `Daily Learning`
- `Today Focus`
- 기존 `shellUtilities` 렌더링 영역

제거 이유:

- Dashboard, Projects, Workflows, Artifacts의 본문 정보와 역할이 중복된다.
- Sidebar가 navigation보다 dashboard sidebar처럼 보이게 만든다.
- 전체 OS의 이동 구조보다 임시 mock 상태 정보가 더 크게 보이는 문제가 있다.

대신 Sidebar 하단에는 compact한 `OS Mode` 영역만 유지한다.

유지 내용:

- `PM Supervisor` / `Always On`
- `Data Boundary` / `Mock UI`

## 기존 페이지 본문 UI 미수정 원칙

Phase 10에서는 다음 페이지의 본문 UI와 기능을 수정하지 않는다.

- Dashboard
- PM Workspace
- Studio Teams
- Artifacts
- Settings / Integrations
- Workflows
- Projects
- Command Templates

각 페이지는 기존 baseline 역할을 유지한다. Phase 10의 변경은 공통 shell, route metadata, navigation 표시, badge behavior처럼 모든 화면을 감싸는 UX 기준에 한정한다.

## 향후 실제 연결 전 유지해야 할 navigation 기준

실제 API, GitHub, Cloudflare, OAuth, backend, queue, database 연결 전까지는 다음 기준을 유지한다.

- AppShell 구조를 유지한다.
- Sidebar는 route navigation 중심으로 유지하고, 페이지별 상세 상태 위젯을 다시 늘리지 않는다.
- 모바일 하단 nav는 핵심 진입점 5개를 유지한다.
- TopBar 검색은 mock UI이며 실제 provider/API 호출과 연결하지 않는다.
- route phase는 baseline 문서와 일치해야 한다.
- Settings / Integrations는 실제 OAuth/API 연결 전까지 mock connection 상태만 보여준다.
- PM Workspace는 명령 화면, Workflows는 흐름 지도, Artifacts는 결과물 보관함, Projects는 프로젝트 포트폴리오로 역할을 분리한다.
- Dashboard와 Projects 사이에 같은 상세 정보가 반복되지 않도록 한다.
- Workflows와 PM Workspace 사이에 실행 기능이 중복 구현되지 않도록 한다.
- Artifacts와 Projects sidebar가 같은 산출물 요약을 과도하게 반복하지 않도록 한다.
- 설명 문장보다 상태, 분류, action affordance가 먼저 보이도록 유지한다.

## 구현 금지 상태

Phase 10 baseline에서는 다음을 구현하지 않는다.

- 실제 AI/API 호출
- 실제 OAuth flow
- GitHub 연결
- Cloudflare 연결
- Firebase/Supabase/backend 연결
- 실제 검색
- 실제 command 실행
- 실제 file upload/download/share
- 실제 workflow automation
- 새 대형 기능 추가

이 문서는 navigation과 UX shell 기준을 잠그기 위한 baseline이며, 기능 구현 문서가 아니다.
