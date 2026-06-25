<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { toast } from '$stores/toaststore';
	import { unsavedChanges } from '$stores/unsavedChanges.svelte';

	// Role-scoped session policy from the root layout (null when signed out / public).
	// See docs/session-management-policy.md and $lib/constants/sessionPolicy.
	const policy = $derived(page.data.sessionPolicy ?? null);

	// Cross-tab activity timestamp (ms epoch). Mirrored to localStorage so activity in one
	// tab resets the idle timer in every tab via the `storage` event.
	const ACTIVITY_KEY = 'soc:last-activity';
	const THROTTLE_MS = 1000; // collapse bursts of pointer/key events
	const PING_CAP_MS = 60_000; // server keep-alive cadence ceiling (must be ≤ warningMs)

	let lastActivity = $state(Date.now());
	let now = $state(Date.now());
	let extending = $state(false);
	let lastHandled = 0; // throttle gate for activity events
	let lastPing = 0; // last server keep-alive
	let redirecting = false; // guard against double redirect

	// Whichever deadline is sooner wins. Absolute is a hard server cap that an extend
	// cannot move; idle slides with activity.
	const idleDeadline = $derived(policy ? lastActivity + policy.idleMs : Number.POSITIVE_INFINITY);
	const absoluteDeadline = $derived(policy?.absoluteDeadline ?? Number.POSITIVE_INFINITY);
	const isAbsolute = $derived(absoluteDeadline <= idleDeadline);
	const remainingMs = $derived(Math.min(idleDeadline, absoluteDeadline) - now);
	const showWarning = $derived(!!policy && remainingMs > 0 && remainingMs <= policy.warningMs);
	const expired = $derived(!!policy && remainingMs <= 0);
	// Deadline lapsed but unsaved work present: hold the modal open instead of redirecting.
	const sessionEnded = $derived(expired && unsavedChanges.hasUnsaved);

	function setActivity(t: number): void {
		lastActivity = t;
		if (browser) localStorage.setItem(ACTIVITY_KEY, String(t));
	}

	function keepServerAlive(t: number): void {
		if (!policy) return;
		// Cap at PING_CAP_MS and the tier's warning window so the server's idle clock can
		// never lapse before the client warning appears.
		const interval = Math.min(policy.warningMs, PING_CAP_MS);
		if (t - lastPing < interval) return;
		lastPing = t;
		fetch('/api/session/keepalive', { method: 'POST' }).catch(() => {});
	}

	function onActivity(event: Event): void {
		if (event.type === 'visibilitychange' && document.visibilityState !== 'visible') return;
		const t = Date.now();
		if (t - lastHandled < THROTTLE_MS) return;
		lastHandled = t;
		setActivity(t);
		keepServerAlive(t);
	}

	function onStorage(event: StorageEvent): void {
		if (event.key !== ACTIVITY_KEY || !event.newValue) return;
		const t = Number(event.newValue);
		if (Number.isFinite(t) && t > lastActivity) lastActivity = t;
	}

	async function extendSession(): Promise<void> {
		extending = true;
		try {
			const response = await fetch('/api/extend-session', { method: 'POST' });
			if (!response.ok) throw new Error('Failed to extend session');
			const result = await response.json();
			if (!result.success) throw new Error('Invalid response from server');

			// Refresh succeeded: reset the idle timer (the request also slid the server's).
			const t = Date.now();
			setActivity(t);
			lastPing = t;
			toast.success('Session extended successfully');
		} catch (error) {
			console.error('Failed to extend session:', error);
			toast.error('Failed to extend session. Please sign in again.');
			setTimeout(() => {
				window.location.href = '/auth/signin?reason=session-refresh-failed';
			}, 2000);
		} finally {
			extending = false;
		}
	}

	function formatTime(ms: number): string {
		const total = Math.max(0, Math.floor(ms / 1000));
		const mins = Math.floor(total / 60);
		const secs = total % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	// Forced sign-out when a deadline lapses. The server enforces this independently; we
	// redirect proactively so the user lands on signin with an explanatory reason — UNLESS a
	// form has unsaved changes (`sessionEnded`), in which case the modal is held open so the
	// user can copy their work rather than losing it to an abrupt navigation.
	$effect(() => {
		if (redirecting) return;
		if (expired && !unsavedChanges.hasUnsaved) {
			redirecting = true;
			window.location.href = `/auth/signin?reason=${isAbsolute ? 'expired' : 'idle'}`;
		}
	});

	onMount(() => {
		if (!browser) return;

		// Seed from any existing cross-tab/refresh value so the idle timer is shared.
		const stored = Number(localStorage.getItem(ACTIVITY_KEY));
		if (Number.isFinite(stored) && stored > 0) lastActivity = stored;
		else setActivity(Date.now());

		const tick = window.setInterval(() => (now = Date.now()), 1000);
		window.addEventListener('pointerdown', onActivity, { passive: true });
		window.addEventListener('keydown', onActivity, { passive: true });
		document.addEventListener('visibilitychange', onActivity);
		window.addEventListener('storage', onStorage);

		return () => {
			clearInterval(tick);
			window.removeEventListener('pointerdown', onActivity);
			window.removeEventListener('keydown', onActivity);
			document.removeEventListener('visibilitychange', onActivity);
			window.removeEventListener('storage', onStorage);
		};
	});
</script>

{#if showWarning || sessionEnded}
	<!-- Modal Overlay -->
	<div
		class="bg-surface-950/50 fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-sm"
		role="alertdialog"
		aria-labelledby="timeout-title"
		aria-describedby="timeout-description"
		aria-modal="true"
	>
		<div class="card bg-surface-50-950 mx-4 w-full max-w-md p-6 shadow-2xl">
			<!-- Warning Icon -->
			<div class="mb-4 flex justify-center">
				<svg
					class="text-warning-500 h-12 w-12"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			</div>

			{#if sessionEnded}
				<!-- Deadline lapsed with unsaved changes: held open so work isn't lost abruptly. -->
				<h2 id="timeout-title" class="text-surface-900-100 mb-2 text-center text-xl font-bold">
					Session ended
				</h2>

				<p id="timeout-description" class="text-surface-700-300 mb-6 text-center text-sm">
					Your session has ended and you have <strong>unsaved changes on this page</strong>. They
					can't be kept once you sign out — please copy anything you need, then sign in again.
				</p>

				<div class="flex flex-col gap-3 sm:flex-row">
					<form method="POST" action={resolve('/auth/signout')} class="flex-1">
						<button type="submit" class="btn preset-filled-primary-500 w-full font-semibold">
							Sign In Again
						</button>
					</form>
				</div>
			{:else if isAbsolute}
				<h2 id="timeout-title" class="text-surface-900-100 mb-2 text-center text-xl font-bold">
					Session Expiring Soon
				</h2>

				<p id="timeout-description" class="text-surface-700-300 mb-4 text-center">
					Your session will expire in <strong class="text-warning-600-400 text-lg"
						>{formatTime(remainingMs)}</strong
					>.
				</p>

				<p class="text-surface-600-400 mb-6 text-center text-sm">
					For your security, sessions have a maximum length and yours has been reached. You'll need
					to sign in again to continue.{#if unsavedChanges.hasUnsaved}
						<strong> Save or copy any unsaved changes now.</strong>{/if}
				</p>

				<div class="flex flex-col gap-3 sm:flex-row">
					<!-- Absolute cap can't be extended; sign out cleanly and return to signin. -->
					<form method="POST" action={resolve('/auth/signout')} class="flex-1">
						<button type="submit" class="btn preset-filled-primary-500 w-full font-semibold">
							Sign In Again
						</button>
					</form>
				</div>
			{:else}
				<h2 id="timeout-title" class="text-surface-900-100 mb-2 text-center text-xl font-bold">
					Session Expiring Soon
				</h2>

				<p id="timeout-description" class="text-surface-700-300 mb-4 text-center">
					Your session will expire in <strong class="text-warning-600-400 text-lg"
						>{formatTime(remainingMs)}</strong
					>.
				</p>

				<p class="text-surface-600-400 mb-6 text-center text-sm">
					You'll be logged out automatically to protect your account. Click "Stay Signed In" to
					continue your session.{#if unsavedChanges.hasUnsaved}
						<strong> You have unsaved changes.</strong>{/if}
				</p>

				<div class="flex flex-col gap-3 sm:flex-row">
					<button
						onclick={extendSession}
						disabled={extending}
						aria-busy={extending}
						class="btn preset-filled-primary-500 flex-1 font-semibold"
					>
						{extending ? 'Staying signed in…' : 'Stay Signed In'}
					</button>

					<!-- Real sign-out: POST to the signout action so the session and tracking
					cookies are actually revoked server-side (not just a client navigation). -->
					<form method="POST" action={resolve('/auth/signout')} class="flex-1">
						<button type="submit" class="btn preset-tonal-surface w-full font-semibold">
							Sign Out Now
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
{/if}
