<script lang="ts">
	interface Props {
		isMenuCollapsed?: boolean;
		size?: number;
		color?: string;
	}

	let { isMenuCollapsed = false, size = 24 }: Props = $props();
</script>

<svg
	class="transform transition-transform duration-300 {isMenuCollapsed ? 'rotate-180' : ''}"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="#C2410C"
	stroke-width="3"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<circle cx="12" cy="12" r="10" />
	<path d="M14 8l-4 4 4 4" />
</svg>
