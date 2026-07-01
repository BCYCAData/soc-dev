<script lang="ts">
	import type { TabItem } from '$lib/types';

	interface Props {
		items: TabItem[];
		initialTab?: number;
	}

	let { items = [], initialTab = 1 }: Props = $props();
	let activeTabValue = $derived(initialTab);

	const handleTabChange = (tabValue: number) => () => {
		activeTabValue = tabValue;
	};

	const handleKeyPress = (tabValue: number, event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			activeTabValue = tabValue;
		}
	};
</script>

<div class="w-full">
	<nav class="mb-0" aria-label="Content tabs">
		<!-- Mobile: 2-col grid so all tabs are visible without wrapping into a pile.
		     sm+: inline wrapping row that connects to the panel below. -->
		<ul
			class="grid list-none grid-cols-2 gap-1 p-0 sm:flex sm:flex-wrap sm:justify-center sm:gap-0"
			role="tablist"
		>
			{#each items as item (item)}
				<li
					class="sm:me-1 sm:-mb-px"
					class:active={activeTabValue === item.value}
					role="tab"
					aria-selected={activeTabValue === item.value}
					aria-controls="tab-content-{item.value}"
				>
					<button
						type="button"
						class="block w-full cursor-pointer rounded-t-lg border-b-2 px-3 py-2 text-center text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500 sm:w-auto sm:px-4 sm:text-base
							{activeTabValue === item.value
							? 'border-secondary-300 bg-secondary-300 text-secondary-900 border-b-4 font-bold'
							: 'border-transparent bg-secondary-200 text-secondary-900 hover:border-secondary-300'}"
						onclick={handleTabChange(item.value)}
						onkeydown={(e) => handleKeyPress(item.value, e)}
					>
						{item.label}
					</button>
				</li>
			{/each}
		</ul>
	</nav>

	{#each items as item (item)}
		{#if activeTabValue === item.value}
			<!-- Surface pairing so the panel follows light/dark mode (secondary shades don't flip). -->
			<div
				id="tab-content-{item.value}"
				class="border-surface-300-700 bg-surface-50-950 text-surface-900-100 rounded-b-lg border p-4 pb-10 sm:p-6"
				role="tabpanel"
				aria-labelledby="tab-{item.value}"
			>
				<item.component {...item.props} />
			</div>
		{/if}
	{/each}
</div>
