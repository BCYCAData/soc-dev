<script>
	import { page } from '$app/state';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
</script>

<AppBar
	background="bg-primary-600 gap-2 sm:gap-10"
	centerClasses="flex flex-col sm:flex-row items-center justify-center text-surface-50"
>
	{#snippet lead()}
		<a
			class="btn btn-sm mb-2 w-full bg-tertiary-400 font-semibold text-surface-50 sm:mb-0 sm:w-auto"
			class:active={page.url.pathname.endsWith('/policies/termsofservice')}
			data-sveltekit-preload-data="hover"
			href="/policies/termsofservice"
		>
			Terms of Service
		</a>
	{/snippet}
	Prepare Connect Rebound
	{#snippet trail()}
		<a
			class="btn btn-sm mb-2 w-full bg-tertiary-400 font-semibold text-surface-50 sm:mb-0 sm:w-auto"
			class:active={page.url.pathname.endsWith('/policies/privacy')}
			data-sveltekit-preload-data="hover"
			href="/policies/privacy"
		>
			Privacy Policy
		</a>
	{/snippet}
</AppBar>
