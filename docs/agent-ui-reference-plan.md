# Creator Hub Agent UI Reference Plan

작성일: 2026-05-13  
작업 범위: 기존 `D:\Projects\creator-hub-v1.0`을 `D:\Projects\creator-hub-agent-os`로 복사한 뒤, 새 폴더 안에서만 문서 작성  
주의: 아래 내용은 GitHub 레퍼런스의 코드 복사가 아니라 UI/UX 구조, 정보 구조, 운영 패턴만 분석한 제안이다.

## 0. 확정된 제품 원칙

Creator Hub Agent OS의 핵심 운영 방식은 다음과 같이 확정한다.

- 사용자는 여러 에이전트와 직접 대화하지 않는다.
- 사용자는 **PM Supervisor**에게만 지시한다.
- PM Supervisor가 사용자 요청을 분석하고, 프로젝트를 판단하고, 필요한 전문 에이전트에게 작업을 배정한다.
- 전문 에이전트는 프로젝트별로 새로 생성하지 않는다.
- 전문 에이전트는 고정된 직원처럼 존재한다.
- 프로젝트마다 필요한 에이전트만 ON/OFF로 선택한다.
- PM Supervisor가 결과물을 취합하고 사용자에게 최종 보고한다.

이 원칙 때문에 UI는 "멀티 채팅 앱"이 아니라 "PM에게 지시하면 내부 제작팀이 움직이는 AI 콘텐츠 제작 회사 운영 OS"로 설계해야 한다.

## 1. 1차 MVP 에이전트 조직

1차 MVP는 **PM Supervisor 1명 + 전문 에이전트 8명**으로 구성한다.

| 에이전트 | 핵심 역할 | 주요 UI 표시 |
| --- | --- | --- |
| PM Supervisor | 사용자 요청 접수, 프로젝트 판단, 작업 분해, 에이전트 호출, 결과물 취합, 최종 보고, 승인 필요 여부 판단 | PM 채팅창, 작업 배정 로그, 승인 요청, 최종 보고 |
| Research Agent | 자료조사, 공식자료 확인, 트렌드 조사, 레퍼런스 수집, 키워드 정리 | 조사 상태, 출처, 키워드, 레퍼런스 카드 |
| Planning Agent | 콘텐츠 기획, 콘셉트 설계, 후킹 구조 설계, 콘텐츠 흐름 구성, 프로젝트별 제작 방향 정리 | 기획안, 콘셉트, 흐름도, 제작 방향 |
| Script Agent | 대본 작성, 숏폼 자막 작성, 롱폼 내레이션 작성, 블로그 초안 작성, 업로드 문구 초안 작성 | 대본/자막/블로그 초안, 버전 |
| Image Agent | 이미지 콘셉트 설계, 이미지 프롬프트 작성, 허브 내부 이미지 생성 요청, 썸네일 방향 제안, 생성 이미지 저장/수정 관리 | 이미지 프롬프트, 썸네일 방향, 이미지 후보 |
| Video Agent | 영상 컷 구성, 영상 프롬프트 작성, 허브 내부 영상 생성 요청, 장면별 영상 상태 관리, 영상 후보 비교 | 컷 리스트, 영상 프롬프트, 장면 상태, 후보 비교 |
| Edit Agent | Remotion 작업 지시, 자막 구성, 컷 편집 구조 설계, 렌더링 지시, 파일 경로/출력물 관리 | 편집 지시서, 렌더 상태, 파일 경로 |
| Publish Agent | 제목 작성, 설명문 작성, 태그 작성, 고정 댓글 작성, 플랫폼별 업로드 메타데이터 작성 | 제목 후보, 설명문, 태그, 업로드 패키지 |
| Review Agent | 최종 검수, 톤 검수, 누락 체크, 제출 조건 확인, 저작권/표기/공모전 조건 점검 | 체크리스트, 리스크, 승인/반려 의견 |

## 2. 레퍼런스 확인 요약

