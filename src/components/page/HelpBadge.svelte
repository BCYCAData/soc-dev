<script lang="ts">
	interface Props {
		helpText: string;
	}

	let { helpText }: Props = $props();

	let isHovered = $state(false);
</script>

<div
	class="help-badge"
	role="tooltip"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	?
	{#if isHovered}
		<div class="tooltip">{helpText}</div>
	{/if}
</div>

<style>
	.help-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: #007bff;
		color: white;
		font-weight: bold;
		font-size: 14px;
		cursor: help;
		position: relative;
	}

	.tooltip {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		background-color: #333;
		color: white;
		padding: 5px 10px;
		border-radius: 4px;
		font-size: 12px;
		white-space: nowrap;
		z-index: 1;
		margin-bottom: 5px;
	}
</style>
