<script lang="ts">
	interface Props {
		rows?: number;
		columns?: number;
	}

	let { rows = 5, columns = 4 }: Props = $props();
</script>

<div class="table-skeleton" role="status" aria-label="Loading data">
	<!-- Header skeleton -->
	<div class="skeleton-header">
		{#each Array(columns) as _}
			<div class="skeleton-cell skeleton-shimmer"></div>
		{/each}
	</div>

	<!-- Row skeletons -->
	{#each Array(rows) as _}
		<div class="skeleton-row">
			{#each Array(columns) as _}
				<div class="skeleton-cell skeleton-shimmer"></div>
			{/each}
		</div>
	{/each}

	<span class="sr-only">Loading table data...</span>
</div>

<style>
	.table-skeleton {
		width: 100%;
		border: var(--default-border-width, 1px) solid var(--color-surface-300);
		border-radius: var(--radius-container, 0.75rem);
		overflow: hidden;
		background: var(--color-surface-50);
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	:global(.dark .table-skeleton) {
		background: var(--color-surface-800);
		border-color: var(--color-surface-700);
	}

	.skeleton-header {
		display: grid;
		grid-template-columns: repeat(var(--columns, 4), 1fr);
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: var(--color-surface-100);
		border-bottom: var(--default-border-width, 1px) solid var(--color-surface-300);
	}

	:global(.dark .skeleton-header) {
		background: var(--color-surface-900);
		border-color: var(--color-surface-700);
	}

	.skeleton-row {
		display: grid;
		grid-template-columns: repeat(var(--columns, 4), 1fr);
		gap: 1rem;
		padding: 1rem 1.25rem;
		border-bottom: var(--default-border-width, 1px) solid var(--color-surface-200);
		transition: background-color 0.15s ease;
	}

	.skeleton-row:hover {
		background: var(--color-surface-100);
	}

	:global(.dark .skeleton-row) {
		border-color: var(--color-surface-700);
	}

	:global(.dark .skeleton-row:hover) {
		background: var(--color-surface-900);
	}

	.skeleton-row:last-child {
		border-bottom: none;
	}

	.skeleton-cell {
		height: 1.25rem;
		border-radius: var(--radius-base, 0.375rem);
		position: relative;
		overflow: hidden;
	}

	.skeleton-shimmer {
		background: linear-gradient(
			90deg,
			var(--color-surface-200) 0%,
			var(--color-surface-300) 50%,
			var(--color-surface-200) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.8s infinite ease-in-out;
	}

	:global(.dark .skeleton-shimmer) {
		background: linear-gradient(
			90deg,
			var(--color-surface-700) 0%,
			var(--color-surface-600) 50%,
			var(--color-surface-700) 100%
		);
		background-size: 200% 100%;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* Screen reader only */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.table-skeleton {
			border-radius: var(--radius-base, 0.375rem);
		}

		.skeleton-header,
		.skeleton-row {
			gap: 0.75rem;
			padding: 0.875rem 1rem;
		}

		.skeleton-cell {
			height: 1rem;
		}
	}

	@media (max-width: 640px) {
		.skeleton-header,
		.skeleton-row {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.skeleton-header {
			display: none;
		}
	}
</style>
