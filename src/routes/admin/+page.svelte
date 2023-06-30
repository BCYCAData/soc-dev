<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ adminData } = data);
</script>

<svelte:head>
	<title>Administrators</title>
</svelte:head>

<pre>{JSON.stringify(adminData, null, 2)}</pre>
<div>
	<h1>This will contain information about how to use the contained pages</h1>
</div>
