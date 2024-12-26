<script lang="ts">
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { ExternalCommunityProfile } from '$lib/form.types';

	type Props = {
		communityExternalProfile: ExternalCommunityProfile;
		communityExternalWorkshopOptions?: { value: string; lable: string }[];
	};

	let { communityExternalProfile = $bindable(), communityExternalWorkshopOptions = [] }: Props =
		$props();
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Which of these Community initiated workshops would be useful to you?<span
		class="text-scale-3 text-surface-700"
	>
		(Check all that apply)</span
	>
</h2>
{#if communityExternalProfile}
	<div
		class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-3 sm:gap-2"
	>
		{#each communityExternalWorkshopOptions as { value, lable }}
			<div class="col-span-1 flex items-center">
				<input
					class="ml-8 h-6 w-6"
					name="community_workshop_choices"
					type="checkbox"
					bind:group={communityExternalProfile.community_workshop_choices}
					value={Number(value)}
					checked={communityExternalProfile?.community_workshop_choices?.includes(Number(value))}
				/>
				<label
					class="text-scale-6 ml-2 font-medium text-orange-900"
					for="community_workshop_choices">{lable}</label
				>
			</div>
		{/each}
	</div>
	<TextAreaInput
		headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
		headingText="If there are other workshops that you would like to see run, please add
			the details here:"
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-secondary-200 sm:text-scale-5"
		nameText="other_community_workshop"
		textAreaClass="w-full resize-y sm:text-scale-5"
		bind:inputValue={communityExternalProfile.other_community_workshop}
	/>
	<TextAreaInput
		headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
		headingText="If you would like to help run any of the workshops, please indicate which
			ones below."
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-secondary-200 sm:text-scale-5"
		nameText="will_run_community_workshops"
		textAreaClass="w-full resize-y sm:text-scale-5"
		bind:inputValue={communityExternalProfile.will_run_community_workshops}
	/>
{/if}
