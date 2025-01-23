<script lang="ts">
	import { writable } from 'svelte/store';
	import { page } from '$app/state';

	import { formatMobile, formatPhone } from '$lib/utility';
	import { yesNoOptions, accessOptions } from '$lib/profile-options';
	import { setUpperCase } from '$lib/svelte-actions.js';

	import NumberInput from '$components/form/inputs/NumberInput.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';
	import FormActions from '$components/form/FormActions.svelte';

	import type { ActionData } from './$types';
	import type { PropertyProfile } from '$lib/form.types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let unsaved = $state(false);
	let formError = $state(form?.error || false);
	let formErrorMessage = $state(form?.errorMessage || '');
	let formSuccess = $state(form?.success || false);

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
		<h1 class="mb-2 text-right text-2xl font-semibold text-gray-600">My Place</h1>

		<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />
		<h2 class="h2 text-lg font-semibold text-gray-900">What is your address?</h2>
		<div class="grid gap-2 rounded-lg bg-orange-300 p-1 sm:grid-cols-10 sm:gap-2">
			<input
				type="text"
				name="property_address_street"
				class="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-base text-gray-900 focus:border-primary-600 focus:ring-primary-600"
				placeholder="Street Address"
				disabled
				bind:value={currentProperty.property_address_street}
			/>
			<input
				type="text"
				name="property_address_suburb"
				class="col-span-3 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-base text-gray-900 focus:border-primary-600 focus:ring-primary-600"
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
				class="col-span-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-base text-gray-900 focus:border-primary-600 focus:ring-primary-600"
				placeholder="Postcode"
				autocomplete="postal-code"
				disabled
				bind:value={currentProperty.property_address_postcode}
			/>
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">Are you renting this property?</h2>
		<div class="flex justify-start rounded-lg bg-orange-300 p-1">
			<div class="mr-4 flex items-center">
				{#each yesNoOptions as { value, lable }}
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
							<label class="ml-2 text-base font-medium text-primary-900" for="property_rented"
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
							<label class="ml-2 text-base font-medium text-primary-900" for="property_rented"
								>{lable}</label
							>
						</div>
					{/if}
				{/each}
			</div>
			<div class="mt-4 grid grid-cols-11 gap-2">
				<div class="col-span-5 flex flex-col">
					<label
						class="flex-initial px-3 text-base text-primary-900"
						for="agent_name"
						hidden={!currentProperty.property_rented}>Agent</label
					>
					<input
						type="text"
						class="rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-base text-gray-900 focus:border-primary-600 focus:ring-primary-600"
						id="agent_name"
						name="agent_name"
						autocomplete="off"
						hidden={!currentProperty.property_rented}
						bind:value={agentName}
					/>
				</div>
				<div class="col-span-3 flex flex-col">
					<label
						class="flex-initial px-3 text-base text-primary-900"
						for="agent_mobile"
						hidden={!currentProperty.property_rented}>Mobile</label
					>
					<input
						type="text"
						class="rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-base text-gray-900 focus:border-primary-600 focus:ring-primary-600"
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
						class="flex-initial px-3 text-base text-primary-900"
						for="agent_phone"
						hidden={!currentProperty.property_rented}>Landline</label
					>
					<input
						type="text"
						class="rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-base text-gray-900 focus:border-primary-600 focus:ring-primary-600"
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
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">
			Is your property well sign posted and numbered clearly from the road?
		</h2>
		<div class="flex justify-start rounded-lg bg-orange-300 p-1">
			<div class="mr-4 flex items-center">
				{#each yesNoOptions as { value, lable }}
					<input
						class="ml-8 h-4 w-4"
						name="sign_posted"
						type="radio"
						bind:group={currentProperty.sign_posted}
						{value}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="sign_posted">{lable}</label
					>
				{/each}
			</div>
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">
			Is there easy truck access to the buildings, boundaries and paddocks?
		</h2>
		<div
			class="grid grid-flow-col gap-2 rounded-lg bg-orange-300 p-2 sm:grid-cols-2 sm:grid-rows-2 sm:gap-2"
		>
			{#each accessOptions as { value, lable }}
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
					<label class="ml-2 text-base font-medium text-orange-900" for="truck_access"
						>{lable}</label
					>
				</div>
			{/each}
		</div>
		<h2 class="text-base font-semibold text-gray-900" hidden={currentProperty.truck_access !== 4}>
			Other Access Information:
		</h2>
		<div
			class="rounded-lg bg-orange-300 p-2 sm:text-lg"
			hidden={currentProperty.truck_access !== 4}
		>
			<input
				type="text"
				class="w-full rounded border border-orange-700 bg-orange-50 py-1 sm:text-base"
				hidden={currentProperty.truck_access !== 4}
				id="truck_access_other_information"
				name="truck_access_other_information"
				autocomplete="off"
				bind:value={currentProperty.truck_access_other_information}
			/>
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">How many people usually live here?</h2>
		<div class="flex flex-row justify-around rounded-lg bg-orange-300 p-2 sm:text-lg">
			<NumberInput
				name="residents0_18"
				lable="0-18 yrs "
				lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
				inputClass="border border-orange-700 rounded text-center py-1 sm:text-base"
				bind:inputValue={currentProperty.residents0_18}
			/>
			<NumberInput
				name="residents19_50"
				lable="19-50 yrs "
				lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
				inputClass="border border-orange-700 rounded text-center py-1 sm:text-base"
				bind:inputValue={currentProperty.residents19_50}
			/>
			<NumberInput
				name="residents51_70"
				lable="51-70 yrs "
				lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
				inputClass="border border-orange-700 rounded text-center py-1 sm:text-base"
				bind:inputValue={currentProperty.residents51_70}
			/>
			<NumberInput
				name="residents71_"
				lable="71+ yrs"
				lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
				inputClass="border border-orange-700 rounded text-center py-1 sm:text-base"
				bind:inputValue={currentProperty.residents71_}
			/>
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">
			Do you consider any person on the property to be vulnerable?
		</h2>
		<div class="flex justify-start rounded-lg bg-orange-300 p-1">
			{#each yesNoOptions as { value, lable }}
				<div class="mr-4 flex items-center">
					<input
						class="ml-8 h-4 w-4"
						name="vulnerable_residents"
						type="radio"
						bind:group={currentProperty.vulnerable_residents}
						{value}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="vulnerable_residents"
						>{lable}</label
					>
				</div>
			{/each}
		</div>
		<div class="flex flex-row items-center justify-start pt-2">
			<h2 class="h2 text-lg font-semibold text-gray-900">What is your landline phone number?</h2>
			<div class="ml-3 rounded-lg bg-orange-300 p-1">
				<input
					onchange={() => {
						unsaved = true;
					}}
					type="tel"
					name="phone"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-base text-gray-900 focus:border-primary-600 focus:ring-primary-600"
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
			</div>
		</div>
		<div class="flex flex-row items-center justify-start pt-2">
			<h2 class="h2 text-lg font-semibold text-gray-900">
				What is the mobile reception quality at the property?
			</h2>
			<div class="ml-4 rounded-lg bg-orange-300 p-1">
				<div class="my-0 flex list-none items-center text-base sm:mx-auto sm:w-full">
					<div class="mx-4 flex-auto font-semibold text-primary-900">Poor</div>
					{#each Array(5) as _, i}
						<li class="mx-3 flex-auto">
							<input
								name="mobile_reception"
								type="radio"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-orange-700 checked:ring-orange-700 focus:ring-orange-700"
								bind:group={currentProperty.mobile_reception}
								value={i + 1}
							/>
							<label class="ml-1 inline-block text-primary-900" for="mobile_reception">
								{i + 1}
							</label>
						</li>
					{/each}
					<div class="mx-4 flex-auto font-semibold text-primary-900">Excellent</div>
				</div>
			</div>
		</div>
		<input type="hidden" name="property_key" value={currentProperty.id} />
		<input type="hidden" name="property_was_rented" bind:value={$propertyWasRented} />
		<FormActions onReset={handleReset} isUnsaved={unsaved} />
	</form>
</section>
