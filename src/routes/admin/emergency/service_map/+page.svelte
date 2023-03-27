<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ emergencyReportsAdminServiceMapData } = data);
</script>

<svelte:head>
	<title>Emergency Admin-Service Map</title>
</svelte:head>
<div>{emergencyReportsAdminServiceMapData}</div>
