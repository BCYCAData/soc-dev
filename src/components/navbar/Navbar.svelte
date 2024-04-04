<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar, getDrawerStore } from '@skeletonlabs/skeleton';
	import Logo from '$components/navbar/logo/Logo.svelte';

	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<div class="hidden sm:hidden lg:inline">
	<AppBar
		gridColumns="grid-cols-[auto_1fr_auto]"
		slotLead="flex-auto flex justify-center items-center overflow-hidden"
		slotDefault="flex justify-center items-center overflow-hidden"
		slotTrail="place-content-center"
		padding="1"
		background="bg-primary-400"
	>
		<svelte:fragment slot="lead">
			<Logo />
		</svelte:fragment>
		<a
			class:active={$page.url.pathname.endsWith('/')}
			href="/"
			class="btn bg-tertiary-400 btn-base mr-2 font-semibold rounded-xl">Home</a
		>
		<a
			class:active={$page.url.pathname.endsWith('/about')}
			href="/about"
			class="btn bg-tertiary-400 btn-base mr-2 font-semibold rounded-xl">About</a
		>
		<a
			class:active={$page.url.pathname.endsWith('/contact')}
			href="/contact"
			class="btn bg-tertiary-400 btn-base font-semibold rounded-xl sm:">Contact Us</a
		>
		<svelte:fragment slot="trail"
			>{#if $page?.data?.session?.user?.id}
				{#if $page?.data?.session?.user?.app_metadata?.roles?.includes('tester') | $page?.data?.session?.user?.app_metadata?.roles?.includes('admin')}
					<a
						class:active={$page.url.pathname.includes('/admin')}
						href="/admin"
						class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl"
						>Administrator</a
					>
				{/if}
				<a
					class:active={$page.url.pathname.includes('/profile')}
					href="/profile"
					class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl"
					>Profile</a
				>
				<form method="POST" action="/api/auth/signout">
					<button
						class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl"
						type="submit"
					>
						Sign Out
					</button>
				</form>
			{:else}
				<a
					class:active={$page.url.pathname.endsWith('/signin')}
					href="/auth/signin"
					class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl"
				>
					Sign In
				</a>
			{/if}
		</svelte:fragment>
	</AppBar>
</div>
<div class="hidden sm:hidden md:inline lg:hidden">
	<AppBar
		gridColumns="grid-cols-[auto_1fr_auto]"
		slotLead="flex-auto flex justify-center items-center overflow-hidden"
		slotDefault="flex justify-center items-center overflow-hidden"
		slotTrail="place-content-center"
		padding="1"
		background="bg-primary-400"
		regionRowMain="h-14"
	>
		<svelte:fragment slot="lead">
			<Logo />
		</svelte:fragment>
		<a
			class:active={$page.url.pathname.endsWith('/')}
			href="/"
			class="btn bg-tertiary-400 btn-base mr-2 font-semibold rounded-xl scale-75">Home</a
		>
		<a
			class:active={$page.url.pathname.endsWith('/about')}
			href="/about"
			class="btn bg-tertiary-400 btn-base mr-2 font-semibold rounded-xl scale-75">About</a
		>
		<a
			class:active={$page.url.pathname.endsWith('/contact')}
			href="/contact"
			class="btn bg-tertiary-400 btn-base font-semibold rounded-xl scale-75">Contact Us</a
		>
		<svelte:fragment slot="trail"
			>{#if $page?.data?.session?.user?.id}
				{#if $page?.data?.session?.user?.app_metadata?.roles?.includes('tester') | $page?.data?.session?.user?.app_metadata?.roles?.includes('admin')}
					<a
						class:active={$page.url.pathname.includes('/admin')}
						href="/admin"
						class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl scale-75"
						>Administrator</a
					>
				{/if}
				<a
					class:active={$page.url.pathname.includes('/profile')}
					href="/profile"
					class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl scale-75"
					>Profile</a
				>
				<form method="POST" action="/api/auth/signout">
					<button
						class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl scale-75"
						type="submit"
					>
						Sign Out
					</button>
				</form>
			{:else}
				<a
					class:active={$page.url.pathname.endsWith('/signin')}
					href="/auth/signin"
					class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl scale-75"
				>
					Sign In
				</a>
			{/if}
		</svelte:fragment>
	</AppBar>
</div>
<div class="sm:inline md:hidden lg:hidden">
	<AppBar
		gridColumns="grid-cols-[auto_1fr_auto]"
		slotLead="flex-auto flex justify-center items-center overflow-hidden"
		slotDefault="flex justify-center items-center overflow-hidden"
		padding="1"
		background="bg-primary-400"
		regionRowMain="h-14"
	>
		<svelte:fragment slot="lead"
			><button class="md:hidden btn btn-base mr-4" on:click={drawerOpen}>
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
		<strong class="text-sm text-center">Strengthen Our Community</strong>
		<svelte:fragment slot="trail"
			>{#if $page?.data?.session?.user?.id}
				{#if $page?.data?.session?.user?.app_metadata?.roles?.includes('tester') | $page?.data?.session?.user?.app_metadata?.roles?.includes('admin')}
					<a
						class:active={$page.url.pathname.includes('/admin')}
						href="/admin"
						class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl scale-75"
						>Administrator</a
					>
				{/if}
				<a
					class:active={$page.url.pathname.includes('/profile')}
					href="/profile"
					class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl scale-75"
					>Profile</a
				>
				<form method="POST" action="/api/auth/signout">
					<button
						class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl scale-75"
						type="submit"
					>
						Sign Out
					</button>
				</form>
			{:else}
				<a
					class:active={$page.url.pathname.endsWith('/signin')}
					href="/auth/signin"
					class="btn bg-primary-500 text-surface-50 btn-base mr-2 font-semibold rounded-xl scale-75"
				>
					Sign In
				</a>
			{/if}
		</svelte:fragment>
	</AppBar>
</div>

<style>
	a.active {
		background-color: #fdba74;
		color: #7c2d12;
		border-width: 2px;
		border-color: #fafaf9;
	}
</style>
