<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { stayInTouchOptions } from '$lib/profileOptions';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import SaveProfilePrompt from '$components/form/SaveProfilePrompt.svelte';

	import type { PageData } from './$types';
	import { type ModalSettings, type ModalComponent, modalStore } from '@skeletonlabs/skeleton';

	let unsaved = false;

	beforeNavigate(async ({ cancel }) => {
		if (unsaved) {
			cancel();
			triggerCustomModal();
		}
	});

	function setUpperCase(e: Event) {
		(e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase();
	}

	function triggerCustomModal(): void {
		const modalComponent: ModalComponent = {
			ref: SaveProfilePrompt
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
			modalClasses: '!overflow-y-auto !max-h-full !relative'
		};
		modalStore.trigger(d);
	}
	export let data: PageData;
	$: ({ userPostalAddressData, userProfileData } = data);
</script>

<svelte:head>
	<title>Profile-Community</title>
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
		How would you prefer to stay in touch?<span class="ml-2 text-sm text-gray-500">
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
					bind:group={userProfileData.stay_in_touch_choices}
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
	<div class:hidden={!userProfileData.stay_in_touch_choices?.includes(5)}>
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
					on:input={setUpperCase}
					style="text-transform:uppercase sm:text-lg"
					bind:value={userPostalAddressData.postal_address_street}
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
					on:input={setUpperCase}
					style="text-transform:uppercase sm:text-lg"
					bind:value={userPostalAddressData.postal_address_suburb}
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
					bind:value={userPostalAddressData.postal_address_postcode}
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
		bind:inputValue={userProfileData.other_comments}
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
