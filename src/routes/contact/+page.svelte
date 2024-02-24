<script lang="ts">
	import { page } from '$app/stores';

	const reference = $page.url.searchParams.get('subject') ?? '';
	const subjectText = `subject=${encodeURIComponent(reference)}`;
</script>

<svelte:head>
	<title>Contact Us</title>
</svelte:head>

<section class="container h-full max-w-3xl mx-auto flex flex-col items-center">
	{#if reference?.startsWith('SOC Address not found:')}
		<div class="text-center">
			<h1 class="mt-5">{reference}</h1>
			<div class="mt-5">
				<a
					class="text-l cursor-pointer space-y-3 max-w-80 hover:underline mt-5 p-2 font-medium text-stone-100 bg-orange-500 rounded-xl"
					href="mailto:bcyca17@gmail.com?{subjectText}">Tap here to send us an email</a
				>
			</div>
		</div>
	{:else}
		<div class="text-center">
			<h3>If you want to be more involved</h3>
			<h3>please call</h3>
			<div class="mt-5">
				<h4>
					<span class="text-xl text-orange-600">Helen</span>
					<span>on</span>
					<span>0424 515 963</span>
				</h4>
				<h3>or</h3>
				<h4>
					<span class="text-xl text-orange-600">Christine</span>
					<span>on</span>
					<span>0488 288 661</span>
				</h4>
			</div>

			<h1
				class=" text-l cursor-pointer max-w-80 no-underline hover:underline mt-5 p-2 font-medium text-stone-100 bg-orange-500 rounded-xl"
			>
				<span>
					<a
						href="mailto:bcyca17@gmail.com?subject=Contacting%20You%20Regarding%20the%20SOC%20Website"
						>Tap here to send us an email</a
					></span
				>
			</h1>
		</div>
	{/if}
</section>
