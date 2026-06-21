<script lang="ts">
	import type { MenuItem } from '$lib/types';

	interface Props {
		item: MenuItem;
		isActive: boolean;
	}

	const { item, isActive }: Props = $props();
</script>

{#snippet icon()}
	{#if item.icon}
		<span class="text-surface-50">
			{#key item.icon.icon}
				<item.icon.icon size={14} letter={item.icon.letter} />
			{/key}
		</span>
	{/if}
{/snippet}

{#snippet content()}
	<span class="text-surface-50 ml-2 transition-opacity">
		{item.name}
	</span>
{/snippet}

<div class="pl-12">
	<a
		href={item.link}
		class="hover:bg-surface-700 flex items-center gap-2 rounded-lg px-4 py-2 {isActive
			? 'bg-surface-700'
			: ''}"
	>
		{@render icon()}
		{@render content()}
	</a>
</div>
