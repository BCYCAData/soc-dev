# soc-dev documentation

Design, testing, and setup docs for soc-dev. `docs/` is the source of truth for the project
(see `CLAUDE.md`); `llms.txt` at the repo root is a high-level tour.

## Design (`design/`)

- [database.md](design/database.md) — data model, RLS, JWT claims, RPCs, spatial schema, enums,
  KYNG areas, and address resolution.
- [gis-mapping.md](design/gis-mapping.md) — GIS/mapping strategy + target architecture, the
  map-authoring guide, source-data lifecycle (caching, provenance, refresh), the property
  data-capture design intent, and the source-data licensing appendix.
- [auth-and-session.md](design/auth-and-session.md) — auth architecture (Supabase SSR + RBAC),
  the route → permission map, and the session lifetime / auto-logout policy with as-built status.
- [styling-conventions.md](design/styling-conventions.md) — Skeleton UI v3 + Tailwind v4 styling
  guardrails (tokens, presets, dark-mode pairings) enforced by `npm run lint:styles`.

## Testing (`testing/`)

- [user-testing-checklist.md](testing/user-testing-checklist.md) — feature-level QA checklist.
- [cutover-checklist.md](testing/cutover-checklist.md) — production cutover / release gate.

## Setup (`setup/`)

- [mcp-setup.md](setup/mcp-setup.md) — MCP server configuration for Claude Code CLI and VSCode.

---

_This folder was consolidated from 16 overlapping files. Superseded material (the v1 map component
tree, the raw spatial DDL now owned by `supabase/migrations/`, the retired PostGIS-editing roadmap,
and the raw licensing transcript) was removed; its still-relevant content lives in the docs above.
Git history retains the originals._
