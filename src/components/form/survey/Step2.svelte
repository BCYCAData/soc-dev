<script lang="ts">
	import { noYesOptions, yesNoOptions, accessOptions } from '$lib/profileOptions';
	import { formatMobile, formatPhone, toTitleCase } from '$lib/utils';

	import type { AgentData, UserProfileData, PropertyProfileData } from '$lib/db.types';

	function setTitleCase(e: Event) {
		(e.target as HTMLInputElement).value = toTitleCase((e.target as HTMLInputElement).value);
	}

	function setUpperCase(e: Event) {
		(e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase();
	}

	export let agentData: AgentData;
	export let userProfileData: UserProfileData;
	export let propertyProfileData: PropertyProfileData;

	const propertyWasRented = propertyProfileData.property_rented;
	let otherAccessChecked = propertyProfileData.truck_access === 4 ? true : false;
	let rentingChecked = propertyProfileData.property_rented === true;
</script>

<div class="py-2 mx-auto lg:py-2">
	<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">What is your name?</h2>
	<div class="grid gap-2 p-2 rounded-lg bg-orange-200 sm:grid-cols-2 sm:gap-2">
		<div class="w-full">
			<input
				type="text"
				id="first_name"
				name="first_name"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
				autocomplete="given-name"
				style="text-transform:capitalize"
				placeholder="First Name "
				on:input={setTitleCase}
				bind:value={userProfileData.first_name}
			/>
		</div>
		<div class="w-full">
			<input
				type="text"
				id="family_name"
				name="family_name"
				autocomplete="family_name"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
				style="text-transform:capitalize"
				placeholder="Family Name "
				on:input={setTitleCase}
				bind:value={userProfileData.family_name}
			/>
		</div>
	</div>
	<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">Your property address is:</h2>
	<div class="p-2 rounded-lg bg-orange-200">
		<div class="grid sm:grid-cols-12 gap-0">
			<div class="flex items-center">
				<label
					class="unstyled px-3 text-lg text-primary-700 font-Poppins"
					for="property_address_street">STREET</label
				>
			</div>
			<div class="flex items-center col-span-11">
				<input
					type="text"
					id="property_address_street"
					name="property_address_street"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
					autocomplete="street-address"
					placeholder="STREET ADDRESS"
					on:input={setUpperCase}
					style="text-transform:uppercase"
					bind:value={propertyProfileData.property_address_street}
					disabled
				/>
			</div>
		</div>

		<div class="p-2 rounded-lg bg-orange-200">
			<div class="grid sm:grid-cols-12 gap-0">
				<div class="flex items-center">
					<label
						class="unstyled pl-2 text-lg text-primary-700 font-Poppins"
						for="property_address_suburb">SUBURB</label
					>
				</div>
				<div class="flex items-center col-span-6">
					<input
						type="text"
						id="property_address_suburb"
						name="property_address_suburb"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
						autocomplete="address-level2"
						placeholder="SUBURB"
						on:input={setUpperCase}
						style="text-transform:uppercase"
						disabled
						bind:value={propertyProfileData.property_address_suburb}
					/>
				</div>
				<div class="flex items-center col-span-2">
					<label
						class="unstyled text-lg text-primary-700 font-Poppins sm:pl-16"
						for="property_address_postcode">POSTCODE</label
					>
				</div>
				<div class="flex items-center col-span-3 pr-20">
					<input
						type="text"
						id="property_address_postcode"
						name="property_address_postcode"
						class="bg-gray-50 border pr-20 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
						placeholder="Postcode"
						autocomplete="postal-code"
						style="text-transform:uppercase"
						disabled
						bind:value={propertyProfileData.property_address_postcode}
					/>
				</div>
			</div>
		</div>
	</div>
	<input type="text" name="property_was_rented" value={propertyWasRented} hidden />
	<div class="flex items-center mb-1">
		<h2 class="unstyled text-xl font-semibold text-gray-900">Are you renting this property?</h2>
		<p class="pt-1 pl-12" hidden={!rentingChecked}>
			Please enter your Agent's Name and at least one contact number if you can.
		</p>
	</div>
	<div class="p-2 h-[62px] w-full flex flex-row rounded-lg bg-orange-200">
		<div class="flex items-center w-1/8 mr-4">
			{#each noYesOptions as { value, lable }}
				{#if lable === 'Yes'}
					<div class="flex items-center">
						<input
							class="w-6 h-6 ml-8"
							id="property_rented"
							type="radio"
							name="property_rented"
							on:change={() => {
								rentingChecked = true;
							}}
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
							on:change={() => {
								rentingChecked = false;
							}}
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
		<div class="flex justify-around flex-1 items-center sm:text-lg">
			<label
				class="unstyled flex-initial px-3 text-lg text-primary-700 font-Poppins"
				for="agent_name"
				hidden={!rentingChecked}>Agent</label
			>
			<input
				type="text"
				class="bg-gray-50 border border-gray-300 flex-initial w-3/4 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 p-0.5"
				id="agent_name"
				name="agent_name"
				autocomplete="off"
				hidden={!rentingChecked}
				bind:value={agentData.agent_name}
			/>
			<label
				class="unstyled flex-initial px-3 text-lg text-primary-700 font-Poppins"
				for="agent_mobile"
				hidden={!rentingChecked}>Mobile</label
			>
			<input
				type="text"
				class="bg-gray-50 border border-gray-300 flex-auto w-1/8 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 p-0.5"
				id="agent_mobile"
				name="agent_mobile"
				autocomplete="do-not-autofill"
				placeholder="Mobile 0XXX XXX XXX"
				on:keydown={(e) => {
					if (['Backspace', 'Delete'].includes(e.key)) {
						agentData.agent_mobile = e.currentTarget.value;
					} else {
						e.preventDefault();
						agentData.agent_mobile = e.currentTarget.value;
						if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
							agentData.agent_mobile = formatMobile(agentData.agent_mobile, e.key);
						}
					}
				}}
				hidden={!rentingChecked}
				bind:value={agentData.agent_mobile}
			/>
			<label
				class="unstyled flex-initial px-3 text-lg text-primary-700 font-Poppins"
				for="agent_phone"
				hidden={!rentingChecked}>Landline</label
			>
			<input
				type="text"
				class="bg-gray-50 border border-gray-300 flex-auto w-1/8 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 p-0.5"
				id="agent_phone"
				autocomplete="do-not-autofill"
				placeholder="Landline XXXX XXXX"
				on:keydown={(e) => {
					if (['Backspace', 'Delete'].includes(e.key)) {
						agentData.agent_phone = e.currentTarget.value;
					} else {
						e.preventDefault();
						agentData.agent_phone = e.currentTarget.value;
						if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
							agentData.agent_phone = formatPhone(agentData.agent_phone, e.key);
						}
					}
				}}
				hidden={!rentingChecked}
				bind:value={agentData.agent_phone}
			/>
		</div>
	</div>
	<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
		Is your property well sign-posted and numbered clearly from the road?
	</h2>
	<div class="p-2 flex flex-wrap rounded-lg bg-orange-200">
		{#each yesNoOptions as { value, lable }}
			<div class="flex items-center mr-4">
				<input
					name="sign_posted"
					class="w-6 h-6 ml-8"
					type="radio"
					bind:group={propertyProfileData.sign_posted}
					{value}
				/>
				<label
					class="unstyled flex-initial px-3 text-lg text-primary-700 font-Poppins"
					for="sign_posted">{lable}</label
				>
			</div>
		{/each}
	</div>
	<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
		Is there easy truck access to the buildings, boundaries and paddocks?
	</h2>
	<div class="p-2 flex flex-wrap rounded-lg bg-orange-200">
		<!-- <ul class="list-none w-full pl-0 m-0"> -->
		{#each accessOptions as { value, lable }}
			{#if lable === 'Other'}
				<div class="pt-1 flex w-full flex-center rounded-lg bg-orange-200">
					<input
						class="w-6 h-6 ml-8"
						on:change={() => {
							otherAccessChecked = !otherAccessChecked;
						}}
						name="truck_access"
						type="radio"
						bind:group={propertyProfileData.truck_access}
						{value}
					/>
					<label
						class="unstyled flex-initial px-3 text-lg text-primary-700 font-Poppins"
						for="truck_access">{lable}</label
					>
					<input
						type="text"
						class="bg-gray-50 border pr-20 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-0.5"
						id="truck_access_other_information"
						name="truck_access_other_information"
						hidden={!otherAccessChecked}
						bind:value={propertyProfileData.truck_access_other_information}
					/>
				</div>
			{:else}
				<div class="flex items-center mr-4">
					<input
						on:change={() => {
							otherAccessChecked = false;
						}}
						class="w-6 h-6 ml-8"
						name="truck_access"
						autocomplete="do-not-autofill"
						placeholder="Other Access Information..."
						type="radio"
						bind:group={propertyProfileData.truck_access}
						{value}
					/>
					<label
						class="unstyled flex-initial px-3 text-lg text-primary-700 font-Poppins"
						for="truck_access">{lable}</label
					>
				</div>
			{/if}
		{/each}
		<!-- </ul> -->
	</div>
	<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">What is your phone number?</h2>
	<div class="p-2 rounded-lg bg-orange-200">
		<div class="flex flex-row sm:text-lg">
			<label class="unstyled flex-initial px-3 text-lg text-primary-700 font-Poppins" for="mobile"
				>Mobile</label
			>
			<input
				type="tel"
				class="bg-gray-50 border pr-20 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
				id="mobile"
				name="mobile"
				placeholder="Mobile 0XXX XXX XXX"
				on:keydown={(e) => {
					if (['Backspace', 'Delete'].includes(e.key)) {
						userProfileData.mobile = e.currentTarget.value;
					} else {
						e.preventDefault();
						userProfileData.mobile = e.currentTarget.value;
						if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
							userProfileData.mobile = formatMobile(userProfileData.mobile, e.key);
						}
					}
				}}
				bind:value={userProfileData.mobile}
				autocomplete="off"
			/>
			<label class="unstyled flex-initial px-3 text-lg text-primary-700 font-Poppins" for="phone"
				>Landline</label
			>
			<input
				type="tel"
				class="bg-gray-50 border pr-20 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
				id="phone"
				name="phone"
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
				autocomplete="tel-local"
			/>
		</div>
	</div>
</div>
