<script lang="ts">
	import { drawerStore } from '@skeletonlabs/skeleton';

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="bg-primary-400 list-nav p-4">
	<ul>
		<li><a href="/" class="btn" on:click={drawerClose}>Left-Button</a></li>
		<li><a href="/" class="btn" on:click={drawerClose}>Left-Anchor</a></li>
		<li><a href="/" class="btn" on:click={drawerClose}>Centre-Button</a></li>
		<li><a href="/" class="btn" on:click={drawerClose}>Centre-Anchor</a></li>
		<li><a href="/" class="btn" on:click={drawerClose}>Right-Button</a></li>
		<li><a href="/" class="btn" on:click={drawerClose}>Right-Anchor</a></li>
	</ul>
</nav>
