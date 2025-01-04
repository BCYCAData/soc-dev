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
	<title>Project Administration</title>
</svelte:head>
<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">SOC Project Administration</h1>

	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-2 gap-4">
				{#if hasPermission('users.kits')}
					<a
						href="/admin/users/kits"
						class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Generate Reports on Kit Delivery
					</a>
				{/if}
				{#if hasPermission('users.newusers')}
					<a
						href="/admin/users/new"
						class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Generate Reports on New Users
					</a>
				{/if}
				{#if hasPermission('users.kyng-coordinators')}
					<a
						href="/admin/users/kyng-coordinators"
						class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Manage KYNG Coordinators
					</a>
				{/if}
				{#if hasPermission('users.newusers')}
					<a
						href="/admin/users/new"
						class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Generate Reports on New Users
					</a>
				{/if}
			</div>
		</section>

		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				{#if hasFeaturePermission('kits')}
					<span class="flex-auto">
						<dt class="font-bold">Generate Reports on Kit Delivery</dt>
						<dd class="text-sm opacity-90">
							Reports can be generated for all registered users and their kit delivery status.
						</dd>
					</span>
				{/if}
				{#if hasFeaturePermission('newusers')}
					<span class="flex-auto">
						<dt class="font-bold">Generate Reports on New Users</dt>
						<dd class="text-sm opacity-90">
							Reports can be generated for all registered users and their information completeness.
						</dd>
					</span>
				{/if}
				{#if hasFeaturePermission('kyng-coordinators')}
					<span class="flex-auto">
						<dt class="font-bold">Manage KYNG Coordinators</dt>
						<dd class="text-sm opacity-90">
							Grant and Revoke KYNG Coordinator status to users. Maintain their contact information.
						</dd>
					</span>
				{/if}
				{#if hasFeaturePermission('newusers')}
					<span class="flex-auto">
						<dt class="font-bold">Generate Reports on New Users</dt>
						<dd class="text-sm opacity-90">
							Reports can be generated for all registered users and their information completeness.
						</dd>
					</span>
				{/if}
			</div>
		</section>
	</div>
</div>
