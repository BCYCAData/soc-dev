<script lang="ts">
	import { residencyOptions, yesNoOptions } from '$lib/profile-options';
	import NumberInput from '$components/form/inputs/NumberInput.svelte';

	import type { PersonalProfileFormData } from '$lib/form.types';

	interface Props {
		userProfile: PersonalProfileFormData;
	}

	let { userProfile = $bindable() }: Props = $props();
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	What is the quality of your mobile reception at the property?
</h2>
<div class="rounded-lg bg-secondary-200 p-1">
	<ul class="text-scale-3 my-0 flex list-none items-center sm:mx-auto sm:w-1/2">
		<div class="flex-auto font-semibold text-primary-700">Poor</div>
		{#each Array(5) as _, i}
			<li class="flex-auto">
				<input
					name="mobile_reception"
					type="radio"
					class="h-4 w-4 border-gray-300 bg-gray-100 text-orange-700 checked:ring-orange-700 focus:ring-orange-700"
					bind:group={userProfile.property_profile.mobile_reception}
					value={i + 1}
				/>
				<label class="ml-1 inline-block text-primary-700" for="mobile_reception">
					{i + 1}
				</label>
			</li>
		{/each}
		<div class="flex-auto font-semibold text-primary-700">Excellent</div>
	</ul>
</div>
<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">Are you:</h2>
<div
	class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
>
	{#each residencyOptions as { value, lable }}
		<div class="col-span-1 flex items-center">
			<input
				class="ml-8 h-6 w-6 border-gray-300 bg-gray-100 text-orange-700 checked:ring-orange-700 focus:ring-orange-700"
				id="residency_profile"
				type="radio"
				name="residency_profile"
				bind:group={userProfile.residency_profile}
				value={Number(value)}
				checked={value != null}
			/>
			<label class="text-scale-6 ml-2 font-medium text-orange-700" for="residency_profile"
				>{lable}</label
			>
		</div>
	{/each}
</div>
<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Please record the number of people who usually live at this property:
</h2>
<div class="rounded-lg bg-secondary-200 p-2">
	<ul class="sm:text-scale-5 my-0 flex list-none justify-around pl-0">
		<NumberInput
			name="residents0_18"
			lable="0-18 years"
			lableClass="ml-2 text-scale-6 font-medium text-orange-700 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded text-center sm:text-scale-5"
			bind:inputValue={userProfile.property_profile.residents0_18}
		/>
		<NumberInput
			name="residents19_50"
			lable="19-50 years"
			lableClass="ml-2 text-scale-6 font-medium text-orange-700 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded text-center sm:text-scale-5"
			bind:inputValue={userProfile.property_profile.residents19_50}
		/>
		<NumberInput
			name="residents51_70"
			lable="51-70 years"
			lableClass="ml-2 text-scale-6 font-medium text-orange-700 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded text-center sm:text-scale-5"
			bind:inputValue={userProfile.property_profile.residents51_70}
		/>
		<NumberInput
			name="residents71_"
			lable="71 years +"
			lableClass="ml-2 text-scale-6 font-medium text-orange-700 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded text-center sm:text-scale-5"
			bind:inputValue={userProfile.property_profile.residents71_}
		/>
	</ul>
</div>
<div>
	<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
		Do you consider any person on the property to be vulnerable?
	</h2>
	<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
		{#each yesNoOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="ml-8 h-6 w-6 border-gray-300 bg-gray-100 text-orange-700 checked:ring-orange-700 focus:ring-orange-700"
					id="vulnerable_residents"
					type="radio"
					name="vulnerable_residents"
					bind:group={userProfile.property_profile.vulnerable_residents}
					{value}
				/>
				<label class="text-scale-6 ml-2 font-medium text-orange-700" for="vulnerable_residents"
					>{lable}</label
				>
			</div>
		{/each}
	</div>
</div>
