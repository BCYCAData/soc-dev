<script lang="ts">
	import Card from '$components/page/Card.svelte';
	import QuickActionsGrid from '$components/page/QuickActionsGrid.svelte';
	import QuickActionTile from '$components/page/QuickActionTile.svelte';
	import { resolve } from '$app/paths';
	import { usePermissions } from '$lib/permissions.svelte';
	import { PERMISSIONS } from '$lib/constants/permissions';

	const { hasPermission } = usePermissions();
</script>

<svelte:head>
	<title>Project Administration</title>
</svelte:head>
<div class="mx-auto max-w-4xl px-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">SOC Project Administration</h1>

	<div class="mb-8 grid gap-6">
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<QuickActionsGrid>
				{#if hasPermission(PERMISSIONS.ADMIN_USERS_KITS)}
					<QuickActionTile href={resolve('/admin/users/kits')}>
						Generate Reports on Kit Delivery
					</QuickActionTile>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_USERS_NEWUSERS)}
					<QuickActionTile href={resolve('/admin/users/new')}>
						Generate Reports on New Users
					</QuickActionTile>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS)}
					<QuickActionTile href={resolve('/admin/users/kyng-coordinators')}>
						Manage KYNG Coordinators
					</QuickActionTile>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_SITE_DATA_KYNG_BOUNDARIES)}
					<QuickActionTile href={resolve('/admin/site/data/kyng-boundaries')}>
						Manage KYNG Area Boundaries
					</QuickActionTile>
				{/if}
			</QuickActionsGrid>
		</Card>

		<Card>
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				{#if hasPermission(PERMISSIONS.ADMIN_USERS_KITS)}
					<div class="mb-4">
						<dt class="font-bold">Generate Reports on Kit Delivery</dt>
						<dd class="text-sm opacity-90">
							Reports can be generated for all registered users and their kit delivery status.
						</dd>
					</div>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_USERS_NEWUSERS)}
					<div class="mb-4">
						<dt class="font-bold">Generate Reports on New Users</dt>
						<dd class="text-sm opacity-90">
							Reports can be generated for all registered users and their information completeness.
						</dd>
					</div>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS)}
					<div class="mb-4">
						<dt class="font-bold">Manage KYNG Coordinators</dt>
						<dd class="text-sm opacity-90">
							Grant and Revoke KYNG Coordinator status to users. Maintain their contact information.
						</dd>
					</div>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_SITE_DATA_KYNG_BOUNDARIES)}
					<div class="mb-4">
						<dt class="font-bold">Manage KYNG Area Boundaries</dt>
						<dd class="text-sm opacity-90">
							Change KYNG Area boundaries. Create new KYNG Areas as needed.
						</dd>
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
