# User Testing Checklist

> **Living document.** This checklist enumerates every user-facing interaction in soc-dev
> and the manual tests that confirm each one behaves correctly. It is built up
> incrementally — sections marked _Not yet written_ are placeholders to be filled in over
> time. Detailed test cases currently exist for the **Authentication** flows.

## How to use this document

- Each test has a checkbox. Tick it when the test passes against the current build.
- When a flow changes, **clear** the relevant checkboxes and re-test rather than assuming.
- Record the environment a test was last run against in the run-log table at the bottom of
  each completed section (dev / staging / prod, date, tester, build/commit).
- Prefer testing against **dev Supabase** first; only repeat against prod when a release is
  being cut.
- Legend: ✅ pass · ❌ fail (link an issue) · ⏭️ skipped/blocked · 🚧 not yet implemented.

## Conventions

- **Preconditions** — state the app/account must be in before the test starts.
- **Steps** — the exact user actions.
- **Expected** — the observable, user-visible result (URL, message, redirect, UI state).
- Test both the **happy path** and the **failure/edge paths** for every interaction.
- Where a flow sends email, use a real inbox you control (the dev allow-list gates which
  addresses can sign up — see [auth-system.md](auth-system.md)).

---

## Document structure (interaction map)

This is the master outline of every user interaction. Sub-sections are expanded with full
test cases as the document matures.

1. **Authentication & account access** — _detailed below_
   1. Sign up (address challenge → account creation → email confirmation)
   2. Sign in
   3. Sign out
   4. Password reset (request → email → set new password)
   5. Email change
   6. Email-not-allowed / ineligible-address handling
   7. Session lifetime (timeout warning, extend session, expiry)
2. **Public site** — _not yet written_
   1. Home / landing
   2. About
   3. Contact (and mailto actions)
   4. Policies — Privacy, Terms of Service
3. **Personal profile (authenticated)** — _not yet written_
   1. Profile landing / completion tracking
   2. About me
   3. My settings
   4. My property — list, detail, property map (PostGIS editing)
   5. My community — BCYCA, Mondrook (information / map / events), Tinonee, External
4. **KYNG coordinator** — _not yet written_
   1. Area dashboard
   2. Area map
   3. Unregistered addresses
   4. User admin
5. **Admin** — _not yet written_
   1. Community management — BCYCA, Mondrook, Tinonee, External
   2. Site — roles, data, profile requirements, messages
   3. Emergency — service map, reports
   4. Users — new, kits, KYNG coordinators
6. **Cross-cutting concerns** — _not yet written_
   1. Navigation / navbar (auth-aware, permission-gated items)
   2. Route protection & authorization (allow-list, permission denial, KYNG area scoping)
   3. Toasts / notifications
   4. Forms — validation, error display, dirty-state, submit/disable behaviour
   5. Accessibility — keyboard nav, focus, `aria-live` regions, colour contrast
   6. Responsive layout — mobile / tablet / desktop breakpoints
   7. Error pages — `/auth/error`, `+error.svelte`, 404
7. **API endpoints (indirect / integration)** — _not yet written_
   1. Geoscape tiles & metadata
   2. Spatial (suburb / roads)
   3. Reports (RFS properties / street)
   4. Session extension / cron

---

## 1. Authentication & account access

Routes involved:

- `/auth/signup` — address challenge + account creation (`+page.server.ts` actions: `validate`, `signup`)
- `/auth/signin` — sign in (`signin` action)
- `/auth/signout` — sign out
- `/auth/requestresetpassword` — request a reset email
- `/auth/redirect/confirm` — email-link handler (PKCE `code` + OTP `token_hash`)
- `/auth/redirect/resetpassword` — set new password (recovery-gated)
- `/auth/redirect/changeemail` — email-change handling
- `/auth/redirect/signup/respond` — post-signup messaging
- `/auth/redirect/signup/personal-profile-form` — post-confirmation onboarding
- `/auth/redirect/email-not-allowed` — blocked by dev allow-list

