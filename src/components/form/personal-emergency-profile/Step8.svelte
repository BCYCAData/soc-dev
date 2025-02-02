<script lang="ts">
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import type { BCYCACommunityProfile } from '$lib/form.types';

	interface Props {
		communityBCYCAProfile: BCYCACommunityProfile;
		communityBCYCAWorkshopOptions?: { value: string; lable: string }[];
	}

	let { communityBCYCAProfile, communityBCYCAWorkshopOptions = [] }: Props = $props();

	let formState = $state({
		community_workshop_choices: communityBCYCAProfile?.community_workshop_choices ?? [],
		other_community_workshop: communityBCYCAProfile?.other_community_workshop ?? '',
		will_run_community_workshops: communityBCYCAProfile?.will_run_community_workshops ?? ''
	});

	$effect(() => {
		if (communityBCYCAProfile) {
			communityBCYCAProfile.community_workshop_choices = formState.community_workshop_choices;
			communityBCYCAProfile.other_community_workshop = formState.other_community_workshop;
			communityBCYCAProfile.will_run_community_workshops = formState.will_run_community_workshops;
		}
	});
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Which of these BCYCA Community initiated workshops would be useful to you?<span
		class="text-scale-3 text-surface-700"
	>
		(Check all that apply)</span
	>
</h2>
{#if communityBCYCAProfile}
	<div
		class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-3 sm:gap-2"
	>
		{#each communityBCYCAWorkshopOptions as { value, lable }}
			<div class="col-span-1 flex items-center">
				<input
					class="ml-8 h-6 w-6"
					name="community_workshop_choices"
					type="checkbox"
					bind:group={formState.community_workshop_choices}
					value={Number(value)}
					checked={formState.community_workshop_choices.includes(Number(value))}
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
		headingText="If there are other workshops that you would like to see run, please add the details here:"
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-secondary-200 sm:text-scale-5"
		nameText="other_community_workshop"
		textAreaClass="w-full resize-y sm:text-scale-5"
		bind:inputValue={formState.other_community_workshop}
	/>

	<TextAreaInput
		headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
		headingText="If you would like to help run any of the workshops, please indicate which ones below."
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-secondary-200 sm:text-scale-5"
		nameText="will_run_community_workshops"
		textAreaClass="w-full resize-y sm:text-scale-5"
		bind:inputValue={formState.will_run_community_workshops}
	/>
{/if}
