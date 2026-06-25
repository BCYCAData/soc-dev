/**
 * Server-only helpers for the session-lifetime tracking cookies that back the
 * role-scoped idle timeout + absolute cap (see docs/session-management-policy.md).
 *
 * - `SESSION_START` — `"{startMs}.{sessionId}"`. The ms epoch anchors the absolute cap and
 *   is never moved by activity; the `sessionId` suffix binds the anchor to the current
 *   login so a *new* login (different Supabase `session_id`) re-anchors instead of
 *   inheriting a previous session's deadline.
 * - `LAST_ACTIVITY` — ms epoch, slid forward on every authenticated request. Only trusted
 *   when the start cookie belongs to the current login.
 *
 * Both are HttpOnly so client JS can't tamper with the enforcement inputs; the client
 * learns the absolute deadline via page data instead.
 *
 * @module server/auth/sessionTracking
 */

import type { Cookies } from '@sveltejs/kit';
import {
	SESSION_START_COOKIE,
	LAST_ACTIVITY_COOKIE,
	SESSION_COOKIE_PATH,
	SESSION_COOKIE_MAX_AGE
} from '$lib/constants';

const SEP = '.'; // sessionId is a UUID (no dots), so the first dot splits start from owner.

const cookieOptions = {
	path: SESSION_COOKIE_PATH,
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: process.env.NODE_ENV === 'production',
	maxAge: SESSION_COOKIE_MAX_AGE
};

function parseEpoch(value: string | undefined, fallback: number): number {
	const n = value ? Number(value) : NaN;
	return Number.isFinite(n) ? n : fallback;
}

/**
 * Returns the absolute-cap anchor (ms epoch) from the start cookie, but only when it
 * belongs to `sessionId`. Returns `null` when the cookie is absent, malformed, or owned by
 * a previous login — the caller treats `null` as "fresh session, re-anchor now".
 */
export function getSessionStart(cookies: Cookies, sessionId: string | null): number | null {
	const raw = cookies.get(SESSION_START_COOKIE);
	if (!raw) return null;
	const idx = raw.indexOf(SEP);
	// No separator means a legacy/unbound cookie; treat as not-owned so it re-anchors.
	if (idx === -1) return null;
	const start = Number(raw.slice(0, idx));
	const owner = raw.slice(idx + 1);
	// Normalise null sessionId to '' on both sides so an unbound login stays stable.
	return Number.isFinite(start) && owner === (sessionId ?? '') ? start : null;
}

/**
 * Read both tracking anchors for an authenticated request. When the start cookie isn't
 * owned by the current login, both anchors reset to `now` (fresh login → no inherited
 * deadline and no spurious instant-idle logout).
 */
export function readSessionTracking(
	cookies: Cookies,
	sessionId: string | null,
	now: number = Date.now()
): { sessionStart: number; lastActivity: number } {
	const start = getSessionStart(cookies, sessionId);
	return {
		sessionStart: start ?? now,
		lastActivity: start !== null ? parseEpoch(cookies.get(LAST_ACTIVITY_COOKIE), now) : now
	};
}

/**
 * Persist the absolute anchor (bound to `sessionId`) and slide the inactivity timer to
 * `now`. Call only after confirming the session is still within its windows.
 */
export function writeSessionTracking(
	cookies: Cookies,
	sessionStart: number,
	sessionId: string | null,
	now: number = Date.now()
): void {
	cookies.set(SESSION_START_COOKIE, `${sessionStart}${SEP}${sessionId ?? ''}`, cookieOptions);
	cookies.set(LAST_ACTIVITY_COOKIE, String(now), cookieOptions);
}

/** Remove both tracking cookies (on sign-out or forced expiry). */
export function clearSessionTracking(cookies: Cookies): void {
	cookies.delete(SESSION_START_COOKIE, { path: SESSION_COOKIE_PATH });
	cookies.delete(LAST_ACTIVITY_COOKIE, { path: SESSION_COOKIE_PATH });
}
