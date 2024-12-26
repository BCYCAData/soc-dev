<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	import Logo from '$components/page/navigation/Logo.svelte';

	let user = $derived(page.data.user);
	let permissions = $derived(page.data.permissions);
	let coordinatesKYNG = $derived(page.data.coordinatesKYNG);
	let isAdmin = $derived(permissions?.includes('admin'));
</script>

<AppBar background="bg-primary-400 p-px" {lead} {trail}>
	<div class="flex h-full flex-auto items-center justify-center">
		<a
			class:active={page.url.pathname.endsWith('/')}
			href="/"
			class="btn-base btn mr-2 rounded-xl bg-tertiary-400 py-2 font-semibold">Home</a
		>
		<a
			class:active={page.url.pathname.endsWith('/about')}
			href="/about"
			class="btn-base btn mr-2 rounded-xl bg-tertiary-400 py-2 font-semibold">About</a
		>
		<a
			class:active={page.url.pathname.endsWith('/contact')}
			href="/contact"
			class="btn-base sm: btn rounded-xl bg-tertiary-400 py-2 font-semibold">Contact Us</a
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
						class:active={page.url.pathname.includes('/kyng-coordinator')}
						href="/kyng-coordinator"
						class="btn-base btn mr-2 rounded-xl bg-primary-500 font-semibold text-surface-50"
						>KYNG Coordinator</a
					>
				{/if}
				<a
					class:active={page.url.pathname.includes('/admin')}
					href="/admin"
					class="btn-base btn mr-2 rounded-xl bg-primary-500 font-semibold text-surface-50"
					>Administrator</a
				>
			{/if}
			<a
				class:active={page.url.pathname.includes('/personal-profile')}
				href="/personal-profile"
				class="btn-base btn mr-2 rounded-xl bg-primary-500 font-semibold text-surface-50">Profile</a
			>
			<form method="POST" action="/auth/signout">
				<button
					class="btn-base btn mr-2 rounded-xl bg-primary-500 font-semibold text-surface-50"
					type="submit">Sign Out</button
				>
			</form>
		{:else}
			<a
				class:active={page.url.pathname.endsWith('/signin')}
				href="/auth/signin"
				class="btn-base btn mr-2 rounded-xl bg-primary-500 font-semibold text-surface-50">Sign In</a
			>
		{/if}
	</div>
{/snippet}
