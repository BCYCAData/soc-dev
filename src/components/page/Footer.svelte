<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar, drawerStore } from '@skeletonlabs/skeleton';

	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<AppBar
	class="grid grid-cols-3 grid-flow-col gap-4"
	padding="p-1"
	background="bg-primary-600"
	slotLead="flex !justify-center !items-center"
	slotDefault="flex !justify-center !items-center"
	slotTrail="flex !justify-center !items-center"
>
	<svelte:fragment slot="lead">
		<a
			class="btn btn-base font-semibold invisible text-surface-50 lg:visible"
			class:active={$page.url.pathname.endsWith('/policies/termsofservice')}
			data-sveltekit-preload-data="hover"
			href="/policies/termsofservice"
		>
			Terms of Service
		</a>
	</svelte:fragment>
	<svelte:fragment slot="default">
		<h3 class="text-surface-50 [word-spacing:20px]" id="footer-text">Prepare Connect Rebound</h3>
	</svelte:fragment>
	<svelte:fragment slot="trail"
		><a
			class="btn btn-base font-semibold invisible text-surface-50 lg:visible"
			class:active={$page.url.pathname.endsWith('/policies/privacy')}
			data-sveltekit-preload-data="hover"
			href="/policies/privacy"
		>
			Privacy Policy
		</a>
	</svelte:fragment></AppBar
>
