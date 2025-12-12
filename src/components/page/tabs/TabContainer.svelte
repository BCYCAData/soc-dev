<script lang="ts">
	import type { TabItem } from '$lib/types';

	interface Props {
		items: TabItem[];
		initialTab?: number;
	}

	let { items = [], initialTab = 1 }: Props = $props();
	let activeTabValue = $state(1);

	$effect(() => {
		activeTabValue = initialTab;
	});

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
		<ul class="flex list-none flex-wrap justify-center p-0" role="tablist">
			{#each items as item}
				<li
					class="me-1 -mb-px [&.active_button]:border-b-4 [&.active_button]:border-orange-300 [&.active_button]:bg-orange-300 [&.active_button]:font-bold"
					class:active={activeTabValue === item.value}
					role="tab"
					aria-selected={activeTabValue === item.value}
					aria-controls="tab-content-{item.value}"
				>
					<button
						type="button"
						class="block cursor-pointer rounded-t-lg border-b-2 border-transparent bg-orange-200 px-4 py-2 text-orange-900 transition-colors duration-200 hover:border-orange-300"
						onclick={handleTabChange(item.value)}
						onkeydown={(e) => handleKeyPress(item.value, e)}
					>
						{item.label}
					</button>
				</li>
			{/each}
		</ul>
	</nav>

	{#each items as item}
		{#if activeTabValue === item.value}
			<div
				id="tab-content-{item.value}"
				class="rounded-b-lg border border-t-0 border-orange-200 bg-orange-300 pb-10"
				role="tabpanel"
				aria-labelledby="tab-{item.value}"
			>
				<item.component {...item.props} />
			</div>
		{/if}
	{/each}
</div>
