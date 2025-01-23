<script lang="ts">
	import { setUpperCase } from '$lib/svelte-actions.js';

	import TextAreaInput from '$components/form/inputs/TextAreaInput.svelte';

	import FormActions from '$components/form/FormActions.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';

	import type { ActionData, PageData } from './$types';
	import type { UserPostalAddress } from '$lib/form.types';

	function requestAccess(id: string) {
		alert(`Requesting access to ${id}`);
	}

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data = $bindable(), form }: Props = $props();

	let unsaved = $state(false);
	let formError = $state(form?.error || false);
	let formErrorMessage = $state(form?.errorMessage || '');
	let formSuccess = $state(form?.success || false);

	let otherComments: string | null = $state(data.userProfile.other_comments);
	let stayInTouchChoices: number[] | null = $state(data.userProfile.stay_in_touch_choices);
	let userPostalAddress: UserPostalAddress | null = $state(data.userProfile.user_postal_address);
	let hadUserPostalAddress: boolean = $state(data.hadUserPostalAddress);

	const stayInTouchOptions =
		data.optionsData?.userOptionsData?.object_names.find(
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
	<h1 class="mb-2 text-right text-2xl font-semibold text-gray-600">Your Community Profile</h1>

	<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

	<h2 class="h2 pt-2 text-lg font-semibold text-gray-900">
		How would you prefer to stay in touch with the <span class="text-orange-600"
			>Strengthen OUR Community</span
		>
		project team? <br /> <span class="ml-2 text-sm text-gray-500"> (Check all that apply)</span>
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
	<FormActions onReset={handleReset} isUnsaved={unsaved} />
</form>
<h2 class="h2 pt-2 text-center text-base font-semibold text-gray-900">
	We have determined that you are part of the <span class="text-orange-600"
		>{data.userProfile?.property_profile.type === 'single'
			? data.userProfile.property_profile.profile.community_area
			: data.userProfile.property_profile.profiles[0].community_area} Community</span
	>
	based on your address.
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
				class="m-2 inline-block h-12 w-32 cursor-pointer rounded-lg border-0 bg-orange-500 px-4 py-2 text-stone-100 shadow-md transition duration-300 disabled:cursor-not-allowed disabled:bg-orange-100 disabled:text-stone-400"
			>
				BCYCA
			</button>
			<button
				id="external-button"
				onclick={() => requestAccess('external')}
				disabled={data.communityProfiles.community_external_profile_id !== null}
				class="m-2 inline-block h-12 w-32 cursor-pointer rounded-lg border-0 bg-orange-500 px-4 py-2 text-stone-100 shadow-md transition duration-300 disabled:cursor-not-allowed disabled:bg-orange-100 disabled:text-stone-400"
			>
				External
			</button>
			<button
				id="mondrook-button"
				onclick={() => requestAccess('mondrook')}
				disabled={data.communityProfiles.community_mondrook_profile_id !== null}
				class="m-2 inline-block h-12 w-32 cursor-pointer rounded-lg border-0 bg-orange-500 px-4 py-2 text-stone-100 shadow-md transition duration-300 disabled:cursor-not-allowed disabled:bg-orange-100 disabled:text-stone-400"
			>
				Mondrook
			</button>
			<button
				id="tinonee-button"
				onclick={() => requestAccess('tinonee')}
				disabled={data.communityProfiles.community_tinonee_profile_id !== null}
				class="m-2 inline-block h-12 w-32 cursor-pointer rounded-lg border-0 bg-orange-500 px-4 py-2 text-stone-100 shadow-md transition duration-300 disabled:cursor-not-allowed disabled:bg-orange-100 disabled:text-stone-400"
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
		background-color: #38bdf8;
	}
	button:disabled {
		background-color: #fdba74;
		color: #7c2d12;
		border-width: 2px;
		border-color: #fafaf9;
	}

	/* .selector-checkbox:not(:disabled):checked + .button-bar button,
	.selector-checkbox:not(:disabled):not(:checked) + .button-bar button {
		background-color: #fd310f; 
	}

	.selector-checkbox:not(:disabled):checked + .button-bar button {
		background-color: #fdba74;
	} */
</style>
