<script lang="ts">
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

	let communityWorkshopChoices = $state(
		data.userProfile.community_external_profile?.community_workshop_choices
	);
	let otherCommunityWorkshop = $state(
		data.userProfile.community_external_profile?.other_community_workshop
	);
	let willRunCommunityWorkshops = $state(
		data.userProfile.community_external_profile?.will_run_community_workshops
	);

	const communityWorkshopOptions =
		data?.optionsData?.communityExternalOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityWorkshopOptions'
		)?.options;

	function handleReset() {
		if (confirm('Are you sure you want to undo? All unsaved changes will be lost.')) {
			unsaved = false;
			// Reset form to initial state
			communityWorkshopChoices =
				data.userProfile.community_external_profile?.community_workshop_choices;
			otherCommunityWorkshop =
				data.userProfile.community_external_profile?.other_community_workshop;
			willRunCommunityWorkshops =
				data.userProfile.community_external_profile?.will_run_community_workshops;
		}
	}
</script>

<svelte:head>
	<title>Profile-Community External-Workshops</title>
</svelte:head>

<form
	id="profileMyCommunityWorkshopsForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
>
	<h1 class="text-surface-600 mb-2 text-right text-2xl font-semibold">Community Workshops</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />
	<h2 class="h2 text-surface-900 text-lg font-semibold">
		Which of these community initiated workshops would be useful to you?<span
			class="text-surface-500 ml-2 text-sm"
		>
			(Check all that apply)</span
		>
	</h2>
	<FormWell layout="grid-2">
		{#if communityWorkshopOptions}
			{#each communityWorkshopOptions as { value, lable } (value)}
				<div class="col-span-1 flex items-center">
					<input
						class="ml-8 h-4 w-4"
						name="community_workshop_choices"
						type="checkbox"
						bind:group={communityWorkshopChoices}
						value={Number(value)}
						checked={communityWorkshopChoices?.includes(Number(value))}
					/>
					<label
						class="text-secondary-900 ml-2 text-base font-medium"
						for="community_workshop_choices">{lable}</label
					>
				</div>
			{/each}
		{/if}
	</FormWell>
	<TextAreaInput
		headingClass="h2 pt-2 text-lg font-semibold text-surface-900"
		headingText="If there are other workshops that you would like to see run, please add the details here"
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_community_workshop"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={otherCommunityWorkshop}
	/>
	<TextAreaInput
		headingClass="h2 pt-2 text-lg font-semibold text-surface-900"
		headingText="If you would like to help run any of the workshops, please indicate which ones below."
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="will_run_community_workshops"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={willRunCommunityWorkshops}
	/>
	<input
		type="hidden"
		name="community_external_profile_id"
		value={data.communityProfiles?.community_external_profile_id}
	/>
	<FormActions onReset={handleReset} isUnsaved={unsaved} {isSubmitting} />
</form>
