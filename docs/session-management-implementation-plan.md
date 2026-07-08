# Implementation plan: role-scoped idle timeout + absolute cap

- **Status:** Draft
- **Date:** 2026-06-24
- **Policy:** [session-management-policy.md](session-management-policy.md)
- **Tests:** [user-testing-checklist.md](user-testing-checklist.md) §1.7.B
- **Touches:** `hooks.server.ts`, `SessionTimeoutWarning.svelte`, signin/signout/confirm flows, new `sessionPolicy.ts`

## The central constraint

**Supabase session settings are project-global, not per-role.** The Supabase Auth
"time-box user sessions" and "inactivity timeout" settings apply to every user equally, so
they **cannot** express the resident/coordinator/admin tiers we want. Therefore:

> Per-role windows must be enforced **in the app**, layered on top of a deliberately
> **lenient Supabase baseline**. Supabase is the floor; the app is the (stricter) ceiling.

The good news: `hooks.server.ts` already resolves `event.locals.userRole` from the
`user_role` JWT claim on every request (`hooks.server.ts:59`), so the role is in hand at the
exact place server-side enforcement belongs.

## Design

Two enforcement layers + one config source of truth:

1. **Shared policy module** — single isomorphic source of thresholds (client + server import it).
2. **Server enforcement (the security boundary)** — cookies + a hook step that force-ends breaching sessions. Cannot be bypassed by disabling JS.
3. **Client UX (warning only)** — reworked `SessionTimeoutWarning` that detects real inactivity, is role-aware, and shows both idle and absolute countdowns. Never the source of truth.

### What "idle" and "absolute" need

| Window          | Needs                    | Source                                                                                         |
| --------------- | ------------------------ | ---------------------------------------------------------------------------------------------- |
| Idle (sliding)  | `lastActivity` timestamp | `LAST_ACTIVITY` cookie, bumped per server request; client also tracks activity for the warning |
| Absolute (hard) | `sessionStart` timestamp | `SESSION_START` HttpOnly cookie, set once at sign-in                                           |

Supabase exposes no reliable "session created at" to the client, which is why we record
`sessionStart` ourselves at sign-in.

---

## Phase 0 — Decisions & Supabase baseline (no code)

- [x] **Role taxonomy — RESOLVED.** `user_role` ∈ `'admin' | 'kyng_coordinator' | 'user'`
      (per `authguard.ts:57`, default `'user'`). Coordinators are identified by the assigned
      `kyng_coordinator` role. Mapping is implemented in `tierForRole` (see Phase 1): admin
      role **or** root `admin` permission → admin tier (mirrors `isAdmin`); `kyng_coordinator`
      → coordinator; everything else → resident.
- [x] **Supabase baseline — WALKED (2026-06-25, on `supabase-newprod`, the dev backend).**
      Current `config/auth`: `refresh_token_rotation_enabled=true` (reuse interval 10s) ✅,
      `jwt_exp=3600`, `sessions_timebox=0`, `sessions_inactivity_timeout=0`. - **Rotation** is already on (available on free tier) — the key security control. No change. - **Inactivity timeout** stays `0`: it's global-only, so it can't express the per-role
      policy; the app enforces idle per role instead. - **Absolute time-box backstop** (31d, ≥ all app caps) was chosen but is **blocked on
      free tier** — PATCH `sessions_timebox` returns HTTP 402 "User sessions can only be
      configured on Pro Plans and up." So there is **no platform backstop**; the app's
      per-role enforcement is the sole mechanism. A 31-day backstop becomes available only
      if the prod project is upgraded to Pro (same gate as B6 leaked-password). Recorded in
      the [[soc-migration-projects]] memory.
- [x] **Idle enforcement strength — RESOLVED:** server-enforces both idle and absolute
      (`hooks.server.ts`), with the client warning as UX only. Done in Phase 2/3.

## Phase 1 — Shared policy module

