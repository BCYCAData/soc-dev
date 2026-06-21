<script lang="ts">
	import { resolve } from '$app/paths';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	import Logo from '$components/page/navigation/Logo.svelte';
	import DarkModeToggle from '$components/page/navigation/DarkModeToggle.svelte';
	import { usePermissions } from '$lib/permissions.svelte';

	let user = $derived(page.data.user);
	let coordinatesKYNG = $derived(page.data.coordinatesKYNG);
	const { isAdmin } = usePermissions();
	let isHomeActive = $derived(page.url.pathname.endsWith('/'));
	let isAboutActive = $derived(page.url.pathname.endsWith('/about'));
	let isContactActive = $derived(page.url.pathname.endsWith('/contact'));
	let isKyngCoordinatorActive = $derived(page.url.pathname.includes('/kyng-coordinator'));
	let isAdminActive = $derived(page.url.pathname.includes('/admin'));
	let isProfileActive = $derived(page.url.pathname.includes('/personal-profile'));
	let isSignInActive = $derived(page.url.pathname.endsWith('/signin'));
</script>

<AppBar background="bg-primary-600" padding="0" {lead} {trail}>
	<div class="flex h-full flex-auto items-center justify-center">
		<a class:active={isHomeActive} href={resolve('/')} class="preset-nav-link mr-2">Home</a>
		<a class:active={isAboutActive} href={resolve('/about')} class="preset-nav-link mr-2">About</a>
		<a class:active={isContactActive} href={resolve('/contact')} class="preset-nav-link"
			>Contact Us</a
		>
	</div>
</AppBar>

{#snippet lead()}
	<Logo />
{/snippet}

{#snippet trail()}
	<div class="flex h-full items-center">
		<div class="mr-3 flex items-center">
			<DarkModeToggle />
		</div>
		{#if user}
			{#if isAdmin()}
				{#if coordinatesKYNG && coordinatesKYNG.length > 0}
					<a
						class:active={isKyngCoordinatorActive}
						href={resolve('/kyng-coordinator')}
						class="preset-nav-link-surface mr-2">KYNG Coordinator</a
					>
				{/if}
				<a
					class:active={isAdminActive}
					href={resolve('/admin')}
					class="preset-nav-link-surface mr-2">Administrator</a
				>
			{/if}
			<a
				class:active={isProfileActive}
				href={resolve('/personal-profile')}
				class="preset-nav-link-surface mr-2">Profile</a
			>
			<form method="POST" action="/auth/signout">
				<button class="preset-nav-link-surface mr-2" type="submit">Sign Out</button>
			</form>
		{:else}
			<a class:active={isSignInActive} href={resolve('/auth/signin')} class="preset-nav-link mr-2"
				>Sign In</a
			>
		{/if}
	</div>
{/snippet}
