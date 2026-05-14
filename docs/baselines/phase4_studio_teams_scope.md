# Phase 4 Studio Teams Scope

## Current MVP Scope

Studio Teams is an AI employee board. It shows who exists in the production team, what role each agent owns, and the current mock status.

The `/teams` screen should remain simpler than Dashboard and PM Workspace. It is not a command execution surface.

## Implemented In MVP

- Overview Stats
- Team-based agent groups
- Individual agent cards
- Selected Agent Summary panel

## Agent Card Fields

- Agent name
- Role
- Status badge
- Team
- One-line capability summary

## Not Implemented Yet

The following ideas are reserved for future phases and should not appear in the current MVP `/teams` UI:

- Agent Detail Panel tabs
- Agent Profile Full Page
- Skilltree
- Logs
- Workflows
- Settings tabs
- Current task display
- Readiness progress bar
- Recent output display
- Command boxes
- Heavy model/engine tags
- Active now / need routing counters
- Session log
- Override Control
- Open Studio Control action

## UX Boundary

Commands and execution belong in PM Workspace. Studio Teams only explains the AI staff structure and basic status.

## Guardrails

- Do not modify Dashboard while refining Studio Teams.
- Do not modify PM Workspace while refining Studio Teams.
- Keep all data mock-only.
- Do not add API, OAuth, Firebase, Supabase, or backend connections.
