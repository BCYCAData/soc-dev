<script lang="ts">
	interface Props {
		href: string;
		isActive: boolean;
		isCollapsed: boolean;
		icon?: import('svelte').Snippet;
		content?: import('svelte').Snippet;
		caret?: import('svelte').Snippet;
	}

	let { href, isActive, isCollapsed, icon, content, caret }: Props = $props();
</script>

<a
	role="button"
	tabindex="0"
	{href}
	class="menu-item relative flex cursor-pointer items-center rounded-full p-2 {isActive
		? 'bg-orange-700'
		: ''} {isCollapsed ? 'justify-center' : ''}"
>
	{@render icon?.()}
	{#if !isCollapsed}
		{@render content?.()}
		{@render caret?.()}
	{/if}
</a>
