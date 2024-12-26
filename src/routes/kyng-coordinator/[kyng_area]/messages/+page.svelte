<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	//TODO Implement front page for Kyng Coordinator
	//@ts-ignore
	let { data }: { data: PageData } = $props();
</script>

<pre>{JSON.stringify($page.params, null, 2)}</pre>
<h1>Messages</h1>
