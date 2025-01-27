<script lang="ts">
	interface ListDataItem {
		lut_text: string;
		[key: string]: any; // This allows for additional properties
	}

	interface Props {
		listData: ListDataItem[];
		placeholder: string;
		selectedValues?: string[];
		targetValues?: string[];
	}

	let {
		listData,
		placeholder,
		selectedValues = $bindable([]),
		targetValues = $bindable([])
	}: Props = $props();

	let inputValue = $state('');
	let sortedListData: ListDataItem[] = $state([]);

	// Helper function to get sortable text (excluding leading numbers)
	const getSortableText = (text: string) => {
		const words = text.split(' ');
		// If first word is a number, use rest of text for sorting
		if (/^\d+$/.test(words[0])) {
			return words.slice(1).join(' ').toLowerCase();
		}
		return text.toLowerCase();
	};

	// Enhanced sorting logic
	$effect(() => {
		sortedListData = [...listData].sort((a, b) =>
			getSortableText(a.lut_text).localeCompare(getSortableText(b.lut_text))
		);
	});

	const handleSelection = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const selectedItem = sortedListData.find((item) => item.lut_text === input.value);

		if (selectedItem && !selectedValues.includes(selectedItem.lut_text)) {
			selectedValues = [...selectedValues, selectedItem.lut_text];
			// Add all property_ids from the selected item
			targetValues = [...targetValues, ...selectedItem.property_id];
			input.value = '';
		}
	};

	const removeValue = (valueToRemove: string) => {
		const index = selectedValues.indexOf(valueToRemove);
		if (index > -1) {
			// Find the corresponding property_id to remove
			const selectedItem = listData.find((item) => item.lut_text === valueToRemove);
			if (selectedItem) {
				selectedValues = selectedValues.filter((_, i) => i !== index);
				// Remove all property_ids associated with this address
				targetValues = targetValues.filter((id) => !selectedItem.property_id.includes(id));
			}
		}
	};

	const listId = `autocomplete-${Math.random().toString(36).slice(2)}`;
</script>

// AutoCompleteSelect.svelte
<div>
	<div class="relative mt-1.5">
		<input
			type="text"
			list={listId}
			class="mr-2 w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
			{placeholder}
			bind:value={inputValue}
			onchange={handleSelection}
		/>
	</div>

	<datalist id={listId}>
		{#each sortedListData.filter((item) => !selectedValues.includes(item.lut_text)) as item}
			<option value={item.lut_text}></option>
		{/each}
	</datalist>

	<div class="mt-2">
		{#each selectedValues as selectedValue}
			<span
				class="mb-2 mr-2 inline-flex items-center rounded-full bg-orange-300 px-3 py-0.5 text-sm font-medium text-orange-900"
			>
				{selectedValue}
				<button
					type="button"
					class="ml-1.5 flex-shrink-0 rounded-full p-1.5 text-orange-700 hover:text-tertiary-400 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2"
					onclick={() => removeValue(selectedValue)}
					aria-label="Remove {selectedValue}"
				>
					<span class="sr-only">Remove</span>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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

<style>
	/* Hide the arrow in Chrome, Safari, and newer versions of Edge */
	input[list]::-webkit-calendar-picker-indicator {
		display: none;
	}

	/* Hide the arrow in Firefox */
	input[list] {
		-moz-appearance: none;
		appearance: none;
	}

	/* Hide the arrow in Internet Explorer and older versions of Edge */
	input[list]::-ms-expand {
		display: none;
	}
</style>
