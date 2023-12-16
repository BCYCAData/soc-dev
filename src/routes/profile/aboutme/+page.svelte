<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { formatMobile, toTitleCase } from '$lib/utils';
	import {
		residencyOptions,
		yesNoOptions,
		yesNoSendOptions,
		fireFightingExperienceOptions,
		stayGoOptions
	} from '$lib/profileOptions';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	export let data;
	const modalStore = getModalStore();

	function triggerSaveProfilePrompt(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'modalSaveProfilePrompt'
		};
		modalStore.trigger(modal);
	}

	function setTitleCase(e: Event) {
		(e.target as HTMLInputElement).value = toTitleCase((e.target as HTMLInputElement).value);
	}

	let unsaved = false;

	beforeNavigate(async ({ cancel }) => {
		if (unsaved) {
			cancel();
			triggerSaveProfilePrompt();
		}
	});

	$: ({ userProfileData } = data);
</script>

<svelte:head>
	<title>Profile-About Me</title>
</svelte:head>

<section class="mx-auto">
	<form
		id="profileAboutMeForm"
		on:change={() => {
			unsaved = true;
		}}
		class="flex flex-col py-1 mx-auto w-full"
		method="POST"
	>
		<h2 class="unstyled text-base font-semibold text-gray-900">What is your name?</h2>
		<div class="grid gap-2 p-1 rounded-lg bg-orange-300 sm:grid-cols-2 sm:gap-2">
			<input
				type="text"
				id="first_name"
				name="first_name"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
				autocomplete="given-name"
				style="text-transform:capitalize"
				placeholder="First Name "
				on:input={setTitleCase}
				bind:value={userProfileData.first_name}
			/>
			<input
				type="text"
				id="family_name"
				name="family_name"
				autocomplete="off"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
				style="text-transform:capitalize"
				placeholder="Family Name"
				on:input={setTitleCase}
				bind:value={userProfileData.family_name}
			/>
		</div>
		<h2 class="unstyled text-base font-semibold text-gray-900">Are you:</h2>
		<div
			class="grid grid-flow-col gap-x-2 p-1 rounded-lg bg-orange-300 sm:grid-cols-2 sm:grid-rows-4 sm:gap-x-2"
		>
			{#each residencyOptions as { value, lable }}
				<div class="flex items-center col-span-1">
					<input
						class="w-4 h-4 ml-8"
						id="residency_profile"
						type="radio"
						name="residency_profile"
						bind:group={userProfileData.residency_profile}
						{value}
					/>
					<label
						class="ml-2 text-base font-medium text-orange-900 font-Poppins"
						for="residency_profile">{lable}</label
					>
				</div>
			{/each}
		</div>
		<div class="flex flex-row justify-start pt-2 items-center">
			<h2 class="unstyled text-base font-semibold text-gray-900">
				What is your mobile phone number?
			</h2>
			<div class="rounded-lg ml-3 p-1 bg-orange-300">
				<input
					on:change={() => {
						unsaved = true;
					}}
					type="tel"
					name="mobile"
					class="bg-gray-50 border pr-20 border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-0.5"
					placeholder="Mobile 0XXX XXX XXX"
					on:keydown={(e) => {
						if (['Backspace', 'Delete'].includes(e.key)) {
							userProfileData.mobile = e.currentTarget.value;
						} else {
							e.preventDefault();
							userProfileData.mobile = e.currentTarget.value;
							if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
								userProfileData.mobile = formatMobile(userProfileData.mobile, e.key);
							}
						}
					}}
					bind:value={userProfileData.mobile}
				/>
			</div>
		</div>
		<h2 class="unstyled text-base font-semibold text-gray-900">
			Have you completed a RFS Bushfire survival plan?
		</h2>
		<div class="flex justify-start rounded-lg p-1 bg-orange-300">
			{#each yesNoSendOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="w-4 h-4 ml-8"
						id="rfs_survival_plan"
						type="radio"
						name="rfs_survival_plan"
						bind:group={userProfileData.rfs_survival_plan}
						{value}
					/>
					<label
						class="ml-2 text-base font-medium text-orange-900 font-Poppins"
						for="rfs_survival_plan">{lable}</label
					>
				</div>
			{/each}
			<div class="flex items-center">
				<input
					on:change={() => {
						if (userProfileData.send_rfs_survival_plan) {
							userProfileData.rfs_survival_plan = 'N';
						} else {
							userProfileData.rfs_survival_plan = null;
						}
					}}
					on:click={() => {
						userProfileData.send_rfs_survival_plan = !userProfileData.send_rfs_survival_plan;
					}}
					class="w-4 h-4 ml-8"
					id="send_rfs_survival_plan"
					type="checkbox"
					name="send_rfs_survival_plan"
					bind:checked={userProfileData.send_rfs_survival_plan}
				/>
				<label
					class="ml-2 text-base font-medium text-orange-900 font-Poppins"
					for="send_rfs_survival_plan">Please send one</label
				>
				{#if userProfileData.sent_rfs_survival_plan}
					<div class="ml-4 text-base font-semibold text-orange-900 font-Poppins">
						RFS Survival Plan Details were sent on {userProfileData.sent_rfs_survival_plan}
					</div>
				{/if}
			</div>
		</div>
		<h2 class="unstyled text-base font-semibold text-gray-900">
			What is your level of firefighting experience?
		</h2>
		<div
			class="grid grid-flow-col gap-x-2 p-1 rounded-lg bg-orange-300 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-2"
		>
			{#each fireFightingExperienceOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="w-4 h-4 ml-8"
						id="fire_fighting_experience"
						type="radio"
						name="fire_fighting_experience"
						bind:group={userProfileData.fire_fighting_experience}
						{value}
					/>
					<label
						class="ml-2 text-base font-medium text-orange-900 font-Poppins"
						for="fire_fighting_experience">{lable}</label
					>
				</div>
			{/each}
		</div>
		<h2 class="unstyled text-base font-semibold text-gray-900">
			Have you had unpleasant traumatic experience of bushfire?
		</h2>
		<div class="flex justify-start rounded-lg p-1 bg-orange-300">
			{#each yesNoOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="w-4 h-4 ml-8"
						id="fire_trauma"
						type="radio"
						name="fire_trauma"
						bind:group={userProfileData.fire_trauma}
						{value}
					/>
					<label class="ml-2 text-base font-medium text-orange-900 font-Poppins" for="fire_trauma"
						>{lable}</label
					>
				</div>
			{/each}
		</div>
		<h2 class="unstyled text-base font-semibold text-gray-900">
			If your property is threatened by fire, are you:
		</h2>
		<div
			class="grid grid-flow-col gap-x-2 p-1 rounded-lg bg-orange-300 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-2"
		>
			{#each stayGoOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="w-4 h-4 ml-8"
						id="plan_to_leave_before_fire"
						type="radio"
						name="plan_to_leave_before_fire"
						bind:group={userProfileData.plan_to_leave_before_fire}
						{value}
					/>
					<label
						class="ml-2 text-base font-medium text-orange-900 font-Poppins"
						for="plan_to_leave_before_fire">{lable}</label
					>
				</div>
			{/each}
		</div>
		<h2 class="unstyled text-base font-semibold text-gray-900">
			If your property is threatened by flood, are you:
		</h2>
		<div
			class="grid grid-flow-col gap-x-2 p-1 rounded-lg bg-orange-300 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-2"
		>
			{#each stayGoOptions as { value, lable }}
				<div class="flex items-center">
					<input
						class="w-4 h-4 ml-8"
						id="plan_to_leave_before_flood"
						type="radio"
						name="plan_to_leave_before_flood"
						bind:group={userProfileData.plan_to_leave_before_flood}
						{value}
					/>
					<label
						class="ml-2 text-base font-medium text-orange-900 font-Poppins"
						for="plan_to_leave_before_flood">{lable}</label
					>
				</div>
			{/each}
		</div>
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
					form="profileAboutMeForm"
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
</section>
