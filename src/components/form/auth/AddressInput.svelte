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

<style>
	.address-input {
		border: 1px solid #2d3748; /* Assuming secondary-700 is a Tailwind color, typically around this hex */
		width: 100%;
		border-radius: 0.25rem; /* Standard rounded value in Tailwind */
		padding: 0.25rem; /* p-1 */
		text-transform: uppercase;
	}

	@media (min-width: 640px) {
		.address-input {
			padding: 0.75rem; /* sm:p-3 */
		}
	}
</style>
