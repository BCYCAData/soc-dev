<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { stayInTouchOptions } from '$lib/profileOptions';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import type { UserPostalAddressData, UserProfileData } from '$lib/custom.types.js';
	import { setUpperCase } from '$lib/svelte-actions.js';

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
	let otherComments: string | null;
	let stayInTouchChoices: number[] | null;
	let userPostalAddress: UserPostalAddressData;
	let hadUserPostalAddress: boolean;
	let communityMondrookProfileId: string | null;
	if (data?.profileMyCommunityMondrookFormData) {
		stayInTouchChoices = data.profileMyCommunityMondrookFormData.stay_in_touch_choices;
		otherComments = data.profileMyCommunityMondrookFormData.other_comments;
		hadUserPostalAddress = data.profileMyCommunityMondrookFormData.hadUserPostalAddress;
		communityMondrookProfileId = data.communityProfiles.community_mondrook_profile_id;
	}
	if (data?.user_postal_address) {
		userPostalAddress = data.user_postal_address;
	}
</script>

<svelte:head>
	<title>Profile-Community Mondrook</title>
</svelte:head>

<form
	id="profileMyCommunityForm"
	on:change={() => {
		unsaved = true;
	}}
	class="flex flex-col py-1 mx-auto w-full"
	method="POST"
>
	<h2 class="unstyled text-base font-semibold text-gray-900">
		How would you prefer to stay in touch with the Mondrook Community team? <br /><span
			class="ml-2 text-sm text-gray-500"
		>
			(Check all that apply)</span
		>
	</h2>
	<div class="flex justify-start rounded-lg p-1 bg-orange-300">
		{#each stayInTouchOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="w-4 h-4 ml-8"
					name="stay_in_touch_choices"
					type="checkbox"
					bind:group={stayInTouchChoices}
					{value}
				/>
				<label
					class="ml-2 text-base font-medium text-orange-900 font-Poppins"
					for="stay_in_touch_choices">{lable}</label
				>
			</div>
		{/each}
	</div>

	<!-- Postal address -->
	<div class:hidden={!stayInTouchChoices?.includes(5)}>
		<div class="flex flex-row mx-2">
			<div class="flex flex-col basis-7/12 mx-2">
				<label class="text-base font-semibold text-gray-900" for="postal_address_street">
					Postal Address
				</label>
				<input
					type="text"
					name="postal_address_street"
					class="border w-full border-orange-700 rounded bg-orange-50 py-1 sm:text-lg"
					placeholder="POSTAL ADDRESS"
					autocomplete="street-address"
					use:setUpperCase
					style="text-transform:uppercase sm:text-lg"
					value={userPostalAddress?.postal_address_street}
				/>
			</div>
			<div class="flex flex-col basis-3/12 mx-2">
				<label class="text-base font-semibold text-gray-900" for="postal_address_suburb">
					Suburb
				</label>
				<input
					type="text"
					name="postal_address_suburb"
					class="border w-full border-orange-700 rounded bg-orange-50 py-1 sm:text-lg"
					placeholder="SUBURB"
					autocomplete=""
					use:setUpperCase
					style="text-transform:uppercase sm:text-lg"
					value={userPostalAddress?.postal_address_suburb}
				/>
			</div>
			<div class="flex flex-col basis-2/12 mx-2">
				<label class="text-base font-semibold text-gray-900" for="postal_address_postcode">
					Postcode
				</label>
				<input
					type="text"
					name="postal_address_postcode"
					class="border w-full border-orange-700 rounded bg-orange-50 py-1 sm:text-lg"
					placeholder="Postcode"
					autocomplete=""
					value={userPostalAddress?.postal_address_postcode}
				/>
			</div>
		</div>
	</div>
	<TextAreaInput
		headingClass="unstyled pt-2 text-base font-semibold text-gray-900"
		headingText="If you have any other comments, add them here."
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_comments"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={otherComments}
	/>
	<input type="text" name="had_user_postal_address" value={hadUserPostalAddress} hidden />
	<input
		type="text"
		name="community_mondrook_profile_id"
		value={communityMondrookProfileId}
		hidden
	/>
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
				form="profileMyCommunityForm"
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
