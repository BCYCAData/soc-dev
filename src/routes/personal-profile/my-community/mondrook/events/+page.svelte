<script lang="ts">
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import FormActions from '$components/form/FormActions.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data = $bindable(), form }: Props = $props();
	let unsaved = $state(false);
	let formError = $state(form?.error || false);
	let formErrorMessage = $state(form?.errorMessage || '');
	let formSuccess = $state(form?.success || false);

	let communityMeetingChoices = $state(
		data.userProfile.community_mondrook_profile?.community_meeting_choices
	);
	let otherCommunityMeeting = $state(
		data.userProfile.community_mondrook_profile?.other_community_meeting
	);

	const communityMeetingOptions =
		data?.optionsData?.communityMondrookOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityMeetingOptions'
		)?.options;

	function handleReset() {
		if (confirm('Are you sure you want to undo? All unsaved changes will be lost.')) {
			unsaved = false;
			// Reset form to initial state
			communityMeetingChoices =
				data.userProfile.community_mondrook_profile?.community_meeting_choices;
			otherCommunityMeeting = data.userProfile.community_mondrook_profile?.other_community_meeting;
		}
	}
</script>

<svelte:head>
	<title>Profile-Community Mondrook-Events</title>
</svelte:head>

<form
	id="profileMyCommunityEventsForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
>
	<h1 class="mb-2 text-right text-2xl font-semibold text-gray-600">Community Events</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />
	<h2 class="h2 text-lg font-semibold text-gray-900">
		What Community Events are you interested in?<span class="ml-2 text-sm text-gray-500">
			(Check all that apply)</span
		>
	</h2>
	<div
		class="grid grid-flow-col gap-2 rounded-lg bg-orange-300 p-2 sm:grid-cols-2 sm:grid-rows-6 sm:gap-2"
	>
		{#if communityMeetingOptions}
			{#each communityMeetingOptions as { value, lable }}
				<div class="col-span-1 flex items-center">
					<input
						class="ml-8 h-4 w-4"
						name="community_meeting_choices"
						type="checkbox"
						bind:group={communityMeetingChoices}
						value={Number(value)}
						checked={communityMeetingChoices?.includes(Number(value))}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="community_meeting_choices"
						>{lable}</label
					>
				</div>
			{/each}
		{/if}
	</div>
	<TextAreaInput
		headingClass="h2 pt-2 text-lg font-semibold text-gray-900"
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
		name="community_mondrook_profile_id"
		value={data.communityProfiles?.community_mondrook_profile_id}
	/>
	<FormActions onReset={handleReset} isUnsaved={unsaved} />
</form>
