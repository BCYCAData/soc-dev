<script lang="ts">
	export let activeTabValue: string;
	export let id: string;
	export let contentDivClass = 'p-4 bg-gray-50 rounded-lg';
</script>

{#if activeTabValue === id}
	<div class={contentDivClass} id="{id}-tabitem" role="tabpanel" aria-labelledby="{id}-tab">
		<slot />
	</div>
{/if}
