# Creator Hub Agent OS Implementation Plan

작성일: 2026-05-13  
작업 폴더: `D:\Projects\creator-hub-agent-os`  
주의: 이 문서는 구현 전 계획서다. 현재 단계에서는 UI 코드, 앱 로직, 데이터 파일을 수정하지 않는다.

## 1. 에이전트 조직 구조

### 핵심 원칙

Creator Hub Agent OS는 사용자가 여러 에이전트와 직접 대화하는 구조가 아니다. 사용자는 **PM Supervisor**에게만 지시하고, PM Supervisor가 요청을 분석한 뒤 필요한 전문 에이전트에게 작업을 배정한다.

운영 원칙:

- 에이전트는 프로젝트별로 새로 만들지 않는다.
- 에이전트는 고정된 직원처럼 존재한다.
- 프로젝트마다 필요한 에이전트만 ON/OFF로 선택한다.
- 사용자는 PM에게 지시하고 PM이 에이전트를 운영한다.
- 전문 에이전트의 작업 과정은 채팅 안에서 "PM의 배정/중계/취합 로그"로 표시한다.

### 1차 MVP 에이전트 구성

1차 MVP는 **PM Supervisor + 전문 에이전트 8명**으로 구성한다.

| 구분 | 에이전트 | 역할 |
| --- | --- | --- |
| 지휘 | PM Supervisor | 사용자 요청 접수, 프로젝트 판단, 작업 분해, 필요한 에이전트 호출, 결과물 취합, 사용자에게 최종 보고, 승인 필요 여부 판단 |
| 조사 | Research Agent | 자료조사, 공식자료 확인, 트렌드 조사, 레퍼런스 수집, 키워드 정리 |
| 기획 | Planning Agent | 콘텐츠 기획, 콘셉트 설계, 후킹 구조 설계, 콘텐츠 흐름 구성, 프로젝트별 제작 방향 정리 |
| 작성 | Script Agent | 대본 작성, 숏폼 자막 작성, 롱폼 내레이션 작성, 블로그 초안 작성, 업로드 문구 초안 작성 |
| 이미지 | Image Agent | 이미지 콘셉트 설계, 이미지 프롬프트 작성, 허브 내부 이미지 생성 요청, 썸네일 방향 제안, 생성 이미지 저장/수정 관리 |
| 영상 | Video Agent | 영상 컷 구성, 영상 프롬프트 작성, 허브 내부 영상 생성 요청, 장면별 영상 상태 관리, 영상 후보 비교 |
| 편집 | Edit Agent | Remotion 작업 지시, 자막 구성, 컷 편집 구조 설계, 렌더링 지시, 파일 경로/출력물 관리 |
| 배포 | Publish Agent | 제목 작성, 설명문 작성, 태그 작성, 고정 댓글 작성, 플랫폼별 업로드 메타데이터 작성 |
| 검수 | Review Agent | 최종 검수, 톤 검수, 누락 체크, 제출 조건 확인, 저작권/표기/공모전 조건 점검 |

### UI에 반영할 조직 구조

- PM Supervisor는 채팅창의 유일한 대화 대상이다.
- 전문 에이전트는 에이전트 카드, 워크플로우 노드, 작업 로그, 결과물 메타데이터에 표시한다.
- 전문 에이전트 카드에는 직접 채팅 버튼을 두지 않는다.
- 전문 에이전트 제어는 프로젝트 설정의 ON/OFF, 작업 일시정지, 로그 보기, 결과물 보기 중심으로 제한한다.
- PM Supervisor는 항상 ON이며 프로젝트에서 끌 수 없다.

## 2. 콘텐츠 체인 구조

### 기본 제작 체인

모든 프로젝트는 하나의 기본 체인을 기준으로 시작한다.

`Brief -> Research -> Plan -> Script -> Image -> Video -> Edit -> Publish -> Review -> Archive`

프로젝트마다 필요 없는 단계는 OFF 처리한다. PM Supervisor가 체인을 생성하고, 단계별 담당 에이전트에게 작업을 배정한다.

### 단계별 정의

