<svelte:head>
	<title>Emergency Administration</title>
</svelte:head>
<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">SOC Emergency Administration</h1>

	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white px-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid grid-cols-2 gap-4">
				<a
					href="/admin/emergency/reports"
					class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
				>
					Generate Reports for Emergency Services
				</a>
				<a
					href="/admin/emergency/service-map"
					class=" flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
				>
					View Emergency Sevices Map
				</a>
			</div>
		</section>

		<section class="rounded-lg bg-white p-6 shadow">
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
