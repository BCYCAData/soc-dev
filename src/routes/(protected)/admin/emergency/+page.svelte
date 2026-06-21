<svelte:head>
	<title>Emergency Administration</title>
</svelte:head>
<div class="mx-auto max-w-4xl p-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">SOC Emergency Administration</h1>

	<div class="mb-8 grid gap-6">
		<section class="bg-surface-50-950 rounded-lg px-6 pb-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-2 gap-4">
				<a href="/admin/emergency/reports" class=" btn preset-filled-secondary-500">
					Generate Reports for Emergency Services
				</a>
				<a href="/admin/emergency/service-map" class=" btn preset-filled-secondary-500">
					View Emergency Sevices Map
				</a>
			</div>
		</section>

		<section class="bg-surface-50-950 rounded-lg p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				<span class="flex-auto">
					<dt class="font-bold">Generate Reports for Emergency Services</dt>
					<dd class="text-sm opacity-90">
						Reports can be generated for all registered properties in a locality or for an
						individual address.
					</dd>
				</span>
				<span class="flex-auto">
					<dt class="font-bold">View Emergency Sevices Map</dt>
					<dd class="text-sm opacity-90">View an interactive map.</dd>
				</span>
			</div>
		</section>
	</div>
</div>
