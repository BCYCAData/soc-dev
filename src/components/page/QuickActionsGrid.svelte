<script lang="ts">
	/**
	 * QuickActionsGrid — the layout for a "Quick Actions" pane. A responsive grid
	 * with strict row-major order (left-to-right, top-to-bottom): one column on
	 * small screens, a maximum of two from `sm` up. Tiles in a row share the same
	 * height. Use with <QuickActionTile> so every pane looks the same.
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
	{@render children?.()}
</div>
