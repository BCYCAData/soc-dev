# Authentication, Authorization & Session Management

Covers three concerns: the **auth architecture** (Supabase SSR + RBAC + route protection),
the **route → permission map**, and the **session-lifetime policy** (idle + absolute
auto-logout) with its as-built implementation status.

## Overview

This system implements a multi-layered auth approach combining Supabase SSR authentication with role-based access control (RBAC) and route protection.

### Key Components

#### 1. Server-Side Authentication (hooks.server.ts)

- Handles initial auth state
- Manages Supabase client creation
- Processes session validation
- Extracts user roles and KYNG coordinates from JWT

#### 2. Route Protection (lib/auth/authGuard.ts)

Implements centralized route guarding with:

- Public route allowlist
- Protected route validation
- Permission-based access control
- KYNG coordinator area validation

#### 3. Permission Management (lib/auth/permissions.ts)

- Fetches user permissions from database
- Validates admin access levels
- Manages role-permission relationships

#### 4. Layout Data Flow

##### Server Layout Load (routes/+layout.server.ts)

Provides:

- Session state
- User data
- Role information
- Permissions
- KYNG coordinates

##### Client Layout Load (routes/+layout.ts)

Handles:

- Browser-side Supabase client
- Session management
- Data synchronization

#### 5. Navigation Components (Navbar.svelte)

Implements:

- Dynamic navigation based on auth state
- Permission-based UI elements
- KYNG coordinator access controls

### Route Protection Rules

#### Public Routes

- /
- /about
- /contact
- /policies/\*
- /auth/signup
- /auth/signin

#### Protected Routes

1. Session Required:
   - /auth/signout
   - /personal-profile/\*

2. KYNG Coordinator:
   - /kyng-coordinator
   - /kyng-coordinator/[kyng_area]

3. Admin Routes:
   - /admin/\* (requires admin permission)
   - /admin/community/\* (requires specific community permissions)
   - /admin/emergency/\* (requires emergency management permissions)
   - /admin/site/\* (requires site administration permissions)
   - /admin/users/\* (requires user management permissions)

### Usage Examples

#### Adding New Protected Routes

1. Add route pattern to routeMatchers.ts
2. Define required permissions
3. Update auth guard logic if needed

#### Implementing New Permissions

1. Add permission to database
2. Update role-permission relationships
3. Add permission check in relevant components

#### Adding Role-Based UI Elements

```typescript
{#if permissions?.includes('required.permission')}
    <YourProtectedComponent />
{/if}
```

### Auth System File Structure and Functions

#### Server-Side Files

##### src/hooks.server.ts

- Entry point for server-side auth processing
- Creates and configures Supabase server client
- Manages cookie handling for auth state
- Implements route protection middleware
- Sequences auth checks with other server hooks

##### src/routes/+layout.server.ts

- Handles server-side data loading
- Fetches and validates user session
- Retrieves user permissions
- Provides auth data to client layout
- Manages KYNG coordinator data

#### Auth Utilities

##### src/lib/server/auth/authguard.ts

- Implements route protection logic
- Validates user permissions
- Checks KYNG coordinator access
- Manages redirect flows
- Handles auth-related errors

##### src/lib/server/auth/routematchers.ts

- Defines route matching patterns
- Handles path validation
- Maps routes to required permissions
- Provides utility functions for path checking
- Manages public route allowlist

##### src/lib/server/auth/utility.ts

- Fetches user permissions from database
- Validates permission strings
- Handles role-permission mapping
- Provides permission checking utilities
- Manages admin access validation

#### Client-Side Files

##### src/routes/+layout.ts

- Creates browser-side Supabase client
- Manages client-side session state
- Handles auth state synchronization
- Provides auth data to components
- Manages auth-related dependencies

##### src/components/page/navigation/Navbar.svelte

- Renders navigation based on auth state
- Shows/hides elements by permission
- Manages auth-related UI elements
- Handles sign-in/sign-out flows
- Displays KYNG coordinator options

#### Type Definitions

##### src/app.d.ts

- Defines auth-related TypeScript types
- Declares session structure
- Types user roles and permissions
- Defines KYNG coordinator types
- Declares global namespace augmentations

##### src/lib/types.ts

- Contains shared type definitions
- Defines permission interfaces
- Types for KYNG area data
- User profile types
- Auth-related utility types

#### Additional Files

