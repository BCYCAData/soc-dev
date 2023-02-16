<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ bcycaInformationAdminData } = data);
</script>

<svelte:head>
	<title>BCYCA Admin-Information</title>
</svelte:head>
<div>{bcycaInformationAdminData}</div>
