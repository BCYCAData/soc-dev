<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ siteAdminData } = data);
</script>

<svelte:head>
	<title>Site Administration</title>
</svelte:head>
<div>{siteAdminData}</div>