| 단계 | 담당 기본 에이전트 | 설명 | 대표 산출물 |
| --- | --- | --- | --- |
| Brief | PM Supervisor | 사용자가 원하는 작업을 입력하는 단계 | 사용자 요청, 프로젝트 목표, 제약조건 |
| Research | Research Agent | 공식자료, 트렌드, 참고자료, 키워드, 타깃 분석 정리 | 리서치 브리프, 출처 목록, 키워드 |
| Plan | Planning Agent | 콘셉트, 메시지, 타깃, 콘텐츠 흐름, 제작 전략 정리 | 기획안, 콘텐츠 흐름, 후킹 구조 |
| Script | Script Agent | 롱폼 대본, 숏폼 자막, 블로그 초안, 업로드 문구 작성 | 대본, 자막, 내레이션, 문구 초안 |
| Image | Image Agent | 이미지 콘셉트, 썸네일 방향, 이미지 프롬프트, 생성 이미지 관리 | 이미지 프롬프트, 썸네일 방향, 이미지 후보 |
| Video | Video Agent | 컷 구성, 장면별 영상 프롬프트, 영상 생성 상태, 후보 비교 | 컷 리스트, 영상 프롬프트, 영상 후보 |
| Edit | Edit Agent | 자막, 컷 편집, Remotion 지시서, 렌더링, 파일 구조 관리 | 편집 지시서, 렌더 결과, 파일 경로 |
| Publish | Publish Agent | 제목, 설명, 태그, 고정 댓글, 플랫폼별 메타데이터 작성 | 업로드 패키지, 제목 후보, 태그 |
| Review | Review Agent | 톤, 오류, 누락, 제출 조건, 저작권, 브랜드 방향 확인 | 검수 리포트, 승인/수정 요청 |
| Archive | PM Supervisor | 완성된 산출물을 프로젝트 자산으로 저장 | 저장된 결과물, 버전, 최종 보고 |

### 프로젝트별 체인 프리셋

| 프로젝트 유형 | 기본 체인 |
| --- | --- |
| 시크40 | Brief -> Plan -> Image -> Video -> Edit -> Publish -> Archive |
| 지혜샘 | Brief -> Research -> Script -> Image -> TTS -> Edit -> Publish -> Archive |
| 공모전 | Brief -> Research -> Plan -> Script -> Image -> Video -> Review -> Submit |
| 스티커랩 | Brief -> Research -> Plan -> Image -> Review -> Package -> Submit |
| 블로그 SEO | Brief -> Research -> Plan -> Script -> SEO -> Review -> Publish |
| 전자책 | Brief -> Research -> Plan -> Script -> Review -> Package -> Publish |

### 체인 UI 원칙

- 사용자는 현재 단계와 담당 에이전트를 시각적으로 확인할 수 있어야 한다.
- 각 단계는 완료, 진행중, 대기, 오류, 승인 대기 상태를 가진다.
- 기본 체인은 하나로 통일하되, 프로젝트별 preset이 단계 ON/OFF를 조정한다.
- 체인에 없는 확장 단계인 TTS, SEO, Package, Submit은 MVP에서는 커스텀 단계로 표현한다.

## 3. 1차 MVP 범위

### 1차 목표

1차 MVP는 완전 자동화 앱이 아니다. 목표는 **AI 콘텐츠 제작 흐름을 한눈에 보고 관리할 수 있는 반자동 제작 허브**를 만드는 것이다.

MVP 원칙:

- 먼저 보이는 구조를 만든다.
- 실제 연결은 나중에 붙인다.
- 기능보다 UX와 정보 구조를 우선한다.
- 초보자도 "어디서 시작해야 하는지" 바로 알 수 있어야 한다.

### 반드시 구현할 기능

| 기능 | 포함 내용 |
| --- | --- |
| 홈 대시보드 | 프로젝트 카드, 오늘의 작업, 최근 결과물, 진행 중인 작업, AI 연결 상태 요약 |
| 프로젝트 카드 | 프로젝트명, 상태, 최근 작업, 진행률, 작업창 열기 버튼 |
| PM 채팅창 | 사용자가 PM에게 작업 지시, PM의 작업 분해, 필요한 에이전트 호출 표시, 결과물 생성/저장 가능 |
| 에이전트 카드 | 에이전트명, 역할, 상태, 현재 작업, 최근 결과물, ON/OFF 상태 |
| 프로젝트별 에이전트 ON/OFF | 프로젝트마다 필요한 에이전트 선택, 자동화 수준 설정, 기본 권한 표시 |
| 워크플로우 체인 | 기본 체인 표시, 현재 단계 표시, 담당 에이전트 표시, 완료/진행중/대기 상태 표시 |
| 결과물 저장 패널 | 대본, 프롬프트, 이미지, 영상, 업로드 문구, 공모전 기획서, 블로그 초안, 버전 관리 기초 구조 |
| AI 연결 상태 UI | ChatGPT, Claude, Gemini, Codex, Google Drive, YouTube, Firebase 연결 가능 구조와 상태 표시 |
| 모바일 반응형 | 모바일 하단 네비게이션, 카드형 UI, 큰 버튼, 탭 전환형 작업창 |

