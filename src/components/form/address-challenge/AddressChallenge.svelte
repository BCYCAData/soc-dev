<script lang="ts">
	import AddressValid from '$components/form/address-challenge/AddressValid.svelte';
	import AddressUnchallenged from '$components/form/address-challenge/AddressUnchallenged.svelte';
	import AddressSystemError from '$components/form/address-challenge/AddressSystemError.svelte';

	import type { AddressPointData } from '$lib/types';
	import AddressIneligible from './AddressIneligible.svelte';

	export let parent: any;

	let addressPointData: AddressPointData = {
		status: 100, // unchallenged
		apistatus: 100, // unchallenged
		searchaddress: '',
		searchsuburb: '',
		validaddress: '',
		validsuburb: '',
		principaladdresssiteoid: -1,
		addresspoint: null,
		community: '',
		kyng: ''
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

		{#if (addressPointData.status === 100 && addressPointData.apistatus === 100) || (addressPointData.status === 403 && addressPointData.apistatus === 200)}
			<AddressUnchallenged bind:addressPointData />
		{:else if addressPointData.status === 200 && addressPointData.apistatus === 200}
			<AddressValid bind:addressPointData />
		{:else if addressPointData.status === 404 && addressPointData.apistatus === 200}
			<AddressIneligible bind:addressPointData />
		{:else}
			<AddressSystemError />
		{/if}
	</div>
</div>
