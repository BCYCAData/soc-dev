<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ usersAdminKitsData } = data);
</script>

<svelte:head>
	<title>Users Admin-Kits</title>
</svelte:head>
<div>{usersAdminKitsData}</div>
