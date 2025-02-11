<script lang="ts">
	import type { MenuItem } from '$lib/types';

	interface Props {
		item: MenuItem;
		isActive: boolean;
		onItemClick?: () => void;
	}

	const { item, isActive, onItemClick }: Props = $props();
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			onItemClick?.();
		}
	}
</script>

{#snippet icon()}
	{#if item.icon}
		<span class="text-stone-50">
			{#key item.icon.icon}
				<item.icon.icon size={16} letter={item.icon.letter} />
			{/key}
		</span>
	{/if}
{/snippet}

{#snippet content()}
	<span class="ml-2 text-stone-50 transition-opacity">
		{item.name}
	</span>
{/snippet}

<div class="pl-8">
	<a
		href={item.link}
		class="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-stone-700 {isActive
			? 'bg-stone-700'
			: ''}"
		onclick={onItemClick}
		onkeydown={handleKeyDown}
	>
		{@render icon()}
		{@render content()}
	</a>
</div>
