# Task Schema & Endpoint Contract

Status: planning document  
Phase: 13  
Scope: Task schema, artifact draft contract, workflow linkage, GitHub Issue-first endpoint design  
Implementation status: documentation only

## 목적

Phase 13은 PM Workspace, Command Templates, Artifacts, Workflows를 실제 자동화로 연결하기 위한 공통 Task Schema와 endpoint contract를 정의하는 단계다.

현재 Creator Hub Agent OS는 mock UI 기반이다. 이 문서는 코드 구현, backend 연결, API 호출, DB 저장을 추가하지 않는다. 향후 server-side layer 또는 Cloudflare Worker를 만들 때 기준으로 삼을 schema와 request/response 형태만 고정한다.

## Task의 역할 정의

Task는 Creator Hub Agent OS에서 "사용자의 작업 명령이 실제 자동화 대상으로 변환된 단위"다.

Task는 다음 화면을 연결하는 중심 레코드가 된다.

- PM Workspace: 사용자가 PM Supervisor에게 작업을 지시하는 시작점
- Command Templates: 반복 명령을 Task로 만들 수 있는 source
- Artifacts: Task 실행 결과물이 저장되는 보관함
- Workflows: Task가 어떤 stage에서 진행 중인지 보여주는 흐름 지도
- GitHub: 실제 자동화가 필요한 경우 Issue, PR, Actions와 연결되는 외부 실행 추적점

Task는 command 자체가 아니다. Task는 command를 실행 가능한 작업 단위로 정규화한 record다.

## 상태 흐름

기본 흐름:

```text
PM command
  -> Task
  -> Artifact draft
  -> Approval
  -> Workflow status update
  -> optional GitHub Issue
  -> optional PR / deployment flow
```

세부 흐름:

1. 사용자가 PM Workspace composer 또는 Command Templates의 mock button에서 작업 의도를 선택한다.
2. command text와 project, target agent, requested artifact type이 Task로 정규화된다.
3. Task는 처음에 `draft` 또는 `queued` 상태로 생성된다.
4. AI draft generation이 붙는 future phase에서는 Task에서 Artifact draft가 생성된다.
5. 생성된 Artifact는 `draft` 또는 `review` 상태로 Artifacts 화면에 나타난다.
6. PM Workspace approval panel에서 사용자가 승인, 수정 요청, 재생성을 결정한다.
7. Workflow는 linked workflow run과 stage status를 통해 Task 진행 위치를 표시한다.
8. 코드 변경, 배포, 외부 작업이 필요한 Task는 GitHub Issue-first flow로 넘어간다.

## TaskSchema 필드 설계

아래 schema는 문서 후보이며 현재 `src/types/creatorHub.ts`에 추가하지 않는다.

```ts
type TaskSchema = {
  taskId: string;
  projectId: ProjectId;
  sourceType: TaskSourceType;
  sourceId?: string;
  targetAgentId: string;
  commandText: string;
  requestedArtifactType: ArtifactType;
  status: TaskStatus;
  approvalState: ApprovalState;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  linkedArtifactIds: string[];
  linkedWorkflowRunId?: string;
  linkedGitHubIssueNumber?: number;
  linkedPullRequestNumber?: number;
};
```

필드 설명:

- `taskId`: Creator Hub 내부 Task 고유 id
- `projectId`: 기존 `ProjectId`와 연결
- `sourceType`: PM Workspace, Command Template, Workflow, manual import 등 Task 생성 출처
- `sourceId`: source record id. 예: `CommandTemplate.id`, `PMThread.id`
- `targetAgentId`: 기존 `Agent.id` 또는 `StudioAgentProfile.id`와 연결
- `commandText`: PM Supervisor에게 전달된 최종 명령문
- `requestedArtifactType`: 기존 `ArtifactType` 후보 중 생성 대상
- `status`: Task 실행 상태
- `approvalState`: 사용자 승인 상태
- `priority`: 작업 우선순위
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp
- `linkedArtifactIds`: 생성되거나 연결된 `Artifact.id` 목록
- `linkedWorkflowRunId`: 기존 `WorkflowRun.id` 또는 future workflow run id
- `linkedGitHubIssueNumber`: GitHub Issue-first flow 연결 번호
- `linkedPullRequestNumber`: PR 생성 이후 연결 번호

## enum 후보

### TaskSourceType