> **Key domain rule:** signup is a two-stage flow. The user must first pass an **address
> challenge** (Geoscape validation via the `get_addresspoint_from_address` RPC) before the
> email/password account is created. Address status codes drive which panel renders:
> `100 UNCHALLENGED`, `200 VALID`, `404 INELIGIBLE`, `403 NOT_FOUND`, else system error.

### 1.1 Sign up

#### 1.1.1 Address challenge — happy path (valid address)

- [ ] **Preconditions:** signed out. On `/auth/signup` the `AddressUnchallenged` panel shows (status `100`).
- [ ] **Steps:** enter a known-valid street address + suburb within a serviced community; submit the `validate` action.
- [ ] **Expected:** the validated address payload returns `success: true`; the `AddressValid` panel renders with the matched address (street/suburb/postcode/community) and reveals the email/password fields.

#### 1.1.2 Address challenge — address not found (403)

- [ ] **Preconditions:** signed out, on `/auth/signup`.
- [ ] **Steps:** enter a plausibly-formatted address that Geoscape cannot resolve; submit `validate`.
- [ ] **Expected:** the "Unfortunately we could not find this address" panel renders with the searched street/suburb echoed back, plus a **MailtoButton** pre-filled with subject `SOC Address not found: '<street>, <suburb>'` to `PUBLIC_CONTACT_EMAIL`.

#### 1.1.3 Address challenge — ineligible address (404)

- [ ] **Preconditions:** signed out, on `/auth/signup`.
- [ ] **Steps:** enter an address that resolves but is outside the eligible area.
- [ ] **Expected:** the `AddressIneligible` panel renders with the street/suburb; no email/password fields are offered.

#### 1.1.4 Address challenge — system / RPC error

- [ ] **Preconditions:** signed out; force a validation error (e.g. invalid/expired `PUBLIC_GEOSCAPE_ADDRESS_API_KEY` or RPC failure).
- [ ] **Steps:** submit the `validate` action.
- [ ] **Expected:** `success: false` with message "Failed to validate address"; the `AddressSystemError` panel renders; an entry is written to `address_validation_errors` (errorType `VALIDATION_ERROR`) with client IP/user-agent metadata.

#### 1.1.5 Account creation — happy path

- [ ] **Preconditions:** address validated (`AddressValid` panel showing), email is on the dev allow-list.
- [ ] **Steps:** enter a valid, unused email and a compliant password; submit the `signup` action.
- [ ] **Expected:** Supabase `signUp` succeeds; the validated address fields are written into `user_metadata` (`principaladdresssiteoid`, `validaddress*`, `searchaddress*`, `community`); browser redirects (303) to `/auth/redirect/signup/respond/?redirectType=signup`; a confirmation email is sent with redirect target `/auth/redirect/signup/personal-profile-form/`.

#### 1.1.6 Account creation — missing email or password

- [ ] **Steps:** with the address validated, submit `signup` leaving email or password blank.
- [ ] **Expected:** `fail(400)` with "Email and password are required"; the validated address `data` is echoed back so the panel stays on `AddressValid`; an entry is logged to `signup_errors` (errorType `VALIDATION_ERROR`).

#### 1.1.7 Account creation — email not on allow-list

- [ ] **Preconditions:** address validated; email **not** on the dev allow-list (`isEmailAllowed` returns false).
- [ ] **Steps:** submit `signup`.
- [ ] **Expected:** 303 redirect to `/auth/redirect/email-not-allowed`; a `signup_errors` row with errorType `EMAIL_NOT_ALLOWED`.

#### 1.1.8 Account creation — email already registered

- [ ] **Preconditions:** address validated; email belongs to an existing confirmed account.
- [ ] **Steps:** submit `signup`.
- [ ] **Expected:** Supabase returns a user with an empty `identities` array; redirect to `/auth/redirect/signup/respond/?redirectType=emailExists`; the respond page shows the "email already exists" message (does not leak whether the account is confirmed); `signup_errors` row with errorType `EXISTING_USER`.

#### 1.1.9 Account creation — invalid email/password (Auth 400)

- [ ] **Steps:** submit `signup` with a malformed email or a password that fails Supabase policy.
- [ ] **Expected:** `fail(400)` with "Invalid email or password"; address `data` echoed back; `signup_errors` row with errorType `AUTH_ERROR`.

