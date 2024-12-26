<script lang="ts">
	import { page } from '$app/state';
	import AddressIneligible from '$components/form/address-challenge/AddressIneligible.svelte';
	import AddressSystemError from '$components/form/address-challenge/AddressSystemError.svelte';
	import AddressUnchallenged from '$components/form/address-challenge/AddressUnchallenged.svelte';
	import AddressValid from '$components/form/address-challenge/AddressValid.svelte';
	import type { APIData } from '$lib/types';

	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
	const apiData = form?.apiData as unknown as APIData;

	// Derived values
	let message = $derived(page.url.searchParams.get('message') ?? '');
	let streetaddress = $derived(apiData?.searchaddressstreet ?? '');
	let suburb = $derived(apiData?.searchaddresssuburb ?? '');
	let addressStatus = $derived(apiData?.status ?? 100);

	let encodedRef = $derived(
		encodeURIComponent(`SOC Address not found: '${streetaddress}, ${suburb}'`)
	);
	let subjectUrl = $derived(`/contact?subject=${encodedRef}`);

	const ADDRESS_STATUS = {
		UNCHALLENGED: 100,
		NOT_FOUND: 403,
		VALID: 200,
		INELIGIBLE: 404
	} as const;
</script>

<div class="max-w-container mx-0 flex flex-col items-center justify-center sm:w-full">
	{#if message}
		<div
			class="text-scale-3 m-1 rounded-lg border-2 border-error-500 bg-error-50 p-2 text-error-700"
			role="alert"
			aria-live="polite"
		>
			<p>{message}</p>
		</div>
	{/if}

	{#if addressStatus === ADDRESS_STATUS.UNCHALLENGED || addressStatus === ADDRESS_STATUS.NOT_FOUND}
		<AddressUnchallenged {streetaddress} {suburb} />

		{#if addressStatus === ADDRESS_STATUS.NOT_FOUND}
			<div
				class="text-scale-3 my-3 flex flex-col items-center rounded-lg border-2 border-error-500 bg-error-50 p-2 text-error-700"
				role="alert"
				aria-live="polite"
			>
				<p>Unfortunately we could not find this address.</p>
				<p>If you are sure it exists please send us a message.</p>
			</div>

			<a href={subjectUrl} class="btn-secondary my-1" rel="noopener noreferrer"> Contact Us </a>
		{/if}
	{:else if addressStatus === ADDRESS_STATUS.VALID}
		<AddressValid {apiData} />
	{:else if addressStatus === ADDRESS_STATUS.INELIGIBLE}
		<AddressIneligible {streetaddress} {suburb} />
	{:else}
		<AddressSystemError />
	{/if}
</div>

<style lang="postcss">
	.btn-secondary {
		@apply rounded-full bg-secondary-500 px-5 py-1 text-center text-secondary-50 hover:bg-secondary-700 focus:outline-none;
	}
</style>
