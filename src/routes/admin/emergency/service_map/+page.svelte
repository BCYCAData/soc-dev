<script lang="ts">
	export let data;
	$: ({ emergencyReportsAdminServiceMapData } = data);
</script>

<svelte:head>
	<title>Emergency Admin-Service Map</title>
</svelte:head>
<div>{emergencyReportsAdminServiceMapData}</div>
