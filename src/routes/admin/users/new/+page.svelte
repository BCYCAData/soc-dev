<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ usersAdminNewUsersData } = data);
</script>

<svelte:head>
	<title>Users Admin-NewUsers</title>
</svelte:head>
<div>{usersAdminNewUsersData}</div>
