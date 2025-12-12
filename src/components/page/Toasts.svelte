<script lang="ts">
	import { toastStore } from '$stores/toaststore';
	import Toast from './Toast.svelte';
</script>

<!-- Toast Container - Fixed position at top-right -->
<div
	class="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-md pointer-events-none"
	aria-live="polite"
	aria-atomic="false"
>
	{#each $toastStore as toast (toast.id)}
		<div class="pointer-events-auto">
			<Toast {toast} />
		</div>
	{/each}
</div>
