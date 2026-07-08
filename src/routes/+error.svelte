<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const heading = $derived(page.status === 404 ? 'Page not found' : 'Something went wrong');
	const detail = $derived(
		page.status === 404
			? "The page you're looking for doesn't exist or may have moved."
			: page.error?.message || 'An unexpected error occurred. Please try again.'
	);
</script>

<svelte:head>
	<title>{page.status}: {heading}</title>
</svelte:head>

<div class="generic-error">
	<p class="status">{page.status}</p>
	<h1>{heading}</h1>
	<p>{detail}</p>
	<a href={resolve('/')}>Return to Home</a>
</div>

<style>
	.generic-error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: 2rem;
		text-align: center;
	}

	.status {
		font-size: 3rem;
		font-weight: 700;
		color: var(--color-surface-400);
	}

	.generic-error h1 {
		font-size: 1.75rem;
		margin-bottom: 1rem;
		color: var(--color-surface-900);
	}

	:global(.dark) .generic-error h1 {
		color: var(--color-surface-100);
	}

	.generic-error p:not(.status) {
		font-size: 1.125rem;
		margin-bottom: 2rem;
		color: var(--color-surface-700);
	}

	:global(.dark) .generic-error p:not(.status) {
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
