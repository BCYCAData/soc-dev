<script lang="ts">
	import { enhance } from '$app/forms';
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import FormActions from '$components/form/FormActions.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';
	import FormWell from '$components/form/FormWell.svelte';

	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data = $bindable(), form }: Props = $props();
	let unsaved = $state(false);
	let isSubmitting = $state(false);
	let formError = $derived(form?.error || false);
	let formErrorMessage = $derived(form?.errorMessage || '');
	let formSuccess = $derived(form?.success || false);

	let communityMeetingChoices = $state(
		data.userProfile?.community_bcyca_profile?.community_meeting_choices
	);
	let otherCommunityMeeting = $state(
		data.userProfile?.community_bcyca_profile?.other_community_meeting
	);
	const communityMeetingOptions = data?.optionsData?.communityBCYCAOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'communityMeetingOptions'
	)?.options;

	function handleReset() {
		unsaved = false;
		// Reset form to initial state
		communityMeetingChoices = data?.userProfile?.community_bcyca_profile?.community_meeting_choices;
		otherCommunityMeeting = data?.userProfile?.community_bcyca_profile?.other_community_meeting;
	}
</script>

<svelte:head>
	<title>Profile-Community BCYCA-Events</title>
</svelte:head>

<form
	id="profileMyCommunityEventsForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ update, result }) => {
			await update({ reset: false });
			isSubmitting = false;
			if (result.type === 'success' && result.data?.success !== false) {
				unsaved = false;
			}
		};
	}}
>
	<h1 class="text-surface-600 mb-2 text-right text-2xl font-semibold">Community Events</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

	<h2 class="h2 text-surface-900 text-lg font-semibold">
		What Community Events are you interested in?<span class="text-surface-500 ml-2 text-sm">
			(Check all that apply)</span
		>
	</h2>
	<FormWell layout="grid-2">
		{#if communityMeetingOptions}
			{#each communityMeetingOptions as { value, lable } (value)}
				<div class="col-span-1 flex items-center">
					<input
						class="ml-8 h-4 w-4"
						name="community_meeting_choices"
						type="checkbox"
						bind:group={communityMeetingChoices}
						value={Number(value)}
						checked={communityMeetingChoices?.includes(Number(value))}
					/>
					<label
						class="text-secondary-900 ml-2 text-base font-medium"
						for="community_meeting_choices">{lable}</label
					>
				</div>
			{/each}
		{/if}
	</FormWell>
	<TextAreaInput
		headingClass="h2 pt-2 text-lg font-semibold text-surface-900"
		headingText="If there are other events you would be interested in, please add them below."
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_community_meeting"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={otherCommunityMeeting}
	/>
	<input
		type="hidden"
		name="community_bcyca_profile_id"
		value={data.communityProfiles.community_bcyca_profile_id}
	/>
	<FormActions onReset={handleReset} isUnsaved={unsaved} {isSubmitting} />
</form>
