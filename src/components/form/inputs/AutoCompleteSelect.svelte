<script lang="ts">
	import type { List } from 'postcss/lib/list';

	interface ListItem {
		user_id: string;
		lut_text: string;
	}

	import AutoCompleteLookUp from './AutoCompleteLookUp.svelte';

	export let listData: ListItem[];
	export let placeholder: string;
	export let selectedValues: string[] = []; // Array to store selected Look Up text

	let filteredList: ListItem[] = [];
	let searchInput: HTMLInputElement;
	let inputValue = '';
	let hiLiteIndex: number;

	let targetValues: string[] = []; // Array to store selected user id values
	let targetData: string;

	let showModal = false; // Controls the modal visibility
	let modalList: ListItem[];

	$: if (!inputValue) {
		filteredList = [];
		hiLiteIndex = -1;
	}

	const filterList = () => {
		if (inputValue) {
			filteredList = listData
				.filter((item: ListItem) => !selectedValues.includes(item.lut_text))
				.filter((item: ListItem) => item.lut_text.toLowerCase().includes(inputValue.toLowerCase()))
				.map((item: ListItem) => ({
					...item
				}));
		} else {
			filteredList = [];
		}
	};

	const setInputValue = (item: ListItem) => {
		// inputValue = removeBold(item.lut_text);
		inputValue = item.lut_text;
		selectedValues = [...selectedValues, inputValue]; // Add selected value to the array
		targetValues = [...targetValues, item.user_id]; // Add selected value to the array
		filteredList = [];
		hiLiteIndex = -1;
		searchInput.focus();
		inputValue = '';
		targetData = JSON.stringify(targetValues);
	};

	// const removeBold = (item: string) => {
	// 	return item.replace(/<(.)*?>/g, '');
	// };

	const removeValue = (valueToRemove: string) => {
		selectedValues = selectedValues.filter((value) => value !== valueToRemove);
	};

	const navigateList = (e: { key: any }) => {
		switch (e.key) {
			case 'ArrowDown':
				if (hiLiteIndex !== null && hiLiteIndex <= filteredList.length - 1) {
					hiLiteIndex += 1;
				}
				break;
			case 'ArrowUp':
				if (hiLiteIndex !== null) {
					hiLiteIndex === 0 ? (hiLiteIndex = filteredList.length - 1) : (hiLiteIndex -= 1);
				}
				break;
			case 'Enter':
				setInputValue(filteredList[hiLiteIndex]);
				break;
			default:
				return;
		}
	};

	const openModal = () => {
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
	};

	const selectValue = (value: ListItem) => {
		setInputValue(value);
		modalList = modalList.filter((item) => item.lut_text !== value.lut_text);
		closeModal();
	};

	$: modalList = listData.map((item) => item);
</script>

<svelte:window on:keydown={navigateList} />

<!-- Modal Component -->
<div
	class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center"
	style="z-index: 9999"
	class:hidden={!showModal}
>
	<div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />

	<div
		class="modal-container bg-white w-11/12 md:w-1/2 mx-auto rounded shadow-lg z-50 overflow-y-auto"
	>
		<div class="modal-content py-1 text-left px-1">
			<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
				{#each modalList as item}
					<button
						class="cursor-pointer hover:bg-gray-100"
						on:click={() => selectValue(item)}
						on:keydown={(event) => {
							if (event.key === 'Enter' || event.key === ' ') {
								selectValue(item);
							}
						}}
					>
						{item.lut_text}
					</button>
				{/each}
			</ul>

			<div class="flex justify-end mt-4">
				<button
					type="button"
					class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
					on:click={closeModal}>Close</button
				>
			</div>
		</div>
	</div>
</div>

<div>
	<div class="relative">
		<input name="target_data" type="hidden" bind:value={targetData} />
		<input
			id="value-input"
			name="value-input"
			type="text"
			{placeholder}
			class="w-full py-2 pl-3 pr-10 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
			bind:this={searchInput}
			bind:value={inputValue}
			on:input={filterList}
		/>
		<button
			type="button"
			class="absolute top-0 right-0 h-full px-2 py-2 text-orange-700 rounded-r-md hover:bg-orange-200"
			on:click={openModal}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 16 16"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M0 .5A.5.5 0 0 1 .5 0h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 .5Zm4 0a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10A.5.5 0 0 1 4 .5Zm-4 2A.5.5 0 0 1 .5 2h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5Zm-4 2A.5.5 0 0 1 .5 4h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5Zm-4 2A.5.5 0 0 1 .5 6h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm-4 2A.5.5 0 0 1 .5 8h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5Zm-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5Zm-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5Zm-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm4 0a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5Z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		{#if filteredList.length > 0}
			<ul class="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg">
				{#each filteredList as item, i}
					<AutoCompleteLookUp
						itemLabel={item.lut_text}
						highlighted={i === hiLiteIndex}
						on:click={() => setInputValue(item)}
					/>
				{/each}
			</ul>
		{/if}
	</div>
	<div class="ml-2">
		<div class="mt-1">
			{#each selectedValues as selectedValue}
				<span
					class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-orange-300 text-orange-900"
				>
					{selectedValue}
					<button
						type="button"
						class="flex-shrink-0 ml-1.5 p-1.5 rounded-full text-orange-700 hover:text-tertiary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary-500"
						on:click={() => removeValue(selectedValue)}
					>
						<span class="sr-only">Remove</span>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.59-11.59a1 1 0 10-1.42-1.42L10 8.59 7.41 6a1 1 0 00-1.42 1.42L8.59 10l-2.6 2.59a1 1 0 101.42 1.42L10 11.41l2.59 2.6a1 1 0 001.42-1.42L11.41 10l2.59-2.59z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</span>
			{/each}
		</div>
	</div>
</div>
