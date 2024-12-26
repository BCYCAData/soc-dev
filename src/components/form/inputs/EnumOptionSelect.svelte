<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		messageContext: string;
		header: string;
	}

	let { messageContext = $bindable(), header }: Props = $props();

	let options: string[] = ['users', 'admins', 'both'];

	onMount(() => {
		if (!options.includes(messageContext)) {
			messageContext = options[0];
		}
	});
</script>

<label class="flex flex-col items-start">
	<span class="mr-2">{header}</span>
	<select
		bind:value={messageContext}
		class="ml-2 min-w-[125px] rounded-md border border-gray-300 px-3 py-1 pr-9 focus:outline-none focus:ring-0 active:outline-none active:ring-0"
	>
		{#each options as option}
			<option class="option-hover-bg min-w-max" value={option}>{option}</option>
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
