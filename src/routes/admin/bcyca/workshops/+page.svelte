<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ bcycaWorkshopsAdminData } = data);
</script>

<svelte:head>
	<title>BCYCA Admin-Workshops</title>
</svelte:head>
<div>{bcycaWorkshopsAdminData}</div>
