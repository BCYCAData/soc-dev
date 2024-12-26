<script lang="ts">
	import { setUpperCase } from '$lib/utility';
	import type { FullAutoFill } from '$lib/types';

	interface Props {
		id: string;
		name: string;
		placeholder: string;
		autocomplete: FullAutoFill;
		required?: boolean;
		value?: string;
		className?: string;
	}

	let {
		id,
		name,
		placeholder,
		autocomplete,
		required = false,
		value = $bindable(''),
		className = ''
	}: Props = $props();
</script>

<input
	{id}
	{name}
	{placeholder}
	{autocomplete}
	{required}
	type="text"
	class="address-input {className}"
	use:setUpperCase
	bind:value
/>

<style lang="postcss">
	.address-input {
		@apply w-full rounded border border-secondary-700 p-1 uppercase sm:p-3;
	}
</style>
