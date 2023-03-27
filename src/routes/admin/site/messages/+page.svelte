<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ siteAdminMessagesData } = data);
</script>

<svelte:head>
	<title>Site Admin-Roles</title>
</svelte:head>
<div>{siteAdminMessagesData}</div>
