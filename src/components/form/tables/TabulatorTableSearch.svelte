<script lang="ts">
	import { onMount } from 'svelte';
	import type { Tabulator } from 'tabulator-tables';
	import type { ComparisonOption } from '$lib/types';

	export let table: Tabulator;
	export let searchField = '';
	export let comparisonType = 'like';
	export let searchValue = '';
	export let fieldOptions: ComparisonOption[];

	const comparisonOptions: ComparisonOption[] = [
		{ value: '=', lable: '=' },
		{ value: '<', lable: '<' },
		{ value: '<=', lable: '<=' },
		{ value: '>', lable: '>' },
		{ value: '>=', lable: '>=' },
		{ value: '!=', lable: '!=' },
		{ value: 'like', lable: 'like' }
	];

	const updateFilter = () => {
		if (searchField) {
			table.setFilter(searchField, comparisonType, searchValue);
		}
	};
	const clearValue = () => {
		searchValue = '';
		updateFilter();
	};

	onMount(() => {
		const clearIcon = document.getElementById('clear-icon');
		if (clearIcon) {
			clearIcon.addEventListener('click', clearValue);
		}
	});
</script>

<div
	class="flex items-center justify-around mb-4 p-2 bg-primary-100 border rounded-md border-gray-400 text-sm"
>
	<span class="flex items-center">
		<label class="mr-2 text-base" for="filter-field">Field: </label>
		<select
			class="filter-field"
			id="filter-field"
			bind:value={searchField}
			on:change={updateFilter}
		>
			{#each fieldOptions as { value, lable }}
				<option {value}>{lable}</option>
			{/each}
		</select>
	</span>
	<span class="flex items-center">
		<label class="mr-2 text-base" for="filter-type">Comparison: </label>
		<select
			class="filter-type"
			id="filter-type"
			bind:value={comparisonType}
			on:change={updateFilter}
		>
			{#each comparisonOptions as { value, lable }}
				<option {value}>{lable}</option>
			{/each}
		</select>
	</span>
	<div class="relative flex-grow">
		<div class="flex">
			<input
				class="h-9 border border-gray-400 bg-surface-100 mx-2 py-1 px-2 rounded w-full"
				id="filter-value"
				bind:value={searchValue}
				placeholder="Search text..."
				on:input={() => updateFilter()}
			/>
			{#if searchValue && searchValue.length > 0}
				<div
					id="clear-icon"
					class="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
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
	</div>
	<button
		class="border border-gray-400 mx-4 w-auto py-1 pl-2 pr-1 rounded bg-tertiary-400"
		on:click={clearValue}
		id="filter-clear">Clear Filter</button
	>
</div>

<style>
	.filter-type,
	.filter-field {
		border: 1px solid #e0e0e0;
		background-color: #fafaf9;
		border-radius: 4px;
		outline: none;
		padding: 0 32px 0 8px;
		line-height: 24px;
		margin-inline-end: 4px;
		height: 36px;
		width: 100%;
		transition: all 0.1s;
		box-sizing: border-box;
	}

	#filter-value {
		margin-inline-end: 8px; /* Add spacing between the input and the button */
	}

	#filter-clear {
		margin-left: 8px; /* Add spacing between the input and the button */
	}
</style>
