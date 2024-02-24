<script lang="ts">
	import { page } from '$app/stores';
	import AddressIneligible from '$components/form/address-challenge/AddressIneligible.svelte';
	import AddressSystemError from '$components/form/address-challenge/AddressSystemError.svelte';
	import AddressUnchallenged from '$components/form/address-challenge/AddressUnchallenged.svelte';
	import AddressValid from '$components/form/address-challenge/AddressValid.svelte';
	import type { APIData } from '$lib/types';

	import type { ActionData } from './$types';

	export let form: ActionData;

	let message: string;
	let streetaddress: string;
	let suburb: string;
	let addressStatus: number;
	let encodedRef: string;

	const apiData = form?.apiData as APIData;

	$: message = $page.url.searchParams.get('message') ?? '';
	$: addressStatus = apiData?.status ?? 100;
	$: streetaddress = apiData?.searchaddressstreet ?? '';
	$: suburb = apiData?.searchaddresssuburb ?? '';
	$: encodedRef = encodeURIComponent(`SOC Address not found: '${streetaddress}, ${suburb}'`);
	$: subjectUrl = `/contact?subject=${encodedRef}`;
</script>

<div class="flex flex-col items-center max-w-container mx-0 justify-center sm:w-full">
	{#if message}
		<div
			class="bg-red-100 border-2 border-red-500 rounded-lg m-1 p-2 text-sm text-red-600"
			role="alert"
		>
			<p>{message}</p>
		</div>
	{/if}
	{#if addressStatus === 100 || addressStatus === 403}
		<AddressUnchallenged {streetaddress} {suburb} />
		{#if addressStatus === 403}
			<p>
				{subjectUrl}
			</p>
			<div
				class="flex flex-col items-center bg-red-100 border-2 border-red-500 rounded-lg my-3 p-2 text-sm text-red-600"
				role="alert"
			>
				<p>Unfortunately we could not find this address.</p>
				<p>If you are sure it exists please send us a message.</p>
			</div>
			<a
				href={subjectUrl}
				class="text-center my-1 py-1 px-5 rounded-full bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none"
			>
				Contact Us
			</a>
		{/if}
	{:else if addressStatus === 200}
		<AddressValid {apiData} />
	{:else if addressStatus === 404}
		<AddressIneligible {streetaddress} {suburb} />
	{:else}
		<AddressSystemError />
	{/if}
</div>
