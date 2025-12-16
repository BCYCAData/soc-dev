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
		error?: string;
		touched?: boolean;
	}

	let {
		id,
		name,
		placeholder,
		autocomplete,
		required = false,
		value = $bindable(''),
		className = '',
		error = undefined,
		touched = false
	}: Props = $props();

	const hasError = $derived(touched && !!error);
	const errorId = $derived(`${id}-error`);
</script>

<div>
	<input
		{id}
		{name}
		{placeholder}
		{autocomplete}
		{required}
		type="text"
		class="address-input {className}"
		class:border-error-500={hasError}
		aria-invalid={hasError}
		aria-describedby={hasError ? errorId : undefined}
		use:setUpperCase
		bind:value
	/>
	{#if hasError}
		<span id={errorId} class="text-error-500 mt-1 block text-sm" role="alert">
			{error}
		</span>
	{/if}
</div>

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
