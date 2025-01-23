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

	let informationSheetChoices = $state(
		data.userProfile.community_mondrook_profile?.information_sheet_choices
	);
	let otherInformationSheet = $state(
		data.userProfile.community_mondrook_profile?.other_information_sheet
	);

	const informationSheetOptions =
		data?.optionsData?.communityMondrookOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'informationSheetOptions'
		)?.options;

	function handleReset() {
		if (confirm('Are you sure you want to undo? All unsaved changes will be lost.')) {
			unsaved = false;
			// Reset form to initial state
			informationSheetChoices =
				data.userProfile.community_mondrook_profile?.information_sheet_choices;
			otherInformationSheet = data.userProfile.community_mondrook_profile?.other_information_sheet;
		}
	}
</script>

<svelte:head>
	<title>Profile-Community Mondrook-Information</title>
</svelte:head>

<form
	id="profileMyCommunityInformationForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
>
	<h1 class="mb-2 text-right text-2xl font-semibold text-gray-600">
		Community Information Resources
	</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

	<h2 class="h2 text-lg font-semibold text-gray-900">
		What information would be useful to you?<span class="ml-2 text-sm text-gray-500">
			(Check all that apply)</span
		>
	</h2>
	<div
		class="grid grid-flow-col gap-2 rounded-lg bg-orange-300 p-2 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
	>
		{#if informationSheetOptions}
			{#each informationSheetOptions as { value, lable }}
				<div class="col-span-1 flex items-center">
					<input
						class="ml-8 h-4 w-4"
						name="information_sheet_choices"
						type="checkbox"
						bind:group={informationSheetChoices}
						value={Number(value)}
						checked={informationSheetChoices?.includes(Number(value))}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="information_sheet_choices"
						>{lable}</label
					>
				</div>
			{/each}
		{/if}
	</div>

	<!-- other_information_sheet -->
	<TextAreaInput
		headingClass="h2 pt-2 text-lg font-semibold text-gray-900"
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
		name="community_mondrook_profile_id"
		value={data.communityProfiles?.community_mondrook_profile_id}
	/>
	<FormActions onReset={handleReset} isUnsaved={unsaved} />
</form>
