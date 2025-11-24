<script lang="ts">
	interface Props {
		videoId: string;
		title?: string;
		width?: number;
		height?: number;
	}

	let { videoId, title, width = 550, height = 300 }: Props = $props();

	let activated = $state(false);
	let thumbnailUrl = $derived(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
	let thumbnailError = $state(false);

	function activate() {
		activated = true;
	}
</script>

{#if !activated}
	<div class="flex flex-col gap-2">
		{#if title}
			<h3 class="text-center text-lg font-semibold">{title}</h3>
		{/if}

		<button
			class="group relative cursor-pointer overflow-hidden bg-linear-to-br from-gray-800 to-gray-900 shadow-lg transition-transform hover:scale-105"
			style="width: {width}px; height: {height}px;"
			onclick={activate}
			aria-label="Play video: {title}"
		>
			<!-- Thumbnail -->
			<img
				src={thumbnailUrl}
				alt={title}
				class="absolute inset-0 h-full w-full object-cover"
				loading="lazy"
				decoding="async"
				onerror={() => (thumbnailError = true)}
			/>

			<!-- Fallback content when thumbnail doesn't load -->
			{#if thumbnailError}
				<div
					class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-white"
				>
					<svg
						width="80"
						height="80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="opacity-70"
					>
						<path
							d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
						/>
						<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
					</svg>
					<span class="text-center text-sm font-medium opacity-90">Click to play video</span>
				</div>
			{/if}

			<!-- Play button overlay -->
			<div class="absolute inset-0 flex items-center justify-center">
				<div
					class="bg-opacity-20 group-hover:bg-opacity-30 rounded-full bg-black p-4 backdrop-blur-sm transition-all group-hover:scale-110"
				>
					<svg
						class="drop-shadow-lg transition-opacity group-hover:opacity-100"
						style="opacity: 0.9;"
						width="68"
						height="48"
						viewBox="0 0 68 48"
						fill="none"
					>
						<path
							d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
							fill="#f00"
						/>
						<path d="M 45,24 27,14 27,34" fill="#fff" />
					</svg>
				</div>
			</div>

			<!-- Subtle gradient overlay -->
			<div
				class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-30"
			></div>
		</button>
	</div>
{:else}
	<div class="flex flex-col gap-2">
		<h3 class="text-center text-lg font-semibold">{title}</h3>
		<iframe
			{width}
			{height}
			src="https://www.youtube-nocookie.com/embed/{videoId}?autoplay=1&rel=0&modestbranding=1"
			{title}
			allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			loading="lazy"
			aria-label="YouTube video: {title}"
		></iframe>
	</div>
{/if}

<style>
	button:focus-visible {
		outline: 3px solid #4a9eff;
		outline-offset: 4px;
		border-radius: 4px;
	}
</style>
