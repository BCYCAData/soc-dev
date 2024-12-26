<script lang="ts">
	import { setUpperCase } from '$lib/svelte-actions.js';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import type { UserPostalAddress } from '$lib/form.types.js';
	import FormActions from '$components/form/FormActions.svelte';

	import FormAlerts from '$components/form/FormAlerts.svelte';
	import type { ActionData, PageData } from './$types';

	type Props = {
		data: PageData;
		form: ActionData;
	};

	let { data = $bindable(), form }: Props = $props();
	let unsaved = $state(false);
	let formError = $state(form?.error || false);
	let formErrorMessage = $state(form?.errorMessage || '');
	let formSuccess = $state(form?.success || false);

	let otherComments = $state(data.userProfile?.community_bcyca_profile?.other_comments);
	let stayInTouchChoices = $state(data.userProfile?.community_bcyca_profile?.stay_in_touch_choices);
	let userPostalAddress: UserPostalAddress = $state(data.userProfile.user_postal_address);
	let hadUserPostalAddress = $state(data.hadUserPostalAddress);
	const stayInTouchOptions = data?.optionsData?.communityBCYCAOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
	)?.options;

	function handleReset() {
		if (confirm('Are you sure you want to undo? All unsaved changes will be lost.')) {
			unsaved = false;
			// Reset form to initial state
			otherComments = data.userProfile?.community_bcyca_profile?.other_comments;
			stayInTouchChoices = data.userProfile?.community_bcyca_profile?.stay_in_touch_choices;
			userPostalAddress = data.userProfile?.user_postal_address;
			hadUserPostalAddress = data.hadUserPostalAddress;
		}
	}
</script>

<svelte:head>
	<title>Profile-Community BCYCA</title>
</svelte:head>

<form
	id="profileBCYCACommunityForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
>
	<h1 class="mb-2 text-right text-2xl font-semibold text-gray-600">
		Stay In Touch With Your BCYCA Community
	</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

	<h2 class="h2 text-lg font-semibold text-gray-900">
		How would you prefer to stay in touch with the BCYCA team? <br /><span
			class="ml-2 text-sm text-gray-500"
		>
			(Check all that apply)</span
		>
	</h2>
	<div class="flex justify-start rounded-lg bg-orange-300 p-1">
		{#if stayInTouchOptions}
			{#each stayInTouchOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="ml-8 h-4 w-4"
						name="stay_in_touch_choices"
						type="checkbox"
						bind:group={stayInTouchChoices}
						value={Number(value)}
						checked={stayInTouchChoices?.includes(Number(value))}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="stay_in_touch_choices"
						>{lable}</label
					>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Postal address -->
	<div class:hidden={!stayInTouchChoices?.includes(5)}>
		<div class="mx-2 flex flex-row">
			<div class="mx-2 flex basis-7/12 flex-col">
				<label class="text-base font-semibold text-gray-900" for="postal_address_street">
					Postal Address
				</label>
				<input
					type="text"
					name="postal_address_street"
					class="w-full rounded border border-orange-700 bg-orange-50 py-1 sm:text-lg"
					placeholder="POSTAL ADDRESS"
					autocomplete="street-address"
					use:setUpperCase
					style="text-transform:uppercase sm:text-lg"
					value={userPostalAddress?.postal_address_street}
				/>
			</div>
			<div class="mx-2 flex basis-3/12 flex-col">
				<label class="text-base font-semibold text-gray-900" for="postal_address_suburb">
					Suburb
				</label>
				<input
					type="text"
					name="postal_address_suburb"
					class="w-full rounded border border-orange-700 bg-orange-50 py-1 sm:text-lg"
					placeholder="SUBURB"
					autocomplete=""
					use:setUpperCase
					style="text-transform:uppercase sm:text-lg"
					value={userPostalAddress?.postal_address_suburb}
				/>
			</div>
			<div class="mx-2 flex basis-2/12 flex-col">
				<label class="text-base font-semibold text-gray-900" for="postal_address_postcode">
					Postcode
				</label>
				<input
					type="text"
					name="postal_address_postcode"
					class="w-full rounded border border-orange-700 bg-orange-50 py-1 sm:text-lg"
					placeholder="Postcode"
					autocomplete=""
					value={userPostalAddress?.postal_address_postcode}
				/>
			</div>
		</div>
	</div>
	<TextAreaInput
		headingClass="h2 pt-2 text-lg font-semibold text-gray-900"
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
		name="community_bcyca_profile_id"
		value={data.communityProfiles.community_bcyca_profile_id}
		hidden
	/>
	<FormActions onReset={handleReset} isUnsaved={unsaved} />
</form>
