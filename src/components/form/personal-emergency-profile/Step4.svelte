<script lang="ts">
	import { yesNoMaybeOptions, yesNoOptions } from '$lib/profile-options';
	import NumberInput from '$components/form/inputs/NumberInput.svelte';
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { PropertyProfile } from '$lib/form.types';

	interface Props {
		propertyProfile: PropertyProfile;
	}

	let { propertyProfile = $bindable() }: Props = $props();

	let live_stock_present = $state(propertyProfile.live_stock_present);
	let live_stock_safe_area = $state(propertyProfile.live_stock_safe_area);
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Please record the number of pets you have on this property:
</h2>
<div class="rounded-lg bg-secondary-200 p-2">
	<ul class="sm:text-scale-5 my-0 flex list-none justify-around pl-0">
		<NumberInput
			name="number_dogs"
			lable="Dogs"
			lableClass="ml-2 text-scale-6 font-medium text-orange-900 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded text-center sm:text-scale-5"
			bind:inputValue={propertyProfile.number_dogs}
		/>
		<NumberInput
			name="number_cats"
			lable="Cats"
			lableClass="ml-2 text-scale-6 font-medium text-orange-900 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded text-center sm:text-scale-5"
			bind:inputValue={propertyProfile.number_cats}
		/>
		<NumberInput
			name="number_birds"
			lable="Birds"
			lableClass="ml-2 text-scale-6 font-medium text-orange-900 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded text-center sm:text-scale-5"
			bind:inputValue={propertyProfile.number_birds}
		/>
		<NumberInput
			name="number_other_pets"
			lable="Other"
			lableClass="ml-2 text-scale-6 font-medium text-orange-900 font-Poppins"
			inputClass="border border-secondary-700 w-20 rounded text-center sm:text-scale-5"
			bind:inputValue={propertyProfile.number_other_pets}
		/>
	</ul>
</div>
<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">Do you have livestock?</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	{#each yesNoOptions as { value, lable }}
		<div class="flex items-center">
			<input
				form="surveyForm"
				class="ml-8 h-6 w-6"
				id="live_stock_present"
				type="radio"
				name="live_stock_present"
				onchange={() => {
					live_stock_present = value;
				}}
				bind:group={propertyProfile.live_stock_present}
				{value}
			/>
			<label class="text-scale-6 ml-2 font-medium text-orange-900" for="live_stock_present"
				>{lable}</label
			>
		</div>
	{/each}
</div>

{#if live_stock_present === true}
	<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
		Do you have an area which would be safe for stock in the event of a bushfire or flood?
	</h2>
	<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
		{#each yesNoMaybeOptions as { value, lable }}
			<div class="flex items-center">
				<input
					form="surveyForm"
					class="ml-8 h-6 w-6"
					id="live_stock_safe_area"
					type="radio"
					name="live_stock_safe_area"
					onchange={() => {
						live_stock_safe_area = value;
					}}
					bind:group={propertyProfile.live_stock_safe_area}
					{value}
				/>
				<label class="text-scale-6 ml-2 font-medium text-orange-900" for="live_stock_safe_area"
					>{lable}</label
				>
			</div>
		{/each}
	</div>
	{#if live_stock_present && live_stock_safe_area != 'N'}
		<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
			Would you be happy for other people to leave their stock on your property, in your safe area,
			for a short period in an emergency?
		</h2>
		<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
			{#each yesNoMaybeOptions as { value, lable }}
				<div class="flex items-center">
					<input
						form="surveyForm"
						class="ml-8 h-6 w-6"
						id="share_livestock_safe_area"
						type="radio"
						name="share_livestock_safe_area"
						bind:group={propertyProfile.share_livestock_safe_area}
						{value}
					/>
					<label
						class="text-scale-6 ml-2 font-medium text-orange-900"
						for="share_livestock_safe_area">{lable}</label
					>
				</div>
			{/each}
		</div>
	{/if}
{/if}

<TextAreaInput
	headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
	headingText="If there are assets, other than the residence, that you consider essential (eg crops, sheds with equipment or antique cars) please describe them here."
	lableClass={null}
	lableText={null}
	divClass="p-2 rounded-lg bg-secondary-200 sm:text-scale-5"
	nameText="other_essential_assets"
	textAreaClass="w-full resize-y sm:text-scale-5"
	bind:inputValue={propertyProfile.other_essential_assets}
/>
