# Phase 9 Command Templates Baseline

Status: locked baseline  
Route: `/commands`  
Primary file: `src/pages/CommandTemplatesPage.tsx`

## 화면 목적

Command Templates는 PM Supervisor에게 자주 내리는 작업 명령 라이브러리다. 단순한 프롬프트 보관함이 아니라, PM Workspace에서 반복적으로 쓰는 작업 지시문을 프로젝트와 대상 Agent 기준으로 빠르게 찾기 위한 화면이다.

이 화면은 실제 명령 실행 화면이 아니다. 사용자는 템플릿 이름, 사용 목적, 대상 Agent, 연결 프로젝트, 예시 명령을 보고 어떤 지시문을 PM Workspace로 가져갈지 판단한다.

## `/commands` route 구조

- `/commands` route는 `CommandTemplatesPage`를 렌더링한다.
- route label은 `Commands`다.
- route title은 `Command Templates`다.
- route eyebrow는 `PM Command Library`다.
- 기존 `AppShell`, `Sidebar`, `TopBar`, `MobileBottomNav` 안에서 렌더링한다.
- 페이지 내부는 데스크톱 기준 `main command library + right command sidebar` 2열 구조를 유지한다.
  - 메인 영역: Command Toolbar, 프로젝트별 command template sections
  - 우측 사이드바: Template Status, PM Boundary
- 모바일에서는 toolbar, 프로젝트별 템플릿 카드, sidebar가 자연스럽게 세로 스택되어야 한다.

## Command Template 카드 구조

각 템플릿 카드는 compact하게 보여준다.

필수 표시 정보:

- 템플릿 이름
- 사용 목적
- 대상 Agent
- 연결 프로젝트
- 예시 명령 미리보기
- 상태 badge
- tags
- mock `Use in PM Workspace` button

카드 구조:

- 상단: icon, template name, project shortName, target agent, status badge
- 중단: purpose
- preview 영역: `Prompt Preview`
- 하단: tag chips, `Use in PM Workspace` mock button

상태 badge는 `CommandTemplateStatus`와 `statusTone`을 사용한다.

## 검색/필터 mock 구조

검색과 필터는 local state와 mock data 기반이다.

검색 대상:

- template name
- purpose
- promptPreview
- project name
- project shortName
- agent name
- tags

프로젝트 필터:

- `All Projects`
- `지혜샘`
- `시크40`
- `공모전`
- `스티커랩`

상태 필터:

- `all`
- `ready`
- `draft`
- `review`

검색/필터는 서버 요청, AI 호출, 저장소 조회 없이 현재 브라우저 메모리의 mock 배열에서만 동작한다.

## mock data 연결 구조

Command Templates는 다음 mock data를 사용한다.

- `commandTemplates`: 템플릿 목록
- `projects`: 연결 프로젝트 이름/shortName/domain 조회
- `agents`: 대상 Agent 이름 조회

관련 타입:

- `CommandTemplate`
- `CommandTemplateStatus`
- `ProjectId`

`CommandTemplate` 필드:

- `id`
- `projectId`
- `name`
- `purpose`
- `targetAgentId`
- `promptPreview`
- `status`
- `tags`

## `Use in PM Workspace` 버튼의 현재 mock 역할

`Use in PM Workspace` 버튼은 현재 실제 동작을 수행하지 않는 mock control이다.

현재 하지 않는 것:

- PM Workspace로 실제 이동
- composer에 템플릿 입력
- 클립보드 복사
- 저장
- 실행
- AI/API 호출

버튼의 현재 목적은 향후 PM Workspace 연동 위치를 UI상에 표시하는 것이다.

## PM Workspace와의 향후 연결 방향

향후 Phase에서 다음 연결을 검토할 수 있다.

- 선택한 command template을 PM Workspace composer에 주입
- `/pm`으로 이동하면서 template id 전달
- 프로젝트 스레드와 command template 연결
- 대상 Agent에 맞는 quick command chip 생성
- template usage history 기록
- PM Supervisor에게 전달될 최종 prompt preview 표시

현재 Phase 9 baseline에서는 위 기능을 구현하지 않는다.

## 실제 실행/복사/저장/AI 호출 금지

현재 Command Templates 화면에는 다음 기능이 없다.

- 실제 AI 호출
- 실제 API 호출
- 실제 저장
- 실제 수정
- 실제 삭제
- 실제 복사
- 실제 PM Workspace composer injection
- 실제 command execution
- backend 연결
- Firebase/Supabase 연결
- OAuth/provider 연결

모든 데이터와 인터랙션은 mock UI 기준이다.

## 기존 페이지 미수정 여부

Command Templates 구현 중 다음 페이지의 UI는 수정하지 않는다.

- Dashboard
- PM Workspace
- Studio Teams
- Artifacts
- Settings / Integrations
- Workflows
- Projects

PM Workspace는 Phase 3 baseline을 유지한다. Command Templates는 PM Workspace를 보조하는 라이브러리 화면이며, PM Workspace의 채팅/composer/approval 구조를 변경하지 않는다.

## 향후 확장 가능 영역

다음 항목은 향후 Phase에서 검토할 수 있지만, 현재 baseline에는 구현하지 않는다.

- command template detail drawer
- template create/edit form
- template duplication
- template version history
- usage count
- favorite/pin 기능
- team별 template grouping
- PM Workspace deep link
- composer injection
- clipboard copy
- template validation
- prompt variable slots
- project-specific template recommendations
- agent-specific template recommendations
- backend persistence

확장 시에도 PM Workspace의 baseline 역할을 침범하지 않아야 한다.
