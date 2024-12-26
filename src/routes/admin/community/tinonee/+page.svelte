<script lang="ts">
	import { page } from '$app/state';

	let permissions = $derived(
		typeof page.data.permissions === 'string' ? page.data.permissions.split(',') : []
	);

	function hasPermission(path: string): boolean {
		const permissionKey = path.split('/').pop()?.replace('/', '');
		return permissions.some((p) => p.includes(permissionKey || ''));
	}

	function hasFeaturePermission(feature: string): boolean {
		return permissions.some((p) => p.includes(feature));
	}
</script>

<svelte:head>
	<title>Tinonee Community Administration</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">Tinonee Community Administration</h1>

	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-3 gap-4">
				{#if hasPermission('tinonee.information')}
					<a
						href="/admin/community/tinonee/information"
						class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Manage Information Requests
					</a>
				{/if}
				{#if hasPermission('tinonee.events')}
					<a
						href="/admin/community/tinonee/events"
						class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Manage Community Events
					</a>
				{/if}
				{#if hasPermission('tinonee.events')}
					<a
						href="/admin/community/tinonee/workshops"
						class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Manage Workshops
					</a>
				{/if}
				{#if hasPermission('tinonee.events')}
					<a
						href="/admin/community/tinonee/map"
						class="col-start-2 flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Tinonee Community At A Glance
					</a>
				{/if}
			</div>
		</section>

		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				<ul class="list-disc pl-4">
					{#if hasFeaturePermission('events')}
						<li>Use the Events Manager to create and update community gatherings</li>
					{/if}
					{#if hasFeaturePermission('workshops')}
						<li>Workshop tools allow you to schedule and track community training sessions</li>
					{/if}
					{#if hasFeaturePermission('information')}
						<li>Communication tools help reach community members efficiently</li>
					{/if}
					{#if hasFeaturePermission('communities')}
						<li>Access detailed analytics about community engagement</li>
					{/if}
				</ul>
			</div>
		</section>
	</div>
</div>
