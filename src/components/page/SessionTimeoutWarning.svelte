<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { toast } from '$stores/toaststore';
	import { createBrowserClient } from '@supabase/ssr';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

	let showWarning = $state(false);
	let secondsRemaining = $state(300);
	let checkInterval: number | null = null;
	let countdownInterval: number | null = null;
	let supabase: ReturnType<typeof createBrowserClient> | null = null;

	onMount(() => {
		if (!browser) return;

		// Create Supabase client
		supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

		checkInterval = window.setInterval(async () => {
			if (!supabase) return;

			// Get session from Supabase
			const {
				data: { session }
			} = await supabase.auth.getSession();

			if (!session || !session.expires_at) {
				// Not logged in or no session data
				if (showWarning) {
					showWarning = false;
				}
				return;
			}

			// Calculate remaining time (expires_at is in seconds, convert to milliseconds)
			const expiresAtMs = session.expires_at * 1000;
			const remaining = (expiresAtMs - Date.now()) / 1000;

			// Show warning at 5 minutes (300 seconds)
			if (remaining < 300 && remaining > 0) {
				if (!showWarning) {
					showWarning = true;
					startCountdown();
				}
				secondsRemaining = Math.floor(remaining);
			}
			// Session expired - redirect to login
			else if (remaining <= 0) {
				cleanup();
				window.location.href = '/auth/signin?reason=expired';
			}
		}, 1000);

		return cleanup;
	});

	function cleanup() {
		if (checkInterval) {
			clearInterval(checkInterval);
			checkInterval = null;
		}
		if (countdownInterval) {
			clearInterval(countdownInterval);
			countdownInterval = null;
		}
	}

	function startCountdown() {
		if (countdownInterval) clearInterval(countdownInterval);

		countdownInterval = window.setInterval(() => {
			secondsRemaining--;
			if (secondsRemaining <= 0) {
				if (countdownInterval) {
					clearInterval(countdownInterval);
					countdownInterval = null;
				}
			}
		}, 1000);
	}

	async function extendSession() {
		try {
			const response = await fetch('/api/extend-session', {
				method: 'POST'
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					showWarning = false;
					if (countdownInterval) {
						clearInterval(countdownInterval);
						countdownInterval = null;
					}
					toast.success('Session extended successfully');
				} else {
					throw new Error('Invalid response from server');
				}
			} else {
				throw new Error('Failed to extend session');
			}
		} catch (error) {
			console.error('Failed to extend session:', error);
			toast.error('Failed to extend session. Please sign in again.');
			// Redirect to login after error
			setTimeout(() => {
				window.location.href = '/auth/signin?reason=session-refresh-failed';
			}, 2000);
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

{#if showWarning}
	<!-- Modal Overlay -->
	<div
		class="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		role="alertdialog"
		aria-labelledby="timeout-title"
		aria-describedby="timeout-description"
		aria-modal="true"
	>
		<div class="dark:bg-surface-800 mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
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

			<h2
				id="timeout-title"
				class="text-surface-900 dark:text-surface-100 mb-2 text-center text-xl font-bold"
			>
				Session Expiring Soon
			</h2>

			<p id="timeout-description" class="text-surface-700 dark:text-surface-300 mb-4 text-center">
				Your session will expire in <strong class="text-warning-600 dark:text-warning-400 text-lg"
					>{formatTime(secondsRemaining)}</strong
				>.
			</p>

			<p class="text-surface-600 dark:text-surface-400 mb-6 text-center text-sm">
				You'll be logged out automatically to protect your account. Click "Stay Signed In" to
				continue your session.
			</p>

			<div class="flex flex-col gap-3 sm:flex-row">
				<button
					onclick={extendSession}
					class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 flex-1 rounded-md px-4 py-3 font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
				>
					Stay Signed In
				</button>

				<a
					href="/auth/signin"
					class="bg-surface-200 text-surface-900 hover:bg-surface-300 focus:ring-surface-500 dark:bg-surface-700 dark:text-surface-100 dark:hover:bg-surface-600 flex-1 rounded-md px-4 py-3 text-center font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
				>
					Sign Out Now
				</a>
			</div>
		</div>
	</div>
{/if}
