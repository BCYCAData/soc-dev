<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ siteAdminData } = data);
</script>

<svelte:head>
	<title>Site Administration</title>
</svelte:head>
<pre>{JSON.stringify(siteAdminData, null, 2)}</pre>
<div>
	<h1 class="unstyled text-xl font-semibold text-gray-900">
		This page contains information specific to site administration
	</h1>
	<h2 class="unstyled mt-2 text-base font-semibold text-gray-900">
		Currently you can use these pages to:
	</h2>

	<dl class="list-dl">
		<div>
			<span class="badge-icon p-4 variant-soft-secondary"
				><iconify-icon
					icon="tabler:messages"
					class="text-orange-700"
					style="font-size: 30px"
				/></span
			>
			<span class="flex-auto">
				<dt class="font-bold">Set User Messages</dt>
				<dd class="text-sm opacity-90">
					Messages can be sent to all users based on locality or individual users based on email
					address
				</dd>
			</span>
		</div>
		<div>
			<span class="badge-icon p-4 variant-soft-secondary"
				><iconify-icon
					icon="tabler:analyze"
					class="text-orange-700"
					style="font-size: 30px"
				/></span
			>
			<span class="flex-auto">
				<dt class="font-bold">Manage User Privleges</dt>
				<dd class="text-sm opacity-90">
					Administrators can Grant or Revoke roles that determine which functions on the
					Administrator Menu individual users have access to.
				</dd>
			</span>
		</div>
	</dl>
</div>
