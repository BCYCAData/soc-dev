<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	import Logo from '$components/page/navigation/Logo.svelte';

	let user = $derived(page.data.user);
	let permissions = $derived(page.data.permissions);
	let coordinatesKYNG = $derived(page.data.coordinatesKYNG);
	let isAdmin = $derived(page.data.userRole === 'admin' || permissions?.includes('admin'));

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
		<a
			class:active={isHomeActive}
			href="/"
			class="btn-base btn preset-tonal-primary mr-2 rounded-xl py-1 font-semibold">Home</a
		>
		<a
			class:active={isAboutActive}
			href="/about"
			class="btn-base btn preset-tonal-primary mr-2 rounded-xl py-1 font-semibold">About</a
		>
		<a
			class:active={isContactActive}
			href="/contact"
			class="btn-base sm: btn preset-tonal-primary rounded-xl py-1 font-semibold">Contact Us</a
		>
	</div>
</AppBar>

{#snippet lead()}
	<Logo />
{/snippet}

{#snippet trail()}
	<div class="flex h-full items-center">
		{#if user}
			{#if isAdmin}
				{#if coordinatesKYNG && coordinatesKYNG.length > 0}
					<a
						class:active={isKyngCoordinatorActive}
						href="/kyng-coordinator"
						class="btn-base btn hover:bg-surface-500 mr-2 rounded-xl py-1 font-semibold {isKyngCoordinatorActive
							? 'bg-surface-100 text-primary-700'
							: 'preset-filled-surface-500'}">KYNG Coordinator</a
					>
				{/if}
				<a
					class:active={isAdminActive}
					href="/admin"
					class="btn-base btn hover:bg-surface-500 mr-2 rounded-xl py-1 font-semibold {isAdminActive
						? 'bg-surface-100 text-primary-700'
						: 'preset-filled-surface-500'}">Administrator</a
				>
			{/if}
			<a
				class:active={isProfileActive}
				href="/personal-profile"
				type="button"
				class="btn-base btn hover:bg-surface-500 mr-2 rounded-xl py-1 font-semibold {isProfileActive
					? 'bg-surface-100 text-primary-700'
					: 'preset-filled-surface-500'}">Profile</a
			>
			<form method="POST" action="/auth/signout">
				<button
					class="btn-base btn preset-filled-surface-500 hover:bg-surface-500 mr-2 rounded-xl font-semibold"
					type="submit">Sign Out</button
				>
			</form>
		{:else}
			<a
				class:active={isSignInActive}
				href="/auth/signin"
				class="btn-base btn hover:bg-surface-500 mr-2 rounded-xl py-1 font-semibold {isSignInActive
					? 'bg-primary-500 text-white'
					: 'bg-primary-100'}">Sign In</a
			>
		{/if}
	</div>
{/snippet}
