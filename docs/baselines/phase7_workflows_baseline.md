# Phase 7 Workflow System Baseline

Status: locked baseline  
Route: `/workflows`  
Primary file: `src/pages/WorkflowsPage.tsx`

## 화면 목적

Workflow System은 Creator Hub Agent OS의 작업 흐름 지도다. Dashboard처럼 전체 운영 상태를 요약하는 화면도 아니고, PM Workspace처럼 사용자가 명령을 입력하는 화면도 아니다.

이 화면은 `어떤 작업이 어떤 Agent를 거쳐 어떻게 진행되는지`를 시각적으로 보여주는 mock workflow map이다. 자동화 파이프라인의 흐름을 직관적으로 확인하는 것이 목적이며, 실제 queue 실행이나 agent orchestration은 수행하지 않는다.

## 유지해야 할 workflow 레이아웃 구조

- 기존 `AppShell`, `Sidebar`, `TopBar`, `MobileBottomNav` 안에서 렌더링한다.
- `/workflows` route는 `WorkflowsPage`를 렌더링한다.
- 페이지 내부는 데스크톱 기준 `main workflow map + right execution sidebar` 2열 구조를 유지한다.
  - 메인 영역: Workflow Map summary, 프로젝트별 workflow chain card
  - 우측 사이드바: Execution Timeline, Workflow Boundary
- 메인 영역의 최대 폭은 기존 Dashboard/Artifacts/Settings 계열과 맞춰 `max-w-[1440px]` 안에서 정리한다.
- workflow chain card 안의 단계는 데스크톱에서 6단계 grid로 보여준다.
- 모바일에서는 summary, workflow chain cards, timeline sidebar가 자연스럽게 세로 스택되어야 한다.
- Dashboard, PM Workspace, Studio Teams, Artifacts, Settings / Integrations 파일과 레이아웃은 Workflow 작업 중 수정하지 않는다.

## workflow 단계 규칙

현재 화면용 pipeline 단계는 `pipelineStages`에서 관리한다.

1. `Brief`
2. `Research`
3. `Script`
4. `Visual`
5. `Render`
6. `Publish`

단계 매핑:

- `brief` -> `Brief`
- `research` -> `Research`
- `script` -> `Script`
- `image` -> `Visual`
- `video` -> `Render`
- `publish` -> `Publish`

각 단계 카드는 다음 정보를 표시한다.

- 단계 icon
- 단계명
- 담당 agent 이름
- 단계 status icon
- 단계 progress bar

Workflow card 상단에는 프로젝트 shortName, workflow title, active status badge, completion percent를 표시한다.

## 상태 badge 규칙

화면용 상태 타입은 `PipelineStatus`다.

- `waiting`
- `running`
- `review`
- `completed`

상태 표시 규칙:

- `waiting`: 아직 대기 중인 단계
- `running`: 현재 진행 중인 단계
- `review`: 검토가 필요한 흐름
- `completed`: 완료된 단계

상태 매핑:

- `WorkflowStageStatus.done` -> `completed`
- `WorkflowStageStatus.running` -> `running`
- `WorkflowStageStatus.queued`, `idle`, `blocked` -> `waiting`
- 프로젝트 상태가 `review`이고 단계가 `image` 또는 `video`인 경우 -> `review`

상태 label, badge tone, icon은 각각 `statusLabel`, `statusTone`, `statusIcon`에서 매핑한다.

ProgressBar tone은 현재 컴포넌트 계약에 맞춰 `review` 상태는 `danger`, 그 외 active 흐름은 `primary`를 사용한다.

## 프로젝트별 workflow 구조

Workflow System은 `workflowRuns`를 기준으로 4개 MVP 프로젝트의 chain을 렌더링한다.

- `지혜샘`
- `시크40`
- `공모전`
- `스티커랩`

각 workflow는 다음 mock data를 조합해 표시한다.

- `workflowRuns`: 프로젝트별 단계 목록, stage status, 담당 agent id
- `projects`: project shortName, progress, status, updatedAt
- `agents`: 단계 담당 agent 이름

