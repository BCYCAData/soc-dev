<script lang="ts">
	import { writable } from 'svelte/store';
	import { page } from '$app/state';

	import { formatMobile, formatPhone } from '$lib/utility';
	import { yesNoOptions, accessOptions } from '$lib/profile-options';
	import { setUpperCase } from '$lib/svelte-actions.js';

	import NumberInput from '$components/form/inputs/NumberInput.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';
	import FormActions from '$components/form/FormActions.svelte';
	import FormWell from '$components/form/FormWell.svelte';

	import type { ActionData } from './$types';
	import type { PropertyProfile } from '$lib/form.types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let unsaved = $state(false);
	let isSubmitting = $state(false);
	let formError = $derived(form?.error || false);
	let formErrorMessage = $derived(form?.errorMessage || '');
	let formSuccess = $derived(form?.success || false);

	const propertyId = page.params.propertyid;

	let currentProperty: PropertyProfile = $state(
		page.data.userProfile.property_profile.find(
			(property: { id: string }) => property.id === propertyId
		)
	);

	let propertyWasRented = writable(false);

	let agentName = $state('');
	let agentMobile = $state('');
	let agentPhone = $state('');

	$effect(() => {
		if (currentProperty) {
			propertyWasRented.set(!!currentProperty.property_rented);
			agentName = currentProperty.property_agent?.agent_name ?? '';
			agentMobile = currentProperty.property_agent?.agent_mobile ?? '';
			agentPhone = currentProperty.property_agent?.agent_phone ?? '';
		}
	});

	$effect(() => {
		if (currentProperty?.property_agent) {
			currentProperty.property_agent.agent_name = agentName;
			currentProperty.property_agent.agent_mobile = agentMobile;
			currentProperty.property_agent.agent_phone = agentPhone;
		}
	});

	function handleReset() {
		currentProperty = page.data.userProfile.property_profile.find(
			(property: { id: string }) => property.id === propertyId
		);

		if (currentProperty) {
			agentName = currentProperty.property_agent?.agent_name ?? '';
			agentMobile = currentProperty.property_agent?.agent_mobile ?? '';
			agentPhone = currentProperty.property_agent?.agent_phone ?? '';

			propertyWasRented.set(!!currentProperty.property_rented);
		}

		unsaved = false;
		formError = false;
		formErrorMessage = '';
		formSuccess = false;
	}
</script>

<svelte:head>
	<title>Profile-My Place</title>
</svelte:head>

