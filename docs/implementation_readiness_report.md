# Creator Hub Agent OS 1차 구현 준비 보고서

작성일: 2026-05-13  
작업 기준 폴더: `D:\Projects\creator-hub-agent-os`  
디자인 기준 폴더: `D:\Projects\creator-hub-agent-os-design`

## 1. 최종 앱 방향 요약

Creator Hub Agent OS는 1인 콘텐츠 크리에이터가 여러 AI 에이전트와 제작 도구를 활용해 콘텐츠를 기획, 생성, 편집, 검수, 저장하는 AI 콘텐츠 제작 운영 웹앱이다.

최종 콘셉트는 "혼자 일하는 크리에이터를 위한 AI 콘텐츠 제작 회사 운영 OS"다. 사용자는 개별 AI 도구를 직접 관리하기보다 `PM Supervisor`에게 지시하고, PM Supervisor가 Research, Image, Video, Review 등 필요한 에이전트에게 작업을 배정하는 구조를 따른다.

1차 MVP의 핵심은 실제 AI/API 연동이 아니라, AI 제작 회사처럼 보이고 작동하는 정보 구조와 UI 골격을 만드는 것이다. 데이터는 mock data만 사용하고, 기존 `creator-hub-v1.0`은 직접 수정하지 않는다.

## 2. 디자인 기준 화면 목록

확정 기준 화면은 로컬 디자인 폴더의 산출물을 우선한다. Stitch 링크나 외부 레퍼런스보다 아래 파일을 기준으로 구현한다.

| 화면 | 기준 폴더 | 참조 파일 | 구현 의미 |
|---|---|---|---|
| Home Dashboard | `01_home_dashboard` | `screen.png`, `code.html`, `DESIGN.md` | 전체 제작 상황을 보여주는 관제센터 |
| PM Workspace | `02_pm_workspace` | `screen.png`, `code.html`, `DESIGN.md` | PM Supervisor와 대화하며 산출물을 승인/재생성하는 작업실 |
| Studio Teams | `03_agents\01_team_board` | `screen.png`, `code.html`, `DESIGN.md`, `notes.md` | 고정 AI 직원 배치도와 에이전트 상태 화면 |

공통 디자인 시스템은 `Mint Intelligence OS`다.

- 색상: Mint `#2DD4BF`, Deep Teal `#0F766E`, Emerald `#10B981`, 배경 `#F0FDFA`/`#F4FBF8`, 표면 `#FFFFFF`
- 톤: Linear 스타일, Modern SaaS, calm productivity, AI 콘텐츠 제작 스튜디오
- 레이아웃: 좌측 사이드바, 상단 바, 우측 컨텍스트 패널, 카드 기반 대시보드, 모바일 하단 내비게이션
- 타이포그래피: Inter + Pretendard
- 주의: generic admin dashboard, heavy table UI, HR dashboard 느낌 금지

참고: `00_planning\01_design_reference_map.md`는 현재 0바이트라서 본 보고서에는 실질 근거로 사용하지 않았다.

## 3. 현재 구현해야 할 페이지 목록

1차 구현 대상 페이지는 아래 6개다.

| Route | 페이지 | 우선순위 | 목적 |
|---|---|---:|---|
| `/` 또는 `/dashboard` | Home Dashboard | 1 | 4개 프로젝트의 제작 현황, KPI, 최근 산출물, 승인 대기, 워크플로우 요약 표시 |
| `/pm` | PM Workspace | 2 | PM Supervisor 채팅, 프로젝트 스레드, 산출물 승인/재생성 작업 |
| `/teams` 또는 `/agents` | Studio Teams | 3 | PM Supervisor와 AI 직원 조직도, 상태, 최근 산출물, 세션 로그 표시 |
| `/workflows` | Workflows | 4 | Brief부터 Archive까지 콘텐츠 제작 체인과 진행 상태 시각화 |
| `/artifacts` | Artifacts | 5 | 이미지, 영상, 스크립트, 문서 산출물 저장소 |
| `/connections` | AI Connections | 6 | ChatGPT, Claude, Gemini, Codex, Sora, Remotion, YouTube, Firebase 연결 상태 placeholder |

선택적으로 `/projects`는 별도 페이지로 만들 수 있으나, 1차에서는 Home Dashboard의 프로젝트 카드와 PM Workspace의 스레드가 프로젝트 탐색 역할을 대체한다. `Settings`는 네비게이션에 자리만 둘 수 있고 본 구현 범위에서는 비워 둔다.

1차 MVP 프로젝트는 4개만 사용한다.

- 지혜샘
- 시크40
- 공모전
- 스티커랩

