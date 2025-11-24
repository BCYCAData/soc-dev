<script lang="ts">
	import { page } from '$app/state';

	let userRole = $derived(page.data.userRole);
	let permissions = $derived((page.data.permissions || []) as string[]);

	// Check if user is an admin (required for all /admin routes)
	let isAdmin = $derived(userRole === 'admin');

	// Check if user has a specific permission
	function hasPermission(permission: string): boolean {
		if (!isAdmin) return false;
		return permissions.some((p) => p === permission || p.startsWith(permission + '.'));
	}

	// Check if user has ANY of the provided permissions
	function hasAnyPermission(...perms: string[]): boolean {
		if (!isAdmin) return false;
		return perms.some((p) => permissions.some((up) => up === p || up.startsWith(p + '.')));
	}

	// Check if user has ANY permission ending with a specific feature
	function hasAnyCommunityFeature(feature: string): boolean {
		if (!isAdmin) return false;
		return permissions.some((p) => p.endsWith(`.${feature}`));
	}

	// Helper to check if user can access a specific admin section
	function canAccessRoute(route: string): boolean {
		if (!isAdmin) return false;

		const routePermissions: Record<string, string[]> = {
			'/admin/site': ['admin.site'],
			'/admin/users': ['admin.users'],
			'/admin/emergency': ['admin.emergency'],
			'/admin/community': [
				'admin.community',
				'admin.community.bcyca', // ✅ Fixed
				'admin.community.mondrook', // ✅ Fixed
				'admin.community.tinonee', // ✅ Fixed
				'admin.community.external' // ✅ Fixed
			]
		};

		const requiredPerms = routePermissions[route] || [];
		return requiredPerms.some((perm) =>
			permissions.some((p) => p === perm || p.startsWith(perm + '.'))
		);
	}
</script>

<svelte:head>
	<title>Site Administration</title>
</svelte:head>

<!-- Remove this debug line once working -->
<pre>Permissions (array): {JSON.stringify(permissions, null, 2)}</pre>
<pre>Is Admin: {isAdmin}</pre>
<pre>Can access /admin/site: {canAccessRoute('/admin/site')}</pre>

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
				{#if hasPermission('admin.site')}
					<div class="mb-4">
						<dt class="font-bold">Manage Site Settings</dt>
						{#if hasPermission('admin.site.messages')}
							<dd class="text-sm opacity-90">
								Messages can be sent to all users based on locality or individual users based on
								email address
							</dd>
						{/if}
						{#if hasPermission('admin.site.roles')}
							<dd class="text-sm opacity-90">
								Administrators can Grant or Revoke roles that determine Administrator Menu functions
								individual users have access to.
							</dd>
						{/if}
						{#if hasPermission('admin.users.kyng-coordinators')}
							<dd class="text-sm opacity-90">
								Administrators can Grant or Revoke KYNG Coordinator status and also edit contact
								details.
							</dd>
						{/if}
						{#if hasPermission('admin.site.data')}
							{#if hasPermission('admin.site.data.spatial')}
								<dd class="text-sm opacity-90">
									Administrators can manage spatial feature types and attributes.
								</dd>
							{/if}
							{#if hasPermission('admin.site.data.addresses')}
								<dd class="text-sm opacity-90">Administrators can manage Custom Addresses.</dd>
							{/if}
						{/if}
					</div>
				{/if}

				{#if hasPermission('admin.users')}
					<div class="mb-4">
						<dt class="font-bold">Manage Registered Users</dt>
						{#if hasPermission('admin.users.kits')}
							<dd class="text-sm opacity-90">
								Reports can be generated for all registered users and their kit delivery status.
							</dd>
						{/if}
						{#if hasPermission('admin.users.newusers')}
							<dd class="text-sm opacity-90">
								Reports can be generated for all registered users and their information
								completeness.
							</dd>
						{/if}
						{#if hasPermission('admin.users.kyng-coordinators')}
							<dd class="text-sm opacity-90">
								Administrators can Grant or Revoke KYNG Coordinator status and also edit contact
								details.
							</dd>
						{/if}
					</div>
				{/if}

				{#if hasPermission('admin.emergency')}
					<div class="mb-4">
						<dt class="font-bold">Manage Emergency Services Reports</dt>
						{#if hasPermission('admin.emergency.reports')}
							<dd class="text-sm opacity-90">
								Reports can be generated for all registered properties in a locality or for an
								individual address.
							</dd>
						{/if}
						{#if hasPermission('admin.emergency.service-map')}
							<dd class="text-sm opacity-90">View an interactive emergency services map.</dd>
						{/if}
					</div>
				{/if}

				{#if hasAnyPermission('admin.community', 'admin.community.bcyca', 'admin.community.mondrook', 'admin.community.tinonee', 'admin.community.external')}
					<div class="mb-4">
						<dt class="font-bold">Manage Community Data Settings</dt>
						{#if hasAnyCommunityFeature('events')}
							<dd class="text-sm opacity-90">
								Use the Events Manager to create and update community gatherings
							</dd>
						{/if}
						{#if hasAnyCommunityFeature('workshops')}
							<dd class="text-sm opacity-90">
								Workshop tools allow you to schedule and track community training sessions
							</dd>
						{/if}
						{#if hasAnyCommunityFeature('information')}
							<dd class="text-sm opacity-90">
								Communication tools help reach community members efficiently
							</dd>
						{/if}
						{#if hasAnyCommunityFeature('map')}
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
