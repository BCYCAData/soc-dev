<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { getCommunityOptions, type CommunityRequestOption } from '$lib/profileOptions';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	import type { ModalSettings } from '@skeletonlabs/skeleton';

	let unsaved = false;

	const modalStore = getModalStore();

	beforeNavigate(async ({ cancel }) => {
		if (unsaved) {
			cancel();
			const modal: ModalSettings = {
				type: 'component',
				component: 'modalSaveProfilePrompt'
			};
			modalStore.trigger(modal);
		}
	});

	export let data;

	let communityWorkshopChoices: number[] | null;
	let otherCommunityWorkshop: string | null;
	let willRunCommunityWorkshops: string | null;
	let communityBCYCAProfileId: string | null;
	const communityWorkshopOptions = data.optionsData.communityBCYCAOptionsData?.object_names.find(
		(item) => item.object_name === 'communityWorkshopOptions'
	)?.options;
	if (data?.profileMyCommunityBCYCAWorkshopsFormData) {
		communityWorkshopChoices =
			data.profileMyCommunityBCYCAWorkshopsFormData.community_workshop_choices;
		otherCommunityWorkshop = data.profileMyCommunityBCYCAWorkshopsFormData.other_community_workshop;
		willRunCommunityWorkshops =
			data.profileMyCommunityBCYCAWorkshopsFormData.will_run_community_workshops;
		communityBCYCAProfileId = data.communityProfiles?.community_bcyca_profile_id || null;
	}
</script>

<svelte:head>
	<title>Profile-Community BCYCA-Workshops</title>
</svelte:head>

<form
	id="profileMyCommunityWorkshopsForm"
	on:change={() => {
		unsaved = true;
	}}
	class="flex flex-col py-1 mx-auto w-full"
	method="POST"
>
	<h2 class="unstyled text-base font-semibold text-gray-900">
		Which of these community initiated workshops would be useful to you?<span
			class="ml-2 text-sm text-gray-500"
		>
			(Check all that apply)</span
		>
	</h2>
	<div
		class="grid grid-flow-col gap-2 p-2 rounded-lg bg-orange-300 sm:grid-cols-2 sm:grid-rows-4 sm:gap-2"
	>
		{#if communityWorkshopOptions}
			{#each communityWorkshopOptions as { value, lable }}
				<div class="flex items-center col-span-1">
					<input
						class="w-4 h-4 ml-8"
						name="community_workshop_choices"
						type="checkbox"
						bind:group={communityWorkshopChoices}
						{value}
					/>
					<label
						class="ml-2 text-base font-medium text-orange-900 font-Poppins"
						for="community_workshop_choices">{lable}</label
					>
				</div>
			{/each}
		{/if}
	</div>
	<TextAreaInput
		headingClass="unstyled pt-2 text-base font-semibold text-gray-900"
		headingText="If there are other workshops that you would like to see run, please add
			the details here"
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_community_workshop"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={otherCommunityWorkshop}
	/>
	<TextAreaInput
		headingClass="unstyled pt-2 text-base font-semibold text-gray-900"
		headingText="If you would like to help run any of the workshops, please indicate which
			ones below."
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="will_run_community_workshops"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={willRunCommunityWorkshops}
	/>
	<input type="text" name="community_bcyca_profile_id" value={communityBCYCAProfileId} hidden />
	<div class="sticky mt-5 bottom-2">
		<div class="flex flex-row">
			<div class="w-1/2" />
			<button
				class="w-1/4 mx-3 mb-3 rounded-lg text-base font-semibold bg-[#0099E8] text-stone-100 border border-purple-700"
				on:click={() => {
					unsaved = false;
				}}
				hidden={!unsaved}
				type="submit"
				form="profileMyCommunityWorkshopsForm"
			>
				Save My Answers
			</button>
			<button
				class="w-1/4 mx-auto mb-3 rounded-lg text-base font-semibold bg-[#27C7BD] text-stone-100 border border-purple-700"
				on:click={() => {
					unsaved = false;
					location.reload();
				}}
				hidden={!unsaved}
				type="button"
			>
				Cancel
			</button>
		</div>
	</div>
</form>