전자책, 블로그 SEO, Remotion, 앱개발, 네이버클립, Moco & Lumi 등은 기존 데이터에는 있으나 이번 Agent OS MVP에서는 확장 후보로 보류한다.

## 4. 필요한 컴포넌트 구조

권장 구조는 TypeScript + Tailwind + component-based structure다. 기존 단일 `app.js` 구조를 그대로 확장하지 말고, 재사용 가능한 컴포넌트 단위로 분리한다.

```text
src/
  app/
    App.tsx
    routes.tsx
  components/
    shell/
      AppShell.tsx
      Sidebar.tsx
      TopBar.tsx
      MobileBottomNav.tsx
      RightPanel.tsx
    ui/
      Button.tsx
      Card.tsx
      Badge.tsx
      StatusDot.tsx
      ProgressBar.tsx
      AvatarStack.tsx
      SearchInput.tsx
      EmptyState.tsx
    dashboard/
      KpiCard.tsx
      ProjectCard.tsx
      FeaturedProjectCard.tsx
      RecentArtifactsGrid.tsx
      MemoPanel.tsx
      ApprovalQueue.tsx
      WorkflowSummary.tsx
      ConnectionMiniStatus.tsx
    pm/
      PMChat.tsx
      ChatMessage.tsx
      CommandChips.tsx
      Composer.tsx
      ProjectThreadPanel.tsx
      ApprovalSidebar.tsx
      ArtifactPreview.tsx
      VersionHistory.tsx
      StatusLog.tsx
    agents/
      TeamSection.tsx
      AgentCard.tsx
      SupervisorCard.tsx
      AgentDetailPanel.tsx
      PMStatusBar.tsx
    workflows/
      WorkflowChain.tsx
      WorkflowNode.tsx
      QueueVisualization.tsx
      WorkflowDetailPanel.tsx
    artifacts/
      ArtifactCard.tsx
      ArtifactPreviewTile.tsx
      VersionStack.tsx
    connections/
      ConnectionCard.tsx
      ProviderIcon.tsx
  data/
    mockData.ts
  types/
    creatorHub.ts
```

초기 구현에서는 `AppShell`, `Sidebar`, `TopBar`, `MobileBottomNav`, `mockData.ts`, empty routes를 먼저 만든다. 페이지별 콘텐츠는 Phase 2부터 순차 적용한다.

## 5. 필요한 mock data 구조

mock data는 실제 API/OAuth/LLM 호출을 대체하는 단일 소스다. 프로젝트, 에이전트, 워크플로우, 산출물, PM 대화, 연결 상태를 서로 참조할 수 있게 ID 기반으로 둔다.

```ts
type Project = {
  id: 'wisdom' | 'chic40' | 'contest' | 'stickerlab';
  name: string;
  status: 'ideation' | 'active' | 'review' | 'rendering' | 'completed';
  progress: number;
  currentStage: WorkflowStageId;
  activeAgentIds: string[];
  summary: string;
  nextAction: string;
  updatedAt: string;
};

type Agent = {
  id: string;
  name: string;
  role: string;
  team: 'strategy' | 'content' | 'visual' | 'operation' | 'review';
  status: 'always-on' | 'working' | 'idle' | 'queued' | 'action-needed';
  currentTask?: string;
  projectId?: Project['id'];
  skills: string[];
  baseEngine?: string;
  primaryTool?: string;
  recentArtifactIds: string[];
};

type WorkflowStageId =
  | 'brief'
  | 'research'
  | 'plan'
  | 'script'
  | 'image'
  | 'video'
  | 'edit'
  | 'review'
  | 'publish'
  | 'archive';

type WorkflowRun = {
  id: string;
  projectId: Project['id'];
  stages: Array<{
    id: WorkflowStageId;
    label: string;
    status: 'done' | 'running' | 'queued' | 'blocked' | 'idle';
    agentId?: string;
    progress?: number;
  }>;
};

type Artifact = {
  id: string;
  projectId: Project['id'];
  type: 'image' | 'video' | 'script' | 'document' | 'data';
  title: string;
  status: 'draft' | 'new' | 'approved' | 'needs-revision' | 'exported';
  previewUrl?: string;
  agentId?: string;
  version: string;
  createdAt: string;
  metadata: Record<string, string>;
};

type PMThread = {
  id: string;
  projectId: Project['id'];
  title: string;
  lastMessage: string;
  agentId?: string;
  status: 'active' | 'processing' | 'completed' | 'idle';
  updatedAt: string;
};

type Connection = {
  id: string;
  provider: 'ChatGPT' | 'Claude' | 'Gemini' | 'Codex' | 'Sora' | 'Remotion' | 'YouTube' | 'Firebase';
  status: 'connected' | 'placeholder' | 'offline';
  usageLabel?: string;
};
```

