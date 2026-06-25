/**
 * Canonical session-lifetime policy: the single source of truth for how long a
 * session may live, scoped by role tier. Pure and environment-agnostic, so it is
 * safe to import from both the server (enforcement in `hooks.server.ts`) and the
 * client (the `SessionTimeoutWarning` countdown) — keeping the two from drifting.
 *
 * Two independent windows per tier:
 * - `idleMs`     — sliding inactivity timeout; resets on user activity.
 * - `absoluteMs` — hard cap on total session age, regardless of activity. Bounds
 *                  how long a stolen refresh token can live.
 * - `warningMs`  — how long before either deadline the "session expiring" warning shows.
 *
 * Policy rationale and thresholds: see `docs/session-management-policy.md`.
 * Reaching either limit ends the session and bounces to `/auth/signin`.
 *
 * @module sessionPolicy
 */

import { isAdmin } from '$lib/constants/permissions';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Session policy tiers, ordered by blast radius (residents lowest, admins highest).
 * Distinct from the raw `user_role` claim — {@link tierForRole} maps roles onto these.
 */
export type SessionTier = 'resident' | 'coordinator' | 'admin';

export interface SessionWindow {
	/** Sliding inactivity timeout (ms). Resets on user activity. */
	idleMs: number;
	/** Hard cap on total session age (ms), independent of activity. */
	absoluteMs: number;
	/** Lead time before a deadline at which the warning is shown (ms). */
	warningMs: number;
}

/** Shared pre-logout warning lead time across all tiers (2 minutes). */
const WARNING_MS = 2 * MINUTE;

/**
 * The "Balanced" idle + "Tiered" absolute-cap policy. Caps scale with blast radius:
 * residents get convenience, elevated roles get tighter windows.
 */
export const SESSION_POLICY: Record<SessionTier, SessionWindow> = {
	resident: { idleMs: 14 * DAY, absoluteMs: 30 * DAY, warningMs: WARNING_MS },
	coordinator: { idleMs: 4 * HOUR, absoluteMs: 7 * DAY, warningMs: WARNING_MS },
	admin: { idleMs: 60 * MINUTE, absoluteMs: 12 * HOUR, warningMs: WARNING_MS }
} as const;

/**
 * Maps a user's `user_role` claim (and permissions) onto a {@link SessionTier}.
 *
 * Tiering is intentionally role-driven (coordinators are identified by an assigned
 * `kyng_coordinator` role), with one safety net: anyone who is effectively an admin —
 * via the `admin` role *or* the root `admin` permission, matching {@link isAdmin} — is
 * placed in the strictest tier so a permission-only admin can never inherit the lenient
 * resident window.
 *
 * Fail-soft: unknown / unrecognised roles fall through to `resident` (the common case is
 * an ordinary `user`). When a NEW elevated role is introduced, add it here explicitly —
 * otherwise it will silently receive the resident window.
 *
 * @param role        The `user_role` claim (e.g. `'admin' | 'kyng_coordinator' | 'user'`).
 * @param permissions Flattened dot-notation permission tokens from `locals.permissions`.
 */
export function tierForRole(role: string | null, permissions: string[] = []): SessionTier {
	if (isAdmin(role, permissions)) return 'admin';
	if (role === 'kyng_coordinator') return 'coordinator';
	return 'resident';
}

/**
 * Convenience: resolve the {@link SessionWindow} for a user directly from role + permissions.
 * Equivalent to `SESSION_POLICY[tierForRole(role, permissions)]`.
 */
export function windowForRole(role: string | null, permissions: string[] = []): SessionWindow {
	return SESSION_POLICY[tierForRole(role, permissions)];
}
