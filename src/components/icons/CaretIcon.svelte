<script lang="ts">
	interface Props {
		isRotated?: boolean;
		size?: number;
		color?: string;
		className?: string;
	}

	let { isRotated = false, size = 24, color = '#FAFAF9', className = '' }: Props = $props();
</script>

<svg
	class="caret {isRotated ? 'rotate' : ''} transform transition-transform duration-300 {className}"
	style="min-width: {size}px; min-height: {size}px;"
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke={color}
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<polyline points="6 9 12 15 18 9" />
</svg>

<style>
	.rotate {
		transform: rotate(90deg);
	}
</style>
