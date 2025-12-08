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

	let communityWorkshopChoices = $state(
		data.userProfile?.community_tinonee_profile?.community_workshop_choices
	);
	let otherCommunityWorkshop = $state(
		data.userProfile?.community_tinonee_profile?.other_community_workshop
	);
	let willRunCommunityWorkshops = $state(
		data.userProfile?.community_tinonee_profile?.will_run_community_workshops
	);

	const communityWorkshopOptions = $derived(
		data?.optionsData?.communityTinoneeOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityWorkshopOptions'
		)?.options
	);

	function handleReset() {
		if (confirm('Are you sure you want to undo? All unsaved changes will be lost.')) {
			unsaved = false;
			// Reset form to initial state
			communityWorkshopChoices =
				data.userProfile?.community_tinonee_profile?.community_workshop_choices;
			otherCommunityWorkshop =
				data.userProfile?.community_tinonee_profile?.other_community_workshop;
			willRunCommunityWorkshops =
				data.userProfile?.community_tinonee_profile?.will_run_community_workshops;
		}
	}
</script>

<svelte:head>
	<title>Profile-Community Tinonee-Workshops</title>
</svelte:head>

<form
	id="profileMyCommunityWorkshopsForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
>
	<h1 class="mb-2 text-right text-2xl font-semibold text-gray-600">Community Workshops</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />
	<h2 class="h2 text-lg font-semibold text-gray-900">
		Which of these community initiated workshops would be useful to you?<span
			class="ml-2 text-sm text-gray-500"
		>
			(Check all that apply)</span
		>
	</h2>
	<div
		class="grid grid-flow-col gap-2 rounded-lg bg-orange-300 p-2 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
	>
		{#if communityWorkshopOptions}
			{#each communityWorkshopOptions as { value, lable }}
				<div class="col-span-1 flex items-center">
					<input
						class="ml-8 h-4 w-4"
						name="community_workshop_choices"
						type="checkbox"
						bind:group={communityWorkshopChoices}
						value={Number(value)}
						checked={communityWorkshopChoices?.includes(Number(value))}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="community_workshop_choices"
						>{lable}</label
					>
				</div>
			{/each}
		{/if}
	</div>
	<TextAreaInput
		headingClass="h2 pt-2 text-lg font-semibold text-gray-900"
		headingText="If there are other workshops that you would like to see run, please add the details here"
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_community_workshop"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={otherCommunityWorkshop}
	/>
	<TextAreaInput
		headingClass="h2 pt-2 text-lg font-semibold text-gray-900"
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
		name="community_tinonee_profile_id"
		value={data.communityProfiles?.community_tinonee_profile_id}
	/>
	<FormActions onReset={handleReset} isUnsaved={unsaved} />
</form>
