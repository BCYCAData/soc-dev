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
		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid auto-rows-auto grid-cols-2 gap-4">
				{#if hasPermission('site.messages')}
					<a
						href="/admin/site/messages"
						class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Manage User Messages
					</a>
				{/if}

				{#if hasPermission('site.roles')}
					<a
						href="/admin/site/roles"
						class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Manage User Privleges
					</a>
				{/if}

				{#if hasPermission('site.kyngcoordinators')}
					<a
						href="/admin/users/kyngcoordinators"
						class="col-span-2 mx-auto flex w-[calc(50%-0.5rem)] items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Manage KYNG Coordinators
					</a>
				{/if}

				{#if hasPermission('site.data')}
					<a
						href="/admin/site/data"
						class="col-span-2 mx-auto flex w-[calc(50%-0.5rem)] items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
					>
						Manage Site Spatial Data and Address Validation Settings
					</a>
				{/if}
			</div>
		</section>

		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				{#if hasFeaturePermission('messages')}
					<span class="flex-auto">
						<dt class="font-bold">Manage User Messages</dt>
						<dd class="text-sm opacity-90">
							Messages can be sent to all users based on locality or individual users based on email
							address
						</dd>
					</span>
				{/if}
				{#if hasFeaturePermission('roles')}
					<span class="flex-auto">
						<dt class="font-bold">Manage User Privleges</dt>
						<dd class="text-sm opacity-90">
							Administrators can Grant or Revoke roles that determine which functions on the
							Administrator Menu individual users have access to.
						</dd>
					</span>
				{/if}
				{#if hasFeaturePermission('kyngcoordinators')}
					<span class="flex-auto">
						<dt class="font-bold">Manage KYNG coordinators</dt>
						<dd class="text-sm opacity-90">
							Administrators can Grant or Revoke KYNG Coordinato status and also edit contact
							details.
						</dd>
					</span>
				{/if}

				{#if hasFeaturePermission('data.spatial')}
					<span class="flex-auto">
						<dt class="font-bold">Manage Spatial Data Templates</dt>
						<dd class="text-sm opacity-90">
							Create and customize feature templates with specific geometry types, categories, and
							custom fields for consistent spatial data collection and management.
						</dd>
					</span>
				{/if}
				{#if hasFeaturePermission('data.addresses')}
					<span class="flex-auto">
						<dt class="font-bold">Manage Custom Addresses</dt>
						<dd class="text-sm opacity-90">
							Create and customize custom addresses to facilitate user registration.
						</dd>
					</span>
				{/if}
			</div>
		</section>
	</div>
</div>
