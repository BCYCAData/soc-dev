<script lang="ts">
	import type { TabItem } from '$lib/types';

	interface Props {
		items: TabItem[];
		initialTab?: number;
	}

	let { items = [], initialTab = 1 }: Props = $props();
	let activeTabValue = $state(initialTab);

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

<div class="tab-container">
	<nav class="tab-nav" aria-label="Content tabs">
		<ul role="tablist">
			{#each items as item}
				<li
					class="tab-item"
					class:active={activeTabValue === item.value}
					role="tab"
					aria-selected={activeTabValue === item.value}
					aria-controls="tab-content-{item.value}"
				>
					<button
						type="button"
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
				class="tab-content"
				role="tabpanel"
				aria-labelledby="tab-{item.value}"
			>
				<item.component {...item.props} />
			</div>
		{/if}
	{/each}
</div>

<style lang="postcss">
	.tab-container {
		@apply w-full;
	}

	.tab-nav {
		@apply mb-0;
	}

	.tab-nav ul {
		@apply flex list-none flex-wrap justify-center p-0;
	}

	.tab-item {
		@apply -mb-px me-1;

		button {
			@apply block cursor-pointer rounded-t-lg border-b-2 border-transparent bg-orange-200 px-4 py-2 text-orange-900 transition-colors duration-200;

			&:hover {
				@apply border-orange-300;
			}
		}

		&.active button {
			@apply border-b-4 border-orange-300 bg-orange-300 font-bold;
		}
	}

	.tab-content {
		@apply rounded-b-lg border border-t-0 border-orange-200 bg-orange-300 pb-10;
	}
</style>
