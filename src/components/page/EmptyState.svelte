<script lang="ts">
	interface Props {
		title: string;
		message: string;
		icon?: 'inbox' | 'search' | 'filter' | 'users' | 'database';
		actionLabel?: string | null;
		onAction?: (() => void) | null;
		secondaryActionLabel?: string | null;
		onSecondaryAction?: (() => void) | null;
	}

	let {
		title,
		message,
		icon = 'inbox',
		actionLabel = null,
		onAction = null,
		secondaryActionLabel = null,
		onSecondaryAction = null
	}: Props = $props();
</script>

<div class="empty-state" role="status">
	<!-- Icon -->
	<div class="empty-state-icon" aria-hidden="true">
		{#if icon === 'inbox'}
			<!-- Inbox Icon -->
			<svg
				class="icon"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
				/>
			</svg>
		{:else if icon === 'search'}
			<!-- Search Icon -->
			<svg
				class="icon"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		{:else if icon === 'filter'}
			<!-- Filter Icon -->
			<svg
				class="icon"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
				/>
			</svg>
		{:else if icon === 'users'}
			<!-- Users Icon -->
			<svg
				class="icon"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		{:else if icon === 'database'}
			<!-- Database Icon -->
			<svg
				class="icon"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
				/>
			</svg>
		{/if}
	</div>

	<!-- Content -->
	<h3 class="empty-state-title">{title}</h3>
	<p class="empty-state-message">{message}</p>

	<!-- Actions -->
	{#if actionLabel && onAction}
		<div class="empty-state-actions">
			<button onclick={onAction} class="btn-primary" type="button">
				{actionLabel}
			</button>

			{#if secondaryActionLabel && onSecondaryAction}
				<button onclick={onSecondaryAction} class="btn-secondary" type="button">
					{secondaryActionLabel}
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		text-align: center;
		background: var(--color-surface-50);
		border: var(--default-border-width, 1px) solid var(--color-surface-200);
		border-radius: var(--radius-container, 0.75rem);
		min-height: 400px;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	:global(.dark) .empty-state {
		background: var(--color-surface-800);
		border-color: var(--color-surface-700);
	}

	.empty-state-icon {
		margin-bottom: 1.5rem;
		opacity: 0.9;
	}

	.icon {
		width: 4rem;
		height: 4rem;
		color: var(--color-tertiary-400);
	}

	:global(.dark) .icon {
		color: var(--color-tertiary-600);
	}

	.empty-state-title {
		font-family: var(--heading-font-family, 'Raleway', sans-serif);
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--heading-font-color, var(--color-surface-900));
		letter-spacing: var(--heading-letter-spacing, inherit);
	}

	:global(.dark) .empty-state-title {
		color: var(--heading-font-color-dark, var(--color-surface-100));
	}

	.empty-state-message {
		font-family: var(--base-font-family, 'Open Sans', sans-serif);
		color: var(--color-surface-600);
		margin-bottom: 1.5rem;
		max-width: 450px;
		line-height: 1.6;
		font-size: 0.9375rem;
	}

	:global(.dark) .empty-state-message {
		color: var(--color-surface-400);
	}

	.empty-state-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.625rem 1.5rem;
		font-family: var(--base-font-family, 'Open Sans', sans-serif);
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.25rem;
		color: var(--color-primary-contrast-dark);
		background-color: var(--color-primary-600);
		border: none;
		border-radius: var(--radius-base, 0.375rem);
		cursor: pointer;
		transition: all 0.15s ease;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	.btn-primary:hover {
		background-color: var(--color-primary-700);
		box-shadow: 0 2px 4px 0 rgb(0 0 0 / 0.1);
		transform: translateY(-1px);
	}

	.btn-primary:active {
		transform: translateY(0);
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	.btn-primary:focus {
		outline: var(--default-ring-width, 2px) solid transparent;
		outline-offset: 2px;
		box-shadow: 0 0 0 3px var(--color-primary-500);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.625rem 1.5rem;
		font-family: var(--base-font-family, 'Open Sans', sans-serif);
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.25rem;
		color: var(--color-surface-700);
		background-color: var(--color-surface-100);
		border: var(--default-border-width, 1px) solid var(--color-surface-300);
		border-radius: var(--radius-base, 0.375rem);
		cursor: pointer;
		transition: all 0.15s ease;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	:global(.dark) .btn-secondary {
		color: var(--color-surface-200);
		background-color: var(--color-surface-700);
		border-color: var(--color-surface-600);
	}

	.btn-secondary:hover {
		background-color: var(--color-surface-200);
		border-color: var(--color-surface-400);
		box-shadow: 0 2px 4px 0 rgb(0 0 0 / 0.1);
		transform: translateY(-1px);
	}

	:global(.dark) .btn-secondary:hover {
		background-color: var(--color-surface-600);
		border-color: var(--color-surface-500);
	}

	.btn-secondary:active {
		transform: translateY(0);
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	.btn-secondary:focus {
		outline: var(--default-ring-width, 2px) solid transparent;
		outline-offset: 2px;
		box-shadow: 0 0 0 3px var(--color-surface-400);
	}

	.btn-secondary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.empty-state {
			padding: 3rem 1.5rem;
			min-height: 350px;
		}

		.icon {
			width: 3.5rem;
			height: 3.5rem;
		}

		.empty-state-message {
			max-width: 350px;
		}
	}

	@media (max-width: 640px) {
		.empty-state {
			padding: 2.5rem 1.25rem;
			min-height: 300px;
			border-radius: var(--radius-base, 0.375rem);
		}

		.icon {
			width: 3rem;
			height: 3rem;
		}

		.empty-state-title {
			font-size: 1.125rem;
		}

		.empty-state-message {
			font-size: 0.875rem;
			max-width: 100%;
		}

		.empty-state-actions {
			flex-direction: column;
			width: 100%;
			gap: 0.5rem;
		}

		.btn-primary,
		.btn-secondary {
			width: 100%;
		}
	}
</style>
