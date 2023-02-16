<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ emergencyAdminData } = data);
</script>

<svelte:head>
	<title>Emergency Administration</title>
</svelte:head>
<div>{emergencyAdminData}</div>