```ts
type TaskSourceType =
  | 'pm-workspace'
  | 'command-template'
  | 'workflow-stage'
  | 'artifact-revision'
  | 'manual';
```

의미:

- `pm-workspace`: PM Workspace composer에서 생성
- `command-template`: Command Templates에서 선택
- `workflow-stage`: 특정 workflow stage에서 파생
- `artifact-revision`: 기존 artifact 수정 요청에서 파생
- `manual`: future manual create form에서 생성

### TaskStatus

```ts
type TaskStatus =
  | 'draft'
  | 'queued'
  | 'running'
  | 'waiting-review'
  | 'revision-requested'
  | 'approved'
  | 'blocked'
  | 'completed'
  | 'cancelled'
  | 'failed';
```

상태 규칙:

- `draft`: 아직 실행 queue에 들어가지 않은 초안 Task
- `queued`: 실행 대기
- `running`: server-side worker 또는 automation runner가 처리 중
- `waiting-review`: artifact가 생성되어 사용자 검토 대기
- `revision-requested`: 사용자가 수정 또는 재생성 요청
- `approved`: 사용자가 결과물을 승인
- `blocked`: secret, provider 연결, 권한, source 부족 등으로 정지
- `completed`: Task가 최종 완료
- `cancelled`: 사용자가 취소
- `failed`: execution error 발생

### ApprovalState

```ts
type ApprovalState =
  | 'not-required'
  | 'pending'
  | 'approved'
  | 'changes-requested'
  | 'rejected';
```

상태 규칙:

- `not-required`: 승인 gate가 필요 없는 내부 상태 표시
- `pending`: PM Workspace approval panel에서 검토 대기
- `approved`: 사용자가 승인
- `changes-requested`: 수정 요청
- `rejected`: 사용자가 폐기

### TaskPriority

```ts
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
```

기존 `Project.priority`는 `high | medium | low`만 사용한다. Task는 future automation에서 긴급 작업을 분리할 수 있도록 `urgent` 후보를 둔다.

## Artifact 생성 규칙

Task에서 Artifact가 생성될 때는 기존 `Artifact` 타입을 기준으로 한다.

기본 매핑:

- `TaskSchema.projectId` -> `Artifact.projectId`
- `TaskSchema.requestedArtifactType` -> `Artifact.type`
- `TaskSchema.targetAgentId` -> `Artifact.agentId`
- `TaskSchema.taskId` -> future `Artifact.metadata.taskId`
- `TaskSchema.commandText` 요약 -> future `Artifact.metadata.sourceCommand`

생성 규칙:

- AI 초안 결과는 기본적으로 `Artifact.status = 'draft'`로 시작한다.
- 사용자 검토가 필요한 경우 `Artifact.status = 'review'`로 전환한다.
- approval이 끝나기 전에는 `approved`로 자동 전환하지 않는다.
- 하나의 Task는 여러 Artifact를 만들 수 있다. 예: longform script -> shorts script, blog draft, Substack draft.
- Artifact는 실행 log가 아니라 결과물 record다. 실행 상태는 Task와 Workflow가 관리한다.

## Workflow stage와 Task 연결 규칙

Task는 `linkedWorkflowRunId`와 `requestedArtifactType`을 통해 Workflow stage와 연결된다.

초기 stage 매핑 후보:

- `script`, `shorts-script`, `blog-draft`, `substack-draft`, `naver-blog-draft` -> `script`
- `image-prompt`, `thumbnail-concept`, `generated-image` -> `image`
- `video-prompt`, `generated-video`, `render plan` 계열 -> `video`
- `upload-metadata`, `affiliate-copy` -> `publish`
- `contest-proposal`, `portfolio-draft` -> `plan` 또는 `review`

Workflow 표시 규칙:

- Task `queued` -> workflow stage `queued`
- Task `running` -> workflow stage `running`
- Task `waiting-review` -> workflow stage `running` 또는 UI mapped `review`
- Task `approved` -> workflow stage `done`
- Task `blocked` 또는 `failed` -> workflow stage `blocked`

현재 `WorkflowStageStatus`는 `done | running | queued | blocked | idle`만 가진다. 따라서 future implementation에서는 TaskStatus를 WorkflowStageStatus로 mapping하는 adapter가 필요하다.

## GitHub Issue-first flow 연결 방식

