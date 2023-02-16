<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { formatPhone } from '$lib/utils';
	import { noYesOptions, yesNoOptions, accessOptions } from '$lib/profileOptions';
	import { modalStore } from '@skeletonlabs/skeleton';
	import SaveProfilePrompt from '$components/form/SaveProfilePrompt.svelte';
	import NumberInput from '$components/form/inputs/NumberInput.svelte';

	import type { PageData } from './$types';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	function triggerCustomModal(): void {
		const modalComponent: ModalComponent = {
			ref: SaveProfilePrompt
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
			modalClasses: '!overflow-y-auto !max-h-full !relative'
		};
		modalStore.trigger(d);
	}

	beforeNavigate(async ({ cancel }) => {
		if (unsaved) {
			cancel();
			triggerCustomModal();
		}
	});

	export let data: PageData;
	$: ({ propertyProfileData, agentData, property_was_rented } = data);

	let unsaved = false;
</script>

<svelte:head>
	<title>Profile-My Place</title>
</svelte:head>

<section class="mx-auto">
	<form
		id="profileMyPlaceForm"
		on:change={() => {
			unsaved = true;
		}}
		class="flex flex-col py-1 mx-auto w-full"
		method="POST"
	>
		<h2 class="text-base font-semibold text-gray-900">What is your address?</h2>
		<div class="grid gap-2 p-1 rounded-lg bg-orange-300 sm:grid-cols-10 sm:gap-2">
			<input
				type="text"
				name="property_address_street"
				class="col-span-6 w-full p-0.5"
				placeholder="Street Address"
				disabled
				bind:value={propertyProfileData.property_address_street}
			/>
			<input
				type="text"
				name="property_address_suburb"
				class="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
				placeholder="Suburb"
				autocomplete="address-level2"
				style="text-transform:uppercase sm:text-base"
				disabled
				bind:value={propertyProfileData.property_address_suburb}
			/>
			<input
				type="text"
				name="property_address_postcode"
				class="col-span-1 w-full p-0.5"
				placeholder="Postcode"
				autocomplete="postal-code"
				disabled
				bind:value={propertyProfileData.property_address_postcode}
			/>
		</div>
		<h2 class="text-base font-semibold text-gray-900">Are you renting this property?</h2>
		<div class="grid gap-0 p-1 rounded-lg bg-orange-300 sm:grid-cols-10 grid-rows-2 sm:gap-0">
			<div class="flex items-center mr-4 col-span-3">
				<div class="flex items-center">
					{#each noYesOptions as { value, lable }}
						{#if lable === 'Yes'}
							<div class="flex items-center">
								<input
									class="w-6 h-6 ml-8"
									id="property_rented"
									type="radio"
									name="property_rented"
									bind:group={propertyProfileData.property_rented}
									{value}
								/>
								<label
									class="ml-2 text-xl font-medium text-orange-700 font-Poppins"
									for="property_rented">{lable}</label
								>
							</div>
						{:else}
							<div class="flex items-center mr-4">
								<input
									class="w-6 h-6 ml-8"
									id="property_rented"
									name="property_rented"
									type="radio"
									bind:group={propertyProfileData.property_rented}
									{value}
								/>
								<label
									class="ml-2 text-xl font-medium text-orange-700 font-Poppins"
									for="property_rented">{lable}</label
								>
							</div>
						{/if}
					{/each}
				</div>
			</div>
			<div class="flex items-center col-span-10 sm:text-base">
				<label
					class="unstyled flex-initial px-3 text-base text-primary-700 font-Poppins"
					for="agent_name"
					hidden={!propertyProfileData.property_rented}>Agent</label
				>
				<input
					type="text"
					class="bg-gray-50 border border-gray-300 flex-initial w-3/4 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 p-0.5"
					id="agent_name"
					name="agent_name"
					autocomplete="off"
					hidden={!propertyProfileData.property_rented}
					bind:value={agentData.agent_name}
				/>
				<label
					class="unstyled flex-initial px-3 text-base text-primary-700 font-Poppins"
					for="agent_mobile"
					hidden={!propertyProfileData.property_rented}>Mobile</label
				>
				<input
					type="text"
					class="bg-gray-50 border border-gray-300 flex-auto w-1/8 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 p-0.5"
					id="agent_mobile"
					name="agent_mobile"
					autocomplete="off"
					hidden={!propertyProfileData.property_rented}
					bind:value={agentData.agent_mobile}
				/>
				<label
					class="unstyled flex-initial px-3 text-base text-primary-700 font-Poppins"
					for="agent_phone"
					hidden={!propertyProfileData.property_rented}>Landline</label
				>
				<input
					type="text"
					class="bg-gray-50 border border-gray-300 flex-auto w-1/8 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 p-0.5"
					id="agent_phone"
					name="agent_phone"
					autocomplete="off"
					hidden={!propertyProfileData.property_rented}
					bind:value={agentData.agent_phone}
				/>
			</div>
		</div>
		<h2 class="text-base font-semibold text-gray-900">
			Is your property well sign posted and numbered clearly from the road?
		</h2>
		<div class="flex justify-start rounded-lg p-1 bg-orange-300">
			{#each yesNoOptions as { value, lable }}
				<input
					class="w-4 h-4 ml-8"
					name="sign_posted"
					type="radio"
					bind:group={propertyProfileData.sign_posted}
					{value}
				/>
				<label class="ml-2 text-base font-medium text-orange-900 font-Poppins" for="sign_posted"
					>{lable}</label
				>
			{/each}
		</div>
		<h2 class="text-base font-semibold text-gray-900">
			Is there easy truck access to the buildings, boundaries and paddocks?
		</h2>
		<div
			class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-300 sm:grid-cols-2 sm:grid-rows-2 sm:gap-2"
		>
			{#each accessOptions as { value, lable }}
				<div class="flex items-center col-span-1">
					{#if lable === 'Other'}
						<input
							class="w-4 h-4 ml-8"
							name="truck_access"
							type="radio"
							bind:group={propertyProfileData.truck_access}
							{value}
						/>
					{:else}
						<input
							class="w-4 h-4 ml-8"
							name="truck_access"
							type="radio"
							bind:group={propertyProfileData.truck_access}
							{value}
						/>
					{/if}
					<label class="ml-2 text-base font-medium text-orange-900 font-Poppins" for="truck_access"
						>{lable}</label
					>
				</div>
			{/each}
		</div>
		<h2
			class="text-base font-semibold text-gray-900"
			hidden={propertyProfileData.truck_access !== 4}
		>
			Other Access Information:
		</h2>
		<div
			class="p-2 rounded-lg bg-orange-300 sm:text-lg"
			hidden={propertyProfileData.truck_access !== 4}
		>
			<input
				type="text"
				class="border w-full border-orange-700 rounded bg-orange-50 py-1 sm:text-base"
				hidden={propertyProfileData.truck_access !== 4}
				id="truck_access_other_information"
				name="truck_access_other_information"
				bind:value={propertyProfileData.truck_access_other_information}
			/>
		</div>
		<h2 class="text-base font-semibold text-gray-900">How many people usually live here?</h2>
		<div class="flex flex-row justify-around p-2 rounded-lg bg-orange-300 sm:text-lg">
			<NumberInput
				name="residents0_18"
				lable="0-18 yrs "
				lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
				inputClass="border border-orange-700 rounded py-1 sm:text-base"
				bind:inputValue={propertyProfileData.residents0_18}
			/>
			<NumberInput
				name="residents19_50"
				lable="19-50 yrs "
				lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
				inputClass="border border-orange-700 rounded py-1 sm:text-base"
				bind:inputValue={propertyProfileData.residents19_50}
			/>
			<NumberInput
				name="residents51_70"
				lable="51-70 yrs "
				lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
				inputClass="border border-orange-700 rounded py-1 sm:text-base"
				bind:inputValue={propertyProfileData.residents51_70}
			/>
			<NumberInput
				name="residents71_"
				lable="71+ yrs"
				lableClass="ml-2 text-base font-medium text-orange-900 font-Poppins"
				inputClass="border border-orange-700 rounded py-1 sm:text-base"
				bind:inputValue={propertyProfileData.residents71_}
			/>
		</div>
		<h2 class="text-base font-semibold text-gray-900">
			Do you consider any person on the property to be vulnerable?
		</h2>
		<div class="flex justify-start rounded-lg p-1 bg-orange-300">
			{#each yesNoOptions as { value, lable }}
				<input
					class="w-4 h-4 ml-8"
					name="vulnerable_residents"
					type="radio"
					bind:group={propertyProfileData.vulnerable_residents}
					{value}
				/>
				<label
					class="ml-2 text-base font-medium text-orange-900 font-Poppins"
					for="vulnerable_residents">{lable}</label
				>
			{/each}
		</div>
		<div class="flex flex-row justify-start pt-2 items-center">
			<h2 class="text-base font-semibold text-gray-900">What is your landline phone number?</h2>
			<div class="rounded-lg ml-3 p-1 bg-orange-300">
				<input
					on:change={() => {
						unsaved = true;
					}}
					type="tel"
					name="phone"
					class="bg-gray-50 border pr-20 border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
					placeholder="Landline XXXX XXXX"
					on:keydown={(e) => {
						if (['Backspace', 'Delete'].includes(e.key)) {
							propertyProfileData.phone = e.currentTarget.value;
						} else {
							e.preventDefault();
							propertyProfileData.phone = e.currentTarget.value;
							if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
								propertyProfileData.phone = formatPhone(propertyProfileData.phone, e.key);
							}
						}
					}}
					bind:value={propertyProfileData.phone}
				/>
			</div>
		</div>
		<div class="flex flex-row justify-start pt-2 items-center">
			<h2 class="text-base font-semibold text-gray-900">
				What is the mobile reception quality at the property?
			</h2>
			<div class="p-1 ml-4 rounded-lg bg-orange-300">
				<div class="flex my-0 items-center list-none text-base sm:w-full sm:mx-auto">
					<div class="flex-auto mx-4 text-primary-700 font-semibold font-Poppins">Poor</div>
					{#each Array(5) as _, i}
						<li class="flex-auto mx-3 ">
							<input
								name="mobile_reception"
								type="radio"
								class="w-4 h-4 text-orange-700 bg-gray-100 border-gray-300 focus:ring-orange-700 checked:ring-orange-700"
								bind:group={propertyProfileData.mobile_reception}
								value={i + 1}
							/>
							<label class="inline-block ml-1 text-primary-700 font-Poppins" for="mobile_reception">
								{i + 1}
							</label>
						</li>
					{/each}
					<div class="flex-auto mx-4 text-primary-700 font-semibold font-Poppins">Excellent</div>
				</div>
			</div>
		</div>
		<input type="text" name="property_key" value={propertyProfileData.id} hidden />
		<input type="text" name="property_was_rented" value={property_was_rented} hidden />
		<div class="sticky mt-5 bottom-2">
			<div class="flex flex-row">
				<div class="w-1/2" />
				<button
					class="w-1/4 mx-3 mb-3 rounded-lg text-base font-semibold bg-[#0099E8] text-stone-100 border border-purple-700"
					on:click={() => {
						unsaved = false;
					}}
					hidden={!unsaved}
					type="submit"
					form="profileMyPlaceForm"
				>
					Save My Answers
				</button>
				<button
					class="w-1/4 mx-auto mb-3 rounded-lg text-base font-semibold bg-[#27C7BD] text-stone-100 border border-purple-700"
					on:click={() => {
						unsaved = false;
						location.reload();
					}}
					hidden={!unsaved}
					type="button"
				>
					Cancel
				</button>
			</div>
		</div>
	</form>
</section>
