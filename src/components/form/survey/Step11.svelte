<script lang="ts">
	import { stayInTouchOptions } from '$lib/profileOptions';
	import TextAreaInput from '../inputs/TextAreaInput.svelte';

	import type { UserProfileData } from '$lib/types';

	export let userProfileData: UserProfileData;
</script>

<h2 class="mb-1 text-xl font-semibold text-gray-900">
	How would you prefer to stay in touch?<span class="ml-2 text-sm text-gray-500">
		(Check all that apply)</span
	>
</h2>
<div
	class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-200 sm:grid-cols-2 sm:grid-rows-3 sm:gap-2"
>
	{#each stayInTouchOptions as { value, lable }}
		<div class="flex items-center col-span-1">
			<input
				class="w-6 h-6 ml-8"
				name="stay_in_touch_choices"
				type="checkbox"
				bind:group={userProfileData.stay_in_touch_choices}
				{value}
			/>
			<label
				class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
				for="stay_in_touch_choices">{lable}</label
			>
		</div>
	{/each}
</div>

<TextAreaInput
	headingClass="mb-1 text-xl font-semibold text-gray-900"
	headingText="Do you have any other comments that you would like to add?"
	lableClass={null}
	lableText={null}
	divClass="p-2 rounded-lg bg-orange-200 sm:text-lg"
	nameText="other_comments"
	textAreaClass="w-full resize-y sm:text-lg"
	bind:inputValue={userProfileData.other_comments}
/>
