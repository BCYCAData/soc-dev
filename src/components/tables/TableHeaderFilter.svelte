<script lang="ts">
	import { onMount } from 'svelte';
	import type { DataHandler } from '@vincjo/datatables';

	export let handler: DataHandler;
	export let filterBy: any | null = null;
	export let align: 'left' | 'right' | 'center' = 'left';
	export let comparator: Function | undefined = undefined;

	let value = '';

	// Function to clear the input value
	function clearValue() {
		value = '';
		handler.filter(value, filterBy, comparator);
	}

	// Attach a listener to clear the input value on component mount
	onMount(() => {
		const clearIcon = document.getElementById('clear-icon');
		if (clearIcon) {
			clearIcon.addEventListener('click', clearValue);
		}
	});
</script>

<th class={$$props.class ?? ''}>
	<div class="input-wrapper">
		<input
			style:text-align={align}
			type="text"
			placeholder={handler.i18n.filter}
			spellcheck="false"
			bind:value
			on:input={() => handler.filter(value, filterBy, comparator)}
		/>
		{#if value && value.length > 0}
			<div
				id="clear-icon"
				class="clear-icon"
				on:click={clearValue}
				on:keydown={(event) => {
					if (event.key === 'Enter') {
						clearValue();
					}
				}}
			>
				<svg
					width="20px"
					height="20px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M7.50006 5.5L4.05262 10.7909C3.71387 11.3107 3.69732 11.9772 4.00984 12.5133L7.50006 18.5H18.8588C19.7651 18.5 20.4999 17.7653 20.4999 16.8589V7.14109C20.4999 6.23474 19.7651 5.5 18.8588 5.5H7.50006Z"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M10 8.5L17 15.5"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M10 15.5L16.9303 8.49996"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		{/if}
	</div>
</th>

<style>
	th {
		border-bottom: 1px solid #e0e0e0;
		background-color: aquamarine;
	}
	.input-wrapper {
		position: relative;
	}
	input {
		width: 100%;
		height: 24px;
		border: none;
		text-align: left;
		padding: 0 20px;
		background: inherit;
		outline: none;
		border-radius: 0;
		font-size: 14px;
		font-family: Arial, Helvetica, sans-serif;
	}
	input::placeholder {
		color: #bdbdbd;
		font-style: italic;
		font-size: 13px;
	}
	input:focus {
		outline: none;
		border: none;
	}
	.clear-icon {
		position: absolute;
		top: 50%;
		right: 5px;
		transform: translateY(-50%);
		cursor: pointer;
	}
</style>
