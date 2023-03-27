<script lang="ts">
	export let steps: string[] = [];
	export let currentActive = 1;
	let circles:
		| NodeListOf<Element>
		| { classList: { add: (arg0: string) => void; remove: (arg0: string) => void } }[];
	let progress: HTMLDivElement;

	export const handleProgress = (stepIncrement: number) => {
		circles = document.querySelectorAll('.circle');
		if (stepIncrement == 1) {
			currentActive++;

			if (currentActive > circles.length) {
				currentActive = circles.length;
			}
		} else {
			currentActive--;

			if (currentActive < 1) {
				currentActive = 1;
			}
		}
		update();
	};

	function update() {
		circles.forEach(
			(
				circle: { classList: { add: (arg0: string) => void; remove: (arg0: string) => void } },
				idx: number
			) => {
				if (idx < currentActive) {
					circle.classList.add('active');
				} else {
					circle.classList.remove('active');
				}
			}
		);

		const actives = document.querySelectorAll('.active');

		progress.style.width = ((actives.length - 1) / (circles.length - 1)) * 100 + '%';
	}

	export const skipTo = (e: MouseEvent | KeyboardEvent | CustomEvent<any>) => {
		circles = document.querySelectorAll('.circle');
		currentActive = Number(
			(e.currentTarget as EventTarget & HTMLDivElement)?.attributes.getNamedItem('data-title')
				?.value
		);
		update();
	};
</script>

<div class="progress-container z-50">
	<div class="progress" bind:this={progress} />
	{#each steps as step, i}
		<div
			class="circle {i == 0 ? 'active' : ''}"
			data-title={step}
			on:click={(e) => {
				skipTo(e);
			}}
			on:keypress={(e) => {
				skipTo(e);
			}}
		/>
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
