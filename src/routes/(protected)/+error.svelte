<script lang="ts">
	import { page } from '$app/state';
	import Error403 from '$components/page/Error403.svelte';

	const determineContext = (message: string) => {
		const msg = message.toLowerCase();
		if (msg.includes('admin')) return 'admin';
		if (msg.includes('kyng') || msg.includes('coordinator')) return 'kyng_coordinator';
		if (msg.includes('session') || msg.includes('expired')) return 'session';
		if (msg.includes('permission')) return 'permission';
		return 'generic';
	};

	const context = $derived(
		page.status === 403 ? determineContext(page.error?.message || '') : 'generic'
	);
</script>

<svelte:head>
	<title>{page.status}: {page.error?.message || 'Error'}</title>
</svelte:head>

{#if page.status === 403}
	<Error403 message={page.error?.message} {context} />
{:else}
	<!-- Fallback for other errors -->
	<div class="generic-error">
		<h1>{page.status}</h1>
		<p>{page.error?.message || 'An error occurred'}</p>
		<a href="/">Return to Home</a>
	</div>
{/if}

<style>
	.generic-error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
		text-align: center;
	}

	.generic-error h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
		color: var(--color-surface-900);
	}

	:global(.dark) .generic-error h1 {
		color: var(--color-surface-100);
	}

	.generic-error p {
		font-size: 1.25rem;
		margin-bottom: 2rem;
		color: var(--color-surface-700);
	}

	:global(.dark) .generic-error p {
		color: var(--color-surface-300);
	}

	.generic-error a {
		padding: 0.75rem 1.5rem;
		background-color: var(--color-primary-600);
		color: white;
		text-decoration: none;
		border-radius: var(--radius-base, 0.375rem);
		transition: background-color 0.15s ease;
	}

	.generic-error a:hover {
		background-color: var(--color-primary-700);
	}
</style>