### 1차에서 제외할 기능

- 실제 OAuth 완전 구현
- 실제 YouTube 자동 업로드
- 실제 영상 생성 API 완전 연결
- 비용/토큰 상세 분석
- 멀티 슈퍼바이저
- 복잡한 권한 시스템
- 완전 자동화 체인
- 고급 승인 정책
- 조직도 애니메이션
- 복잡한 통계 대시보드

### 연결 상태 UI의 범위

1차에서는 실제 연결 완료가 아니라 "연결 가능한 구조와 UI"만 만든다.

| 서비스 | 1차 표시 상태 |
| --- | --- |
| ChatGPT | Connected / Not Connected / Coming Soon |
| Claude | Connected / Not Connected / Coming Soon |
| Gemini | Connected / Not Connected / Coming Soon |
| Codex | Connected / Not Connected / Coming Soon |
| Google Drive | Not Connected / OAuth Later |
| YouTube | Not Connected / OAuth Later |
| Firebase | Connected / Local / Not Configured |

## 4. 필요한 화면 목록

### 1차 화면 구조

| 화면 | 목적 | 핵심 요소 |
| --- | --- | --- |
| Home Dashboard | 전체 운영 상황을 한눈에 확인 | 프로젝트 카드, 오늘의 작업, 진행 중인 작업, 최근 결과물, AI 연결 요약 |
| Project Workspace | 특정 프로젝트의 작업 공간 | PM 채팅, 워크플로우 체인, 결과물 패널, 프로젝트 상태 |
| PM Chat | 사용자가 PM에게 지시하는 중심 화면 | 대화 thread, composer, 에이전트 호출 로그, 승인 요청, 결과물 카드 |
| Agents | 고정 직원형 에이전트 상태 관리 | 9개 에이전트 카드, 상태, 현재 작업, ON/OFF 요약 |
| Workflow | 콘텐츠 체인 시각화 | 단계 노드, 담당 에이전트, 상태, 로그, 재실행 버튼 |
| Artifacts | 결과물 저장소 | 결과물 목록, preview, 버전, 저장 위치, 승인 상태 |
| Project Settings | 프로젝트별 자동화 설정 | 에이전트 ON/OFF, 자동화 수준, 기본 권한, 체인 preset |
| Connections | AI/외부 서비스 연결 상태 | ChatGPT, Claude, Gemini, Codex, Google Drive, YouTube, Firebase |

### 모바일 화면 구조

- 하단 네비게이션: Home / Chat / Workflow / Artifacts / Settings
- Project Workspace는 탭 전환형으로 구성: `PM`, `Chain`, `Files`, `Agents`
- 모바일에서는 대시보드와 상세 패널을 동시에 보여주지 않고, 한 화면 한 작업 원칙을 적용한다.

## 5. 필요한 컴포넌트 목록

### 공통 레이아웃

- `AppShell`: 데스크톱 좌측 내비게이션과 모바일 하단 네비게이션을 포함한 기본 shell
- `TopBar`: 현재 프로젝트, 검색, 연결 상태, 주요 액션 표시
- `MobileBottomNav`: 모바일 하단 네비게이션
- `PanelTabs`: 모바일/좁은 화면에서 작업 패널 전환

### 대시보드

- `DashboardSummary`
- `ProjectCard`
- `TodayTaskList`
- `ActiveWorkList`
- `RecentArtifactList`
- `ConnectionStatusStrip`

### PM 채팅

- `PMChatThread`
- `PMMessage`
- `UserBriefMessage`
- `PMPlanMessage`
- `AgentHandoffCard`
- `AgentProgressCard`
- `ToolCallCard`
- `ApprovalRequestCard`
- `ArtifactResultCard`
- `PMComposer`
- `PromptTemplateMenu`

### 에이전트

- `AgentRoster`
- `AgentCard`
- `AgentStatusBadge`
- `AgentPermissionSummary`
- `AgentOnOffToggle`
- `AgentWorkLog`

