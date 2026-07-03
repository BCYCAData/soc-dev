<script lang="ts">
	/**
	 * FormWell — the tinted secondary-300 wrapper that groups a question's
	 * input(s), repeated by hand across aboutme/+page.svelte and every other
	 * personal-profile form. `layout` controls the inner arrangement:
	 * - "flex"  : single field or a row of inline radios (default)
	 * - "grid-2": two fields/options side by side (sm:grid-cols-2)
	 */
	interface Props {
		layout?: 'flex' | 'grid-2';
		children?: import('svelte').Snippet;
	}

	let { layout = 'flex', children }: Props = $props();
</script>

<div
	class="bg-secondary-300 rounded-lg p-1 {layout === 'grid-2'
		? 'grid gap-2 sm:grid-cols-2 sm:gap-2'
		: 'flex flex-wrap justify-start gap-2'}"
>
	{@render children?.()}
</div>
