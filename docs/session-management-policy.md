# ADR: Session lifetime & auto-logout policy

- **Status:** Proposed — **diverges from current implementation** (see _Current state vs. proposal_)
- **Date:** 2026-06-24
- **Owners:** soc-dev auth
- **Related:** [auth-system.md](auth-system.md), [user-testing-checklist.md](user-testing-checklist.md) §1.7
- **Code:** `src/components/page/SessionTimeoutWarning.svelte`, `src/routes/api/extend-session/+server.ts`

> **Note on location:** the project's `~/ai-dev-system/projects/soc-dev/design/` knowledge
> base was not mounted when this was written, so this ADR lives in the project `docs/`
> alongside `auth-system.md`. Move/mirror it into the design knowledge system if/when that
> is available.

## Context

soc-dev authenticates via Supabase SSR (`@supabase/ssr`). Access (JWT) tokens are
short-lived (~1 hr) and silently refreshed; the _session_ persists via a rotating refresh
token. A `SessionTimeoutWarning` component plus `/api/extend-session` already exist to warn
users and prolong sessions client-side.

The question: **should users be auto-logged-out after a period, and how aggressively?**

Key facts that shape the decision:

- Auto-logout's real security value is against a **walk-up attacker** — someone using a
  device a legitimate user left signed in. It does little against remote threats (stolen
  credentials, XSS, token theft), which are handled by other controls.
- soc-dev users differ enormously in blast radius:
  - **Residents** — own profile/property/address only. Low risk, mostly personal devices.
  - **KYNG coordinators** — PII of _other_ residents in their area. Higher risk.
  - **Admins** — site-wide data, roles, emergency reports, user management. High risk.
- A single uniform timeout is therefore the wrong model: it's either too annoying for
  residents (which degrades real-world security — password reuse, written-down passwords)
  or too loose for admins.

## Decision

Adopt a **role-scoped, two-tier session policy**: a sliding **idle timeout** (resets on
activity, with a pre-logout warning) plus a hard **absolute cap** (independent of activity).
Anchor the enforceable parts in **Supabase Auth** settings; the client `SessionTimeoutWarning`
_reflects_ that policy rather than being the source of truth.

### Idle (inactivity) timeout — "Balanced"

| Role        | Idle timeout | Warning before logout |
| ----------- | ------------ | --------------------- |
| Resident    | 14 days      | 2 min                 |
| Coordinator | 4 hours      | 2 min                 |
| Admin       | 60 min       | 2 min                 |

### Absolute session lifetime (hard cap) — "Tiered"

| Role        | Absolute cap |
| ----------- | ------------ |
| Resident    | 30 days      |
| Coordinator | 7 days       |
| Admin       | 12 hours     |

Reaching either limit ends the session and bounces protected routes to `/auth/signin`.

## Current state vs. proposal (as-built reconciliation)

The code that exists today does **not** implement this policy. It is a single, global
**access-token-expiry warning**, not an idle timeout and not role-aware. Concretely:

| Aspect                | Proposed policy                      | As built today                                                                                                                 |
| --------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Trigger               | User **inactivity** (idle timer)     | Supabase `session.expires_at` — the **access-token (JWT) lifetime** (~1 hr default), refreshed on any client activity          |
| Warning lead time     | 2 min                                | **5 min** (`remaining < 300`, `secondsRemaining` starts at 300)                                                                |
| Role scoping          | Resident / Coordinator / Admin tiers | **None** — identical for every user                                                                                            |
| Absolute cap          | 30 d / 7 d / 12 h                    | **None** — nothing bounds total session age                                                                                    |
| Idle detection        | Yes (reset on activity)              | **No** — there is no activity listener; it only reads token expiry                                                             |
| Extend                | `/api/extend-session`                | ✅ matches — POSTs to `/api/extend-session`, which calls `supabase.auth.refreshSession()`                                      |
| Expiry action         | Sign out + bounce to `/auth/signin`  | Redirects to `/auth/signin?reason=expired` (client-side `window.location`)                                                     |
| "Sign Out Now" button | Revoke session server-side           | ⚠️ **Only navigates** to `/auth/signin` (an `<a href>`); it does **not** call `signOut()`, so the refresh token is not revoked |

Additional caveats:

- Because `@supabase/ssr` clients auto-refresh tokens by default, the warning often **won't
  fire at all** in normal use — the JWT is silently renewed before it reaches the 5-min
  threshold. The warning realistically only appears when the tab has been backgrounded /
  the refresh has failed.
- The component polls `getSession()` every 1 s; `getSession()` reads local state (cheap),
  not the network. (Unrelated to the `getClaims()` network-call concern noted elsewhere.)

**Implication:** the proposed idle-timeout + absolute-cap + role-scoping behaviour is
greenfield work, not a tweak of the current component. Treat the §1.7 policy-target tests as
**not-yet-implemented** until this is built.

## Rationale

- **Caps scale with blast radius.** Short windows are reserved for the accounts that can
  actually do damage (admins, coordinators); residents get convenience because their blast
  radius is small.
- **Idle ≠ absolute.** The idle timer addresses the walk-up threat; the absolute cap bounds
  how long a _stolen refresh token_ can live even if the attacker keeps it "active".
- **Warn, don't surprise.** A 2-minute "stay signed in?" prompt removes most of the
  annoyance while preserving the security benefit — critical for users mid-form (property
  map, profile forms have real unsaved-work cost).

## Consequences / implementation notes

- **Supabase is the enforcement point.** Configure refresh-token rotation, the _time-box
  user sessions_ (absolute) and _inactivity timeout_ settings in Supabase Auth. The client
  warning must fire _before_ the server will reject, or client and server disagree and users
  hit surprise failures.
- **Role-scoping mechanism is TBD.** Supabase project-level session settings are global; if
  per-role idle/absolute values can't be set natively, enforce the stricter coordinator/admin
  windows in app middleware (`hooks.server.ts` / `authGuard`) layered on top of a lenient
  Supabase baseline. Decide this before implementing.
- **Don't discard unsaved work on expiry.** Preserve form state across re-auth, or block
  expiry while a form is dirty.
- **Sign-out must revoke server-side.** Ensure explicit sign-out calls `signOut` so the
  refresh token is invalidated, not just the local cookie cleared. **Current bug:** the
  "Sign Out Now" button in `SessionTimeoutWarning.svelte` is an `<a href="/auth/signin">`
  that only navigates — it does not call `signOut()`. Fix as part of this work.
- **Cookies:** confirm httpOnly / secure / sameSite on the Supabase auth cookies (largely
  handled by `@supabase/ssr`).

## Higher-leverage controls (out of scope here, but don't forget)

Timeout tuning is secondary to: refresh-token rotation on, server-side revocation at
sign-out, secure cookie flags, and XSS prevention. These defend the _remote_ threats that
timeouts do not.

## Open questions

- Can per-role idle/absolute windows be enforced in Supabase, or must app middleware do it?
- "Remember me" option for residents, or rely on the 14-day idle window?
- Should the current 5-min JWT-expiry warning be kept (as a refresh-failure safety net)
  alongside the new idle timer, or replaced by it?