#### 1.1.10 Account creation — server error

- [ ] **Preconditions:** force a non-400 Supabase auth error.
- [ ] **Steps:** submit `signup`.
- [ ] **Expected:** `fail(500)` with "Server error. Please try again later."; `signup_errors` row with errorType `SERVER_ERROR`.

#### 1.1.11 Email confirmation link

- [ ] **Preconditions:** an unconfirmed account from 1.1.5; the confirmation email received.
- [ ] **Steps:** click the confirmation link (lands on `/auth/redirect/confirm`).
- [ ] **Expected — PKCE (`?code=`):** `exchangeCodeForSession` succeeds, auth cookies are set, user is forwarded to the link's `next` target. **OTP (`token_hash` + `type=email`):** redirect (302) to `/auth/redirect/signup/personal-profile-form/`.
- [ ] **Expected — failure:** on exchange/verify error, redirect to `/auth/error?error=otp_verification_failed`.

#### 1.1.12 Post-confirmation onboarding

- [ ] **Preconditions:** email just confirmed, landed on `/auth/redirect/signup/personal-profile-form/`.
- [ ] **Steps:** observe the onboarding form load.
- [ ] **Expected:** the personal-profile onboarding form renders for the new (now authenticated) user, pre-populated from `user_metadata` where applicable.

### 1.2 Sign in

#### 1.2.1 Sign in — happy path

- [ ] **Preconditions:** signed out, confirmed account exists. Visiting `/auth/signin` while signed out shows the form (a live session would 303 to `/`).
- [ ] **Steps:** enter correct email + password; submit the `signin` action.
- [ ] **Expected:** session established; 303 redirect to `/personal-profile`; navbar updates to the authenticated state.

#### 1.2.2 Sign in — already authenticated

- [ ] **Preconditions:** signed in.
- [ ] **Steps:** navigate to `/auth/signin`.
- [ ] **Expected:** `load` detects the session and 303-redirects to `/`.

#### 1.2.3 Sign in — missing email or password

- [ ] **Steps:** submit with email or password blank.
- [ ] **Expected:** `fail(400)` "Email and password are required"; `signin_errors` row with errorType `VALIDATION_ERROR`.

#### 1.2.4 Sign in — invalid credentials

- [ ] **Steps:** submit a valid-format email with the wrong password (or unknown email).
- [ ] **Expected:** `fail(400)` "Invalid credentials" (no user enumeration); `signin_errors` row with errorType `AUTH_ERROR`.

#### 1.2.5 Sign in — rate limited

- [ ] **Steps:** trigger repeated failed attempts until Supabase returns 429.
- [ ] **Expected:** `fail(429)` "Too many requests. Please try again later."; `signin_errors` row with errorType `RATE_LIMIT_ERROR`.

#### 1.2.6 Sign in — server / session error

- [ ] **Steps:** force a non-400/429 auth error, or a successful auth that returns no session.
- [ ] **Expected:** `fail(500)` with the appropriate message ("An unexpected error occurred…" or "Failed to establish session…"); `signin_errors` row (`SERVER_ERROR` / `SESSION_ERROR`).

### 1.3 Sign out

- [ ] **Preconditions:** signed in.
- [ ] **Steps:** trigger sign out (`/auth/signout`).
- [ ] **Expected:** session/cookies cleared; redirected to a public page; protected routes now bounce to `/auth/signin`; navbar reverts to the signed-out state.

### 1.4 Password reset

#### 1.4.1 Request reset — happy path

- [ ] **Preconditions:** signed out, on `/auth/requestresetpassword`.
- [ ] **Steps:** enter an account email; submit the default action.
- [ ] **Expected:** `success: true` "Password reset instructions have been sent to your email"; a reset email arrives with redirect `…/auth/redirect/confirm?next=/auth/redirect/resetpassword`.

#### 1.4.2 Request reset — error

- [ ] **Steps:** force `resetPasswordForEmail` to error.
- [ ] **Expected:** `fail(400)` with the Supabase error message.

