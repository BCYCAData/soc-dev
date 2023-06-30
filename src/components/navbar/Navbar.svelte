<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar, drawerStore } from '@skeletonlabs/skeleton';
	import Logo from '$components/navbar/logo/Logo.svelte';

	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<AppBar
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
	padding="1"
	background="bg-primary-400"
>
	<svelte:fragment slot="lead"
		><button class="lg:hidden btn btn-base mr-4" on:click={drawerOpen}>
			<span>
				<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
					<rect width="100" height="20" />
					<rect y="30" width="100" height="20" />
					<rect y="60" width="100" height="20" />
				</svg>
			</span>
		</button>
		<Logo />
	</svelte:fragment>
	<a
		class:active={$page.url.pathname.endsWith('/')}
		href="/"
		class="btn bg-tertiary-400 btn-base mr-2 font-semibold invisible rounded-xl lg:visible">Home</a
	>
	<a
		class:active={$page.url.pathname.endsWith('/about')}
		href="/about"
		class="btn bg-tertiary-400 btn-base mr-2 font-semibold invisible rounded-xl lg:visible">About</a
	>
	<a
		class:active={$page.url.pathname.endsWith('/contact')}
		href="/contact"
		class="btn bg-tertiary-400 btn-base font-semibold invisible rounded-xl lg:visible">Contact Us</a
	>
	<svelte:fragment slot="trail"
		>{#if $page?.data?.session?.user?.id}
			{#if $page?.data?.session?.user?.app_metadata?.roles?.includes('tester') | $page?.data?.session?.user?.app_metadata?.roles?.includes('admin')}
				<a
					class:active={$page.url.pathname.includes('/admin')}
					href="/admin"
					class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold invisible rounded-xl lg:visible"
					>Administrator</a
				>
			{/if}
			<a
				class:active={$page.url.pathname.includes('/profile')}
				href="/profile"
				class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold invisible rounded-xl lg:visible"
				>Profile</a
			>
			<form method="POST" action="/api/auth/signout">
				<button
					class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold invisible rounded-xl lg:visible"
					type="submit"
				>
					Sign Out
				</button>
			</form>
		{:else}
			<a
				class:active={$page.url.pathname.endsWith('/signin')}
				href="/auth/signin"
				class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold invisible rounded-xl lg:visible"
			>
				Sign In
			</a>
		{/if}
	</svelte:fragment>
</AppBar>

<style>
	a.active {
		background-color: #fdba74;
		color: #7c2d12;
		border-width: 2px;
		border-color: #fafaf9;
	}
</style>
