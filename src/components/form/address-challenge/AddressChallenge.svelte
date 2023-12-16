<script lang="ts">
	import AddressValid from '$components/form/address-challenge/AddressValid.svelte';
	import AddressUnchallenged from '$components/form/address-challenge/AddressUnchallenged.svelte';
	import AddressSystemError from '$components/form/address-challenge/AddressSystemError.svelte';

	import type { AddressPointData } from '$lib/types';

	export let parent: any;

	let addressPointData: AddressPointData = {
		status: 100, // unchallenged
		validaddress: [],
		searchaddress: [],
		communityname: 'None identified',
		principaladdresssiteoid: null,
		addresspoint: null,
		message: 'Could not check the address.',
		returnstatus: 100,
		apistatus: 100,
		apistatustext: '',
		error: null
	};
</script>

<div class="flex flex-col items-center max-w-container mx-auto justify-center relative">
	<div class="bg-orange-50 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
		<button
			class="cursor-pointer bg-orange-500 text-stone-100 hover:font-bold absolute top-0 right-0 px-1"
			on:click={parent.onClose}
		>
			&times
		</button>

		{#if addressPointData.status === 100 || addressPointData.status === 404}
			<AddressUnchallenged bind:addressPointData />
		{/if}
		{#if addressPointData.status >= 500}
			<AddressSystemError />
		{/if}
		{#if addressPointData.status === 200}
			<AddressValid bind:addressPointData />
		{/if}
	</div>
</div>
