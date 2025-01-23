<script lang="ts">
	import type { Step } from '$lib/menu-items';

	interface Props {
		steps?: Step[];
		currentActive?: number;
		onStepClick?: (event: MouseEvent | KeyboardEvent | CustomEvent<any>) => void;
	}

	let { steps = [], currentActive = $bindable(1), onStepClick }: Props = $props();

	let progress: HTMLDivElement;

	const updateProgress = () => {
		const circles = document.querySelectorAll('.circle');
		circles.forEach((circle, idx) => {
			if (idx < currentActive) {
				circle.classList.add('active');
			} else {
				circle.classList.remove('active');
			}
		});

		const actives = document.querySelectorAll('.active');
		if (progress) {
			progress.style.width = ((actives.length - 1) / (circles.length - 1)) * 100 + '%';
		}
	};

	export const handleProgress = (stepIncrement: number) => {
		const circles = document.querySelectorAll('.circle');

		if (stepIncrement === 1) {
			currentActive = Math.min(currentActive + 1, circles.length);
		} else {
			currentActive = Math.max(currentActive - 1, 1);
		}

		updateProgress();
	};

	export const skipTo = (e: MouseEvent | KeyboardEvent | CustomEvent<any>) => {
		const target = e.currentTarget as HTMLDivElement;
		const value = target?.dataset.title;
		if (value) {
			currentActive = Number(value);
			updateProgress();
		}
	};

	const handleClick = (e: MouseEvent | KeyboardEvent | CustomEvent<any>) => {
		onStepClick?.(e);
		skipTo(e);
	};
</script>

<div class="progress-container z-50">
	<div class="progress" bind:this={progress}></div>
	{#each steps as step, i}
		<div
			class="circle {i === 0 ? 'active' : ''}"
			data-title={step.text}
			onclick={handleClick}
			onkeypress={handleClick}
			role="button"
			tabindex="0"
		></div>
	{/each}
</div>

<style>
	.progress-container {
		display: flex;
		justify-content: space-between;
		position: relative;
		margin-top: 30px;
		margin-bottom: 10px;
	}

	.progress-container::before {
		content: '';
		background-color: #e0e0e0;
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		height: 4px;
		width: 100%;
		z-index: -1;
	}

	.progress {
		background-color: #fdba74;
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		height: 4px;
		width: 0%;
		z-index: -1;
		transition: 0.4s ease;
	}

	.circle {
		background-color: #fff;
		color: #999;
		border-radius: 50%;
		height: 15px;
		width: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3px solid #e0e0e0;
		transition: 0.4s ease;
		cursor: pointer;
	}

	.circle::after {
		content: attr(data-title) ' ';
		position: absolute;
		bottom: 20px;
		color: #999;
		transition: 0.4s ease;
	}

	.circle.active::after {
		color: #f97316;
	}

	.circle.active {
		border-color: #f97316;
	}
</style>
