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

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	role="button"
	tabindex="0"
	{href}
	class="menu-item relative flex cursor-pointer items-center rounded-full p-2 {isActive
		? 'bg-secondary-950 ring-1 ring-inset ring-secondary-400'
		: ''} {isCollapsed ? 'justify-center' : ''}"
>
	{@render icon?.()}
	{#if !isCollapsed}
		{@render content?.()}
		{@render caret?.()}
	{/if}
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
