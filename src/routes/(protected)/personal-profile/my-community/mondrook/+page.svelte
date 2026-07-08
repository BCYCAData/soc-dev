<script lang="ts">
	import { enhance } from '$app/forms';
	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';
	import FormActions from '$components/form/FormActions.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';
	import FormWell from '$components/form/FormWell.svelte';
	import { setUpperCase } from '$lib/svelte-actions';
	import type { UserPostalAddress } from '$lib/form.types';
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

	let otherComments = $state(data.userProfile.community_mondrook_profile?.other_comments);
	let stayInTouchChoices = $state(
		data.userProfile.community_mondrook_profile?.stay_in_touch_choices
	);
	let userPostalAddress: UserPostalAddress = $state(data.userProfile?.user_postal_address);
	let hadUserPostalAddress = $state(data.hadUserPostalAddress);

	const stayInTouchOptions = data?.optionsData?.communityMondrookOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
	)?.options;

	function handleReset() {
		unsaved = false;
		// Reset form to initial state
		otherComments = data.userProfile.community_mondrook_profile?.other_comments;
		stayInTouchChoices = data.userProfile.community_mondrook_profile?.stay_in_touch_choices;
		userPostalAddress = data.userProfile?.user_postal_address;
		hadUserPostalAddress = data.hadUserPostalAddress;
	}
</script>

<svelte:head>
	<title>Profile-Community Mondrook</title>
</svelte:head>

<form
	id="profileMondrookCommunityForm"
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
	<h1 class="text-surface-600 mb-2 text-right text-2xl font-semibold">
		Stay In Touch With Your Mondrook Community
	</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />
	<h2 class="h2 text-surface-900 text-lg font-semibold">
		How would you prefer to stay in touch with the Mondrook Community team? <br /><span
			class="text-surface-500 ml-2 text-sm"
		>
			(Check all that apply)</span
		>
	</h2>
	<FormWell>
		{#if stayInTouchOptions}
			{#each stayInTouchOptions as { value, lable } (value)}
				<div class="flex items-center">
					<input
						class="ml-8 h-4 w-4"
						name="stay_in_touch_choices"
						type="checkbox"
						bind:group={stayInTouchChoices}
						value={Number(value)}
						checked={stayInTouchChoices?.includes(Number(value))}
					/>
					<label class="text-secondary-900 ml-2 text-base font-medium" for="stay_in_touch_choices"
						>{lable}</label
					>
				</div>
			{/each}
		{/if}
	</FormWell>

	<!-- Postal address -->
	<div class:hidden={!stayInTouchChoices?.includes(5)}>
		<div class="mx-2 flex flex-row">
			<div class="mx-2 flex basis-7/12 flex-col">
				<label class="text-surface-900 text-base font-semibold" for="postal_address_street">
					Postal Address
				</label>
				<input
					type="text"
					name="postal_address_street"
					class="border-secondary-700 bg-secondary-50 w-full rounded border py-1 sm:text-lg"
					placeholder="POSTAL ADDRESS"
					autocomplete="street-address"
					use:setUpperCase
					style="text-transform:uppercase sm:text-lg"
					value={userPostalAddress?.postal_address_street}
				/>
			</div>
			<div class="mx-2 flex basis-3/12 flex-col">
				<label class="text-surface-900 text-base font-semibold" for="postal_address_suburb">
					Suburb
				</label>
				<input
					type="text"
					name="postal_address_suburb"
					class="border-secondary-700 bg-secondary-50 w-full rounded border py-1 sm:text-lg"
					placeholder="SUBURB"
					autocomplete=""
					use:setUpperCase
					style="text-transform:uppercase sm:text-lg"
					value={userPostalAddress?.postal_address_suburb}
				/>
			</div>
			<div class="mx-2 flex basis-2/12 flex-col">
				<label class="text-surface-900 text-base font-semibold" for="postal_address_postcode">
					Postcode
				</label>
				<input
					type="text"
					name="postal_address_postcode"
					class="border-secondary-700 bg-secondary-50 w-full rounded border py-1 sm:text-lg"
					placeholder="Postcode"
					autocomplete=""
					value={userPostalAddress?.postal_address_postcode}
				/>
			</div>
		</div>
	</div>
	<TextAreaInput
		headingClass="h2 pt-2 text-lg font-semibold text-surface-900"
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
		type="hidden"
		name="community_mondrook_profile_id"
		value={data.communityProfiles?.community_mondrook_profile_id}
	/>
	<FormActions onReset={handleReset} isUnsaved={unsaved} {isSubmitting} />
</form>
