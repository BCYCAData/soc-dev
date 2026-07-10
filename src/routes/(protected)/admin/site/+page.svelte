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
	<title>Site Administration</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">SOC Website Administration</h1>
	<div class="mb-8 grid gap-6">
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<QuickActionsGrid>
				{#if hasPermission(PERMISSIONS.ADMIN_SITE_MESSAGES)}
					<QuickActionTile href={resolve('/admin/site/messages')}>
						Manage User Messages
					</QuickActionTile>
				{/if}

				{#if hasPermission(PERMISSIONS.ADMIN_SITE_ROLES)}
					<QuickActionTile href={resolve('/admin/site/roles')}>
						Manage User Privleges
					</QuickActionTile>
				{/if}

				{#if hasPermission(PERMISSIONS.ADMIN_SITE_PROFILE_REQUIREMENTS)}
					<QuickActionTile href={resolve('/admin/site/profile-requirements')}>
						Manage Profile Requirements
					</QuickActionTile>
				{/if}

				{#if hasPermission(PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS)}
					<QuickActionTile href={resolve('/admin/users/kyng-coordinators')}>
						Manage KYNG Coordinators
					</QuickActionTile>
				{/if}

				{#if hasPermission(PERMISSIONS.ADMIN_SITE_DATA)}
					<QuickActionTile href={resolve('/admin/site/data')}>
						Manage Site Spatial Data and Address Validation Settings
					</QuickActionTile>
				{/if}
			</QuickActionsGrid>
		</Card>

		<Card>
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				{#if hasFeature('messages')}
					<span class="flex-auto">
						<dt class="font-bold">Manage User Messages</dt>
						<dd class="text-sm opacity-90">
							Messages can be sent to all users based on locality or individual users based on email
							address
						</dd>
					</span>
				{/if}
				{#if hasFeature('roles')}
					<span class="flex-auto">
						<dt class="font-bold">Manage User Privleges</dt>
						<dd class="text-sm opacity-90">
							Administrators can Grant or Revoke roles that determine which functions on the
							Administrator Menu individual users have access to.
						</dd>
					</span>
				{/if}
				{#if hasFeature('kyngcoordinators')}
					<span class="flex-auto">
						<dt class="font-bold">Manage KYNG coordinators</dt>
						<dd class="text-sm opacity-90">
							Administrators can Grant or Revoke KYNG Coordinato status and also edit contact
							details.
						</dd>
					</span>
				{/if}

				{#if hasFeature('data.spatial')}
					<span class="flex-auto">
						<dt class="font-bold">Manage Spatial Data Templates</dt>
						<dd class="text-sm opacity-90">
							Create and customize feature templates with specific geometry types, categories, and
							custom fields for consistent spatial data collection and management.
						</dd>
					</span>
				{/if}
				{#if hasFeature('data.addresses')}
					<span class="flex-auto">
						<dt class="font-bold">Manage Custom Addresses</dt>
						<dd class="text-sm opacity-90">
							Create and customize custom addresses to facilitate user registration.
						</dd>
					</span>
				{/if}
			</div>
		</Card>
	</div>
</div>
