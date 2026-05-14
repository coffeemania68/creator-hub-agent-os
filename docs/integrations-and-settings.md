# Integrations And Settings

## Purpose

Settings and Integrations are separate surfaces in Creator Hub Agent OS.

Settings controls how the app workspace behaves and appears. Integrations shows the readiness of external systems that will connect through a future MCP/backend boundary.

## Settings Role

Settings is for app-level operating preferences:

- workspace name
- default project
- approval mode
- notification preference
- theme and display density
- runtime mode: mock, MCP-ready, production

Settings must not collect provider credentials, OAuth secrets, API keys, or personal access tokens.

## Integrations Role

Integrations is an external connection status board. It tracks whether future systems are mock, pending, connected, or blocked.

Current MCP-ready integration categories:

- GitHub
- Cloudflare Pages
- Cloudflare Workers
- OpenAI / ChatGPT MCP
- Perplexity
- Codex / GitHub Issues
- Google
- Notion

The page is a status and handoff map, not a credential entry form.

## MCP-Ready Connection Structure

The target direction is:

```text
ChatGPT -> MCP / Backend -> Creator Hub Task -> GitHub Issue -> User Approval
```

The frontend remains a mock UI and operating console. It does not directly call OpenAI, Perplexity, Google, GitHub, Cloudflare, OAuth providers, databases, or background job systems.

## Secret Boundary

Secrets are backend-only.

API keys, OAuth client secrets, GitHub tokens, Cloudflare tokens, and provider credentials must not be placed in frontend state, browser storage, React components, or Vite-exposed variables.

Reason:

- Vite frontend code is bundled for the browser.
- Browser-visible variables can be inspected by users.
- Provider credentials require server-side rotation, audit, and access control.
- OAuth token exchange and callback handling belong in a backend or worker.

The frontend may display connection status labels and future setup requirements, but it must not include secret input fields.

## Future Integration Roadmap

Future work can add:

- Cloudflare Worker backend boundary
- MCP tool contract for ChatGPT handoff
- GitHub Issue creation after approval
- GitHub PR or Actions integration after task approval
- Cloudflare deployment status lookup
- OAuth callback handling in backend only
- audit logs for task, artifact, issue, and approval transitions
- connector sync for Google, Notion, and future knowledge sources

These are roadmap items only. Current implementation remains mock and does not execute live integration calls.
