<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<div class="hidden sm:inline">
	<AppBar
		gridColumns="grid-cols-[1fr_auto_1fr]"
		slotLead="place-self-end"
		slotDefault="place-self-center"
		slotTrail="place-self-start"
		padding="p-1"
		background="bg-primary-600"
	>
		<svelte:fragment slot="lead"
			><a
				class="btn btn-sm scale-75 bg-tertiary-400 font-semibold invisible text-surface-50 lg:visible"
				class:active={$page.url.pathname.endsWith('/policies/termsofservice')}
				data-sveltekit-preload-data="hover"
				href="/policies/termsofservice"
			>
				Terms of Service
			</a></svelte:fragment
		>
		<h3
			class="text-center text-sm md:text-base text-surface-50 [word-spacing:20px]"
			id="footer-text"
		>
			Prepare Connect Rebound
		</h3>
		<svelte:fragment slot="trail"
			><a
				class="btn btn-sm scale-75 bg-tertiary-400 font-semibold invisible text-surface-50 lg:visible"
				class:active={$page.url.pathname.endsWith('/policies/privacy')}
				data-sveltekit-preload-data="hover"
				href="/policies/privacy"
			>
				Privacy Policy
			</a></svelte:fragment
		>
	</AppBar>
</div>
<div class="inline sm:hidden">
	<AppBar gridColumns="grid-cols-1" padding="p-1" background="bg-primary-600">
		<h3
			class="col-span-3 text-center text-sm md:text-base text-surface-50 [word-spacing:20px]"
			id="footer-text"
		>
			Prepare Connect Rebound
		</h3>
	</AppBar>
</div>
