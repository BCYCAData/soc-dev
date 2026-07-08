# Project Instructions for Claude

## Project: soc-dev

This project uses an AI-assisted development system for design documentation, conventions, and domain knowledge.

## Knowledge System Location

`~/ai-dev-system/`

## Before Responding to Implementation Questions

1. **Check the repo design docs first**: `docs/` in this repository is the
   source of truth. It is organised into `docs/design/` (database.md,
   gis-mapping.md, auth-and-session.md, styling-conventions.md), `docs/testing/`
   (user-testing-checklist.md, cutover-checklist.md), and `docs/setup/`
   (mcp-setup.md). See `docs/README.md` for the index.
2. **Repo conventions beat shared conventions**: `.prettierrc`, `eslint.config`,
   and `docs/design/styling-conventions.md` are authoritative. The shared
   `~/ai-dev-system/core/conventions/` docs are written for a different project
   (Skeleton v4 / bendev theme) — treat them as background only.
3. **Reference domain knowledge**: `~/ai-dev-system/domains/community-environmental-management/`

## Source Priority (highest to lowest)

1. Design docs in this repo: `docs/` (plus `llms.txt` for a high-level tour)
2. Repo tooling config: `.prettierrc`, `eslint.config.js`, `scripts/check-styles.sh`
3. Library documentation (via GitHub MCP or Fetch MCP)
4. Domain knowledge in `~/ai-dev-system/domains/community-environmental-management/`
5. General knowledge (flag as unverified)

## When Providing Code

- Follow patterns in `~/ai-dev-system/core/conventions/component-patterns.md`
- Follow database conventions in `~/ai-dev-system/core/conventions/database-conventions.md`
- Follow API conventions in `~/ai-dev-system/core/conventions/api-conventions.md`
- Cite sources for technical recommendations
- Flag uncertainty rather than guessing

## Project Context

| Attribute             | Value                              |
| --------------------- | ---------------------------------- |
| **Project name**      | soc-dev                            |
| **Domain**            | Community Environmental Management |
| **Design docs**       | `docs/` (in this repository)       |
| **Current iteration** | v0.1                               |

## Technology Stack

- **Frontend**: SvelteKit + Skeleton UI (Svelte 5 runes)
- **Backend**: Supabase (PostgreSQL + PostGIS)
- **Spatial**: PostGIS
- **Mapping**: Leaflet (config-driven MapView engine in `src/lib/map/`)

## Key Commands

```bash
# Development
npm run dev

# Build
npm run build

# Check types
npm run check
```

## Important Files

- `src/routes/` — SvelteKit routes
- `src/lib/` — Shared components and utilities
- `supabase/migrations/` — Database migrations (if present)
