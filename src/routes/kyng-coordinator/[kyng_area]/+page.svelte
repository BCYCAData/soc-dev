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
	<h1 class="mb-6 text-3xl font-bold text-orange-700">{kyngName} KYNG</h1>

	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-3 gap-4">
				<a
					href="/kyng-coordinator/{kyngAreaId}/map"
					class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
				>
					{kyngName} KYNG Map
				</a>
				<a
					href="/kyng-coordinator/{kyngAreaId}/messages"
					class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
				>
					{kyngName} KYNG Messages
				</a>
				<a
					href="/kyng-coordinator/{kyngAreaId}/user-admin"
					class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
				>
					{kyngName} KYNG User Management
				</a>
			</div>
		</section>

		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				<ul class="list-disc pl-4">
					<li>See a map representing the current state of your KYNG group</li>
					<li>Manage messages to users in your KYNG</li>
					<li>Reporting tools to help know the state of your KYNG group</li>
				</ul>
			</div>
		</section>
	</div>
</div>