<section class="mx-auto">
	<form
		id="profileMyPlaceForm"
		autocomplete="off"
		onchange={() => {
			unsaved = true;
		}}
		class="mx-auto w-full max-w-5xl space-y-2 py-2"
		method="POST"
	>
		<h1 class="text-surface-600 mb-2 text-right text-2xl font-semibold">My Place</h1>

		<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />
		<h2 class="h2 text-surface-900 text-lg font-semibold">What is your address?</h2>
		<div class="bg-secondary-300 grid gap-2 rounded-lg p-1 sm:grid-cols-10 sm:gap-2">
			<input
				type="text"
				name="property_address_street"
				class="focus:border-primary-600 focus:ring-primary-600 border-surface-300 bg-surface-50 text-surface-900 col-span-6 block w-full rounded-lg border p-0.5 text-base"
				placeholder="Street Address"
				disabled
				bind:value={currentProperty.property_address_street}
			/>
			<input
				type="text"
				name="property_address_suburb"
				class="focus:border-primary-600 focus:ring-primary-600 border-surface-300 bg-surface-50 text-surface-900 col-span-3 block w-full rounded-lg border p-0.5 text-base"
				placeholder="SUBURB"
				autocomplete="address-level2"
				use:setUpperCase
				style="text-transform:uppercase sm:text-base"
				disabled
				bind:value={currentProperty.property_address_suburb}
			/>
			<input
				type="text"
				name="property_address_postcode"
				class="focus:border-primary-600 focus:ring-primary-600 border-surface-300 bg-surface-50 text-surface-900 col-span-1 block w-full rounded-lg border p-0.5 text-base"
				placeholder="Postcode"
				autocomplete="postal-code"
				disabled
				bind:value={currentProperty.property_address_postcode}
			/>
		</div>
		<h2 class="h2 text-surface-900 text-lg font-semibold">Are you renting this property?</h2>
		<FormWell>
			<div class="mr-4 flex items-center">
				{#each yesNoOptions as { value, lable } (value)}
					{#if lable === 'Yes'}
						<div class="mr-4 flex items-center">
							<input
								class="ml-8 h-4 w-4"
								id="property_rented"
								type="radio"
								name="property_rented"
								bind:group={currentProperty.property_rented}
								{value}
							/>
							<label class="text-primary-900 ml-2 text-base font-medium" for="property_rented"
								>{lable}</label
							>
						</div>
					{:else}
						<div class="mr-4 flex items-center">
							<input
								class="ml-8 h-4 w-4"
								id="property_rented"
								name="property_rented"
								type="radio"
								bind:group={currentProperty.property_rented}
								{value}
							/>
							<label class="text-primary-900 ml-2 text-base font-medium" for="property_rented"
								>{lable}</label
							>
						</div>
					{/if}
				{/each}
			</div>
			<div class="mt-4 grid grid-cols-11 gap-2">
				<div class="col-span-5 flex flex-col">
					<label
						class="text-primary-900 flex-initial px-3 text-base"
						for="agent_name"
						hidden={!currentProperty.property_rented}>Agent</label
					>
					<input
						type="text"
						class="focus:border-primary-600 focus:ring-primary-600 border-surface-300 bg-surface-50 text-surface-900 rounded-lg border p-0.5 text-base"
						id="agent_name"
						name="agent_name"
						autocomplete="off"
						hidden={!currentProperty.property_rented}
						bind:value={agentName}
					/>
				</div>
				<div class="col-span-3 flex flex-col">
					<label
						class="text-primary-900 flex-initial px-3 text-base"
						for="agent_mobile"
						hidden={!currentProperty.property_rented}>Mobile</label
					>
					<input
						type="text"
						class="focus:border-primary-600 focus:ring-primary-600 border-surface-300 bg-surface-50 text-surface-900 rounded-lg border p-0.5 text-base"
						id="agent_mobile"
						name="agent_mobile"
						hidden={!currentProperty.property_rented}
						autocomplete="off"
						placeholder="Mobile 0XXX XXX XXX"
						onkeydown={(e) => {
							if (['Backspace', 'Delete'].includes(e.key)) {
								agentMobile = e.currentTarget.value;
							} else {
								e.preventDefault();
								agentMobile = e.currentTarget.value;
								if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
									agentMobile = formatMobile(agentMobile, e.key);
								}
							}
						}}
						bind:value={agentMobile}
					/>
				</div>
				<div class="col-span-3 flex flex-col">
					<label
						class="text-primary-900 flex-initial px-3 text-base"
						for="agent_phone"
						hidden={!currentProperty.property_rented}>Landline</label
					>
					<input
						type="text"
						class="focus:border-primary-600 focus:ring-primary-600 border-surface-300 bg-surface-50 text-surface-900 rounded-lg border p-0.5 text-base"
						id="agent_phone"
						name="agent_phone"
						hidden={!currentProperty.property_rented}
						autocomplete="off"
						placeholder="Landline XXXX XXXX"
						onkeydown={(e) => {
							if (['Backspace', 'Delete'].includes(e.key)) {
								agentPhone = e.currentTarget.value;
							} else {
								e.preventDefault();
								agentPhone = e.currentTarget.value;
								if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
									agentPhone = formatPhone(agentPhone, e.key);
								}
							}
						}}
						bind:value={agentPhone}
					/>
				</div>
			</div>
		</FormWell>
		<h2 class="h2 text-surface-900 text-lg font-semibold">
			Is your property well sign posted and numbered clearly from the road?
		</h2>
		<FormWell>
			<div class="mr-4 flex items-center">
				{#each yesNoOptions as { value, lable } (value)}
					<input
						class="ml-8 h-4 w-4"
						name="sign_posted"
						type="radio"
						bind:group={currentProperty.sign_posted}
						{value}
					/>
					<label class="text-secondary-900 ml-2 text-base font-medium" for="sign_posted"
						>{lable}</label
					>
				{/each}
			</div>
		</FormWell>
		<h2 class="h2 text-surface-900 text-lg font-semibold">
			Is there easy truck access to the buildings, boundaries and paddocks?
		</h2>
		<FormWell layout="grid-2">
			{#each accessOptions as { value, lable } (value)}
				<div class="col-span-1 flex items-center">
					{#if lable === 'Other'}
						<input
							class="ml-8 h-4 w-4"
							name="truck_access"
							type="radio"
							bind:group={currentProperty.truck_access}
							{value}
						/>
					{:else}
						<input
							class="ml-8 h-4 w-4"
							name="truck_access"
							type="radio"
							bind:group={currentProperty.truck_access}
							{value}
						/>
					{/if}
					<label class="text-secondary-900 ml-2 text-base font-medium" for="truck_access"
						>{lable}</label
					>
				</div>
			{/each}
		</FormWell>
		<h2
			class="text-surface-900 text-base font-semibold"
			hidden={currentProperty.truck_access !== 4}
		>
			Other Access Information:
		</h2>
		<div
			class="bg-secondary-300 rounded-lg p-2 sm:text-lg"
			hidden={currentProperty.truck_access !== 4}
		>
			<input
				type="text"
				class="border-secondary-700 bg-secondary-50 w-full rounded border py-1 sm:text-base"
				hidden={currentProperty.truck_access !== 4}
				id="truck_access_other_information"
				name="truck_access_other_information"
				autocomplete="off"
				bind:value={currentProperty.truck_access_other_information}
			/>
		</div>
		<h2 class="h2 text-surface-900 text-lg font-semibold">How many people usually live here?</h2>
		<div class="bg-secondary-300 flex flex-row justify-around rounded-lg p-2 sm:text-lg">
			<NumberInput
				name="residents0_18"
				lable="0-18 yrs "
				lableClass="ml-2 text-base font-medium text-secondary-900 font-Poppins"
				inputClass="border border-secondary-700 rounded text-center py-1 sm:text-base"
				bind:inputValue={currentProperty.residents0_18}
			/>
			<NumberInput
				name="residents19_50"
				lable="19-50 yrs "
				lableClass="ml-2 text-base font-medium text-secondary-900 font-Poppins"
				inputClass="border border-secondary-700 rounded text-center py-1 sm:text-base"
				bind:inputValue={currentProperty.residents19_50}
			/>
			<NumberInput
				name="residents51_70"
				lable="51-70 yrs "
				lableClass="ml-2 text-base font-medium text-secondary-900 font-Poppins"
				inputClass="border border-secondary-700 rounded text-center py-1 sm:text-base"
				bind:inputValue={currentProperty.residents51_70}
			/>
			<NumberInput
				name="residents71_"
				lable="71+ yrs"
				lableClass="ml-2 text-base font-medium text-secondary-900 font-Poppins"
				inputClass="border border-secondary-700 rounded text-center py-1 sm:text-base"
				bind:inputValue={currentProperty.residents71_}
			/>
		</div>
		<h2 class="h2 text-surface-900 text-lg font-semibold">
			Do you consider any person on the property to be vulnerable?
		</h2>
		<FormWell>
			{#each yesNoOptions as { value, lable } (value)}
				<div class="mr-4 flex items-center">
					<input
						class="ml-8 h-4 w-4"
						name="vulnerable_residents"
						type="radio"
						bind:group={currentProperty.vulnerable_residents}
						{value}
					/>
					<label class="text-secondary-900 ml-2 text-base font-medium" for="vulnerable_residents"
						>{lable}</label
					>
				</div>
			{/each}
		</FormWell>
		<div class="flex flex-row items-center justify-start pt-2">
			<h2 class="h2 text-surface-900 text-lg font-semibold">What is your landline phone number?</h2>
			<div class="ml-3">
				<FormWell>
					<input
						onchange={() => {
							unsaved = true;
						}}
						type="tel"
						name="phone"
						class="focus:border-primary-600 focus:ring-primary-600 border-surface-300 bg-surface-50 text-surface-900 block w-full rounded-lg border p-0.5 text-base"
						placeholder="Landline XXXX XXXX"
						onkeydown={(e) => {
							if (['Backspace', 'Delete'].includes(e.key)) {
								currentProperty.phone = e.currentTarget.value;
							} else {
								e.preventDefault();
								currentProperty.phone = e.currentTarget.value;
								if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
									currentProperty.phone = formatPhone(currentProperty.phone, e.key);
								}
							}
						}}
						bind:value={currentProperty.phone}
					/>
				</FormWell>
			</div>
		</div>
		<div class="flex flex-row items-center justify-start pt-2">
			<h2 class="h2 text-surface-900 text-lg font-semibold">
				What is the mobile reception quality at the property?
			</h2>
			<div class="ml-4">
				<FormWell>
					<div class="my-0 flex list-none items-center text-base sm:mx-auto sm:w-full">
						<div class="text-primary-900 mx-4 flex-auto font-semibold">Poor</div>
						{#each Array(5) as _, i (i)}
							<li class="mx-3 flex-auto">
								<input
									name="mobile_reception"
									type="radio"
									class="border-surface-300 bg-surface-100 text-secondary-700 checked:ring-secondary-700 focus:ring-secondary-700 h-4 w-4"
									bind:group={currentProperty.mobile_reception}
									value={i + 1}
								/>
								<label class="text-primary-900 ml-1 inline-block" for="mobile_reception">
									{i + 1}
								</label>
							</li>
						{/each}
						<div class="text-primary-900 mx-4 flex-auto font-semibold">Excellent</div>
					</div>
				</FormWell>
			</div>
		</div>
		<input type="hidden" name="property_key" value={currentProperty.id} />
		<input type="hidden" name="property_was_rented" bind:value={$propertyWasRented} />
		<FormActions onReset={handleReset} isUnsaved={unsaved} {isSubmitting} />
	</form>
</section>
