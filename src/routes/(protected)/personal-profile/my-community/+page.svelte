<script lang="ts">
	import { setUpperCase } from '$lib/svelte-actions.js';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import FormActions from '$components/form/FormActions.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';
	import FormWell from '$components/form/FormWell.svelte';

	import type { ActionData, PageData } from './$types';
	import type { UserPostalAddress } from '$lib/form.types';

	//TODO: Implement requestAccess()

	function requestAccess(id: string) {
		alert(`Requesting access to ${id}`);
	}

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

	let otherComments: string | null = $state(data.userProfile.other_comments);
	let stayInTouchChoices: number[] | null = $state(data.userProfile.stay_in_touch_choices);
	let userPostalAddress: UserPostalAddress | null = $state(data.userProfile.user_postal_address);
	let hadUserPostalAddress: boolean = $state(data.hadUserPostalAddress);
	let intergratedCommunity = $derived(
		data.userProfile?.property_profile[0]?.community_areas[0]?.community ?? 'Unknown'
	);

	const stayInTouchOptions =
		data.optionsData?.userOptionsData?.object_names?.find(
			(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
		)?.options || [];

	function handleReset() {
		if (confirm('Are you sure you want to undo? All unsaved changes will be lost.')) {
			unsaved = false;
			// Reset form to initial state
			otherComments = data.userProfile.other_comments;
			stayInTouchChoices = data.userProfile.stay_in_touch_choices;
			userPostalAddress = data.userProfile.user_postal_address;
			hadUserPostalAddress = data.hadUserPostalAddress;
		}
	}
</script>

<svelte:head>
	<title>Profile-Community</title>
</svelte:head>

<form
	id="profileMyCommunityForm"
	onchange={() => {
		unsaved = true;
	}}
	class="mx-auto w-full max-w-5xl space-y-2 py-2"
	method="POST"
>
	<h1 class="text-surface-600 mb-2 text-right text-2xl font-semibold">Your Community Profile</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

	<h2 class="h2 text-surface-900 pt-2 text-lg font-semibold">
		How would you prefer to stay in touch with the <span class="text-secondary-600"
			>Strengthen OUR Community</span
		>
		project team? <br /> <span class="text-surface-500 ml-2 text-sm"> (Check all that apply)</span>
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
		headingClass="h2 mb-1 text-lg font-semibold text-surface-950"
		headingText="If you have any other comments, add them here."
		lableClass={null}
		lableText={null}
		divClass="px-4 pt-2 rounded-lg sm:text-lg"
		nameText="other_comments"
		textAreaClass="w-full resize-y sm:text-lg"
		bind:inputValue={otherComments}
	/>
	<input type="text" name="had_user_postal_address" value={hadUserPostalAddress} hidden />
	<FormActions onReset={handleReset} isUnsaved={unsaved} {isSubmitting} />
</form>
<!-- <pre>Community: {JSON.stringify(data.userProfile, null, 2)}</pre> -->
<h2 class="h2 text-surface-900 pt-2 text-center text-base font-semibold">
	We have determined that you are part of the <span class="text-secondary-600">
		{intergratedCommunity}
	</span>
	Community based on your address.
	<br />
	{#if data.communityProfiles}
		{#each ['bcyca', 'mondrook', 'tinonee', 'external'] as connectedCommunity (connectedCommunity)}
			{#if data.communityProfiles[`community_${connectedCommunity}_profile_id`] !== null && connectedCommunity !== intergratedCommunity.toLowerCase()}
				You have also connected with the {connectedCommunity.toUpperCase()} community.
			{/if}
		{/each}
	{/if}
	<br />
	<br />
	If you would like to connect with another community team please click on the buttons below.
</h2>

{#if data.communityProfiles}
	<div class="pill-container mt-4 flex h-12 flex-row items-center justify-center">
		<div class="button-bar">
			<button
				id="bcyca-button"
				onclick={() => requestAccess('bcyca')}
				disabled={data.communityProfiles.community_bcyca_profile_id !== null}
				class="bg-secondary-500 text-surface-100 disabled:bg-secondary-100 disabled:text-surface-400 m-2 inline-block h-12 w-32 cursor-pointer rounded-lg border-0 px-4 py-2 shadow-md transition duration-300 disabled:cursor-not-allowed"
			>
				BCYCA
			</button>
			<button
				id="external-button"
				onclick={() => requestAccess('external')}
				disabled={data.communityProfiles.community_external_profile_id !== null}
				class="bg-secondary-500 text-surface-100 disabled:bg-secondary-100 disabled:text-surface-400 m-2 inline-block h-12 w-32 cursor-pointer rounded-lg border-0 px-4 py-2 shadow-md transition duration-300 disabled:cursor-not-allowed"
			>
				External
			</button>
			<button
				id="mondrook-button"
				onclick={() => requestAccess('mondrook')}
				disabled={data.communityProfiles.community_mondrook_profile_id !== null}
				class="bg-secondary-500 text-surface-100 disabled:bg-secondary-100 disabled:text-surface-400 m-2 inline-block h-12 w-32 cursor-pointer rounded-lg border-0 px-4 py-2 shadow-md transition duration-300 disabled:cursor-not-allowed"
			>
				Mondrook
			</button>
			<button
				id="tinonee-button"
				onclick={() => requestAccess('tinonee')}
				disabled={data.communityProfiles.community_tinonee_profile_id !== null}
				class="bg-secondary-500 text-surface-100 disabled:bg-secondary-100 disabled:text-surface-400 m-2 inline-block h-12 w-32 cursor-pointer rounded-lg border-0 px-4 py-2 shadow-md transition duration-300 disabled:cursor-not-allowed"
			>
				Tinonee
			</button>
		</div>
	</div>
{/if}

<style>
	.pill-container {
		text-align: center;
	}

	.button-bar {
		display: flex;
		justify-content: center; /* Horizontally center-align */
		text-align: right;
		padding: 0 5px;
	}

	.button-bar button {
		line-height: 1.2; /* Adjust line height as needed */
		text-align: center;
		overflow: hidden;
		white-space: normal; /* Allow text to wrap */
		word-wrap: break-word; /* Break long words */
	}

	button:hover {
		background-color: var(--color-tertiary-300);
	}
	button:disabled {
		background-color: var(--color-secondary-300);
		color: var(--color-secondary-900);
		border-width: 2px;
		border-color: var(--color-surface-50);
	}

	/* .selector-checkbox:not(:disabled):checked + .button-bar button,
	.selector-checkbox:not(:disabled):not(:checked) + .button-bar button {
		background-color: var(--color-error-500); 
	}

	.selector-checkbox:not(:disabled):checked + .button-bar button {
		background-color: var(--color-secondary-300);
	} */
</style>
