<script lang="ts">
	import { setUpperCase, setTitleCase } from '$lib/svelte-actions';
	import { yesNoOptions, accessOptions } from '$lib/profile-options';
	import { formatMobile, formatPhone } from '$lib/utility';

	import type { PersonalProfileFormData } from '$lib/form.types';

	type Props = {
		propertyWasRented: boolean;
		userProfile: PersonalProfileFormData;
	};

	let { propertyWasRented, userProfile = $bindable() }: Props = $props();

	let otherAccessChecked = $state(userProfile.property_profile.truck_access === 4 ? true : false);
	let rentingChecked = $state(userProfile.property_profile.property_rented === true);
	let agentName = $state('');
	let agentMobile = $state('');
	let agentPhone = $state('');

	function initializePropertyAgent() {
		if (userProfile.property_profile.property_agent === null) {
			userProfile.property_profile.property_agent = {
				agent_name: '',
				agent_mobile: '',
				agent_phone: ''
			};
		}
	}
	// Watch for changes in rentingChecked
	$effect(() => {
		if (rentingChecked) {
			initializePropertyAgent();
			agentName = userProfile.property_profile.property_agent?.agent_name ?? '';
			agentMobile = userProfile.property_profile.property_agent?.agent_mobile ?? '';
			agentPhone = userProfile.property_profile.property_agent?.agent_phone ?? '';
		} else {
			userProfile.property_profile.property_agent = {
				agent_name: null,
				agent_mobile: null,
				agent_phone: null
			};
			agentName = '';
			agentMobile = '';
			agentPhone = '';
		}
	});

	// Watch for changes in rentingChecked
	$effect(() => {
		if (rentingChecked) {
			initializePropertyAgent();
		} else {
			userProfile.property_profile.property_agent = {
				agent_name: null,
				agent_mobile: null,
				agent_phone: null
			};
		}
	});
</script>

