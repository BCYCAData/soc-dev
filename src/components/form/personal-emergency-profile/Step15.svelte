<script lang="ts">
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { MondrookCommunityProfile } from '$lib/form.types';

	type Props = {
		communityMondrookProfile: MondrookCommunityProfile;
		communityMondrookInformationOptions?: { value: string; lable: string }[];
	};

	let { communityMondrookProfile = $bindable(), communityMondrookInformationOptions = [] }: Props =
		$props();
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	What Mondrook Community information would be useful to you?<span
		class="text-scale-3 ml-2 text-surface-500"
	>
		(Check all that apply)</span
	>
</h2>
{#if communityMondrookProfile}
	<div
		class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
	>
		{#each communityMondrookInformationOptions as { value, lable }}
			<div class="col-span-1 flex items-center">
				<input
					class="ml-8 h-6 w-6"
					name="information_sheet_choices"
					type="checkbox"
					bind:group={communityMondrookProfile.information_sheet_choices}
					value={Number(value)}
					checked={communityMondrookProfile?.information_sheet_choices?.includes(Number(value))}
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
		bind:inputValue={communityMondrookProfile.other_information_sheet}
	/>
{/if}
