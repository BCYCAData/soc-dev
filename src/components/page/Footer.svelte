<script>
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
</script>

<AppBar
	background="bg-primary-600 gap-2 sm:gap-10"
	centerClasses="flex flex-col sm:flex-row items-center justify-center text-surface-50"
>
	{#snippet lead()}
		<a
			class="btn btn-sm preset-tonal-primary mb-2 w-full font-semibold sm:mb-0 sm:w-auto"
			href="/policies/termsofservice"
		>
			Terms of Service
		</a>
	{/snippet}
	Prepare Connect Rebound
	{#snippet trail()}
		<a
			class="btn btn-sm preset-tonal-primary mb-2 w-full font-semibold sm:mb-0 sm:w-auto"
			href="/policies/privacy"
		>
			Privacy Policy
		</a>
	{/snippet}
</AppBar>
