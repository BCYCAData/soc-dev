<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';
	import AddressIneligible from '$components/form/address-challenge/AddressIneligible.svelte';
	import AddressSystemError from '$components/form/address-challenge/AddressSystemError.svelte';
	import AddressUnchallenged from '$components/form/address-challenge/AddressUnchallenged.svelte';
	import AddressValid from '$components/form/address-challenge/AddressValid.svelte';
	import MailtoButton from '$components/page/MailtoButton.svelte';
	import type { APIData } from '$lib/types';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	const ADDRESS_STATUS = {
		UNCHALLENGED: 100,
		NOT_FOUND: 403,
		VALID: 200,
		INELIGIBLE: 404
	} as const;

	// `data` is the validated address payload returned by both actions
	// (validate success and signup failure echo it back). Cast bridges the
	// server's AddressValidationResponse (siteoid: string) to APIData (number).
	const apiData = $derived(form?.data as unknown as APIData);

	let message = $derived(page.url.searchParams.get('message') ?? '');
	let streetaddress = $derived(form?.data?.searchaddressstreet ?? '');
	let suburb = $derived(form?.data?.searchaddresssuburb ?? '');
	let addressStatus = $derived(form?.data?.status ?? ADDRESS_STATUS.UNCHALLENGED);

	// Narrowed values passed to route-agnostic children instead of the whole form blob.
	let errorMessage = $derived(form && form.success === false ? (form.message ?? '') : '');
	let validateErrors = $derived(form && 'errors' in form ? (form.errors ?? null) : null);

	let encodedRef = $derived(
		encodeURIComponent(`SOC Address not found: '${streetaddress}, ${suburb}'`)
	);
	let mailtoUrl = $derived(`mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodedRef}`);
</script>

<div class="max-w-container mx-0 flex flex-col items-center justify-center sm:w-full">
	{#if message}
		<div
			class="text-scale-3 border-error-500 bg-error-50 text-error-700 m-1 rounded-lg border-2 p-2"
			role="alert"
			aria-live="polite"
		>
			<p>{message}</p>
		</div>
	{/if}

	{#if addressStatus === ADDRESS_STATUS.UNCHALLENGED}
		<AddressUnchallenged {streetaddress} {suburb} errors={validateErrors} {errorMessage} />
	{:else if addressStatus === ADDRESS_STATUS.VALID}
		<AddressValid {apiData} {errorMessage} />
	{:else if addressStatus === ADDRESS_STATUS.INELIGIBLE}
		<AddressIneligible {streetaddress} {suburb} />
	{:else if addressStatus === ADDRESS_STATUS.NOT_FOUND}
		<div
			class="text-scale-3 border-error-500 bg-error-50 text-error-700 my-3 flex flex-col items-center rounded-lg border-2 p-2"
			role="alert"
			aria-live="polite"
		>
			<p>{streetaddress} {suburb}</p>
			<p>Unfortunately we could not find this address.</p>
			<p>If you are sure it exists please send us a message.</p>
		</div>

		<MailtoButton href={mailtoUrl} />
	{:else}
		<AddressSystemError />
	{/if}
</div>
