<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="bg-secondary-400 mx-auto flex max-h-[45px] min-h-[45px] items-center">
	<h3 class="text-secondary-900 mx-auto font-bold">Mondrook Hall Commitee</h3>
</div>
{@render children?.()}