GitHub 연결은 PR 자동 생성이 아니라 Issue 생성부터 시작한다.

Issue-first 기준:

- Task가 code, deployment, repository file change, automation validation이 필요한 경우에만 GitHub Issue를 만든다.
- Issue title은 project shortName과 Task 목적을 포함한다.
- Issue body는 command, requested artifact type, target agent, linked artifacts, approval state를 포함한다.
- Issue 생성 후 `linkedGitHubIssueNumber`를 Task에 기록한다.
- PR은 사용자 승인 또는 별도 automation gate 이후에만 생성한다.

Issue 생성이 필요한 후보:

- site/content repository 파일 변경
- Remotion render template 변경
- Cloudflare deployment 확인 필요
- artifact를 production content로 반영해야 하는 작업
- repeated workflow automation bug 또는 failure investigation

Issue 생성이 필요 없는 후보:

- 단순 script draft
- image prompt draft
- local review-only artifact
- PM memo 또는 planning-only command

## 첫 real bridge 후보

Phase 13 기준 첫 구현 후보는 세 개 endpoint contract다. 아직 구현하지 않는다.

- `POST /api/tasks/draft`
- `POST /api/artifacts/draft`
- `POST /api/github/issues`

이 endpoint들은 frontend에서 직접 provider secret을 사용하지 않고, future server-side layer 또는 Cloudflare Worker에서 처리해야 한다.

## Endpoint: POST /api/tasks/draft

역할:

PM command 또는 Command Template 선택을 Task draft로 정규화한다.

Request 예시:

```json
{
  "projectId": "wisdom",
  "sourceType": "command-template",
  "sourceId": "cmd-wisdom-repurpose-chain",
  "targetAgentId": "script-agent",
  "commandText": "롱폼 원고를 쇼츠 3개, 블로그 초안, Substack 초안으로 나눠줘.",
  "requestedArtifactType": "shorts-script",
  "priority": "high"
}
```

Response 예시:

```json
{
  "task": {
    "taskId": "task_20260513_wisdom_001",
    "projectId": "wisdom",
    "sourceType": "command-template",
    "sourceId": "cmd-wisdom-repurpose-chain",
    "targetAgentId": "script-agent",
    "commandText": "롱폼 원고를 쇼츠 3개, 블로그 초안, Substack 초안으로 나눠줘.",
    "requestedArtifactType": "shorts-script",
    "status": "draft",
    "approvalState": "not-required",
    "priority": "high",
    "createdAt": "2026-05-13T15:00:00+09:00",
    "updatedAt": "2026-05-13T15:00:00+09:00",
    "linkedArtifactIds": [],
    "linkedWorkflowRunId": "workflow-wisdom"
  }
}
```

Validation 후보:

- `projectId`는 기존 ProjectId 중 하나여야 한다.
- `targetAgentId`는 기존 agent id 중 하나여야 한다.
- `requestedArtifactType`은 기존 ArtifactType 중 하나여야 한다.
- `commandText`는 빈 문자열이면 안 된다.
- secret이나 API key가 포함된 commandText는 reject 또는 redact해야 한다.

## Endpoint: POST /api/artifacts/draft

역할:

Task 결과로 draft Artifact record를 만든다. 실제 AI 호출은 이 endpoint의 future 내부 구현 후보지만, Phase 13에서는 contract만 정의한다.

Request 예시:

```json
{
  "taskId": "task_20260513_wisdom_001",
  "projectId": "wisdom",
  "type": "shorts-script",
  "title": "wisdom_longform_repurpose_shorts_v01",
  "agentId": "script-agent",
  "draftBody": "초안 본문은 future storage 또는 artifact content table에 저장한다.",
  "metadata": {
    "sourceCommand": "롱폼 원고를 쇼츠 3개, 블로그 초안, Substack 초안으로 나눠줘.",
    "channel": "YouTube Shorts",
    "taskId": "task_20260513_wisdom_001"
  }
}
```

Response 예시:

