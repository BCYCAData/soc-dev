<script lang="ts">
	import { usePermissions } from '$lib/permissions.svelte';
	import { PERMISSIONS } from '$lib/constants/permissions';

	const { hasPermission, hasFeature } = usePermissions();
</script>

<svelte:head>
	<title>External Community Administration</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">External Community Administration</h1>

	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-3 gap-4">
				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_EXTERNAL_INFORMATION)}
					<a
						href="/admin/community/external/information"
						class=" flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage Information Requests
					</a>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_EXTERNAL_EVENTS)}
					<a
						href="/admin/community/external/events"
						class=" flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage Community Events
					</a>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_EXTERNAL_WORKSHOPS)}
					<a
						href="/admin/community/external/workshops"
						class=" flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage Workshops
					</a>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_EXTERNAL)}
					<a
						href="/admin/community/external/map"
						class="col-start-2 flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						External Community At A Glance
					</a>
				{/if}
			</div>
		</section>

		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				<ul class="list-disc pl-4">
					{#if hasFeature('events')}
						<li>Use the Events Manager to create and update community gatherings</li>
					{/if}
					{#if hasFeature('workshops')}
						<li>Workshop tools allow you to schedule and track community training sessions</li>
					{/if}
					{#if hasFeature('information')}
						<li>Communication tools help reach community members efficiently</li>
					{/if}
					{#if hasFeature('communities')}
						<li>Access detailed analytics about community engagement</li>
					{/if}
				</ul>
			</div>
		</section>
	</div>
</div>