#### 1.4.3 Recovery link → set new password (gating)

- [ ] **Preconditions:** reset email from 1.4.1.
- [ ] **Steps:** click the link; it passes through `/auth/redirect/confirm` (which sets the HttpOnly `RECOVERY_COOKIE` flag) and lands on `/auth/redirect/resetpassword`.
- [ ] **Expected:** the "set new password" form renders **only** because both a session and the recovery flag are present.
- [ ] **Negative:** visiting `/auth/redirect/resetpassword` with an ordinary logged-in session (no recovery flag) or no session → 303 redirect to `/auth/signin`.

#### 1.4.4 Set new password — happy path

- [ ] **Preconditions:** valid recovery session (1.4.3).
- [ ] **Steps:** enter a new compliant password; submit `resetpassword`.
- [ ] **Expected:** `updateUser` succeeds; the recovery cookie is deleted (one-time use); 303 redirect to `/personal-profile`; the new password works on next sign in and the old one does not.

#### 1.4.5 Set new password — POST without recovery flag

- [ ] **Steps:** attempt to POST the `resetpassword` action with an ordinary session and no recovery flag.
- [ ] **Expected:** 303 redirect to `/auth/signin` — the action re-checks the flag and refuses.

#### 1.4.6 Set new password — update error

- [ ] **Steps:** submit a password that fails policy / force an `updateUser` error.
- [ ] **Expected:** `fail(400)` with the Supabase error message; user stays on the form; recovery flag not yet consumed.

### 1.5 Email change

- [ ] **Preconditions:** signed in; email-change initiated; confirmation link received.
- [ ] **Steps:** click the email-change link → `/auth/redirect/confirm` with `type=email_change`.
- [ ] **Expected:** session refreshed, then **signed out**; redirect (303) to `/auth/signin?message=email_changed`; the sign-in page surfaces the "email changed" message; the new address is required to sign back in.
- [ ] **Negative:** on refresh failure → redirect to `/auth/error?error=email_change_failed`.
- [ ] **Companion page:** verify `/auth/redirect/changeemail` renders/handles its own state correctly.

### 1.6 Email-not-allowed / ineligible handling

- [ ] **Steps:** complete signup with an address-valid but non-allow-listed email (see 1.1.7).
- [ ] **Expected:** `/auth/redirect/email-not-allowed` renders a clear, non-technical explanation and a route back / contact option.

### 1.7 Session lifetime

> Code: `SessionTimeoutWarning.svelte`, `/api/extend-session`. Full policy and the
> as-built reconciliation are in [session-management-policy.md](session-management-policy.md).
>
> ⚠️ **Implementation gap.** The role-scoped **idle timeout** + **absolute cap** policy
> below is **🚧 not yet implemented**. What ships today is a single, global **access-token
> (JWT) expiry warning** at **5 minutes** — no idle detection, no role tiers, no absolute
> cap. Tests are split accordingly: §1.7.A covers current behaviour (runnable now);
> §1.7.B covers the policy target (write-blocked until built).

#### 1.7.A Current behaviour — JWT-expiry warning (runnable now)

- [ ] **1.7.A.1 Warning fires at 5 min:** with the access token within 5 minutes of `expires_at`, the "Session Expiring Soon" modal appears showing a `m:ss` countdown. _(Note: with auto-refresh on, this normally only happens after a backgrounded tab or a failed refresh — may need to force it by suspending refresh.)_
- [ ] **1.7.A.2 Countdown ticks down** once per second while the modal is open.
- [ ] **1.7.A.3 Stay Signed In:** clicking it POSTs `/api/extend-session` → `refreshSession()`; on success the modal closes and a "Session extended successfully" toast shows; `expires_at` moves forward.
- [ ] **1.7.A.4 Extend failure:** if `/api/extend-session` returns non-OK / `success:false`, an error toast shows and the user is redirected to `/auth/signin?reason=session-refresh-failed` after ~2 s.
- [ ] **1.7.A.5 Auto-expiry:** if the countdown reaches 0 with no action, the user is redirected to `/auth/signin?reason=expired`.
- [ ] **1.7.A.6 Accessibility:** the modal uses `role="alertdialog"`, `aria-modal`, and labelled title/description; verify focus handling and screen-reader announcement.
- [ ] **1.7.A.7 "Sign Out Now" — known gap:** the button is an `<a href="/auth/signin">` that only **navigates**; it does **not** call `signOut()`, so the session/refresh token is **not revoked**. Confirm current behaviour and track as a bug (see §1.7.B.8).

