<script lang="ts">
	import { yesNoMaybeOptions, yesNoOptions } from '$lib/profileOptions';
	import NumberInput from '$components/form/inputs/NumberInput.svelte';
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { PropertyProfileData } from '$lib/db.types';

	export let propertyProfileData: PropertyProfileData;

	let live_stock_present = propertyProfileData.live_stock_present;
	let live_stock_safe_area = propertyProfileData.live_stock_safe_area;
</script>

<h2 class="mb-1 text-xl font-semibold text-gray-900">
	Please record the number of pets you have on this property:
</h2>
<div class="p-2 rounded-lg bg-orange-200">
	<ul class="flex pl-0 my-0 justify-around list-none sm:text-lg">
		<NumberInput
			name="number_dogs"
			lable="Dogs"
			lableClass="ml-2 text-xl font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 w-20 rounded sm:text-lg"
			bind:inputValue={propertyProfileData.number_dogs}
		/>
		<NumberInput
			name="number_cats"
			lable="Cats"
			lableClass="ml-2 text-xl font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 w-20 rounded sm:text-lg"
			bind:inputValue={propertyProfileData.number_cats}
		/>
		<NumberInput
			name="number_birds"
			lable="Birds"
			lableClass="ml-2 text-xl font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 w-20 rounded sm:text-lg"
			bind:inputValue={propertyProfileData.number_birds}
		/>
		<NumberInput
			name="number_other_pets"
			lable="Other"
			lableClass="ml-2 text-xl font-medium text-orange-900 font-Poppins"
			inputClass="border border-orange-700 w-20 rounded sm:text-lg"
			bind:inputValue={propertyProfileData.number_other_pets}
		/>
	</ul>
</div>
<h2 class="mb-1 text-xl font-semibold text-gray-900">Do you have livestock?</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	{#each yesNoOptions as { value, lable }}
		<div class="flex items-center">
			<input
				form="surveyForm"
				class="w-6 h-6 ml-8"
				id="live_stock_present"
				type="radio"
				name="live_stock_present"
				on:change={() => {
					live_stock_present = value;
				}}
				bind:group={propertyProfileData.live_stock_present}
				{value}
			/>
			<label class="ml-2 text-xl font-medium text-orange-900 font-Poppins" for="live_stock_present"
				>{lable}</label
			>
		</div>
	{/each}
</div>

{#if live_stock_present === true}
	<h2 class="mb-1 text-xl font-semibold text-gray-900">
		Do you have an area which would be safe for stock in the event of a bushfire or flood?
	</h2>
	<div class="p-2 flex justify-start rounded-lg bg-orange-200">
		{#each yesNoMaybeOptions as { value, lable }}
			<div class="flex items-center">
				<input
					form="surveyForm"
					class="w-6 h-6 ml-8"
					id="live_stock_safe_area"
					type="radio"
					name="live_stock_safe_area"
					on:change={() => {
						live_stock_safe_area = value;
					}}
					bind:group={propertyProfileData.live_stock_safe_area}
					{value}
				/>
				<label
					class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
					for="live_stock_safe_area">{lable}</label
				>
			</div>
		{/each}
	</div>
	{#if live_stock_present && live_stock_safe_area != 'N'}
		<h2 class="mb-1 text-xl font-semibold text-gray-900">
			Would you be happy for other people to leave their stock on your property, in your safe area,
			for a short period in an emergency?
		</h2>
		<div class="p-2 flex justify-start rounded-lg bg-orange-200">
			{#each yesNoMaybeOptions as { value, lable }}
				<div class="flex items-center">
					<input
						form="surveyForm"
						class="w-6 h-6 ml-8"
						id="share_livestock_safe_area"
						type="radio"
						name="share_livestock_safe_area"
						bind:group={propertyProfileData.share_livestock_safe_area}
						{value}
					/>
					<label
						class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
						for="share_livestock_safe_area">{lable}</label
					>
				</div>
			{/each}
		</div>
	{/if}
{/if}

<TextAreaInput
	headingClass="mb-1 text-xl font-semibold text-gray-900"
	headingText="If there are assets, other than the residence, that you consider essential (eg crops, sheds with equipment or antique cars) please describe them here."
	lableClass={null}
	lableText={null}
	divClass="p-2 rounded-lg bg-orange-200 sm:text-lg"
	nameText="other_essential_assets"
	textAreaClass="w-full resize-y sm:text-lg"
	bind:inputValue={propertyProfileData.other_essential_assets}
/>
