<script lang="ts">
	export let data;
	$: ({ siteAdminRolesData } = data);
</script>

<svelte:head>
	<title>Site Admin-Roles</title>
</svelte:head>
<pre>{JSON.stringify(siteAdminRolesData, null, 2)}</pre>
<div>{siteAdminRolesData}</div>
