<script lang="ts">
	import { page } from '$app/state';

	// let permissions = $derived(page.data.permissions ? page.data.permissions.split(',') : []);
	let coordinatesKYNG = $derived(page.data.coordinatesKYNG ? page.data.coordinatesKYNG : []);
</script>

<svelte:head>
	<title>KYNG Coordinators</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">KYNG</h1>
	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-3 gap-4">
				{#each coordinatesKYNG as { kyngAreaId, kyngName }}
					<a
						href={`/kyng-coordinator/${kyngAreaId}`}
						class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						{kyngName}
					</a>
				{/each}
			</div>
		</section>
	</div>
</div>
