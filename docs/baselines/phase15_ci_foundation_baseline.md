# Phase 15 GitHub Actions CI Foundation Baseline

Status: locked baseline  
Phase: 15  
Primary workflow: `.github/workflows/ci.yml`  
Scope: lint/build CI validation only

## CI 목적

Phase 15 CI는 Creator Hub Agent OS repository의 기본 품질 검증을 자동화하기 위한 foundation이다.

이 CI의 목적은 Pull Request와 주요 branch push 시 다음 두 가지를 확인하는 것이다.

- `npm run lint`
- `npm run build`

CI는 자동 AI 작업, GitHub Issue 생성, PR 자동 생성, Cloudflare 배포, OAuth, backend 호출을 수행하지 않는다.

## `ci.yml` trigger 기준

Workflow는 다음 이벤트에서 실행된다.

```yaml
on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop
```

기준:

- `main` push
- `develop` push
- `main` 대상 pull request
- `develop` 대상 pull request

`feature/*` branch 작업은 `main` 또는 `develop`으로 PR을 열 때 검증된다.

## Node 버전

CI는 `actions/setup-node@v4`를 사용한다.

```yaml
node-version: 22
cache: npm
```

Node 22를 기준으로 npm dependency cache를 사용한다.

## 실행 steps

현재 CI job 이름은 `lint-build`다.

실행 순서:

1. `actions/checkout@v4`
2. `actions/setup-node@v4`
3. `npm ci`
4. `npm run lint`
5. `npm run build`

`npm ci`는 `package-lock.json` 기준 clean install을 수행한다. CI는 local `node_modules` 상태에 의존하지 않는다.

## permissions 기준

Workflow permissions는 read-only 기준이다.

```yaml
permissions:
  contents: read
```

현재 CI는 repository contents를 checkout하고 lint/build를 실행하기 위한 읽기 권한만 필요하다.

## secret 미사용 원칙

Phase 15 CI는 secret을 사용하지 않는다.

사용하지 않는 값:

- `OPENAI_API_KEY`
- `PERPLEXITY_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_TOKEN` write automation
- `CLOUDFLARE_API_TOKEN`
- OAuth access token
- OAuth refresh token
- deployment token
- webhook secret

CI는 `.env.local`을 생성하지 않는다. 현재 app은 mock UI 기반이며 실제 secret 없이 lint/build가 통과해야 한다.

## 금지된 자동화 범위

Phase 15 CI에서 금지되는 동작:

- OpenAI API 호출
- Perplexity API 호출
- Anthropic API 호출
- 실제 OAuth login
- OAuth callback 처리
- GitHub Issue 생성
- GitHub PR 생성
- GitHub Actions workflow dispatch automation
- Cloudflare Pages 배포 trigger
- Cloudflare API 호출
- backend/server 실행
- database 연결
- artifact upload/download/share
- production deployment approval 처리

이 workflow는 lint/build 검증만 수행한다.

## Cloudflare 배포와 분리된 상태

Phase 15 CI는 Cloudflare Pages 배포와 분리되어 있다.

분리 기준:

- `ci.yml`에는 Cloudflare action이 없다.
- `CLOUDFLARE_API_TOKEN`을 참조하지 않는다.
- Cloudflare Pages deploy trigger를 실행하지 않는다.
- `dist/` artifact를 업로드하지 않는다.
- preview deployment URL을 생성하지 않는다.

Cloudflare Pages 배포 기준은 `docs/architecture/deployment_foundation.md`에서 별도로 관리한다.

## 향후 확장 가능 영역

다음 항목은 future phase 후보이며 현재 baseline에는 구현하지 않는다.

- typecheck-only job 분리
- Playwright visual smoke test
- route smoke test
- Cloudflare Pages preview deployment check
- dependency audit job
- generated artifact validation
- GitHub Issue-first automation
- protected environment approval
- deployment status reporting
- branch protection required check 설정

확장 시에도 `docs/architecture/runtime_environment.md`의 secret boundary를 따라야 한다.

## 유지 기준

Phase 15 baseline 유지 조건:

- CI workflow는 lint/build 검증만 수행한다.
- workflow는 secret을 사용하지 않는다.
- workflow permissions는 `contents: read`를 유지한다.
- Cloudflare 배포와 분리한다.
- 실제 API/OAuth/backend behavior를 추가하지 않는다.
- `npm run lint`와 `npm run build`가 local에서도 통과해야 한다.
