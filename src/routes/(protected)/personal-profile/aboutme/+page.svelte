<script lang="ts">
	import {
		residencyOptions,
		yesNoOptions,
		yesNoSendOptions,
		fireFightingExperienceOptions,
		stayGoOptions
	} from '$lib/profile-options';

	import FormActions from '$components/form/FormActions.svelte';
	import FormAlerts from '$components/form/FormAlerts.svelte';

	import { formatMobile } from '$lib/utility';
	import { setTitleCase } from '$lib/svelte-actions.js';

	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data = $bindable(), form }: Props = $props();

	let unsaved = $state(false);
	let formError = $derived(form?.success === false);
	let formErrorMessage = $derived(form?.message || '');
	let formSuccess = $derived(form?.success || false);
	let isSubmitting = $state(false);

	let family_name = $state(data.userProfile.family_name);
	//@ts-ignore
	let fire_fighting_experience = $state(data.userProfile.fire_fighting_experience);
	//@ts-ignore
	let fire_trauma = $state(data.userProfile.fire_trauma);
	let first_name = $state(data.userProfile.first_name);
	let mobile = $state(data.userProfile.mobile);
	//@ts-ignore
	let plan_to_leave_before_fire = $state(data.userProfile.plan_to_leave_before_fire);
	//@ts-ignore
	let plan_to_leave_before_flood = $state(data.userProfile.plan_to_leave_before_flood);
	//@ts-ignore
	let residency_profile = $state(data.userProfile.residency_profile);
	//@ts-ignore
	let rfs_survival_plan = $state(data.userProfile.rfs_survival_plan);

	function handleReset() {
		if (confirm('Are you sure you want to undo? All unsaved changes will be lost.')) {
			unsaved = false;
			// Reset form to initial state
			family_name = data.userProfile.family_name;
			fire_fighting_experience = data.userProfile.fire_fighting_experience;
			fire_trauma = data.userProfile.fire_trauma;
			first_name = data.userProfile.first_name;
			mobile = data.userProfile.mobile;
			plan_to_leave_before_fire = data.userProfile.plan_to_leave_before_fire;
			plan_to_leave_before_flood = data.userProfile.plan_to_leave_before_flood;
			residency_profile = data.userProfile.residency_profile;
			rfs_survival_plan = data.userProfile.rfs_survival_plan;
		}
	}
</script>

<svelte:head>
	<title>Profile-About Me</title>
</svelte:head>

<section class="mx-auto pr-5">
	<form
		id="profileAboutMeForm"
		onchange={() => {
			unsaved = true;
		}}
		class="mx-auto w-full max-w-5xl space-y-2 py-2"
		method="POST"
	>
		<h1 class="mb-2 text-right text-2xl font-semibold text-gray-600">About Me</h1>

		<FormAlerts {unsaved} {formError} {formSuccess} errorMessage={formErrorMessage} />

		<h2 class="h2 text-lg font-semibold text-gray-900">What is your name?</h2>
		<div class="grid gap-2 rounded-lg bg-orange-300 p-1 sm:grid-cols-2 sm:gap-2">
			<input
				type="text"
				id="first_name"
				name="first_name"
				class="focus:border-primary-600 focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-base text-gray-900"
				autocomplete="given-name"
				style="text-transform:capitalize"
				placeholder="First Name "
				use:setTitleCase
				bind:value={first_name}
			/>
			<input
				type="text"
				id="family_name"
				name="family_name"
				autocomplete="off"
				class="focus:border-primary-600 focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-base text-gray-900"
				style="text-transform:capitalize"
				placeholder="Family Name"
				use:setTitleCase
				bind:value={family_name}
			/>
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">Are you:</h2>
		<div
			class="grid grid-flow-col gap-x-2 rounded-lg bg-orange-300 p-1 sm:grid-cols-2 sm:grid-rows-4 sm:gap-x-2"
		>
			{#each residencyOptions as { value, lable }}
				<div class="col-span-1 flex items-center">
					<input
						class="ml-8 h-4 w-4"
						id="residency_profile"
						type="radio"
						name="residency_profile"
						bind:group={residency_profile}
						{value}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="residency_profile"
						>{lable}</label
					>
				</div>
			{/each}
		</div>
		<div class="flex flex-row items-center justify-start pt-2">
			<h2 class="h2 text-lg font-semibold text-gray-900">What is your mobile phone number?</h2>
			<div class="ml-3 rounded-lg bg-orange-300 p-1">
				<input
					onchange={() => {
						unsaved = true;
					}}
					type="tel"
					name="mobile"
					class="focus:border-primary-600 focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-0.5 text-base text-gray-900"
					placeholder="Mobile 0XXX XXX XXX"
					onkeydown={(e) => {
						if (['Backspace', 'Delete'].includes(e.key)) {
							mobile = e.currentTarget.value;
						} else {
							e.preventDefault();
							mobile = e.currentTarget.value;
							if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
								mobile = formatMobile(mobile, e.key);
							}
						}
					}}
					bind:value={mobile}
				/>
			</div>
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">
			Have you completed a RFS Bushfire survival plan?
		</h2>
		<div class="flex justify-start rounded-lg bg-orange-300 p-1">
			{#each yesNoSendOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="ml-8 h-4 w-4"
						id="rfs_survival_plan"
						type="radio"
						name="rfs_survival_plan"
						bind:group={rfs_survival_plan}
						{value}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="rfs_survival_plan"
						>{lable}</label
					>
				</div>
			{/each}
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">
			What is your level of firefighting experience?
		</h2>
		<div
			class="grid grid-flow-col gap-x-2 rounded-lg bg-orange-300 p-1 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-2"
		>
			{#each fireFightingExperienceOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="ml-8 h-4 w-4"
						id="fire_fighting_experience"
						type="radio"
						name="fire_fighting_experience"
						bind:group={fire_fighting_experience}
						{value}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="fire_fighting_experience"
						>{lable}</label
					>
				</div>
			{/each}
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">
			Have you had unpleasant traumatic experience of bushfire?
		</h2>
		<div class="flex justify-start rounded-lg bg-orange-300 p-1">
			{#each yesNoOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="ml-8 h-4 w-4"
						id="fire_trauma"
						type="radio"
						name="fire_trauma"
						bind:group={fire_trauma}
						{value}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="fire_trauma">{lable}</label
					>
				</div>
			{/each}
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">
			If your property is threatened by fire, are you:
		</h2>
		<div
			class="grid grid-flow-col gap-x-2 rounded-lg bg-orange-300 p-1 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-2"
		>
			{#each stayGoOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="ml-8 h-4 w-4"
						id="plan_to_leave_before_fire"
						type="radio"
						name="plan_to_leave_before_fire"
						bind:group={plan_to_leave_before_fire}
						{value}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="plan_to_leave_before_fire"
						>{lable}</label
					>
				</div>
			{/each}
		</div>
		<h2 class="h2 text-lg font-semibold text-gray-900">
			If your property is threatened by flood, are you:
		</h2>
		<div
			class="grid grid-flow-col gap-x-2 rounded-lg bg-orange-300 p-1 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-2"
		>
			{#each stayGoOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="ml-8 h-4 w-4"
						id="plan_to_leave_before_flood"
						type="radio"
						name="plan_to_leave_before_flood"
						bind:group={plan_to_leave_before_flood}
						value={Number(value)}
					/>
					<label class="ml-2 text-base font-medium text-orange-900" for="plan_to_leave_before_flood"
						>{lable}</label
					>
				</div>
			{/each}
			<FormActions onReset={handleReset} isUnsaved={unsaved} {isSubmitting} />
		</div>
	</form>
</section>