초기 데이터에는 다음 값이 반드시 있어야 한다.

- 프로젝트 4개: 지혜샘, 시크40, 공모전, 스티커랩
- 핵심 활성 에이전트: PM Supervisor, Research Agent, Image Agent, Video Agent, Review Agent
- 보조 에이전트: Planning Agent, Script Agent, Edit Agent, Publish Agent
- 기본 체인: Brief -> Research -> Plan -> Script -> Image -> Video -> Edit -> Review -> Publish -> Archive
- 산출물 샘플: 썸네일 이미지, 쇼츠 영상, 스크립트 문서, 키워드 분석 CSV, 로드맵 PDF
- PM 대화 샘플: "시크40 여름 쇼츠 5개 만들어줘."와 PM Supervisor 응답

## 6. 라우팅 구조

권장 라우팅은 단순하고 예측 가능하게 둔다.

```text
/
/dashboard
/pm
/teams
/workflows
/artifacts
/connections
/settings
```

`/`는 `/dashboard`로 리다이렉트하거나 같은 컴포넌트를 렌더링한다. 사이드바와 모바일 하단 내비게이션의 주요 항목은 Dashboard, PM, Teams, Workflows, Artifacts, Connections다.

데스크톱은 고정 사이드바 + fluid main + optional right panel 구조를 사용한다. 모바일은 사이드바를 숨기고 `MobileBottomNav`를 사용하며, PM Workspace의 우측 승인 패널은 탭 또는 접이식 패널로 전환한다.

## 7. Phase별 구현 순서

| Phase | 목표 | 산출물 | 검증 |
|---:|---|---|---|
| 0 | 구현 준비 | 본 보고서, 기존 구조 분석 | 문서만 작성, UI 코드 수정 없음 |
| 1 | AppShell & Foundation | AppShell, Sidebar, TopBar, MobileBottomNav, theme tokens, empty routes, mockData skeleton | lint/build |
| 2 | Home Dashboard | KPI, 프로젝트 카드, 최근 산출물, 메모, 승인 대기, 워크플로우/연결 요약 | 디자인 기준 `01_home_dashboard` 대조 |
| 3 | PM Workspace | PM 채팅, fixed composer, quick command chips, 프로젝트 스레드, 승인 패널, 산출물 preview | 디자인 기준 `02_pm_workspace` 대조 |
| 4 | Studio Teams | 팀 섹션, AgentCard, PM Supervisor highlight, 우측 상세 패널, 하단 PM 상태바 | 디자인 기준 `03_agents\01_team_board` 대조 |
| 5 | Workflows | 제작 체인, 노드 상태, active agent, queue, detail panel | generic kanban처럼 보이지 않는지 확인 |
| 6 | Artifacts | 산출물 카드, 이미지/영상/스크립트 preview, metadata, version stack | 단순 파일 목록처럼 보이지 않는지 확인 |
| 7 | AI Connections | provider cards, status chips, OAuth placeholder | 실제 연결/키 저장 없음 확인 |
| 8 | Mobile Optimization | 390px 기준 반응형, stacked layout, mobile tabs | horizontal overflow 없음 |
| 9 | Mock Interaction Layer | fake PM responses, approval, regenerate, save simulation | 실제 LLM 호출 없음 확인 |
| 10 | Real Integration Preparation | provider adapter placeholder, auth/API hook placeholder | 실제 API 키/OAuth 구현 금지 |

Phase마다 lint/build를 실행하고, 큰 단위 구현을 한 번에 밀어 넣지 않는다.

## 8. 기존 creator-hub-v1.0에서 유지할 것과 버릴 것

`creator-hub-v1.0`은 순수 HTML/CSS/JS 기반 로컬 앱이며, `app.js` 하나에 데이터와 로직이 크게 모여 있다. Agent OS에서는 직접 수정하지 않고 참고 자료로만 사용한다.

유지할 것:

- 로컬 우선 철학: 로그인, 서버, 실제 외부 연동 없이도 동작하는 mock 중심 구조
- 프로젝트 도메인 지식: 시크40, 지혜샘, 공모전, 스티커랩의 설명, 상태, 다음 행동, 폴더 맥락
- 공모전 후보/지시문/요강 메모처럼 콘텐츠 제작에 필요한 참고 데이터
- Codex/Claude 지시문 보관함의 운영 노하우
- Remotion 용어장과 렌더 명령어 생성 로직의 지식 구조
- JSON 내보내기/가져오기, localStorage 기반 저장 아이디어는 추후 확장 후보로 유지

버릴 것 또는 1차에서 제외할 것:

