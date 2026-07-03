<script lang="ts">
	/**
	 * Card — generic surface panel. Extracted from the classes already inlined
	 * in (protected)/admin/+page.svelte ("bg-surface-50-950 rounded-lg shadow"),
	 * so it drops in with zero visual change wherever that pattern repeats.
	 */
	interface Props {
		padded?: boolean;
		children?: import('svelte').Snippet;
	}

	let { padded = true, children }: Props = $props();
</script>

<section class="bg-surface-50-950 rounded-lg shadow {padded ? 'p-6' : ''}">
	{@render children?.()}
</section>
