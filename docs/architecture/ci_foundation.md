# GitHub Actions CI Foundation

Status: implemented foundation  
Phase: 15  
Scope: GitHub Actions lint/build validation only  
Primary file: `.github/workflows/ci.yml`

## 목적

Phase 15는 Creator Hub Agent OS repository에서 사용할 기본 CI workflow를 준비하는 단계다.

이 CI는 자동 AI 작업, GitHub Issue 생성, PR 자동 생성, Cloudflare 배포, OAuth, backend 호출을 하지 않는다. 목적은 Pull Request와 branch push에서 frontend 품질 기준인 lint/build를 자동 검증하는 것이다.

## Workflow 위치

```text
.github/workflows/ci.yml
```

## Trigger 기준

CI는 다음 이벤트에서 실행된다.

- `push` to `main`
- `push` to `develop`
- `pull_request` targeting `main`
- `pull_request` targeting `develop`

`feature/*` branch는 PR을 만들 때 검증된다.

## 실행 단계

CI job은 `ubuntu-latest`에서 실행된다.

Steps:

1. `actions/checkout@v4`
2. `actions/setup-node@v4`
3. `npm ci`
4. `npm run lint`
5. `npm run build`

Node version:

```yaml
node-version: 22
```

Dependency install:

```bash
npm ci
```

`npm ci`는 `package-lock.json`을 기준으로 clean install을 수행한다. CI에서는 local `node_modules` 상태에 의존하지 않는다.

## 권한 기준

Workflow permissions:

```yaml
permissions:
  contents: read
```

현재 CI는 repository contents를 읽는 권한만 필요하다.

## Secret 미사용 원칙

Phase 15 CI는 secret을 사용하지 않는다.

사용하지 않는 것:

- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_TOKEN` write automation
- `CLOUDFLARE_API_TOKEN`
- OAuth token
- deployment token

CI는 `.env.local`을 만들지 않고, 실제 API key를 읽지 않는다. 현재 앱은 mock UI이며 lint/build가 secret 없이 통과해야 한다.

## 하지 않는 것

Phase 15 CI에서는 다음을 하지 않는다.

- OpenAI API 호출
- Perplexity API 호출
- GitHub Issue 생성
- GitHub PR 생성
- GitHub Actions workflow dispatch automation
- Cloudflare Pages 배포 trigger
- Cloudflare API 호출
- OAuth login 또는 callback 처리
- backend/server 실행
- database 연결
- artifact upload/download/share

## Branch 전략과의 관계

기준 branch:

- `main`: production-ready branch
- `develop`: optional integration branch
- `feature/*`: PR 단위 작업 branch

CI는 `main`과 `develop`을 보호하기 위한 최소 검증이다. 향후 repository settings에서 branch protection을 설정한다면 `lint-build` job 통과를 merge 조건으로 둘 수 있다.

## PR review 기준

PR reviewer는 다음을 확인한다.

- CI가 통과했는가?
- `npm run lint`가 통과했는가?
- `npm run build`가 통과했는가?
- 변경이 baseline 역할을 침범하지 않는가?
- 실제 API/OAuth/backend behavior가 추가되지 않았는가?
- secret이 workflow, docs, mock data, source code에 들어가지 않았는가?

## 향후 확장 후보

아래 항목은 future phase 후보이며 현재 구현하지 않는다.

- typecheck-only job 분리
- Playwright visual smoke test
- Cloudflare Pages preview deployment check
- GitHub Issue-first automation
- generated artifact validation
- protected environment approval
- deployment status reporting

확장 시에도 secret boundary는 `docs/architecture/runtime_environment.md`를 따라야 한다.
