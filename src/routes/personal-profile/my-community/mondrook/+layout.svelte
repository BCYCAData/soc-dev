<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="mx-auto flex max-h-[45px] min-h-[45px] items-center bg-orange-400">
	<h3 class="mx-auto font-bold text-orange-900">Mondrook Hall Commitee</h3>
</div>
{@render children?.()}
