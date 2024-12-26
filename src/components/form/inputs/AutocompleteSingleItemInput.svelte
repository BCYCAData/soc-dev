<script lang="ts">
	interface Props {
		listData: string[];
		placeholder: string;
		selectedValue?: string;
	}

	let { listData, placeholder, selectedValue = $bindable('') }: Props = $props();
	let inputValue = $state('');

	const getSortableText = (text: string) => {
		const words = text.split(' ');
		if (/^\d+$/.test(words[0])) {
			return words.slice(1).join(' ').toLowerCase();
		}
		return text.toLowerCase();
	};

	const handleSelection = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.value && !selectedValue) {
			selectedValue = input.value;
			input.value = '';
		}
	};

	let sortedListData: string[] = $derived(
		[...listData].sort((a, b) => getSortableText(a).localeCompare(getSortableText(b)))
	);

	const removeValue = () => {
		selectedValue = '';
	};

	const listId = `autocomplete-${Math.random().toString(36).slice(2)}`;
</script>

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
		<input name="target_data" type="hidden" bind:value={selectedValue} />
	</div>

	<datalist id={listId}>
		{#each sortedListData.filter((item) => item !== selectedValue) as item}
			<option value={item}></option>
		{/each}
	</datalist>

	<div class="mt-2">
		{#if selectedValue}
			<span
				class="mb-2 mr-2 inline-flex items-center rounded-full bg-orange-300 px-3 py-0.5 text-sm font-medium text-orange-900"
			>
				{selectedValue}
				<button
					type="button"
					class="ml-1.5 flex-shrink-0 rounded-full p-1.5 text-orange-700 hover:text-tertiary-400 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2"
					onclick={removeValue}
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
		{/if}
	</div>
</div>

<style>
	input[list]::-webkit-calendar-picker-indicator {
		display: none;
	}

	input[list] {
		-moz-appearance: none;
		appearance: none;
	}

	input[list]::-ms-expand {
		display: none;
	}
</style>
