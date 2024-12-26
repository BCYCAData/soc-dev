<svelte:head>
	<title>Site Admin-Roles</title>
</svelte:head>

<div class="container mx-auto p-4">
	<h1 class="mb-6 text-2xl font-bold">Role Management</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<a
			href="/admin/site/roles/assignments"
			class="card bg-orange-50 p-6 transition-all hover:bg-orange-100"
		>
			<h2 class="mb-3 text-xl font-semibold">Role Assignments</h2>
			<ul class="list-inside list-disc space-y-2">
				<li>View current role assignments</li>
				<li>Assign new roles to users</li>
				<li>Remove user roles</li>
				<li>Manage role permissions</li>
			</ul>
		</a>

		<a
			href="/admin/site/roles/permissions"
			class="card bg-orange-50 p-6 transition-all hover:bg-orange-100"
		>
			<h2 class="mb-3 text-xl font-semibold">Roles & Permissions</h2>
			<ul class="list-inside list-disc space-y-2">
				<li>View permission hierarchy</li>
				<li>Create and delete roles</li>
				<li>Edit role permissions</li>
				<li>Maintain permission structure</li>
			</ul>
		</a>
	</div>
</div>
