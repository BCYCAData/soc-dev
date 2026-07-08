# Strengthen Our Community (soc-dev)

Community fire-safety and property-preparedness platform for NSW rural
communities (BCYCA, Tinonee, Mondrook and external members). Residents record
the property details that help emergency services respond — access, hazards,
assets, residents — on forms and property maps; KYNG coordinators and admins
get area maps, reports (RFS PDFs) and administration tools.

## Stack

- **Frontend:** SvelteKit 2 / Svelte 5 (runes) + Skeleton UI v3 + Tailwind v4
- **Backend:** Supabase (Postgres + PostGIS, Auth with custom JWT claims + RLS)
- **Mapping:** Leaflet via the config-driven MapView engine (`src/lib/map/`)
- **Hosting:** Vercel (Sydney), weekly cron for spatial data refresh

## Getting started

```bash
nvm use                      # Node 22
npm ci
cp .env.example .env.local   # fill in values (see comments in the file)
npm run dev
```

Key commands:

| Command                   | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| `npm run dev`             | Dev server                                        |
| `npm run check`           | svelte-check (types)                              |
| `npm run lint`            | style guardrail + prettier + eslint               |
| `npm run build`           | production build                                  |
| `npm run update-db-types` | regenerate `src/lib/db.types.ts` from the live DB |

## Where things live

- `src/routes/(public)` — landing, about, auth flows
- `src/routes/(protected)` — personal-profile, kyng-coordinator, admin
- `src/lib/map/` — MapView engine, profiles and layer configs
  (see `docs/authoring-map-layers.md`)
- `src/lib/server/` — auth guards, permissions, error logging
- `supabase/migrations/` — forward-only migration line (CI replays it on a
  fresh Postgres)
- `docs/` — the real design docs: database, GIS strategy, styling conventions,
  session management, user-testing checklist, cutover checklist

## Auth model (short version)

`hooks.server.ts` decodes custom JWT claims (role, permissions, property*ids,
coordinates_kyng) into `locals`; route-level authorization is centralized in
`src/lib/server/auth/authguard.ts` (admin permission tokens are derived from
the URL path). Standalone endpoints and form actions must guard themselves with
`requireUser` / `requirePermission` from `src/lib/server/auth/apiGuard.ts`.
Database access is enforced with RLS using the `jwt*\*` helper functions.
