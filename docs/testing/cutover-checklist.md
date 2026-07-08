# Production cutover checklist — SOCData-Prod (`rcnccgyvdgmcnomwcaja`)

One consolidated, ordered list for switching production from the old Supabase
project ("StrengthenOurCommunity", `oiwbamoupmoudqwautha`) to the new
**SOCData-Prod** project. Sources: `scripts/migrate-reference/README.md`,
`scripts/migrate-legacy/README.md`, `docs/design/gis-mapping.md` §7,
`docs/design/auth-and-session.md` (session lifetime & auto-logout).

Status column: fill in date/initials as each step is verified.

## A. Pre-cutover gates (owner decisions — cannot be done in code)

| #   | Gate                                                                                                                                             | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| A1  | Supabase **Pro plan** decision for SOCData-Prod (absolute session time-box + leaked-password protection are 402-gated on free tier)              |        |
| A2  | Licensing confirmations: G-NAF product tier, Geocoding API ToU, mail-compilation caveat (`docs/design/gis-mapping.md`, source-data lifecycle §3) |        |
| A3  | Enable **leaked-password protection** (Dashboard → Auth → Passwords) once Pro                                                                    |        |
| A4  | Unpause / decommission decision for the old dev project (`swyytxokzdqqitszxaep`) — currently paused                                              |        |

## B. Database state (SOCData-Prod)

| #   | Step                                                                                                                                 | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| B1  | Migration line applied through `20260707231000_app_errors_table` (`supabase migration list` matches repo)                            |        |
| B2  | Reference/spatial data loaded (17 tables — `scripts/migrate-reference`; counts spot-checked)                                         |        |
| B3  | Legacy users + properties loaded (`scripts/migrate-legacy` transform + backfill; 181 property_profiles / 134 geometries at last run) |        |
| B4  | **Custom access token hook enabled** in Dashboard → Auth → Hooks (NOT captured in SQL dumps — this bit us before)                    |        |
| B5  | Auth URL configuration: Site URL + redirect URLs point at the production domain                                                      |        |
| B6  | SMTP / email templates configured (confirmation, recovery, email change) and send from the production domain                         |        |
| B7  | `get_advisors` (security + performance) re-run; remaining lints match the documented accepted list                                   |        |
| B8  | pg_cron jobs present (monthly spatial refresh) and `read_secret` secrets set in Vault                                                |        |

## C. Application deployment (Vercel)

| #   | Step                                                                                                                                                                                 | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| C1  | Vercel env vars set for production: all keys in `.env.example` (Supabase URL/anon/service-role → SOCData-Prod; Geoscape keys; `CRON_SECRET`; `EDGE_CONFIG`; contact/production URLs) |        |
| C2  | `npm run lint && npm run check && npm run build` green on the release commit; CI green (quality + migrations jobs)                                                                   |        |
| C3  | Deploy to production; verify `/api/cron` responds 401 without bearer and Vercel cron is scheduled (Sun 02:00)                                                                        |        |
| C4  | DNS switched to the new deployment (if the domain changes hands)                                                                                                                     |        |

## D. Verification (on production, after C)

| #   | Step                                                                                                                                                       | Status |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| D1  | Real-account smoke: sign in as a migrated resident → sees own property, profile values, community sections; JWT claims present (property_ids, permissions) |        |
| D2  | New-account smoke: full signup (address challenge → email confirm → onboarding form)                                                                       |        |
| D3  | Admin smoke: users/kits, community access-request approve, emergency service map, RFS PDF                                                                  |        |
| D4  | KYNG smoke: coordinator sees only their area; area map renders                                                                                             |        |
| D5  | Full run of `docs/testing/user-testing-checklist.md` §1–§7 recorded in the run logs                                                                        |        |
| D6  | `app_errors` receiving rows (force one client + one server error) and being reviewed                                                                       |        |

## E. Rollback plan

- The old production project remains untouched until D-steps pass; rolling back
  is a DNS/Vercel env revert to the old project.
- Database changes on SOCData-Prod are forward-only migrations; if a migration
  step fails during cutover, restore from the automated Supabase backup taken
  immediately before B1 and re-run.
- Take a manual backup (Dashboard → Database → Backups) immediately before the
  final data load and before DNS switch.
