<script lang="ts">
	import { onMount } from 'svelte';
	export let enumValue = '';
	export let header: string;

	let options: string[] = ['users', 'admins', 'both'];

	onMount(() => {
		// Set the initial value of the picker
		if (!options.includes(enumValue)) {
			enumValue = options[0];
		}
	});
</script>

<label class="flex flex-col items-start">
	<span class="mr-2">{header}</span>
	<select
		name="enumSelect"
		bind:value={enumValue}
		class="border border-gray-300 rounded-md ml-2 px-3 py-1 pr-9 min-w-[125px] focus:outline-none focus:ring-0 active:outline-none active:ring-0"
	>
		{#each options as option}
			<option class="min-w-max option-hover-bg" value={option}>{option}</option>
		{/each}
	</select>
</label>

<style>
	option:checked {
		background: transparent !important;
		appearance: none !important;
		-webkit-appearance: none !important;
		-moz-appearance: none !important;
	}
	option:hover {
		background: none;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
	}
	option:focus {
		background: none;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
	}
	option:active {
		background: none;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
	}
</style>