```text
Public Routes:
/
/about
/contact
/policies/privacy
/policies/termsofservice
/auth/signup
/auth/signin

Protected Routes:
Sign Out Route:
/auth/sgnout => have session and user

    Onboarding Profile Route:
      /personal-profile-form => only on redirect from callback

    Personal Profile Route:
      /personal-profile => have session and user
      /personal-profile/my-property/[propertyid] => have session and user and UserPropertyProfile.id === `propertyid`

    Coordinator Routes:
      /kyng-coordinator => length `coordinatesKYNG`> 0 and not null
      /kyng-coordinator/[kyng_area] => `coordinatesKYNG`.kyngAreaId === `kyng_area`

    Admin Routes: /admin => permissions.includes('admin')
     Community Admin: /admin/community => permissions.includes('admin.communities')
      /admin/community/bcyca => permissions.includes('admin.bcyca')
      /admin/community/bcyca/workshops => permissions.includes('admin.bcyca.workshops')
      /admin/community/bcyca/information => permissions.includes('admin.bcyca.information')
      /admin/community/bcyca/events => permissions.includes('admin.bcyca.events')
      /admin/community/bcyca/map => permissions.includes('admin.bcyca')
      /admin/community/tinonee => permissions.includes('admin.tinonee')
      /admin/community/tinonee/workshops => permissions.includes('admin.tinonee.workshops')
      /admin/community/tinonee/information => permissions.includes('admin.tinonee.information')
      /admin/community/tinonee/events => permissions.includes('admin.tinonee.events')
      /admin/community/tinonee/map => permissions.includes('admin.tinonee')
      /admin/community/mondrook => permissions.includes('admin.mondrook')
      /admin/community/mondrook/workshops => permissions.includes('admin.mondrook.workshops')
      /admin/community/mondrook/events => permissions.includes('admin.mondrook.events')
      /admin/community/mondrook/information => permissions.includes('admin.mondrook.information')
      /admin/community/mondrook/map => permissions.includes('admin.mondrook')
      /admin/community/external => permissions.includes('admin.external')
      /admin/community/external/events => permissions.includes('admin.external.events')
      /admin/community/external/workshops => permissions.includes('admin.external.workshops')
      /admin/community/external/information => permissions.includes('admin.external.information')
      /admin/community/external/map => permissions.includes('admin.external')
     Emergency Admin:
      /admin/emergency => permissions.includes('admin.emergency')
      /admin/emergency/reports => permissions.includes('admin.emergency.reports')
      /admin/emergency/service-map => permissions.includes('admin.emergency.servicemap')
     Site Admin:
      /admin/site => permissions.includes('admin.site')
      /admin/site/data => permissions.includes('admin.site.data')
      /admin/site/messages => permissions.includes('admin.site.messages')
      /admin/site/roles => permissions.includes('admin.site.roles')
     Users Admin:
      /admin/users => permissions.includes('admin.users')
      /admin/users/kits => permissions.includes('admin.users.kits')
      /admin/users/new => permissions.includes('admin.users.new')
```

---

## Session lifetime & auto-logout

- **Status:** Policy proposed 2026-06-24; **implemented** (Phases 1–3 done — server enforcement,
  client UX, sign-out fix). Phase 4 (formal verification) is the remaining work.
- **Owners:** soc-dev auth
- **Tests:** [user-testing-checklist.md](../testing/user-testing-checklist.md) §1.7
- **Code:** `src/lib/constants/sessionPolicy.ts`, `src/lib/server/auth/sessionTracking.ts`,
  `hooks.server.ts` (`enforceSessionLifetime`), `src/components/page/SessionTimeoutWarning.svelte`,
  `src/routes/api/extend-session/+server.ts`, `src/routes/api/session/keepalive/+server.ts`

### Context

soc-dev authenticates via Supabase SSR (`@supabase/ssr`). Access (JWT) tokens are short-lived
(~1 hr) and silently refreshed; the _session_ persists via a rotating refresh token.

Auto-logout's real security value is against a **walk-up attacker** — someone using a device a
legitimate user left signed in. It does little against remote threats (stolen credentials, XSS,
token theft), which are handled by other controls (refresh-token rotation, secure cookies, XSS
prevention). Users differ enormously in blast radius, so a single uniform timeout is the wrong
model — too annoying for residents (which degrades real security via password reuse) or too loose
for admins:

- **Residents** — own profile/property/address only. Low risk, mostly personal devices.
- **KYNG coordinators** — PII of _other_ residents in their area. Higher risk.
- **Admins** — site-wide data, roles, emergency reports, user management. High risk.

### Decision

A **role-scoped, two-tier** policy: a sliding **idle timeout** (resets on activity, with a
pre-logout warning) plus a hard **absolute cap** (independent of activity). Reaching either limit
ends the session and bounces protected routes to `/auth/signin`.

#### Idle (inactivity) timeout — "Balanced"

| Role        | Idle timeout | Warning before logout |
| ----------- | ------------ | --------------------- |
| Resident    | 14 days      | 2 min                 |
| Coordinator | 4 hours      | 2 min                 |
| Admin       | 60 min       | 2 min                 |

#### Absolute session lifetime (hard cap) — "Tiered"

| Role        | Absolute cap |
| ----------- | ------------ |
| Resident    | 30 days      |
| Coordinator | 7 days       |
| Admin       | 12 hours     |

