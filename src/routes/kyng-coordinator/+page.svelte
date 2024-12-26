<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>KYNG Coordinators</title>
</svelte:head>

<pre>{JSON.stringify(page.params, null, 2)}</pre>

<div>
	<h1>This will contain information about how to use the contained pages</h1>
</div>
