<script lang="ts">
	import AddressChallenge from '$components/form/address-challenge/AddressChallenge.svelte';
	import { modalStore } from '@skeletonlabs/skeleton';

	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	export let data;
	$: supabase = data.supabase;

	function triggerCustomModal(): void {
		const modalComponent: ModalComponent = {
			// Pass a reference to your custom component
			ref: AddressChallenge
			// Add your props as key/value pairs !!!! ONLY FOR BUILT IN ALERTS !!!!
			// props: { regionHeader: '!text-2xl !font-bold !text-blue-500' }
			// Provide default slot content as a template literal
			// slot: '<p>Skeleton</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
			// title: 'Address Check',
			modalClasses: '!overflow-y-auto !max-h-full !relative'

			// NOTE: title, body, response, etc are supported!
		};
		modalStore.trigger(d);
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="container h-full max-w-3xl mx-auto flex justify-center">
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
		<button
			class="cursor-pointer max-w-80 no-underline hover:underline mt-1 p-2 font-semibold text-stone-100 bg-orange-500 rounded-xl"
			on:click={() => triggerCustomModal()}
		>
			Tap here to find out if you qualify
		</button>
		<p class="unstyled text-sm md:text-lg mt-1 font-semibold">Want more information?</p>
		<p class="unstyled text-sm md:text-lg mt-0 font-semibold">Call Helen 0424 515 963</p>
	</div>
</div>
