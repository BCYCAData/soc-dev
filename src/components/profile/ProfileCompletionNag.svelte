<script lang="ts">
	import { resolve } from '$app/paths';

	let {
		nag
	}: {
		nag: { percent: number; answered: number; total: number; sessionId: string };
	} = $props();

	let dismissed = $state(false);

	function dismiss() {
		// Mirror the server-side cookie (a non-sensitive UI flag) keyed to this login's
		// session id, so the nag stays hidden until the next sign-in.
		document.cookie = `ppf_nag=${nag.sessionId};path=/;max-age=${60 * 60 * 12};samesite=lax`;
		dismissed = true;
	}
</script>

{#if !dismissed}
	<div
		class="bg-surface-50-950 border-primary-500 mx-auto mb-4 flex max-w-4xl flex-col gap-3 rounded-lg border-l-4 p-4 shadow sm:flex-row sm:items-center sm:justify-between"
		role="status"
		aria-live="polite"
	>
		<div class="flex-1">
			<p class="font-semibold">Your community profile is {nag.percent}% complete</p>
			<p class="text-sm opacity-90">
				You've answered {nag.answered} of {nag.total} required questions. Completing your profile helps
				us keep you safe and informed.
			</p>
			<div
				class="bg-surface-300-700 mt-2 h-2 w-full overflow-hidden rounded-full"
				role="progressbar"
				aria-valuenow={nag.percent}
				aria-valuemin={0}
				aria-valuemax={100}
			>
				<div class="bg-primary-500 h-full rounded-full" style="width: {nag.percent}%"></div>
			</div>
		</div>
		<div class="flex shrink-0 gap-2">
			<a href={resolve('/personal-profile-form')} class="btn preset-filled-primary-500">
				Complete profile
			</a>
			<button type="button" class="btn preset-tonal-surface" onclick={dismiss}> Not now </button>
		</div>
	</div>
{/if}
