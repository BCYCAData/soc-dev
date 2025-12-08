<script lang="ts">
	import { usePermissions } from '$lib/permissions.svelte';
	import { PERMISSIONS } from '$lib/constants/permissions';

	const { hasPermission } = usePermissions();
</script>

<svelte:head>
	<title>Project Administration</title>
</svelte:head>
<div class="mx-auto max-w-4xl px-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">SOC Project Administration</h1>

	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-2 gap-4">
				{#if hasPermission(PERMISSIONS.ADMIN_USERS_KITS)}
					<a
						href="/admin/users/kits"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Generate Reports on Kit Delivery
					</a>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_USERS_NEWUSERS)}
					<a
						href="/admin/users/new"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Generate Reports on New Users
					</a>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS)}
					<a
						href="/admin/users/kyng-coordinators"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage KYNG Coordinators
					</a>
				{/if}
				{#if hasPermission(PERMISSIONS.ADMIN_SITE_DATA_KYNG_BOUNDARIES)}
					<a
						href="/admin/site/data/kyng-boundaries"
						class="flex items-center justify-center rounded bg-orange-500 p-2 text-center text-white transition hover:bg-orange-600"
					>
						Manage KYNG Area Boundaries
					</a>
				{/if}
			</div>
		</section>

		<section class="rounded-lg bg-white p-6 shadow">
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
		</section>
	</div>
</div>

<style>
	.prose dd {
		margin-left: 1rem;
		margin-bottom: 0.5rem;
	}
</style>
