<script lang="ts">
	export let data;
	$: ({ siteAdminRolesData } = data);
</script>

<svelte:head>
	<title>Site Admin-Roles</title>
</svelte:head>
<div>{siteAdminRolesData}</div>
