<script lang="ts">
	import { toastStore } from '$stores/toaststore';
	import Toast from './Toast.svelte';
</script>

<!-- Toast Container - Fixed position at top-right -->
<div
	class="pointer-events-none fixed top-4 right-4 z-50 flex w-full max-w-md flex-col gap-3"
	aria-live="polite"
	aria-atomic="false"
>
	{#each $toastStore as toast (toast.id)}
		<div class="pointer-events-auto">
			<Toast {toast} />
		</div>
	{/each}
</div>
