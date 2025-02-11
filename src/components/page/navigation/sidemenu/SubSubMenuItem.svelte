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
		<span class="text-stone-50">
			{#key item.icon.icon}
				<item.icon.icon size={14} letter={item.icon.letter} />
			{/key}
		</span>
	{/if}
{/snippet}

{#snippet content()}
	<span class="ml-2 text-stone-50 transition-opacity">
		{item.name}
	</span>
{/snippet}

<div class="pl-12">
	<a
		href={item.link}
		class="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-stone-700 {isActive
			? 'bg-stone-700'
			: ''}"
	>
		{@render icon()}
		{@render content()}
	</a>
</div>
