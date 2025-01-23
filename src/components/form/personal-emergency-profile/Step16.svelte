<script lang="ts">
	import TextAreaInput from '../inputs/TextAreaInput.svelte';

	import type { MondrookCommunityProfile } from '$lib/form.types';

	interface Props {
		communityMondrookProfile: MondrookCommunityProfile;
		communityMondrookMeetingOptions?: { value: string; lable: string }[];
	}

	let { communityMondrookProfile = $bindable(), communityMondrookMeetingOptions = [] }: Props =
		$props();
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	What Mondrook Community Events are you interested in?<span
		class="text-scale-3 ml-2 text-surface-500"
	>
		(Check all that apply)</span
	>
</h2>
{#if communityMondrookProfile}
	<div
		class="grid grid-flow-col gap-2 rounded-lg bg-secondary-200 p-2 sm:grid-cols-2 sm:grid-rows-6 sm:gap-2"
	>
		{#each communityMondrookMeetingOptions as { value, lable }}
			<div class="col-span-1 flex items-center">
				<input
					class="ml-8 h-6 w-6"
					name="community_meeting_choices"
					type="checkbox"
					bind:group={communityMondrookProfile.community_meeting_choices}
					value={Number(value)}
					checked={communityMondrookProfile?.community_meeting_choices?.includes(Number(value))}
				/>
				<label class="text-scale-6 ml-2 font-medium text-orange-900" for="community_meeting_choices"
					>{lable}</label
				>
			</div>
		{/each}
	</div>
	<TextAreaInput
		headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
		headingText="If there are other events you would be interested in, please add them below."
		lableClass={null}
		lableText={null}
		divClass="p-2 rounded-lg bg-secondary-200 sm:text-scale-5"
		nameText="other_community_meeting"
		textAreaClass="w-full resize-y sm:text-scale-5"
		bind:inputValue={communityMondrookProfile.other_community_meeting}
	/>
{/if}
