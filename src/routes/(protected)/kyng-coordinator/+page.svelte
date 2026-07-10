<script lang="ts">
	import Card from '$components/page/Card.svelte';
	import QuickActionsGrid from '$components/page/QuickActionsGrid.svelte';
	import QuickActionTile from '$components/page/QuickActionTile.svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let coordinatesKYNG = $derived(page.data.coordinatesKYNG ? page.data.coordinatesKYNG : []);
</script>

<svelte:head>
	<title>KYNG Coordinators</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">KYNG</h1>
	<div class="mb-8 grid gap-6">
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<QuickActionsGrid>
				{#each coordinatesKYNG as { kyngAreaId, kyngName } (kyngAreaId)}
					<QuickActionTile
						href={resolve('/(protected)/kyng-coordinator/[kyng_area]', { kyng_area: kyngAreaId })}
					>
						{kyngName}
					</QuickActionTile>
				{/each}
			</QuickActionsGrid>
		</Card>
	</div>
</div>
