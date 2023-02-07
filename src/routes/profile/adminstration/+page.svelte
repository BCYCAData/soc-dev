<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Profile-Administration</title>
</svelte:head>

<div>{data}</div>
