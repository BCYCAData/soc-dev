<script lang="ts">
	interface Props {
		size?: string;
		unit?: string;
		ballTopLeft?: string;
		ballTopRight?: string;
		ballBottomLeft?: string;
		ballBottomRight?: string;
		duration?: string;
	}

	let {
		size = '60',
		unit = 'px',
		ballTopLeft = '#006400',
		ballTopRight = '#FF3E00',
		ballBottomLeft = '#44444',
		ballBottomRight = '#F46524',
		duration = '1.5s'
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

<div class="spinner" {style} role="status" aria-label="Loading">
	<div class="spinner-inner">
		<div class="ball-container">
			<div class="ball ball-top-left"></div>
			<div class="ball ball-top-right"></div>
			<div class="ball ball-bottom-left"></div>
			<div class="ball ball-bottom-right"></div>
		</div>
	</div>
</div>

<style lang="postcss">
	.spinner {
		@apply flex items-center justify-center;
		width: var(--size);
		height: var(--size);
	}

	.spinner-inner {
		transform: scale(var(--scale));
	}

	.ball-container {
		@apply relative;
		width: 44px;
		height: 44px;
		animation: container-spin var(--duration) infinite;
	}

	.ball {
		@apply absolute rounded-full;
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
			@apply opacity-50;
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