`buildPipelineSteps`는 `workflowRuns`의 원본 stage를 화면용 6단계 pipeline으로 변환한다. `mapWorkflowStatus`는 mock workflow stage 상태를 화면용 `PipelineStatus`로 변환한다.

## mock execution timeline 구조

우측 `Execution Timeline`은 실제 job queue가 아니라 `agentQueue` mock data를 읽어 표시하는 timeline preview다.

각 timeline item은 다음 정보를 보여준다.

- 프로젝트 shortName
- artifact type
- queue status badge
- 담당 agent 이름
- eta

현재 timeline status tone:

- `running` -> active
- `review` -> danger
- 그 외 상태 -> muted

`Workflow Boundary` 패널은 현재 화면이 mock 상태 표시용이며 실제 queue, automation engine, agent orchestration을 연결하지 않는다는 점을 명시한다.

## Dashboard / PM Workspace / Studio Teams / Artifacts / Settings 와의 역할 차이

Dashboard는 전체 제작 현황을 요약하는 관제 화면이다. workflow 상태를 일부 보여줄 수 있지만, 상세 흐름 지도는 Workflow System의 책임이다.

PM Workspace는 사용자가 PM Supervisor에게 지시하고 산출물 승인/재생성 흐름을 확인하는 작업실이다. 실제 명령 입력과 승인 UX는 PM Workspace의 책임이다.

Studio Teams는 AI 직원 조직도와 에이전트 상태를 보여주는 화면이다. 어떤 agent가 있는지 설명하지만, 프로젝트별 작업 흐름 지도는 아니다.

Artifacts는 생성된 결과물을 확인/정리하는 보관함이다. 산출물 자체의 상태와 메타데이터를 다루며, 단계별 생산 흐름은 Workflow System에서 본다.

Settings / Integrations는 provider 연결 준비 상태와 환경 변수 안내를 보여주는 foundation 화면이다. workflow 실행 엔진이나 provider 호출은 이 화면에서도 구현하지 않는다.

Workflow System은 프로젝트별 제작 chain과 단계별 agent handoff를 시각적으로 보여주는 흐름 관리 화면이다.

## 실제 automation engine과 현재 mock workflow의 차이

현재 mock workflow:

- 정적 mock data를 화면에 렌더링한다.
- 단계 status는 `workflowRuns`, `projects`, `agentQueue`에서 파생한다.
- progress는 UI 표시용 숫자다.
- timeline은 mock queue signal이다.
- 버튼, drag/drop, 실행 mutation이 없다.
- background job이나 agent orchestration을 시작하지 않는다.

실제 automation engine:

- 서버 또는 worker queue에서 job을 생성/실행한다.
- agent handoff, retry, failure handling, timeout을 관리한다.
- stage transition을 실제 상태 저장소에 기록한다.
- workflow run id, execution log, artifact output을 연결한다.
- 실시간 업데이트 또는 polling이 필요하다.
- 사용자 권한, provider connection, secret management와 연결된다.

현재 Phase 7 baseline은 실제 automation engine 구현 전의 시각적 foundation이다.

## 제거/미구현한 기능

현재 Phase 7 baseline에는 다음 기능을 구현하지 않는다.

- 실제 drag/drop
- 실제 workflow 실행
- 실제 queue orchestration
- 실제 automation engine
- 실제 background jobs
- stage mutation
- retry / cancel / pause
- agent handoff execution
- 실시간 status sync
- server polling
- websocket 연결
- workflow editor
- conditional branch editor
- artifact 생성 트리거
- provider API 호출

## 향후 확장 가능 영역

다음 항목은 향후 Phase에서 검토할 수 있지만, 현재 baseline에는 구현하지 않는다.

- workflow detail page
- workflow run history
- stage log drawer
- execution trace
- 실패/재시도 상태
- 단계별 artifact output 연결
- PM Workspace deep link
- Artifacts detail deep link
- agent handoff map
- workflow template library
- conditional branching
- manual approval gates
- queue worker integration
- realtime run updates
- automation engine backend

확장 시에도 Dashboard, PM Workspace, Studio Teams, Artifacts, Settings / Integrations의 baseline 역할을 침범하지 않아야 한다.
