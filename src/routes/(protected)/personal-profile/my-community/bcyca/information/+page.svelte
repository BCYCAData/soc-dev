<script lang="ts">
	import FormActions from '$components/form/FormActions.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';
	import FormWell from '$components/form/FormWell.svelte';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
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

	let informationSheetChoices = $state(
		data.userProfile?.community_bcyca_profile?.information_sheet_choices
	);

	let otherInformationSheet = $state(
		data.userProfile?.community_bcyca_profile?.other_information_sheet
	);

	const informationSheetOptions = data?.optionsData?.communityBCYCAOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'informationSheetOptions'
	)?.options;

	function handleReset() {
		if (confirm('Are you sure you want to undo? All unsaved changes will be lost.')) {
			unsaved = false;
			// Reset form to initial state
			informationSheetChoices =
				data?.userProfile?.community_bcyca_profile?.information_sheet_choices || [];
			otherInformationSheet =
				data?.userProfile?.community_bcyca_profile?.other_information_sheet || '';
		}
	}
</script>

<svelte:head>
	<title>Profile-Community BCYCA-Information</title>
</svelte:head>

<form
	id="profileMyCommunityInformationForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
>
	<h1 class="text-surface-600 mb-2 text-right text-2xl font-semibold">
		Community Information Resources
	</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

	<h2 class="h2 text-surface-900 text-lg font-semibold">
		What information would be useful to you?<span class="text-surface-500 ml-2 text-sm">
			(Check all that apply)</span
		>
	</h2>
	<FormWell layout="grid-2">
		{#if informationSheetOptions}
			{#each informationSheetOptions as { value, lable } (value)}
				<div class="flex items-center space-x-1">
					<input
						class="ml-8 h-4 w-4"
						name="information_sheet_choices"
						type="checkbox"
						bind:group={informationSheetChoices}
						value={Number(value)}
						checked={informationSheetChoices?.includes(Number(value))}
					/>
					<label
						class="text-base leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						for={`option-${value}`}>{lable}</label
					>
				</div>
			{/each}
		{/if}
	</FormWell>

	<TextAreaInput
		headingClass="h2 text-lg font-semibold text-surface-900"
		headingText="Is there other information which you would find useful?"
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_information_sheet"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={otherInformationSheet}
	/>
	<input
		type="hidden"
		name="community_bcyca_profile_id"
		value={data.communityProfiles.community_bcyca_profile_id}
	/>
	<FormActions onReset={handleReset} isUnsaved={unsaved} {isSubmitting} />
</form>