- [x] **`src/lib/constants/sessionPolicy.ts` — DONE.** Single source of truth, placed in
      `lib/constants/` (the project's home for isomorphic, client-safe config + pure helpers,
      alongside `permissions.ts`) rather than the originally-sketched `lib/auth/`. Exports
      `SessionTier`, `SessionWindow`, `SESSION_POLICY`, `tierForRole(role, permissions)`, and
      a `windowForRole` convenience. `tierForRole` reuses `isAdmin` from `permissions.ts` so a
      permission-only admin can't inherit the lenient resident window. Imported by hooks
      (server) and the warning component (client) so the numbers never drift. Typechecks clean.
- [ ] **Add cookie-name constants** to `src/lib/constants.ts`: `SESSION_START_COOKIE`,
      `LAST_ACTIVITY_COOKIE` (+ path/sameSite, mirroring the existing `RECOVERY_COOKIE_*`).

## Phase 2 — Server enforcement (security boundary) — ✅ DONE

Implemented and verified (svelte-check + prettier + `npm run build` all clean).

- [x] **Tracking cookies + helper.** `SESSION_START_COOKIE` / `LAST_ACTIVITY_COOKIE` (+ path
      / max-age) added to `constants.ts`; new server-only `src/lib/server/auth/sessionTracking.ts`
      provides `getSessionStart` / `readSessionTracking` / `writeSessionTracking` /
      `clearSessionTracking`. **Refinement vs. original sketch:** `SESSION_START` is stored as
      `"{startMs}.{sessionId}"`, **bound to the Supabase `session_id`**, rather than a bare
      "set only if absent" timestamp. This fixes two bugs the naive approach had: a re-login
      after a non-clearing sign-out inheriting a stale absolute deadline, and a stale
      `LAST_ACTIVITY` causing an instant-idle logout on the new login. `null` sessionId is
      normalised to `''` on both sides so enforcement can't silently disable itself.
- [x] **`enforceSessionLifetime` step in `hooks.server.ts`** (step "3b", after claims, before
      `resolve`). For an authenticated `user`: resolve the window via
      `windowForRole(userRole, permissions)`, read the (session-bound) anchors, and if
      `now > sessionStart + absoluteMs` **or** `now > lastActivity + idleMs` →
      `signOut()` + `clearSessionTracking()` + `throw redirect(303, /auth/signin?reason=expired|idle)`.
      Otherwise persist the anchor and slide `LAST_ACTIVITY`. No redirect loop (signed-out
      next request has no `user`).
- [x] **Exposed `sessionPolicy` to the client** via root `+layout.server.ts`
      (`{ tier, idleMs, absoluteMs, warningMs, absoluteDeadline }`, null when no session);
      typed in `app.d.ts`. Display-only — the server enforces independently. `cookies.set` in
      hooks is visible to the same-request layout `load`, so the deadline is populated even on
      the first post-login request.
- [x] **Sign-out bug fixed.** "Sign Out Now" in `SessionTimeoutWarning.svelte` is now a
      `<form method="POST" action={resolve('/auth/signout')}>` (real server sign-out), and
      `clearSessionTracking` runs on **all three** sign-out paths (signout action, hooks
      enforcement, email-change in `auth/redirect/confirm`). Closes §1.7.A.7 / §1.7.B.8.

> **Note — enforcement now precedes the UX.** The server will sign a user out at the
> role's idle/absolute window even though the client component still only warns at the old
> 5-min JWT mark (Phase 3 not yet done). Affected users get bounced to
> `/auth/signin?reason=idle|expired` without a prior in-app warning. Acceptable interim
> state; Phase 3 closes it.
>
> ✅ **Follow-up done:** the signin page now renders a neutral (`warning`-tone,
> `aria-live="polite"`) notice for `?reason=expired|idle|session-refresh-failed` and the
> email-change `?message=email_changed`, so these sign-outs are no longer silent.

## Phase 3 — Client UX rework (`SessionTimeoutWarning.svelte`) — ✅ DONE

