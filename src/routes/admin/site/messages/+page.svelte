<script lang="ts">
	export let data;
	$: ({ siteAdminMessagesData } = data);
</script>

<svelte:head>
	<title>Site Admin-Roles</title>
</svelte:head>
<div>{siteAdminMessagesData}</div>