```json
{
  "artifact": {
    "id": "artifact_task_20260513_wisdom_001_shorts",
    "projectId": "wisdom",
    "type": "shorts-script",
    "title": "wisdom_longform_repurpose_shorts_v01",
    "status": "draft",
    "agentId": "script-agent",
    "version": "v0.1",
    "createdAt": "2026-05-13T15:02:00+09:00",
    "updatedAt": "2026-05-13T15:02:00+09:00",
    "metadata": {
      "format": "Shorts Script",
      "channel": "YouTube Shorts",
      "taskId": "task_20260513_wisdom_001"
    }
  },
  "taskPatch": {
    "taskId": "task_20260513_wisdom_001",
    "status": "waiting-review",
    "approvalState": "pending",
    "linkedArtifactIds": ["artifact_task_20260513_wisdom_001_shorts"],
    "updatedAt": "2026-05-13T15:02:00+09:00"
  }
}
```

Validation 후보:

- `taskId`가 존재해야 한다.
- Artifact type은 Task requestedArtifactType과 호환되어야 한다.
- Artifact는 기본적으로 `draft` 또는 `review`로만 생성한다.
- 승인 없이 `approved` artifact를 생성하지 않는다.

## Endpoint: POST /api/github/issues

역할:

Task를 GitHub Issue-first flow로 넘긴다. 실제 GitHub API 호출은 future server-side layer에서만 허용한다.

Request 예시:

```json
{
  "taskId": "task_20260513_chic40_002",
  "projectId": "chic40",
  "repository": "owner/creator-hub-agent-os",
  "title": "[chic40] Create upload metadata validation task",
  "body": {
    "commandText": "쇼츠 업로드 메타데이터와 affiliate copy를 검증해줘.",
    "requestedArtifactType": "upload-metadata",
    "targetAgentId": "publish-agent",
    "linkedArtifactIds": ["artifact-chic40-metadata"],
    "approvalState": "pending"
  },
  "labels": ["creator-hub", "automation", "chic40"]
}
```

Response 예시:

```json
{
  "githubIssue": {
    "number": 42,
    "url": "https://github.com/owner/creator-hub-agent-os/issues/42",
    "state": "open"
  },
  "taskPatch": {
    "taskId": "task_20260513_chic40_002",
    "linkedGitHubIssueNumber": 42,
    "status": "queued",
    "updatedAt": "2026-05-13T15:06:00+09:00"
  }
}
```

Validation 후보:

- GitHub repository target은 server-side config와 일치해야 한다.
- frontend에서 repository write token을 전달하지 않는다.
- Issue body에는 secret, API key, OAuth token이 포함되면 안 된다.
- PR number는 이 endpoint에서 만들지 않는다.

## Error response 공통 후보

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "requestedArtifactType is not compatible with the selected project.",
    "details": {
      "field": "requestedArtifactType"
    }
  }
}
```

공통 error code 후보:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `PROVIDER_NOT_CONFIGURED`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

## 실제 구현 전 금지사항

Phase 13에서는 다음을 구현하지 않는다.

- 실제 API 호출
- 실제 OpenAI / Perplexity / Anthropic 호출
- 실제 DB 저장
- 실제 GitHub 호출
- 실제 GitHub Issue 생성
- 실제 PR 생성
- 실제 GitHub Actions dispatch
- 실제 Cloudflare 호출
- 실제 secret 사용
- `.env.local` 생성
- frontend에서 provider key 사용
- backend endpoint 파일 생성
- Task type을 `src/types/creatorHub.ts`에 추가
- mock data에 실제 Task record 추가

## 다음 구현 후보

1. Type-only planning review

이 문서의 `TaskSchema`, `TaskStatus`, `ApprovalState`를 실제 TypeScript 타입으로 옮길지 검토한다. 구현 시에는 UI 변경 없이 type definition만 먼저 추가한다.

2. Mock task data 추가

실제 backend 전 단계로 `mockTasks`를 추가해 PM Workspace, Artifacts, Workflows 연결 가능성을 UI에 표시할 수 있다. 이 단계도 별도 phase에서 진행한다.

3. `POST /api/tasks/draft` mock handler

server-side 없이도 테스트 가능한 mock adapter를 만들 수 있다. 단, 실제 API endpoint처럼 보이게 만들지 말고 local function 또는 mock service로 분리한다.

4. Cloudflare Worker contract 확정

Phase 12의 secret boundary에 맞춰 Worker runtime에서만 secret을 읽는 endpoint contract를 확정한다.

5. GitHub Issue-first prototype

가장 낮은 위험의 real bridge는 PR 자동 생성이 아니라 GitHub Issue 생성이다. 사용자가 승인한 Task만 Issue로 보내는 gate를 먼저 설계한다.
