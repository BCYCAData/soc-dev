<script lang="ts">
	import { page } from '$app/stores';

	let permissions = $derived(
		typeof $page.data.permissions === 'string' ? $page.data.permissions.split(',') : []
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
	<title>Community Administration</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">Community Administration</h1>

	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Select a Community:</h2>
			<div class="grid grid-cols-3 gap-4">
				{#if hasPermission('bcyca')}
					<a
						href="/admin/community/bcyca/"
						class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						BCYCA
					</a>
				{/if}

				{#if hasPermission('tinonee')}
					<a
						href="/admin/community/tinonee/"
						class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Tinonee
					</a>
				{/if}

				{#if hasPermission('mondrook')}
					<a
						href="/admin/community/mondrook"
						class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Mondrook
					</a>
				{/if}

				{#if hasPermission('external')}
					<a
						href="/admin/community/external"
						class="col-start-2 flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						External
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
