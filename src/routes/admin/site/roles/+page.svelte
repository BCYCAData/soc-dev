<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ siteAdminRolesData } = data);
</script>

<svelte:head>
	<title>Site Admin-Roles</title>
</svelte:head>
<div>{siteAdminRolesData}</div>
