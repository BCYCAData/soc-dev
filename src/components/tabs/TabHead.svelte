<script lang="ts">
	export let tabStyle: 'default' | 'underline' = 'default';

	export const divClasses = {
		default: '',
		underline: 'mb-1 text-sm font-medium text-center text-gray-500'
	};
	export const ulClasses = {
		default: 'flex flex-wrap',
		underline: 'flex flex-wrap mb-1'
	};
</script>

<div class={divClasses[tabStyle]}>
	<ul class={ulClasses[tabStyle]} role="tablist">
		<slot />
	</ul>
</div>
