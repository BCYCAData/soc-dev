<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data }: Props = $props();
	const emergencyReportsAdminServiceMapData = $derived(data.emergencyReportsAdminServiceMapData);
</script>

<svelte:head>
	<title>Emergency Admin-Service Map</title>
</svelte:head>
<div>{emergencyReportsAdminServiceMapData}</div>
