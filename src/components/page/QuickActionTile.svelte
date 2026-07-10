<script lang="ts">
	/**
	 * QuickActionTile — a card-sized action link used inside <QuickActionsGrid>.
	 * Bigger than a plain `btn` so long labels have room to wrap, using the same
	 * secondary fill the "Quick Actions" panes already used.
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		children?: Snippet;
	}

	let { href, children }: Props = $props();
</script>

<a
	{href}
	class="preset-filled-secondary-500 flex min-h-24 items-center justify-center rounded-lg p-6 text-center text-lg font-semibold shadow transition-shadow hover:shadow-lg"
>
	{@render children?.()}
</a>
