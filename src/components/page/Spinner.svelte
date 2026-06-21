<script lang="ts">
	interface Props {
		size?: string;
		unit?: string;
		ballTopLeft?: string;
		ballTopRight?: string;
		ballBottomLeft?: string;
		ballBottomRight?: string;
		duration?: string;
		message?: string;
	}

	let {
		size = '60',
		unit = 'px',
		ballTopLeft = 'var(--color-success-600)',
		ballTopRight = 'var(--color-secondary-500)',
		ballBottomLeft = 'var(--color-primary-500)',
		ballBottomRight = 'var(--color-tertiary-500)',
		duration = '1.5s',
		message = ''
	}: Props = $props();

	const style = $derived(`
        --size: ${size}${unit};
        --scale: ${Number(size) / 52};
        --ball-top-left: ${ballTopLeft};
        --ball-top-right: ${ballTopRight};
        --ball-bottom-left: ${ballBottomLeft};
        --ball-bottom-right: ${ballBottomRight};
        --duration: ${duration};
    `);
</script>

<div
	class="mt-4 flex flex-col items-center justify-center rounded-md p-2 whitespace-nowrap"
	{style}
>
	<div class="spinner" role="status" aria-label="Loading">
		<div class="spinner-inner">
			<div class="ball-container">
				<div class="ball ball-top-left"></div>
				<div class="ball ball-top-right"></div>
				<div class="ball ball-bottom-left"></div>
				<div class="ball ball-bottom-right"></div>
			</div>
		</div>
	</div>
	{#if message}
		<div class="message text-surface-700 mt-4 text-center font-medium">
			{message}
		</div>
	{/if}
</div>

<style>
	.message {
		white-space: nowrap;
		background-color: var(--color-surface-200);
		padding: 4px;
		border-radius: 8px;
	}

	.spinner {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--size);
		height: var(--size);
	}

	.spinner-inner {
		transform: scale(var(--scale));
	}

	.ball-container {
		position: relative;
		width: 44px;
		height: 44px;
		animation: container-spin var(--duration) infinite;
	}

	.ball {
		position: absolute;
		border-radius: 9999px;
		width: 20px;
		height: 20px;
		animation: ball-squeeze var(--duration) infinite ease;
	}

	.ball-top-left {
		background-color: var(--ball-top-left);
		top: 0;
		left: 0;
	}

	.ball-top-right {
		background-color: var(--ball-top-right);
		top: 0;
		left: 24px;
	}

	.ball-bottom-left {
		background-color: var(--ball-bottom-left);
		top: 24px;
		left: 0;
	}

	.ball-bottom-right {
		background-color: var(--ball-bottom-right);
		top: 24px;
		left: 24px;
	}

	@keyframes ball-squeeze {
		50% {
			opacity: 50%;
			top: 12px;
			left: 12px;
		}
	}

	@keyframes container-spin {
		50% {
			transform: rotate(360deg) scale(1.3);
		}
		100% {
			transform: rotate(720deg) scale(1);
		}
	}
</style>
