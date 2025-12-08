<script lang="ts">
	import { usePermissions } from '$lib/permissions.svelte';
	import { PERMISSIONS } from '$lib/constants/permissions';

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
	<h1 class="mb-6 text-3xl font-bold text-orange-700">SOC Website Administration</h1>
	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white px-6 pb-6 shadow">
			<h2 class="mb-2 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-2 gap-4">
				{#if canAccessRoute('/admin/site')}
					<a
						href="/admin/site"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage Site Settings
					</a>
				{/if}

				{#if canAccessRoute('/admin/users')}
					<a
						href="/admin/users"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage Registered Users
					</a>
				{/if}

				{#if canAccessRoute('/admin/emergency')}
					<a
						href="/admin/emergency"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage Emergency Services Reports
					</a>
				{/if}

				{#if canAccessRoute('/admin/community')}
					<a
						href="/admin/community"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage Community Data Settings
					</a>
				{/if}
			</div>
		</section>

		<section class="rounded-lg bg-white px-6 py-2 shadow">
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
								Communication tools help reach community members efficiently
							</dd>
						{/if}
						{#if hasFeature('map')}
							<dd class="text-sm opacity-90">
								Access detailed analytics about community engagement
							</dd>
						{/if}
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>

<style>
	.prose dd {
		margin-left: 1rem;
		margin-bottom: 0.5rem;
	}
</style>
