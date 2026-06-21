<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	// let permissions = $derived(page.data.permissions ? page.data.permissions.split(',') : []);
	let coordinatesKYNG = $derived(page.data.coordinatesKYNG ? page.data.coordinatesKYNG : []);
</script>

<svelte:head>
	<title>KYNG Coordinators</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">KYNG</h1>
	<div class="mb-8 grid gap-6">
		<section class="bg-surface-50-950 rounded-lg p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-3 gap-4">
				{#each coordinatesKYNG as { kyngAreaId, kyngName } (kyngAreaId)}
					<a
						href={resolve('/(protected)/kyng-coordinator/[kyng_area]', { kyng_area: kyngAreaId })}
						class="btn preset-filled-secondary-500"
					>
						{kyngName}
					</a>
				{/each}
			</div>
		</section>
	</div>
</div>