Implemented and verified (svelte-autofixer clean · svelte-check 0 errors · prettier · build).

- [x] **Consumes `page.data.sessionPolicy`** (tier, `idleMs`, `absoluteMs`, `warningMs`,
      `absoluteDeadline`) instead of hard-coded values; renders nothing when it's null
      (signed out / public). Dropped the Supabase browser client + `expires_at` polling.
- [x] **Real idle detection:** throttled `pointerdown` / `keydown` / `visibilitychange`
      listeners update `lastActivity`, mirrored to `localStorage` (`soc:last-activity`) and
      synced across tabs via the `storage` event.
- [x] **Warns at the sooner of `idleDeadline` and `absoluteDeadline`** (− `warningMs`), with
      the existing modal + `m:ss` countdown driven off `remainingMs`.
- [x] **"Stay Signed In"** calls `/api/extend-session` and resets the idle timer (the request
      also slides the server `LAST_ACTIVITY`). **Absolute-cap mode** shows a distinct "maximum
      length reached — sign in again" message with a single sign-out button instead of a
      no-op extend. Forced redirect to `/auth/signin?reason=expired|idle` when a deadline lapses.
- [x] **Keep-alive endpoint** `POST /api/session/keepalive` (returns 204): pinged from the
      component, throttled to `min(warningMs, 60s)`, while the user interacts. This slides the
      server idle cookie without a token refresh and resolves the SPA-divergence risk — the
      ≤ `warningMs` cadence guarantees the server can't lapse before the client warning shows.
- [x] **Guard against unsaved work** (§1.7.B.7) — _done (warn + confirm approach)._ New
      `$stores/unsavedChanges.svelte.ts` registry (reactive `hasUnsaved`); forms opt in via
      `unsavedChanges.acquire()` (reactive) or the one-line `use:trackFormChanges` action in
      `$lib/svelte-actions`. When a deadline lapses **with** unsaved changes, the warning
      shows a held-open "Session ended — unsaved changes can't be kept" state (manual "Sign In
      Again") instead of auto-redirecting; with no unsaved changes it redirects as before. The
      warning also appends a "you have unsaved changes" nudge during the countdown. Wired into
      the `aboutme` profile form via its existing `unsaved` state as the reference example;
      other forms opt in with one line. _Note:_ this is warn-not-persist — work is not saved
      across re-auth, by design (chosen scope).

## Phase 4 — Verify

- [ ] Work through [user-testing-checklist.md](user-testing-checklist.md) **§1.7.B**, ticking
      items as each lands; re-run **§1.7.A** to confirm no regression in the existing warning.
- [ ] For testing, make thresholds overridable (env var / query param) so a 14-day idle
      window can be exercised in seconds without waiting.
- [ ] Run `get_advisors` (security) on the dev project after the Supabase baseline change.

## Risks / open questions

- ~~**SPA navigations & the sliding idle cookie.**~~ Resolved by the `POST /api/session/keepalive`
  ping (Phase 3): client interaction slides the server cookie at a `≤ warningMs` cadence, so
  the server idle clock can't lapse before the warning appears even with no navigation.
- **Cookie tampering.** `SESSION_START` / `LAST_ACTIVITY` are HttpOnly but client-sent;
  consider signing them (HMAC) if a user shifting their own absolute deadline is in scope.
  For the walk-up threat model it's low priority — the attacker isn't editing cookies.
- **Role change mid-session.** Tier follows the `user_role` claim, which only updates on
  token refresh — a promotion/demotion applies on next refresh, not instantly. Acceptable.
- ~~**Coordinator identification.**~~ Resolved: assigned `kyng_coordinator` role (see Phase 0).

## Suggested sequencing

Phase 0 → Phase 2 sign-out fix (quick win, closes a real bug) → Phase 1 → rest of Phase 2 →
Phase 3 → Phase 4. The absolute-cap server enforcement (Phase 2) delivers the core security
value even before the client rework lands.
