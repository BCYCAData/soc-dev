<script lang="ts">
	import { residencyOptions, yesNoOptions } from '$lib/profileOptions';
	import NumberInput from '$components/form/inputs/NumberInput.svelte';

	import type { PropertyProfileData, UserProfileData } from '$lib/types';

	export let userProfileData: UserProfileData;
	export let propertyProfileData: PropertyProfileData;
</script>

<h2 class="mb-1 text-xl font-semibold text-gray-900">
	What is the quality of your mobile reception at the property?
</h2>
<div class="p-1 rounded-lg bg-orange-200">
	<ul class="flex my-0 items-center list-none text-base sm:w-1/2 sm:mx-auto">
		<div class="flex-auto text-primary-700 font-semibold font-Poppins">Poor</div>
		{#each Array(5) as _, i}
			<li class="flex-auto">
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
		<div class="flex-auto text-primary-700 font-semibold font-Poppins">Excellent</div>
	</ul>
</div>
<h2 class="mb-1 text-xl font-semibold text-gray-900">Are you:</h2>
<div
	class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-200 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
>
	{#each residencyOptions as { value, lable }}
		<div class="flex items-center col-span-1">
			<input
				class="w-6 h-6 ml-8 text-orange-700 bg-gray-100 border-gray-300 focus:ring-orange-700 checked:ring-orange-700"
				id="residency_profile"
				type="radio"
				name="residency_profile"
				bind:group={userProfileData.residency_profile}
				{value}
			/>
			<label class="ml-2 text-xl font-medium text-orange-700 font-Poppins" for="residency_profile"
				>{lable}</label
			>
		</div>
	{/each}
</div>
<h2 class="mb-1 text-xl font-semibold text-gray-900">
	Please record the number of people who usually live at this property:
</h2>
<div class="p-2 rounded-lg bg-orange-200">
	<ul class="flex pl-0 my-0 justify-around list-none sm:text-lg">
		<NumberInput
			name="residents0_18"
			lable="0-18 years"
			lableClass="ml-2 text-xl font-medium text-orange-700 font-Poppins"
			inputClass="border border-orange-700 w-20 rounded sm:text-lg"
			bind:inputValue={propertyProfileData.residents0_18}
		/>
		<NumberInput
			name="residents19_50"
			lable="19-50 years"
			lableClass="ml-2 text-xl font-medium text-orange-700 font-Poppins"
			inputClass="border border-orange-700 w-20 rounded sm:text-lg"
			bind:inputValue={propertyProfileData.residents19_50}
		/>
		<NumberInput
			name="residents51_70"
			lable="51-70 years"
			lableClass="ml-2 text-xl font-medium text-orange-700 font-Poppins"
			inputClass="border border-orange-700 w-20 rounded sm:text-lg"
			bind:inputValue={propertyProfileData.residents51_70}
		/>
		<NumberInput
			name="residents71_"
			lable="71 years +"
			lableClass="ml-2 text-xl font-medium text-orange-700 font-Poppins"
			inputClass="border border-orange-700 w-20 rounded sm:text-lg"
			bind:inputValue={propertyProfileData.residents71_}
		/>
	</ul>
</div>
<div>
	<h2 class="mb-1 text-xl font-semibold text-gray-900">
		Do you consider any person on the property to be vulnerable?
	</h2>
	<div class="p-2 flex justify-start rounded-lg bg-orange-200">
		{#each yesNoOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="w-6 h-6 ml-8 text-orange-700 bg-gray-100 border-gray-300 focus:ring-orange-700 checked:ring-orange-700"
					id="vulnerable_residents"
					type="radio"
					name="vulnerable_residents"
					bind:group={propertyProfileData.vulnerable_residents}
					{value}
				/>
				<label
					class="ml-2 text-xl font-medium text-orange-700 font-Poppins"
					for="vulnerable_residents">{lable}</label
				>
			</div>
		{/each}
	</div>
</div>