**Rationale:** caps scale with blast radius; the idle timer addresses the walk-up threat while the
absolute cap bounds how long a _stolen refresh token_ can live even if kept "active". Warn, don't
surprise — the 2-min prompt preserves the security benefit while protecting mid-form work.

### The central constraint

**Supabase session settings are project-global, not per-role.** The Auth "time-box user sessions"
and "inactivity timeout" settings apply to every user equally, so they cannot express the
resident/coordinator/admin tiers. Therefore per-role windows are enforced **in the app**, layered
on a deliberately **lenient Supabase baseline** — Supabase is the floor; the app is the (stricter)
ceiling. `hooks.server.ts` already resolves `event.locals.userRole` from the `user_role` JWT claim
on every request, so the role is in hand where server-side enforcement belongs.

### Architecture — two enforcement layers + one config source

1. **Shared policy module** — `src/lib/constants/sessionPolicy.ts`: single isomorphic source of
   thresholds (client + server import it). Exports `SessionTier`, `SessionWindow`,
   `SESSION_POLICY`, `tierForRole(role, permissions)` (reuses `isAdmin` so a permission-only admin
   can't inherit the lenient resident window) and `windowForRole`.
2. **Server enforcement (the security boundary)** — cookies + a hook step that force-ends breaching
   sessions. Cannot be bypassed by disabling JS.
3. **Client UX (warning only)** — `SessionTimeoutWarning` detects real inactivity, is role-aware,
   and shows idle + absolute countdowns. Never the source of truth.

| Window          | Needs                    | Source                                               |
| --------------- | ------------------------ | ---------------------------------------------------- |
| Idle (sliding)  | `lastActivity` timestamp | `LAST_ACTIVITY` cookie, bumped per server request    |
| Absolute (hard) | `sessionStart` timestamp | `SESSION_START` HttpOnly cookie, set once at sign-in |

### As-built status

- **Supabase baseline (walked 2026-06-25 on the dev backend):** `refresh_token_rotation_enabled=true`
  (the key control — no change), `jwt_exp=3600`, `sessions_timebox=0`, `sessions_inactivity_timeout=0`.
  The absolute time-box backstop (31d) is **402-gated on the free tier**, so there is no platform
  backstop — the app's per-role enforcement is the sole mechanism until the prod project is Pro
  (same gate as leaked-password protection; see the cutover checklist).
- **Server enforcement — done.** `sessionTracking.ts` stores `SESSION_START` as
  `"{startMs}.{sessionId}"` (bound to the Supabase `session_id` — fixes stale-deadline and
  instant-idle bugs of a naive timestamp). `enforceSessionLifetime` in `hooks.server.ts` (after
  claims, before `resolve`) signs out + clears tracking + redirects to
  `/auth/signin?reason=expired|idle` when a window is breached; otherwise it slides `LAST_ACTIVITY`.
  `sessionPolicy` is exposed to the client via root `+layout.server.ts` (display-only).
- **Client UX — done.** `SessionTimeoutWarning` consumes `page.data.sessionPolicy`, does real idle
  detection (throttled `pointerdown`/`keydown`/`visibilitychange`, mirrored to `localStorage` and
  synced across tabs), warns at the sooner of idle/absolute deadlines, and has a distinct
  absolute-cap message. A keep-alive ping (`POST /api/session/keepalive`, throttled to
  `min(warningMs, 60s)`) slides the server idle cookie so it can't lapse before the warning shows.
  Unsaved-work guard: the `unsavedChanges` registry holds the warning open ("unsaved changes can't
  be kept") instead of auto-redirecting — warn-not-persist by design.
- **Sign-out bug — fixed.** "Sign Out Now" is now a real `POST` server sign-out, and
  `clearSessionTracking` runs on all three sign-out paths (signout action, hooks enforcement,
  email-change confirm). The signin page renders a neutral notice for
  `?reason=expired|idle|session-refresh-failed` so these sign-outs aren't silent.

### Remaining work / open questions

- **Phase 4 verification:** work through [user-testing-checklist.md](../testing/user-testing-checklist.md)
  §1.7.B; make thresholds overridable (env/query param) so a 14-day idle window can be exercised in
  seconds; re-run `get_advisors` (security) after any Supabase baseline change.
- **Cookie tampering:** `SESSION_START` / `LAST_ACTIVITY` are HttpOnly but client-sent — consider
  HMAC-signing if a user shifting their _own_ absolute deadline is in scope (low priority for the
  walk-up threat model).
- **Role change mid-session:** tier follows the `user_role` claim, which updates only on token
  refresh — a promotion/demotion applies on next refresh, not instantly. Accepted.
- **Higher-leverage controls (don't forget):** refresh-token rotation on, server-side revocation at
  sign-out, secure cookie flags, XSS prevention — these defend the _remote_ threats that timeout
  tuning does not.