- 단일 `app.js`에 모든 기능을 넣는 구조
- 8개 이상 프로젝트를 모두 보여주는 기존 대시보드 방식
- 오늘 할 일, 자주 쓰는 링크, 네이버클립, Moco & Lumi, AFTER50LAB, 영상 제작 시스템 등 MVP 범위를 흐리는 화면
- 기존 색상/스타일을 그대로 계승하는 방식
- 공모전 허브 localStorage 직접 연동
- 실제 Remotion 렌더 명령 실행, YouTube 업로드, 외부 파일 읽기/쓰기 자동화
- 백업 스크립트 중심 운영 UI

이번 Agent OS는 기존 허브의 "작업 자료 창고" 성격을 줄이고, PM Supervisor 중심의 "AI 제작 운영실"로 재구성해야 한다.

## 9. 구현 전에 확인해야 할 위험 요소

- 현재 `creator-hub-agent-os`는 `creator-hub-v1.0` 복사본 형태에 가깝고 `package.json`/`src`가 없다. Phase 1 전에 유지형 리팩터링인지, 새 React/Vite/Tailwind 프로젝트로 전환할지 결정해야 한다.
- 디자인 기준 HTML은 Material Symbols와 Tailwind 스타일을 전제로 한다. 실제 프로젝트에서 아이콘 라이브러리를 Material Symbols로 유지할지, lucide-react로 통일할지 정해야 한다.
- `DESIGN.md`의 typography에는 일부 negative letter-spacing이 포함되어 있으나, 구현 시에는 텍스트 가독성과 현행 UI 기준을 고려해 과도한 letter-spacing 사용을 피해야 한다.
- PM Workspace는 데스크톱 3영역 구조라 모바일에서 채팅, 스레드, 승인 패널이 겹칠 위험이 크다. 모바일 탭/드로어 설계를 Phase 3부터 염두에 둬야 한다.
- Home Dashboard는 정보량이 많아 admin dashboard처럼 보일 위험이 있다. 프로젝트 preview, 제작 상태, AI 에이전트 활동감을 우선해야 한다.
- Studio Teams는 HR dashboard처럼 보이면 콘셉트가 흐려진다. "고정 AI 직원"과 "제작 작업 배정 현황"을 중심으로 구성해야 한다.
- 실제 API/OAuth 연결 UI를 만들더라도 버튼이 실제 인증을 시도하면 안 된다. 모든 연결 상태는 placeholder/mock이어야 한다.
- 기존 데이터에는 2026년 공모전 날짜와 외부 링크가 포함되어 있다. mock data로 사용할 때는 "실시간 정보"처럼 표현하지 말고 샘플 데이터로만 표시한다.
- 1차 MVP는 4개 프로젝트만 사용한다. 기존 8개 프로젝트를 자동 이식하면 화면 초점이 흐려진다.

## 10. 다음 Codex 작업 지시안

다음 작업자는 아래 지시를 그대로 사용하면 된다.

```text
D:\Projects\creator-hub-agent-os 작업입니다.

목표:
Creator Hub Agent OS Phase 1 - AppShell & Foundation을 구현해주세요.

반드시 먼저 읽을 문서:
- D:\Projects\creator-hub-agent-os\docs\implementation_readiness_report.md
- D:\Projects\creator-hub-agent-os-design\00_planning\00_current_direction.md
- D:\Projects\creator-hub-agent-os-design\00_planning\02_codex_phase_plan.md
- D:\Projects\creator-hub-agent-os-design\01_home_dashboard\DESIGN.md

주의:
- 기존 D:\Projects\creator-hub-v1.0은 수정하지 마세요.
- 실제 API/OAuth/LLM 호출을 만들지 마세요.
- 이번 Phase에서는 실제 페이지 콘텐츠를 완성하지 말고, AppShell, 라우팅, 테마, mock data skeleton, empty route만 만드세요.
- generic admin dashboard처럼 보이지 않도록 Mint Intelligence OS 디자인 토큰을 먼저 반영하세요.

구현 범위:
1. 프로젝트 구조를 React + TypeScript + Tailwind 기반으로 정리할 수 있는지 확인
2. AppShell, Sidebar, TopBar, MobileBottomNav 생성
3. routes: /dashboard, /pm, /teams, /workflows, /artifacts, /connections, /settings 생성
4. 각 route는 아직 placeholder만 표시
5. src/data/mockData.ts와 src/types/creatorHub.ts 생성
6. 4개 MVP 프로젝트와 핵심 에이전트 mock skeleton 작성
7. lint/build 실행

완료 후 보고:
- 변경 파일 목록
- 실행/검증 명령 결과
- Phase 2 Home Dashboard로 넘어가기 전 남은 결정사항
```

