<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { toastStore } from '$stores/toaststore';
	import { TOAST_STYLES } from '$lib/constants/toastStyles';
	import type { Toast } from '$stores/toaststore';

	export let toast: Toast;

	const styles = TOAST_STYLES[toast.type];

	function dismiss() {
		toastStore.remove(toast.id);
	}
</script>

<div
	class="flex items-start gap-3 p-4 rounded-lg min-w-[320px] max-w-md {styles.container}"
	role="alert"
	aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
	in:fly={{ x: 300, duration: 200, easing: quintOut }}
	out:fly={{ x: 300, duration: 150, easing: quintOut }}
>
	<!-- Icon -->
	<div class="flex-shrink-0 {styles.icon}" aria-hidden="true">
		{#if toast.type === 'success'}
			<!-- Success Check Icon -->
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M5 13l4 4L19 7"
				/>
			</svg>
		{:else if toast.type === 'error'}
			<!-- Error X Icon -->
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		{:else if toast.type === 'warning'}
			<!-- Warning Triangle Icon -->
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
		{:else}
			<!-- Info Icon -->
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		{/if}
	</div>

	<!-- Content -->
	<div class="flex-1 min-w-0">
		<p class="font-medium leading-tight">
			{toast.message}
		</p>
	</div>

	<!-- Close Button -->
	<button
		type="button"
		class="flex-shrink-0 rounded-md p-1.5 transition-colors focus:outline-none focus:ring-2 {styles.closeButton}"
		on:click={dismiss}
		aria-label="Dismiss notification"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	</button>
</div>