| 레퍼런스 | 확인한 핵심 | Creator Hub 적용 방향 |
| --- | --- | --- |
| [Mission Control](https://github.com/builderz-labs/mission-control) | AI agent fleet 관리, 작업 dispatch, 비용/상태/로그/토큰/보안/파이프라인을 한 SPA shell 안에서 운영하는 구조. README 기준 agents, tasks, skills, logs, tokens, memory, cron, alerts, webhooks, pipelines 등 32개 패널과 WebSocket/SSE 기반 실시간 업데이트를 강조한다. | Creator Hub를 단순 콘텐츠 목록이 아니라 "제작 회사 상황판"으로 재구성. 에이전트, 프로젝트, 작업 큐, 비용, 결과물, 승인 상태를 한 화면에서 훑는 운영 대시보드 패턴 채택. |
| [assistant-ui](https://github.com/assistant-ui/assistant-ui) | ChatGPT식 React 채팅 UX를 위한 Thread, Message, Composer, ThreadList, ActionBar 같은 조립식 primitives. streaming, auto-scroll, retry, attachment, markdown, code highlighting, tool call rendering, inline approval 패턴을 제공한다. | PM 채팅창을 단순 입력창이 아니라 작업 지시, 파일 첨부, 도구 호출, 승인 요청, 재시도/분기 이력이 있는 제작 지휘 인터페이스로 설계. |
| [React Multi-Agent Chat with LangGraph](https://github.com/Ashot72/React-Multi-Agent-Chat-with-LangGraph) | React 앱이 LangGraph Server agents와 통신하고 Supervisor Agent에도 연결된다. ChatGPT 유사 UX, 프롬프트 수정, 대안 응답 branch, regenerate, thread history를 제공한다. | PM 채팅의 대화 스레드, 에이전트 라우팅 표시, 결과 재생성, 이전 제작 대화 재개 패턴을 채택. |
| [Agent Dashboard](https://github.com/Lokesh-shiva/Agent-Dashboard) | 전문 에이전트별 목적/역량을 분리하고, KPI/차트/실시간 처리/대시보드 생성/자연어 분석을 결합한다. Data Cleaner, Trend Detector, Forecast Generator, Comparison Analyzer, Conversational Agent 같은 역할형 에이전트 구성이 명확하다. | Research, Planning, Script, Image, Video, Edit, Publish, Review처럼 고정 직원형 전문 에이전트를 카드화하고 각 에이전트의 입출력, KPI, 병목을 보여준다. |
| [LangGraph Supervisor](https://github.com/langchain-ai/langgraph-supervisor-py) | 중앙 supervisor가 전문 에이전트를 조율하는 hierarchical multi-agent 구조. tool-based handoff, message history 관리, full history/last message 출력 모드, multi-level hierarchy를 지원한다. | PM Supervisor를 유일한 사용자 대화 창구로 두고, 내부에서 전문 에이전트에게 handoff하는 구조를 UI에 드러낸다. |
| [tmai](https://github.com/trust-delta/tmai) | Claude Code, Codex CLI, OpenCode, Gemini CLI 등 여러 coding agent를 통합 모니터링/제어. HTTP hooks, IPC/PTY, tmux fallback의 상태 감지, auto-approve engine, orchestrator, dashboard TUI, pluggable UI, agent teams, git surface를 제공한다. | 여러 제작/자동화 에이전트를 한 화면에서 켜고 끄며, 상태 감지 신뢰도와 승인 정책을 표시하는 운영 콘솔 패턴 채택. |

## 3. Creator Hub에 적용할 에이전트 카드 UI

### 목적

에이전트 카드는 "이 고정 직원형 에이전트가 지금 어떤 프로젝트에서 무엇을 하고 있고, PM Supervisor가 맡긴 작업이 어디까지 진행됐는지"를 3초 안에 판단하게 해야 한다. 사용자가 직접 대화하는 대상은 PM Supervisor뿐이므로, 전문 에이전트 카드는 채팅 진입점이 아니라 운영 상태와 작업 결과를 보는 패널이어야 한다.

### 카드 구성 제안

| 영역 | 표시 정보 | UX 의도 |
| --- | --- | --- |
| 헤더 | 에이전트명, 역할, 상태 배지: Idle / Working / Blocked / Waiting Approval / Error | 고정 제작팀 상태를 빠르게 스캔 |
| 역할/역량 | 전문 영역 태그: 조사, 기획, 대본, 이미지, 영상, 편집, 배포, 검수 | 역할 혼선을 줄이고 PM의 배정 근거를 보여줌 |
| 현재 작업 | 프로젝트명, 작업명, PM이 배정한 이유, 진행률, ETA, 마지막 heartbeat | Mission Control/tmai식 운영 감시 |
| 산출물 | 최근 생성한 결과물 수, 승인 대기 수, 수정 요청 수 | 결과 중심 운영 |
| 비용/성능 | 오늘 사용 토큰/비용, 성공률, 재작업률, 평균 처리 시간 | 콘텐츠 제작 회사의 비용 통제 |
| 권한/승인 | 허용 도구, auto-approve 가능 여부, human approval 필요 여부 | 프로젝트별 ON/OFF 및 승인 정책과 연결 |
| 액션 | 작업 로그 보기, 결과물 보기, 일시정지, 재시도, PM에게 이슈 전달 | 사용자가 전문 에이전트와 직접 대화하지 않도록 액션을 제한 |

### 추천 레이아웃

- 상단에는 전체 에이전트 상태 요약: `전체 9`, `작업 중 5`, `승인 대기 2`, `오류 1`, `오늘 비용`.
- 본문은 역할 흐름 순서로 배치: `PM -> Research -> Planning -> Script -> Image/Video -> Edit -> Publish -> Review`.
- 카드 클릭 시 오른쪽 drawer 또는 상세 패널에서 작업 로그, 최근 산출물, 권한, 연결된 워크플로우를 보여준다.
- 전문 에이전트 카드에는 "채팅하기"보다 "PM에게 이슈 전달", "로그 보기", "결과물 보기"를 우선 배치한다.

## 4. PM 채팅창 UI

### 목적

PM 채팅창은 사용자가 "회사 대표/PD"처럼 지시하고, PM Supervisor가 고정 전문 에이전트들에게 작업을 나누는 지휘실이어야 한다.

### 핵심 패턴

- assistant-ui의 `Thread / Message / Composer / ActionBar` 개념을 참고해 대화, 입력, 메시지 액션을 분리한다.
- React Multi-Agent Chat의 thread history, regenerate, prompt edit, branch 개념을 콘텐츠 기획안/대본 대안 생성에 적용한다.
- LangGraph Supervisor의 supervisor handoff를 메시지 안에 시각적으로 표시하되, 사용자가 전문 에이전트에게 직접 말하는 UI는 만들지 않는다.

### 메시지 타입 제안

| 타입 | UI 표시 | 예시 |
| --- | --- | --- |
| User Brief | 사용자의 프로젝트 지시 | "50대 남성 타깃 건강 쇼츠 5개 기획해줘" |
| PM Plan | PM Supervisor의 작업 분해 | Research -> Planning -> Script -> Review |
| Agent Handoff | PM이 어떤 에이전트에게 넘겼는지 표시 | `Research Agent에게 공식자료 확인 배정` |
| Agent Progress | 전문 에이전트의 진행 상태를 PM이 중계 | `Image Agent가 썸네일 방향 3안을 준비 중` |
| Tool Call | 외부 도구/데이터 접근 카드 | 검색, 파일 읽기, 이미지 생성, 영상 생성, 저장 |
| Approval Request | 사용자 승인 요청 | "이 콘셉트로 대본 제작을 진행할까요?" |
| Artifact Result | 결과물 카드 | 대본, 이미지 프롬프트, 업로드 문안 |
| Final Report | PM의 취합 보고 | 완료 항목, 저장 위치, 다음 추천 액션 |
| Error/Blocked | 막힌 이유와 필요한 입력 | "브랜드 톤 가이드가 없어 선택 필요" |

### Composer 기능

- 프로젝트 선택 드롭다운: 현재 대화가 어느 프로젝트에 기록되는지 명확히 표시.
- 첨부: 이미지, CSV, 기존 대본, 브랜드 가이드, 공모전 요강.
- 지시 템플릿: `아이디어 만들기`, `기획안 작성`, `대본 작성`, `이미지 만들기`, `영상 만들기`, `편집 지시`, `업로드 문안`, `최종 검수`.
- 실행 모드: `초안만`, `승인 후 진행`, `자동 진행`.
- 응답 액션: regenerate, branch, edit prompt, save to project, assign to workflow.

### 레이아웃 제안

- 왼쪽: 프로젝트/대화 thread list.
- 중앙: PM Supervisor 채팅 thread.
- 오른쪽: 현재 대화에서 생성된 결과물 preview/save 패널.
- 메시지 내부의 tool call, handoff, progress는 접었다 펼칠 수 있는 compact card로 제공.

## 5. 프로젝트별 에이전트 ON/OFF 설정 UI

### 목적

프로젝트마다 필요한 제작팀 구성이 다르다. "이 프로젝트에서는 어떤 고정 직원형 에이전트를 가동할지"를 명확히 설정하게 한다.

### 설정 화면 구성

| 영역 | 제안 UI | 설명 |
| --- | --- | --- |
| 프로젝트 운영 모드 | segmented control: Manual / Assisted / Autonomous | 자동 진행 수준 |
| 에이전트 토글 | 8개 전문 에이전트 switch 목록 | Research, Planning, Script, Image, Video, Edit, Publish, Review ON/OFF |
| PM Supervisor | 항상 ON, 잠금 상태 | 사용자의 유일한 대화 창구이므로 끌 수 없음 |
| 승인 정책 | radio/select | 항상 승인, 비용 초과 시 승인, 생성 요청 전 승인, 배포 전 승인, 자동 승인 |
| 예산/한도 | numeric input + progress bar | 일/프로젝트별 토큰 또는 비용 한도 |
| 권한 | 체크박스 | 웹 검색, 파일 접근, 이미지 생성, 영상 생성, Remotion 렌더링, 저장, 배포 |
| 기본 라우팅 | PM Supervisor rules | 어떤 요청이 어떤 에이전트로 가는지 |
| 알림 | toggle | 완료, 실패, 승인 대기, 비용 초과 |

### 에이전트 설정 row 예시

각 에이전트 row 또는 card에는 다음을 둔다.

- ON/OFF switch
- 역할 설명 한 줄
- 사용 모델/도구
- 프로젝트 내 권한
- 승인 필요 조건
- 최근 이 프로젝트에서의 성공률/평균 비용
- 비활성화 시 PM Supervisor가 대체 처리할 수 있는 범위

### 적용 원칙

- tmai의 multi-agent monitoring과 auto-approve engine을 "콘텐츠 제작 프로젝트별 권한 관리"로 변환한다.
- Mission Control의 RBAC/quality gates 관점을 "생성 전 승인", "배포 전 승인", "브랜드 안전성 검수", "비용 한도 초과 방지"로 해석한다.
- 초기 버전은 고급 rule builder보다 간단한 preset 중심이 낫다.

## 6. 작업 체인/워크플로우 시각화 UI

### 목적

AI 콘텐츠 제작은 한 번의 채팅 응답이 아니라 여러 작업의 체인이다. 사용자는 PM Supervisor가 어떤 순서로 에이전트에게 일을 배정했고, 현재 병목이 어디인지 봐야 한다.

### 기본 워크플로우

`Brief -> PM Analysis -> Research -> Planning -> Script -> Image/Video -> Edit -> Publish -> Review -> Save/Archive`

### 시각화 제안

| 요소 | UI 패턴 | 설명 |
| --- | --- | --- |
| PM 노드 | 상단 고정 또는 중심 노드 | 모든 작업 배정의 출발점 |
| 작업 노드 | 단계 카드 | 작업명, 담당 에이전트, 상태, 산출물 수 |
| 엣지 | 방향 연결선 | PM의 배정/취합 흐름 표시 |
| 상태 | 색상/아이콘 | Pending, Running, Waiting Approval, Failed, Done |
| 승인 게이트 | diamond/checkpoint | 사람이 결정해야 하는 지점 |
| 병렬 작업 | swimlane | Script 이후 Image와 Video가 병렬 진행 가능 |
| 로그 | 선택한 노드의 오른쪽 panel | 입력, 출력, 비용, 소요 시간 |
| 재실행 | node action | 이 단계만 regenerate 또는 rerun |

### 화면 배치

- 상단: 프로젝트명, 목표, 마감일, 전체 진행률, 총 비용.
- 중앙: horizontal 또는 left-to-right workflow map.
- 하단 또는 오른쪽: 선택한 노드의 상세 로그와 산출물.
- PM 채팅에서 만들어진 계획은 즉시 workflow map으로 변환된다.

### Supervisor 구조 반영

- 사용자는 PM Supervisor와만 대화한다.
- PM Supervisor는 workflow map에서 모든 에이전트 작업의 조율자다.
- 전문 에이전트는 작업 노드의 담당자로만 표시된다.
- 향후 확장하더라도 1차 MVP에서는 다중 supervisor를 만들지 않는다.

## 7. 결과물 미리보기/저장 패널 UI

### 목적

Creator Hub는 대화 결과가 흘러가면 안 된다. 모든 결과물은 프로젝트 자산으로 저장, 비교, 승인, 재사용 가능해야 한다.

### 패널 구성

| 영역 | 표시 정보 | 액션 |
| --- | --- | --- |
| Artifact List | 생성된 결과물 카드 목록 | 필터: 기획안, 대본, 이미지, 영상, 편집 지시, 업로드 문안, 검수 리포트 |
| Preview | 선택한 결과물 전문/이미지/영상/표/체크리스트 | 복사, 편집, 버전 비교 |
| Save Target | 저장 위치 | 프로젝트, 콘텐츠 아이템, 캠페인, 아카이브 |
| Metadata | 만든 에이전트, 생성 시간, 소스 대화, 비용, 버전 | 추적/감사 |
| Approval | Draft / Approved / Needs Revision / Published | 승인 상태 변경 |
| Export | TXT, Markdown, JSON, CSV, 이미지, 영상, 업로드 패키지 | 외부 활용 |

### 결과물 카드 타입

- `Research Brief`: 출처, 키워드, 트렌드, 레퍼런스.
- `Content Plan`: 콘셉트, 후킹 구조, 콘텐츠 흐름.
- `Script`: 대본, 숏폼 자막, 롱폼 내레이션, 블로그 초안.
- `Image Package`: 이미지 콘셉트, 이미지 프롬프트, 썸네일 방향, 생성 이미지.
- `Video Package`: 컷 리스트, 영상 프롬프트, 장면별 상태, 영상 후보.
- `Edit Package`: Remotion 작업 지시, 자막 구성, 렌더링 지시, 파일 경로.
- `Publish Package`: 제목 후보, 설명, 태그, 고정 댓글, 플랫폼별 메타데이터.
- `Review Report`: 누락 체크, 톤 검수, 저작권/표기/공모전 조건 점검.
- `Workflow Snapshot`: PM Supervisor가 어떤 에이전트에게 어떤 순서로 배정했는지.

### 저장 UX 원칙

- 저장 전에는 "대화 속 임시 결과물"로 표시한다.
- 사용자가 승인하거나 PM Supervisor가 승인 조건을 만족하면 "프로젝트 자산"으로 승격한다.
- 같은 결과물의 버전은 덮어쓰기보다 버전 스택으로 관리한다.
- 저장된 산출물은 다음 작업의 입력으로 다시 선택할 수 있어야 한다.

## 8. 우선순위 제안

1. **PM 채팅창 + 결과물 패널**을 먼저 설계한다. 사용자의 실제 작업 시작점이기 때문이다.
2. **고정 에이전트 카드 UI**로 현재 제작팀 상태를 보여준다.
3. **프로젝트별 에이전트 ON/OFF 설정**으로 자동화 범위를 통제한다.
4. **워크플로우 시각화**는 PM 채팅에서 생성된 작업 계획을 보여주는 형태로 시작한다.
5. 이후 비용/로그/권한/분석을 Mission Control식 운영 대시보드로 확장한다.

## 9. 구현 전 결정해야 할 질문

- Creator Hub의 1차 운영 단위는 `프로젝트`인가, `콘텐츠 아이템`인가, 아니면 `캠페인`인가?
- PM Supervisor가 자동으로 저장까지 할 수 있는가, 아니면 모든 결과물 저장은 사용자 승인 후에만 가능한가?
- 에이전트는 실제 API/CLI와 연결되는가, 아니면 초기에는 UI상의 역할/상태 모델부터 구현하는가?
- 결과물 preview는 텍스트 중심으로 시작할지, 썸네일/이미지/영상 프리뷰까지 1차 범위에 포함할지 정해야 한다.

## 10. 다음 단계

이 문서를 기준으로 UI 코드를 수정하기 전에 다음 산출물을 먼저 잡는 것이 좋다.

- Creator Hub Agent OS의 정보 구조: Dashboard / Projects / PM Chat / Agents / Workflows / Artifacts / Settings
- 프로젝트 데이터 모델 초안: project, agent, task, workflowNode, artifact, approval
- 첫 화면 와이어프레임: 좌측 내비게이션, 중앙 운영 대시보드, 우측 preview/action 패널

