<script lang="ts">
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import type { ExternalCommunityProfile } from '$lib/form.types';

	interface Props {
		communityExternalProfile: ExternalCommunityProfile;
		communityExternalInformationOptions?: { value: string; lable: string }[];
	}

	let { communityExternalProfile, communityExternalInformationOptions = [] }: Props = $props();

	let formState = $state({
		information_sheet_choices: communityExternalProfile?.information_sheet_choices ?? [],
		other_information_sheet: communityExternalProfile?.other_information_sheet ?? ''
	});

	$effect(() => {
		if (communityExternalProfile) {
			communityExternalProfile.information_sheet_choices = formState.information_sheet_choices;
			communityExternalProfile.other_information_sheet = formState.other_information_sheet;
		}
	});
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	What External Community information would be useful to you?<span
		class="text-scale-3 ml-2 text-surface-500"
	>
		(Check all that apply)</span
	>
</h2>
{#if communityExternalProfile}
	<div
		class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
	>
		{#each communityExternalInformationOptions as { value, lable }}
			<div class="col-span-1 flex items-center">
				<input
					class="ml-8 h-6 w-6"
					name="information_sheet_choices"
					type="checkbox"
					bind:group={formState.information_sheet_choices}
					value={Number(value)}
					checked={formState.information_sheet_choices.includes(Number(value))}
				/>
				<label class="text-scale-6 ml-2 font-medium text-orange-900" for="information_sheet_choices"
					>{lable}</label
				>
			</div>
		{/each}
	</div>

	<TextAreaInput
		headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
		headingText="Is there other information which you would find useful?"
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-secondary-300 sm:text-scale-5"
		nameText="other_information_sheet"
		textAreaClass="w-full resize-y sm:text-scale-5"
		bind:inputValue={formState.other_information_sheet}
	/>
{/if}
