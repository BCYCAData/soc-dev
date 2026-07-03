<script lang="ts">
	/**
	 * Chip — removable selection token. Extracted from the inline markup
	 * duplicated inside AutoCompleteSelect.svelte's `selectedValues` loop.
	 * Styling is unchanged — it's the same `.preset-chip-token` class already
	 * defined in app.css, just given a reusable component + a11y-labelled
	 * remove button instead of copy-pasted SVG per call site.
	 */
	interface Props {
		onRemove?: () => void;
		children?: import('svelte').Snippet;
	}

	let { onRemove, children }: Props = $props();
</script>

<span class="preset-chip-token mr-2 mb-2">
	{@render children?.()}
	{#if onRemove}
		<button
			type="button"
			class="hover:text-tertiary-400 focus:ring-tertiary-500 text-secondary-700 ml-1.5 shrink-0 rounded-full p-1.5 focus:ring-2 focus:ring-offset-2 focus:outline-none"
			onclick={onRemove}
			aria-label="Remove"
		>
			<span class="sr-only">Remove</span>
			<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.59-11.59a1 1 0 10-1.42-1.42L10 8.59 7.41 6a1 1 0 00-1.42 1.42L8.59 10l-2.6 2.59a1 1 0 101.42 1.42L10 11.41l2.59 2.6a1 1 0 001.42-1.42L11.41 10l2.59-2.59z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	{/if}
</span>
