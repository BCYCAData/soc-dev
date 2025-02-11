<script lang="ts">
	import BaseMenuItem from '$components/page/navigation/sidemenu/BaseMenuItem.svelte';
	import CaretIcon from '$components/icons/CaretIcon.svelte';
	import type { MenuItem } from '$lib/types';

	interface Props {
		item: MenuItem;
		isCollapsed: boolean;
		isActive: boolean;
		onItemClick?: () => void;
	}

	const { item, isCollapsed, isActive, onItemClick }: Props = $props();

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
				<item.icon.icon size={20} letter={item.icon.letter} />
			{/key}
		</span>
	{/if}
{/snippet}

{#snippet content()}
	<span class="ml-2 text-stone-50 transition-opacity">
		{item.name}
	</span>
{/snippet}

{#snippet caret()}
	{#if item.subItems}
		<CaretIcon isRotated={isActive} className="ml-auto" />
	{/if}
{/snippet}

<div
	class="menu-item-wrapper"
	role="menuitem"
	tabindex="0"
	onmouseenter={(e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		document.documentElement.style.setProperty('--tooltip-y', `${rect.top}px`);
	}}
	onclick={onItemClick}
	onkeydown={handleKeyDown}
	data-tooltip={isCollapsed ? item.name : null}
>
	<BaseMenuItem href={item.link} {isActive} {isCollapsed} {icon} {content} {caret} />
</div>

<style>
	.menu-item-wrapper {
		position: relative;
	}

	.menu-item-wrapper[data-tooltip]:hover::after {
		content: attr(data-tooltip);
		position: fixed;
		left: 3.75rem;
		top: calc(var(--tooltip-y, 0));
		background: #333;
		color: white;
		padding: 5px 10px;
		border-radius: 4px;
		z-index: 9999;
		pointer-events: none;
	}
</style>