### 워크플로우

- `WorkflowChain`
- `WorkflowNode`
- `WorkflowEdge`
- `WorkflowStatusBadge`
- `WorkflowGate`
- `WorkflowNodeDetailPanel`
- `WorkflowPresetSelector`

### 결과물

- `ArtifactPanel`
- `ArtifactList`
- `ArtifactCard`
- `ArtifactPreview`
- `ArtifactMetadata`
- `ArtifactVersionList`
- `SaveToProjectControl`
- `ApprovalStatusControl`

### 설정/연결

- `ProjectAgentSettings`
- `AutomationLevelControl`
- `PermissionChecklist`
- `ConnectionCard`
- `ConnectionStatusBadge`

## 6. 데이터 모델 초안

### Agent

```ts
type Agent = {
  id: string;
  name: string;
  role: "supervisor" | "research" | "planning" | "script" | "image" | "video" | "edit" | "publish" | "review";
  description: string;
  capabilities: string[];
  status: "idle" | "working" | "blocked" | "waiting_approval" | "error";
  currentTaskId?: string;
  recentArtifactIds: string[];
  isGlobalEnabled: boolean;
};
```

### Project

```ts
type Project = {
  id: string;
  name: string;
  type: "chic40" | "jihyesam" | "contest" | "sticker_lab" | "blog_seo" | "ebook" | "custom";
  status: "draft" | "active" | "paused" | "review" | "archived";
  goal: string;
  progress: number;
  activeWorkflowId?: string;
  recentTaskId?: string;
  recentArtifactIds: string[];
  settings: ProjectSettings;
  createdAt: string;
  updatedAt: string;
};
```

### ProjectSettings

```ts
type ProjectSettings = {
  automationLevel: "manual" | "assisted" | "autonomous";
  enabledAgentIds: string[];
  workflowPreset: string;
  permissions: {
    webSearch: boolean;
    fileAccess: boolean;
    imageGeneration: boolean;
    videoGeneration: boolean;
    remotionRender: boolean;
    saveArtifacts: boolean;
    publishMetadata: boolean;
  };
  approvalMode: "always" | "before_generation" | "before_publish" | "cost_limit" | "auto";
};
```

### Workflow

```ts
type Workflow = {
  id: string;
  projectId: string;
  name: string;
  preset: string;
  status: "idle" | "running" | "waiting_approval" | "completed" | "failed";
  nodeIds: string[];
  createdBy: "pm_supervisor";
  createdAt: string;
  updatedAt: string;
};
```

### WorkflowNode

```ts
type WorkflowNode = {
  id: string;
  workflowId: string;
  step: "brief" | "research" | "plan" | "script" | "image" | "video" | "edit" | "publish" | "review" | "archive" | "tts" | "seo" | "package" | "submit";
  label: string;
  assignedAgentId: string;
  status: "pending" | "running" | "waiting_approval" | "done" | "failed" | "skipped";
  inputArtifactIds: string[];
  outputArtifactIds: string[];
  startedAt?: string;
  completedAt?: string;
};
```

### ChatThread / ChatMessage

```ts
type ChatThread = {
  id: string;
  projectId: string;
  title: string;
  messageIds: string[];
  createdAt: string;
  updatedAt: string;
};

type ChatMessage = {
  id: string;
  threadId: string;
  sender: "user" | "pm_supervisor" | "system";
  type: "user_brief" | "pm_plan" | "agent_handoff" | "agent_progress" | "tool_call" | "approval_request" | "artifact_result" | "final_report" | "error";
  content: string;
  agentId?: string;
  workflowId?: string;
  artifactIds?: string[];
  createdAt: string;
};
```

### Artifact

```ts
type Artifact = {
  id: string;
  projectId: string;
  workflowNodeId?: string;
  createdByAgentId: string;
  type: "research_brief" | "content_plan" | "script" | "image_prompt" | "image" | "video_prompt" | "video" | "edit_package" | "publish_package" | "review_report" | "document" | "other";
  title: string;
  content: string;
  filePath?: string;
  version: number;
  status: "draft" | "approved" | "needs_revision" | "published" | "archived";
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
};
```

### Connection

