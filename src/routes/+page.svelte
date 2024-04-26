<script lang="ts">
	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);
	console.log('supabase', supabase);
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section class="flex flex-col items-center mx-auto h-full max-w-5xl">
	<div class="text-center">
		<h1 class="unstyled title-font font-bold hidden sm:block sm:text-4xl sm:mt-4 text-primary-600">
			Strengthen OUR Community
		</h1>
		<p class="unstyled text-base mt-3 mb-0 sm:text-lg text-grey-900">
			This project, funded by the Bushfire Community Recovery Resilience Fund, is a response to the
			community’s feedback following the 2019 bushfires.
		</p>
		<p class="unstyled text-base sm:text-lg mt-1 mb-0">
			As a community we share the same environment.&nbsp; We want our community to feel prepared for
			future challenges and be armed with knowledge that helps us to tackle whatever natural
			disaster comes our way.
		</p>
		<p class="unstyled text-base md:text-lg text-gray-900 font-semibold mt-1 mb-0">
			Above all, we want our community to feel prepared, safe and connected.
		</p>
		<p class="unstyled text-base md:text-lg text-red-700 font-semibold mt-1 mb-0">
			Will you join us?
		</p>
		<a
			href="/auth/validateaddress"
			class="cursor-pointer max-w-80 no-underline hover:underline mt-1 p-2 font-semibold text-stone-100 bg-orange-500 rounded-xl"
			>Tap here to find out if you qualify</a
		>
		<p class="unstyled text-sm md:text-lg mt-1 font-semibold">Want more information?</p>
		<p class="unstyled text-sm md:text-lg mt-0 font-semibold">Call Helen 0424 515 963</p>
		<div class="iframe-center mt-4">
			<iframe
				width="560"
				height="315"
				src="https://www.youtube.com/embed/Q6CCR6gBUkU"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			/>
			<iframe
				width="560"
				height="315"
				src="https://www.youtube.com/embed/ukXYzMK6zk4"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			/>
		</div>
	</div>
</section>

<style>
	iframe {
		width: 100%;
		height: 315px;
		margin: 5px;
	}
	@media (min-width: 768px) {
		.iframe-center {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
		}
		iframe {
			max-width: 75%;
			margin: 10px;
		}
	}
</style>
