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
	<title>Site Administration</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">SOC Website Administration</h1>
	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white px-6 pb-6 shadow">
			<h2 class="mb-2 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-2 gap-4">
				{#if hasPermission('admin.site')}
					<a
						href="/admin/site"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage Site Settings
					</a>
				{/if}

				{#if hasPermission('admin.users')}
					<a
						href="/admin/users"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage Registered Users
					</a>
				{/if}

				{#if hasPermission('admin.emergency')}
					<a
						href="/admin/emergency"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage Emergency Services Reports
					</a>
				{/if}

				{#if hasPermission('admin.community')}
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
				{#if hasFeaturePermission('site')}
					<span class="flex-auto">
						<dt class="font-bold">Manage Site Settings</dt>
						{#if hasFeaturePermission('messages')}
							<dd class="text-sm opacity-90">
								Messages can be sent to all users based on locality or individual users based on
								email address
							</dd>
						{/if}
						{#if hasFeaturePermission('roles')}
							<dd class="text-sm opacity-90">
								Administrators can Grant or Revoke roles that determine Administrator Menu functions
								individual users have access to.
							</dd>
						{/if}
						{#if hasFeaturePermission('kyngcoordinators')}
							<dd class="text-sm opacity-90">
								Administrators can Grant or Revoke KYNG Coordinator status and also edit contact
								details.
							</dd>
						{/if}
						{#if hasFeaturePermission('data')}
							{#if hasFeaturePermission('spatial')}
								<dd class="text-sm opacity-90">
									Administrators can manage spatial feature types and attributes.
								</dd>
							{/if}
							{#if hasFeaturePermission('addresses')}
								<dd class="text-sm opacity-90">Administrators can manage Custom Addresses.</dd>
							{/if}
						{/if}
					</span>
				{/if}

				{#if hasFeaturePermission('users')}
					<span class="flex-auto">
						<dt class="font-bold">Manage Registered Users</dt>
						{#if hasFeaturePermission('users.kits')}
							<dd class="text-sm opacity-90">
								Reports can be generated for all registered users and their kit delivery status.
							</dd>
						{/if}
						{#if hasFeaturePermission('users.new')}
							<dd class="text-sm opacity-90">
								Reports can be generated for all registered users and their information
								completeness.
							</dd>
						{/if}
						{#if hasFeaturePermission('users.kyng-coordinators')}
							<dd class="text-sm opacity-90">
								Administrators can Grant or Revoke KYNG Coordinator status and also edit contact
								details.
							</dd>
						{/if}
					</span>
				{/if}

				{#if hasFeaturePermission('emergency')}
					<span class="flex-auto">
						<dt class="font-bold">Manage Emergency Services Reports</dt>
						{#if hasFeaturePermission('emergency.reports')}
							<dd class="text-sm opacity-90">
								Reports can be generated for all registered properties in a locality or for an
								individual address.
							</dd>
						{/if}
						{#if hasFeaturePermission('emergency.service-map')}
							<dd class="text-sm opacity-90">View an interactive emergency services map.</dd>
						{/if}
					</span>
				{/if}

				{#if hasFeaturePermission('community')}
					<span class="flex-auto">
						<dt class="font-bold">Manage Community Data Settings</dt>
						{#if hasFeaturePermission('events')}
							<li class="text-sm opacity-90">
								Use the Events Manager to create and update community gatherings
							</li>
						{/if}
						{#if hasFeaturePermission('workshops')}
							<li class="text-sm opacity-90">
								Workshop tools allow you to schedule and track community training sessions
							</li>
						{/if}
						{#if hasFeaturePermission('information')}
							<li class="text-sm opacity-90">
								Communication tools help reach community members efficiently
							</li>
						{/if}
						{#if hasFeaturePermission('communities')}
							<li class="text-sm opacity-90">
								Access detailed analytics about community engagement
							</li>
						{/if}
					</span>
				{/if}
			</div>
		</section>
	</div>
</div>