#### 1.7.B Policy target — role-scoped idle + absolute cap (✅ implemented, ⏳ pending manual test)

> Target thresholds (per [session-management-policy.md](session-management-policy.md)).
> The feature is built (hooks enforcement, `sessionPolicy`, reworked `SessionTimeoutWarning`,
> `/api/session/keepalive`) and passes type/build checks; these boxes track **manual
> verification**, still to be done. **Exception: B.7 (unsaved work) is not yet implemented** —
> forced redirect can still discard a dirty form. Tip: temporarily shrink the thresholds in
> `sessionPolicy.ts` to exercise the long windows in seconds.

| Role        | Idle timeout | Absolute cap | Warning |
| ----------- | ------------ | ------------ | ------- |
| Resident    | 14 days      | 30 days      | 2 min   |
| Coordinator | 4 hours      | 7 days       | 2 min   |
| Admin       | 60 min       | 12 hours     | 2 min   |

- [ ] **1.7.B.1 Idle warning fires per role** at the role's idle threshold, ~2 min before logout (Resident 14 d / Coordinator 4 h / Admin 60 min).
- [ ] **1.7.B.2 Activity resets the idle timer** — interaction before the threshold resets the countdown; no warning fires.
- [ ] **1.7.B.3 Extend from warning** prolongs the session with **no page/form state lost**.
- [ ] **1.7.B.4 Idle expiry** signs the user out and bounces protected routes to `/auth/signin`.
- [ ] **1.7.B.5 Absolute cap** ends the session at the role's cap **despite** continuous activity (Resident 30 d / Coordinator 7 d / Admin 12 h).
- [ ] **1.7.B.6 Client warning precedes server rejection** — no silent/surprise auth failure at the boundary.
- [ ] **1.7.B.7 Unsaved-work guard (warn + confirm)** — with a dirty tracked form (e.g. `aboutme`) open at expiry, the warning does **not** auto-redirect; it holds open a "Session ended — unsaved changes can't be kept" state with a manual "Sign In Again". With no unsaved changes, expiry redirects normally. During the countdown a dirty form adds a "you have unsaved changes" nudge. _(Warn-not-persist: data is not restored after re-auth, by design.)_
- [ ] **1.7.B.8 Sign-out revokes server-side** — explicit sign-out calls `signOut()`; the prior refresh token cannot resume the session (fixes the §1.7.A.7 gap).

### Auth section — cross-checks

- [ ] Every failure path writes to the correct error table (`address_validation_errors`,
      `signup_errors`, `signin_errors`) with client IP and user-agent.
- [ ] No error message leaks whether an email is registered (no user enumeration).
- [ ] All auth pages are reachable and styled correctly on mobile widths.
- [ ] `aria-live` alert regions announce error/success messages to screen readers.

### Auth section — run log

| Date | Tester | Env | Build / commit | Result | Notes |
| ---- | ------ | --- | -------------- | ------ | ----- |
| 2026-06-25 | Claude (HTTP smoke) | dev (`supabase-newprod`) | working tree | PASS (6/6) | Server-side integration only: signin `?reason=idle\|expired\|session-refresh-failed` and `?message=email_changed` notices render via SSR; no param → no banner; `POST /api/session/keepalive` → 204, `GET` → 405; unauth `/personal-profile` → 303 `/auth/signin`. Browser/auth-gated items (§1.7.A/B UX, hooks expiry) NOT covered — need manual browser run. |

---

## 2–7. Remaining sections

_Not yet written._ Use Section 1 as the template: list the routes/actions involved, state
the domain rules, then enumerate happy-path and failure-path tests with Preconditions /
Steps / Expected, and finish with a cross-checks list and a run-log table.