<div class="mx-auto py-2 lg:py-2">
	<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">What is your name?</h2>
	<div class="grid gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:gap-2">
		<div class="w-full">
			<input
				type="text"
				id="first_name"
				name="first_name"
				class="text-scale-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
				autocomplete="given-name"
				style="text-transform:capitalize"
				placeholder="First Name "
				use:setTitleCase
				bind:value={userProfile.first_name}
			/>
		</div>
		<div class="w-full">
			<input
				type="text"
				id="family_name"
				name="family_name"
				autocomplete="off"
				class="text-scale-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
				style="text-transform:capitalize"
				placeholder="Family Name "
				use:setTitleCase
				bind:value={userProfile.family_name}
			/>
		</div>
	</div>
	<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">Your property address is:</h2>
	<div class="rounded-lg bg-secondary-200 p-2">
		<div class="grid gap-0 sm:grid-cols-12">
			<div class="flex items-center">
				<label class="px-3 text-lg font-semibold text-primary-700" for="property_address_street"
					>STREET</label
				>
			</div>
			<div class="col-span-11 flex items-center">
				<input
					type="text"
					id="property_address_street"
					name="property_address_street"
					class="text-scale-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
					autocomplete="street-address"
					placeholder="STREET ADDRESS"
					use:setUpperCase
					style="text-transform:uppercase"
					value={userProfile.property_profile.property_address_street}
					disabled
				/>
			</div>
		</div>

		<div class="rounded-lg bg-secondary-200 p-2">
			<div class="grid gap-0 sm:grid-cols-12">
				<div class="flex items-center">
					<label
						class="px-3 pl-2 text-lg font-semibold text-primary-700"
						for="property_address_suburb">SUBURB</label
					>
				</div>
				<div class="col-span-6 flex items-center">
					<input
						type="text"
						id="property_address_suburb"
						name="property_address_suburb"
						class="text-scale-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
						autocomplete="address-level2"
						placeholder="SUBURB"
						use:setUpperCase
						style="text-transform:uppercase"
						disabled
						bind:value={userProfile.property_profile.property_address_suburb}
					/>
				</div>
				<div class="col-span-2 flex items-center">
					<label
						class="px-3 text-lg font-semibold text-primary-700 sm:pl-16"
						for="property_address_postcode">POSTCODE</label
					>
				</div>
				<div class="col-span-3 flex items-center pr-20">
					<input
						type="text"
						id="property_address_postcode"
						name="property_address_postcode"
						class="text-scale-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 pr-20 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
						placeholder="Postcode"
						autocomplete="postal-code"
						style="text-transform:uppercase"
						disabled
						bind:value={userProfile.property_profile.property_address_postcode}
					/>
				</div>
			</div>
		</div>
	</div>
	<input type="text" name="property_was_rented" value={propertyWasRented} hidden />
	<div class="mb-1 flex items-center">
		<h2 class="h2 text-lg font-semibold text-surface-950">Are you renting this property?</h2>
		<p class="pl-12 pt-1" hidden={!rentingChecked}>
			Please enter your Agent's Name and at least one contact number if you can.
		</p>
	</div>
	<div class="flex h-[62px] w-full flex-row rounded-lg bg-secondary-200 p-2">
		<div class="w-1/8 mr-4 flex items-center">
			{#each yesNoOptions as { value, lable }}
				{#if lable === 'Yes'}
					<div class="flex items-center">
						<input
							class="ml-8 h-6 w-6"
							id="property_rented"
							type="radio"
							name="property_rented"
							onchange={() => {
								rentingChecked = true;
							}}
							bind:group={userProfile.property_profile.property_rented}
							{value}
						/>
						<label class="text-scale-6 ml-2 font-medium text-orange-700" for="property_rented"
							>{lable}</label
						>
					</div>
				{:else}
					<div class="mr-4 flex items-center">
						<input
							class="ml-8 h-6 w-6"
							id="property_rented"
							name="property_rented"
							type="radio"
							onchange={() => {
								rentingChecked = false;
							}}
							bind:group={userProfile.property_profile.property_rented}
							{value}
						/>
						<label class="text-scale-6 ml-2 font-medium text-orange-700" for="property_rented"
							>{lable}</label
						>
					</div>
				{/if}
			{/each}
		</div>
		<div class="sm:text-scale-5 flex flex-1 items-center justify-around">
			<label
				class="flex-initial px-3 text-lg font-semibold text-primary-700"
				for="agent_name"
				hidden={!rentingChecked}>Agent</label
			>
			<input
				type="text"
				class="text-scale-5 w-3/4 flex-initial rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
				id="agent_name"
				name="agent_name"
				autocomplete="off"
				hidden={!rentingChecked}
				bind:value={agentName}
			/>
			<label
				class="flex-initial px-3 text-lg font-semibold text-primary-700"
				for="agent_mobile"
				hidden={!rentingChecked}>Mobile</label
			>
			<input
				type="text"
				class="w-1/8 text-scale-5 flex-auto rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
				id="agent_mobile"
				name="agent_mobile"
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
				hidden={!rentingChecked}
				bind:value={agentMobile}
			/>
			<label
				class="flex-initial px-3 text-lg font-semibold text-primary-700"
				for="agent_phone"
				hidden={!rentingChecked}>Landline</label
			>
			<input
				type="text"
				class="w-1/8 text-scale-5 flex-auto rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
				id="agent_phone"
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
				hidden={!rentingChecked}
				bind:value={agentPhone}
			/>
		</div>
	</div>
	<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
		Is your property well sign-posted and numbered clearly from the road?
	</h2>
	<div class="flex flex-wrap rounded-lg bg-secondary-200 p-2">
		{#each yesNoOptions as { value, lable }}
			<div class="mr-4 flex items-center">
				<input
					name="sign_posted"
					class="ml-8 h-6 w-6"
					type="radio"
					bind:group={userProfile.property_profile.sign_posted}
					{value}
				/>
				<label class="flex-initial px-3 text-lg font-semibold text-primary-700" for="sign_posted"
					>{lable}</label
				>
			</div>
		{/each}
	</div>
	<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
		Is there easy truck access to the buildings, boundaries and paddocks?
	</h2>
	<div class="flex flex-wrap rounded-lg bg-secondary-200 p-2">
		{#each accessOptions as { value, lable }}
			{#if lable === 'Other'}
				<div class="flex-center flex w-full rounded-lg bg-secondary-200 pt-1">
					<input
						class="ml-8 h-6 w-6"
						onchange={() => {
							otherAccessChecked = !otherAccessChecked;
						}}
						name="truck_access"
						type="radio"
						bind:group={userProfile.property_profile.truck_access}
						{value}
					/>
					<label class="flex-initial px-3 text-lg font-semibold text-primary-700" for="truck_access"
						>{lable}</label
					>
					<input
						type="text"
						class="text-scale-5 w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 pr-20 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
						id="truck_access_other_information"
						name="truck_access_other_information"
						hidden={!otherAccessChecked}
						bind:value={userProfile.property_profile.truck_access_other_information}
					/>
				</div>
			{:else}
				<div class="mr-4 flex items-center">
					<input
						onchange={() => {
							otherAccessChecked = false;
						}}
						class="ml-8 h-6 w-6"
						name="truck_access"
						autocomplete="off"
						placeholder="Other Access Information..."
						type="radio"
						bind:group={userProfile.property_profile.truck_access}
						{value}
					/>
					<label class="flex-initial px-3 text-lg font-semibold text-primary-700" for="truck_access"
						>{lable}</label
					>
				</div>
			{/if}
		{/each}
	</div>
	<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">What is your phone number?</h2>
	<div class="rounded-lg bg-secondary-200 p-2">
		<div class="sm:text-scale-5 flex flex-row">
			<label class="flex-initial px-3 text-lg font-semibold text-primary-700" for="mobile"
				>Mobile</label
			>
			<input
				type="tel"
				class="text-scale-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 pr-20 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
				id="mobile"
				name="mobile"
				placeholder="Mobile 0XXX XXX XXX"
				onkeydown={(e) => {
					if (['Backspace', 'Delete'].includes(e.key)) {
						userProfile.mobile = e.currentTarget.value;
					} else {
						e.preventDefault();
						userProfile.mobile = e.currentTarget.value;
						if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
							userProfile.mobile = formatMobile(userProfile.mobile, e.key);
						}
					}
				}}
				bind:value={userProfile.mobile}
				autocomplete="off"
			/>
			<label class="flex-initial px-3 text-lg font-semibold text-primary-700" for="phone"
				>Landline</label
			>
			<input
				type="tel"
				class="text-scale-5 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 pr-20 text-surface-950 focus:border-primary-600 focus:ring-primary-600"
				id="phone"
				name="phone"
				placeholder="Landline XXXX XXXX"
				onkeydown={(e) => {
					if (['Backspace', 'Delete'].includes(e.key)) {
						userProfile.property_profile.phone = e.currentTarget.value;
					} else {
						e.preventDefault();
						userProfile.property_profile.phone = e.currentTarget.value;
						if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
							userProfile.property_profile.phone = formatPhone(
								userProfile.property_profile.phone,
								e.key
							);
						}
					}
				}}
				bind:value={userProfile.property_profile.phone}
				autocomplete="tel-local"
			/>
		</div>
	</div>
</div>
