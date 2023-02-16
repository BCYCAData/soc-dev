<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ emergencyReportsAdminData } = data);
</script>

<svelte:head>
	<title>Emergency Admin-Reports</title>
</svelte:head>
<div>{emergencyReportsAdminData}</div>
