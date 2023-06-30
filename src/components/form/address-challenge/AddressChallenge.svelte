<script lang="ts">
	import AddressValid from '$components/form/address-challenge/AddressValid.svelte';
	import AddressEligible from '$components/form/address-challenge/AddressEligible.svelte';
	import AddressIneligible from '$components/form/address-challenge/AddressIneligible.svelte';
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

<button
	class="absolute cursor-pointer bg-orange-500 text-stone-100 hover:font-bold top-0 right-0 px-1"
	on:click={parent.onClose}
>
	<span class="text-xs">EXIT</span>&times
</button>

{#if addressPointData.status === 100 || addressPointData.status === 400 || addressPointData.status === 404}
	<AddressUnchallenged bind:addressPointData />
{/if}
{#if addressPointData.status === 403}
	<AddressIneligible bind:addressPointData />
{/if}
{#if addressPointData.status === 401}
	<AddressEligible bind:addressPointData />
{/if}
{#if addressPointData.status >= 500}
	<AddressSystemError />
{/if}
{#if addressPointData.status === 200}
	<AddressValid bind:addressPointData />
{/if}
