<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Site Admin-Roles</title>
</svelte:head>

<div class="container mx-auto p-4">
	<h1 class="mb-6 text-2xl font-bold">Data Management</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<a
			href={resolve('/admin/site/data/spatial')}
			class="card preset-filled-secondary-500 p-6 transition-all hover:shadow-lg"
		>
			<h2 class="mb-3 text-xl font-semibold">Manage Site Data</h2>
			<ul class="list-inside list-disc space-y-2">
				<li>View current feature types</li>
				<li>Assign new feature types</li>
				<li>Manage feature type attributes</li>
			</ul>
		</a>

		<a
			href={resolve('/admin/site/data/addresses')}
			class="card preset-filled-secondary-500 p-6 transition-all hover:shadow-lg"
		>
			<h2 class="mb-3 text-xl font-semibold">Manage Custom Addresses</h2>
			<ul class="list-inside list-disc space-y-2">
				<li>View custom addresses</li>
				<li>Create and revoke custom addresses</li>
				<li>Edit custom address details</li>
			</ul>
		</a>
	</div>
</div>
