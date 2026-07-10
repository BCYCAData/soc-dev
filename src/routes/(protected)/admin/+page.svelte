<script lang="ts">
	import { resolve } from '$app/paths';
	import { usePermissions } from '$lib/permissions.svelte';
	import { PERMISSIONS } from '$lib/constants/permissions';
	import Card from '$components/page/Card.svelte';
	import QuickActionsGrid from '$components/page/QuickActionsGrid.svelte';
	import QuickActionTile from '$components/page/QuickActionTile.svelte';

	const { hasPermission, hasAnyPermission, hasFeature } = usePermissions();

	// Helper to check if user can access a specific admin section
	function canAccessRoute(route: string): boolean {
		const routePermissions: Record<string, string | string[]> = {
			'/admin/site': PERMISSIONS.ADMIN_SITE,
			'/admin/users': PERMISSIONS.ADMIN_USERS,
			'/admin/emergency': PERMISSIONS.ADMIN_EMERGENCY,
			'/admin/community': [
				PERMISSIONS.ADMIN_COMMUNITY,
				PERMISSIONS.ADMIN_COMMUNITY_BCYCA,
				PERMISSIONS.ADMIN_COMMUNITY_MONDROOK,
				PERMISSIONS.ADMIN_COMMUNITY_TINONEE,
				PERMISSIONS.ADMIN_COMMUNITY_EXTERNAL
			]
		};

		const requiredPerms = routePermissions[route];
		if (!requiredPerms) return false;
		const result = hasPermission(requiredPerms);
		return result;
	}
</script>

<svelte:head>
	<title>Site Administration</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">SOC Website Administration</h1>
	<div class="mb-8 grid gap-6">
		<Card>
			<h2 class="mb-2 text-xl font-semibold">Quick Actions</h2>
			<QuickActionsGrid>
				{#if canAccessRoute('/admin/site')}
					<QuickActionTile href={resolve('/admin/site')}>Manage Site Settings</QuickActionTile>
				{/if}

				{#if canAccessRoute('/admin/users')}
					<QuickActionTile href={resolve('/admin/users')}>Manage Registered Users</QuickActionTile>
				{/if}

				{#if canAccessRoute('/admin/emergency')}
					<QuickActionTile href={resolve('/admin/emergency')}>
						Manage Emergency Services Reports
					</QuickActionTile>
				{/if}

				{#if canAccessRoute('/admin/community')}
					<QuickActionTile href={resolve('/admin/community')}>
						Manage Community Data Settings
					</QuickActionTile>
				{/if}
			</QuickActionsGrid>
		</Card>

		<Card>
			<h2 class="mb-2 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				{#if hasPermission(PERMISSIONS.ADMIN_SITE)}
					<div class="mb-4">
						<dt class="font-bold">Manage Site Settings</dt>
						{#if hasPermission(PERMISSIONS.ADMIN_SITE_MESSAGES)}
							<dd class="text-sm opacity-90">
								Messages can be sent to all users based on locality or individual users based on
								email address
							</dd>
						{/if}
						{#if hasPermission(PERMISSIONS.ADMIN_SITE_ROLES)}
							<dd class="text-sm opacity-90">
								Administrators can Grant or Revoke roles that determine Administrator Menu functions
								individual users have access to.
							</dd>
						{/if}
						{#if hasPermission(PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS)}
							<dd class="text-sm opacity-90">
								Administrators can Grant or Revoke KYNG Coordinator status and also edit contact
								details.
							</dd>
						{/if}
						{#if hasPermission(PERMISSIONS.ADMIN_SITE_DATA)}
							{#if hasPermission(PERMISSIONS.ADMIN_SITE_DATA_SPATIAL)}
								<dd class="text-sm opacity-90">
									Administrators can manage spatial feature types and attributes.
								</dd>
							{/if}
							{#if hasPermission(PERMISSIONS.ADMIN_SITE_DATA_ADDRESSES)}
								<dd class="text-sm opacity-90">Administrators can manage Custom Addresses.</dd>
							{/if}
						{/if}
					</div>
				{/if}

				{#if hasPermission(PERMISSIONS.ADMIN_USERS)}
					<div class="mb-4">
						<dt class="font-bold">Manage Registered Users</dt>
						{#if hasPermission(PERMISSIONS.ADMIN_USERS_KITS)}
							<dd class="text-sm opacity-90">
								Reports can be generated for all registered users and their kit delivery status.
							</dd>
						{/if}
						{#if hasPermission(PERMISSIONS.ADMIN_USERS_NEWUSERS)}
							<dd class="text-sm opacity-90">
								Reports can be generated for all registered users and their information
								completeness.
							</dd>
						{/if}
						{#if hasPermission(PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS)}
							<dd class="text-sm opacity-90">
								Administrators can Grant or Revoke KYNG Coordinator status and also edit contact
								details.
							</dd>
						{/if}
					</div>
				{/if}

				{#if hasPermission(PERMISSIONS.ADMIN_EMERGENCY)}
					<div class="mb-4">
						<dt class="font-bold">Manage Emergency Services Reports</dt>
						{#if hasPermission(PERMISSIONS.ADMIN_EMERGENCY_REPORTS)}
							<dd class="text-sm opacity-90">
								Reports can be generated for all registered properties in a locality or for an
								individual address.
							</dd>
						{/if}
						{#if hasPermission(PERMISSIONS.ADMIN_EMERGENCY_SERVICE_MAP)}
							<dd class="text-sm opacity-90">View an interactive emergency services map.</dd>
						{/if}
					</div>
				{/if}

				{#if hasAnyPermission(PERMISSIONS.ADMIN_COMMUNITY, PERMISSIONS.ADMIN_COMMUNITY_BCYCA, PERMISSIONS.ADMIN_COMMUNITY_MONDROOK, PERMISSIONS.ADMIN_COMMUNITY_TINONEE, PERMISSIONS.ADMIN_COMMUNITY_EXTERNAL)}
					<div class="mb-4">
						<dt class="font-bold">Manage Community Data Settings</dt>
						{#if hasFeature('events')}
							<dd class="text-sm opacity-90">
								Use the Events Manager to create and update community gatherings
							</dd>
						{/if}
						{#if hasFeature('workshops')}
							<dd class="text-sm opacity-90">
								Workshop tools allow you to schedule and track community training sessions
							</dd>
						{/if}
						{#if hasFeature('information')}
							<dd class="text-sm opacity-90">
								Manage the information sheets shared with community members
							</dd>
						{/if}
						{#if hasFeature('map')}
							<dd class="text-sm opacity-90">
								Community maps show registered properties within each community area
							</dd>
						{/if}
					</div>
				{/if}
			</div>
		</Card>
	</div>
</div>

<style>
	.prose dd {
		margin-left: 1rem;
		margin-bottom: 0.5rem;
	}
</style>
