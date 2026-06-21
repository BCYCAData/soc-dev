<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	const kyngAreaId = $derived(data.currentArea?.kyngAreaId);
	const kyngName = $derived(data.currentArea.kyngName);
</script>

<svelte:head>
	<title>{kyngName} KYNG</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">{kyngName} KYNG</h1>

	<div class="mb-8 grid gap-6">
		<section class="bg-surface-50-950 rounded-lg p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-3 gap-4">
				<a href="/kyng-coordinator/{kyngAreaId}/map" class=" btn preset-filled-secondary-500">
					{kyngName} KYNG Map
				</a>
				<a
					href="/kyng-coordinator/{kyngAreaId}/unregistered-addresses"
					class=" btn preset-filled-secondary-500"
				>
					{kyngName} Un-registered Addresses
				</a>
				<a
					href="/kyng-coordinator/{kyngAreaId}/user-admin"
					class=" btn preset-filled-secondary-500"
				>
					{kyngName} KYNG User Management
				</a>
			</div>
		</section>

		<section class="bg-surface-50-950 rounded-lg p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				<ul class="list-disc pl-4">
					<li>See a map representing the current state of your KYNG group</li>
					<li>Identify Unregistered Addresses in your KYNG</li>
					<li>Reporting tools to help know the state of your KYNG group</li>
				</ul>
			</div>
		</section>
	</div>
</div>
