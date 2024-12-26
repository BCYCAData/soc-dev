<script lang="ts">
	interface Props {
		size?: number;
		color?: string;
		strokeWidth?: number;
		letter: any;
		bgColor?: string;
		gap?: number;
	}

	let {
		size = 24,
		color = 'currentColor',
		strokeWidth = 4,
		letter,
		bgColor = 'transparent',
		gap = 0
	}: Props = $props();

	let dimension = $derived(typeof size === 'number' ? `${size}px` : size);
	let viewBoxSize = $derived(100);
	let radius = $derived((viewBoxSize - strokeWidth) / 2);
	let fontSize = $derived((viewBoxSize / 2) * (1 - gap));
</script>

<span
	style="
		font-size: {dimension};
		color: {color};
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		position: relative;
	"
>
	<svg
		width="100%"
		height="100%"
		viewBox="0 0 {viewBoxSize} {viewBoxSize}"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle
			cx={viewBoxSize / 2}
			cy={viewBoxSize / 2}
			r={radius}
			stroke={color}
			stroke-width={strokeWidth}
			fill={bgColor}
		/>
	</svg>
	<span
		style="
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		line-height: 1;
		font-size: {fontSize}%;
		font-weight: bold;
	">{letter}</span
	>
</span>
