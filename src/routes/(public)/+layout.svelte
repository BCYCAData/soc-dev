<script lang="ts">
	let { children }: { children: any } = $props();
</script>

<!-- Public pages might have different header/footer -->
{@render children?.()}
