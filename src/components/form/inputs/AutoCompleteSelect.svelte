<script lang="ts">
	import Chip from '$components/form/Chip.svelte';

	interface ListDataItem {
		lut_text: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic lookup item shape
		[key: string]: any;
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
	const sortedListData: ListDataItem[] = $derived(
		[...listData].sort((a, b) =>
			getSortableText(a.lut_text).localeCompare(getSortableText(b.lut_text))
		)
	);

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

<div>
	<div class="relative mt-1.5">
		<input
			type="text"
			list={listId}
			class="focus:ring-primary-500 border-surface-300 mr-2 w-full rounded-md border px-3 py-1 focus:ring-2 focus:ring-offset-2 focus:outline-none"
			{placeholder}
			bind:value={inputValue}
			onchange={handleSelection}
		/>
	</div>

	<datalist id={listId}>
		{#each sortedListData.filter((item) => !selectedValues.includes(item.lut_text)) as item (item)}
			<option value={item.lut_text}></option>
		{/each}
	</datalist>

	<div class="mt-2">
		{#each selectedValues as selectedValue (selectedValue)}
			<Chip onRemove={() => removeValue(selectedValue)}>{selectedValue}</Chip>
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
