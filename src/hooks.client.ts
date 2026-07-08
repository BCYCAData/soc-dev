import type { HandleClientError } from '@sveltejs/kit';

/**
 * Last-resort capture for unexpected client errors: report them to the server
 * (which records them in public.app_errors) and show a sanitized message.
 */
export const handleError: HandleClientError = async ({ error, status, message }) => {
	// 404s are expected navigation misses — don't report them.
	if (status === 404) {
		return { message: 'Not found' };
	}
	const err = error as Error | undefined;
	console.error('Unhandled client error:', err ?? message);
	try {
		await fetch('/api/log-error', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				status,
				message: err?.message || message,
				stack: err?.stack,
				url: window.location.pathname + window.location.search
			}),
			keepalive: true
		});
	} catch {
		// Reporting must never cascade into another error.
	}
	return { message: 'An unexpected error occurred. The team has been notified.' };
};