```ts
type Connection = {
  id: string;
  provider: "chatgpt" | "claude" | "gemini" | "codex" | "google_drive" | "youtube" | "firebase";
  status: "connected" | "not_connected" | "coming_soon" | "oauth_later" | "local" | "not_configured";
  label: string;
  description: string;
  lastCheckedAt?: string;
};
```

## 7. 구현 순서

### Phase 0. 현재 앱 파악

목표: 기존 Creator Hub 구조를 보존하면서, 새 Agent OS 화면을 얹을 위치를 결정한다.

작업:

- `index.html`, `styles.css`, `app.js`의 현재 구조 확인
- 기존 데이터 저장 방식 확인
- 현재 프로젝트/결과물/백업 구조 확인
- Agent OS를 별도 섹션으로 넣을지, 기존 홈을 교체할지 결정

### Phase 1. 정적 정보 구조 구현

목표: 실제 AI 연결 없이도 Agent OS의 뼈대가 보이게 만든다.

작업:

- 기본 에이전트 9명 seed 데이터 추가
- 기본 콘텐츠 체인 seed 데이터 추가
- 프로젝트 카드와 대시보드 요약 UI 구성
- Connections 상태 mock 데이터 구성

### Phase 2. 홈 대시보드 구현

목표: 사용자가 앱을 열면 "오늘 무엇을 해야 하는지" 바로 보이게 만든다.

작업:

- 프로젝트 카드
- 오늘의 작업
- 최근 결과물
- 진행 중인 작업
- AI 연결 상태 요약
- 모바일 카드형 레이아웃

### Phase 3. Project Workspace 구현

목표: 한 프로젝트 안에서 PM 채팅, 체인, 결과물을 같이 관리하게 만든다.

작업:

- 프로젝트 작업창 레이아웃
- 데스크톱 3패널 구조: PM Chat / Workflow / Artifact Panel
- 모바일 탭 구조: PM / Chain / Files / Agents
- 프로젝트 상태와 진행률 표시

### Phase 4. PM 채팅 UI 구현

목표: 사용자가 PM에게 지시하고, PM이 작업 분해/배정/보고하는 흐름을 시각화한다.

작업:

- PM 채팅 thread
- 사용자 brief 메시지
- PM plan 메시지
- agent handoff 카드
- agent progress 카드
- approval request 카드
- artifact result 카드
- composer와 지시 템플릿

주의:

- 이 단계에서는 실제 LLM 호출 없이 mock 응답 또는 로컬 시뮬레이션으로 시작한다.
- 전문 에이전트 직접 채팅 UI는 만들지 않는다.

### Phase 5. 에이전트 카드와 프로젝트별 ON/OFF 구현

목표: 고정 직원형 에이전트의 상태와 프로젝트별 사용 여부를 관리한다.

작업:

- 9개 에이전트 카드
- PM Supervisor always-on 표시
- 전문 에이전트 ON/OFF switch
- 자동화 수준 설정
- 기본 권한 체크리스트
- 프로젝트별 설정 저장 구조

### Phase 6. 워크플로우 체인 구현

목표: 콘텐츠 제작 단계와 담당 에이전트를 시각적으로 보여준다.

작업:

- 기본 체인 노드 렌더링
- 프로젝트별 preset 적용
- 단계별 상태 표시
- 담당 에이전트 표시
- 노드 클릭 시 상세 패널 표시
- 완료/진행중/대기/스킵 상태 표현

### Phase 7. 결과물 저장 패널 구현

목표: PM 채팅과 워크플로우에서 나온 결과물을 프로젝트 자산으로 관리한다.

작업:

- 결과물 목록
- 결과물 타입 필터
- preview 패널
- 저장 대상 표시
- 버전 번호 표시
- Draft / Approved / Needs Revision / Published 상태 표시

### Phase 8. 모바일 반응형 정리

목표: 모바일에서 바로 작업을 시작할 수 있게 만든다.

작업:

- 하단 네비게이션
- 큰 버튼
- 카드형 리스트
- PM/Chain/Files/Agents 탭 전환
- 좁은 화면에서 패널 겹침/텍스트 넘침 점검

### Phase 9. 연결 확장 준비

목표: 실제 API/OAuth를 붙이기 전에 연결 지점을 정리한다.

작업:

- Connection 모델과 UI 정리
- 실제 OAuth 제외 안내 표시
- ChatGPT, Claude, Gemini, Codex, Google Drive, YouTube, Firebase provider id 고정
- 향후 연결을 위한 adapter 함수 자리만 준비

