<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ bcycaEventsAdminData } = data);
</script>

<svelte:head>
	<title>BCYCA Admin-Events</title>
</svelte:head>
<div>{bcycaEventsAdminData}</div>
