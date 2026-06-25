import type { RequestHandler } from './$types';

/**
 * Activity ping for the session idle timer. The request itself passing through
 * `hooks.server.ts` slides the server-side `LAST_ACTIVITY` cookie, keeping the server's
 * idle clock aligned with real client-side activity — without forcing a token refresh the
 * way `/api/extend-session` does. The `SessionTimeoutWarning` component calls this
 * (throttled) while the user is interacting. Does nothing for unauthenticated requests
 * (hooks only bumps when a user is present). Returns 204.
 */
export const POST: RequestHandler = async () => new Response(null, { status: 204 });
