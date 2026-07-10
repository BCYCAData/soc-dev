<script lang="ts">
	import Card from '$components/page/Card.svelte';
	import QuickActionsGrid from '$components/page/QuickActionsGrid.svelte';
	import QuickActionTile from '$components/page/QuickActionTile.svelte';
	import { resolve } from '$app/paths';
	import { usePermissions } from '$lib/permissions.svelte';
	import { PERMISSIONS } from '$lib/constants/permissions';

	const { hasPermission, hasFeature } = usePermissions();
</script>

<svelte:head>
	<title>Tinonee Community Administration</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">Tinonee Community Administration</h1>

	<div class="mb-8 grid gap-6">
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<QuickActionsGrid>
				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_TINONEE_INFORMATION)}
					<QuickActionTile href={resolve('/admin/community/tinonee/information')}>
						Manage Information Requests
					</QuickActionTile>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_TINONEE_EVENTS)}
					<QuickActionTile href={resolve('/admin/community/tinonee/events')}>
						Manage Community Events
					</QuickActionTile>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_TINONEE_WORKSHOPS)}
					<QuickActionTile href={resolve('/admin/community/tinonee/workshops')}>
						Manage Workshops
					</QuickActionTile>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_TINONEE)}
					<QuickActionTile href={resolve('/admin/community/tinonee/map')}>
						Tinonee Community At A Glance
					</QuickActionTile>
				{/if}
			</QuickActionsGrid>
		</Card>

		<Card>
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
		</Card>
	</div>
</div>
