<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ bcycaAdminData } = data);
</script>

<svelte:head>
	<title>BCYCA Administration</title>
</svelte:head>
<div>{bcycaAdminData}</div>
