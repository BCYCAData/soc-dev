<script lang="ts">
	import { page } from '$app/state';
	import Error403 from '$components/page/Error403.svelte';
</script>

<svelte:head>
	<title>403: KYNG Coordinator Access Required</title>
</svelte:head>

{#if page.status === 403}
	<Error403
		message={page.error?.message || 'KYNG coordinator access required'}
		context="kyng_coordinator"
	/>
{:else}
	<!-- Fallback for other errors -->
	<div class="error-fallback">
		<h1>{page.status}</h1>
		<p>{page.error?.message || 'An error occurred'}</p>
		<a href="/personal-profile">Return to Dashboard</a>
	</div>
{/if}

<style>
	.error-fallback {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
		text-align: center;
	}

	.error-fallback h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.error-fallback a {
		padding: 0.75rem 1.5rem;
		background-color: var(--color-primary-600);
		color: white;
		text-decoration: none;
		border-radius: var(--radius-base, 0.375rem);
	}
</style>
