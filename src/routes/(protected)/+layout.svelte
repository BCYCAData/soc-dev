<script lang="ts">
	let { children }: { children: any } = $props();
</script>

<!-- Protected pages have full navigation -->
{@render children?.()}
