<script lang="ts">
	import AboutMap from '$components/map/AboutMap.svelte';

	export let data;
	let mapLayers = data.mapData;
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="container h-full max-h-3/4 max-w-3xl mx-auto flex justify-center">
	<div class="text-center">
		<h1 class="unstyled title-font font-bold hidden sm:block sm:text-4xl sm:mt-4 text-primary-600">
			Strengthen OUR Community
		</h1>
		<h2 class="unstyled title-font font-bold">Our aim is to Prepare, Connect and Rebound</h2>
		<h3 class="unstyled">
			This project is about empowering our community to take responsibility for being prepared and <br
			/>
			working together to make a difference.
		</h3>
		<div class="text-left">
			<h4 class="mt-2">The project focuses on four areas:</h4>
			<ol class="list">
				<li class="!pt-0 !pb-0">
					<span class="badge-icon p-0 variant-soft-primary">1</span>
					<span class="font-semibold">The Burrell Creek Hall</span>
					<span class="flex-auto"
						>- an emergency information hub, a place where up-to-date accurate, current information
						is available.
					</span>
				</li>
				<li class="!pt-0 !pb-0">
					<span class="badge-icon p-0 variant-soft-primary">2</span>
					<span class="font-semibold">KYNGs</span>
					<span class="flex-auto"
						>- Know Your Neighbour Groups - Community groups who work together to provide
						information, connection and support.</span
					>
				</li>
				<li class="!pt-0 !pb-0">
					<span class="badge-icon p-0 variant-soft-primary">3</span>
					<span class="font-semibold">Digital Online Mapping</span>
					<span class="flex-auto"
						>- this website. A digital representation of our local information, that we individually
						own and update.</span
					>
				</li>
				<li class="!pt-0 !pb-0">
					<span class="badge-icon p-0 variant-soft-primary">4</span>
					<span class="font-semibold">Workshops</span>
					<span class="flex-auto"
						>- locally run workshops to increase community preparedness, through knowledge sharing.</span
					>
				</li>
			</ol>

			<p class="my-1 font-semibold text-center">
				This map shows the <span class="text-orange-600">properties</span>
				that are participating
			</p>
		</div>
		<div class="main-map w-7/8 h-[58%]">
			<AboutMap {mapLayers} />
		</div>
	</div>
</div>
