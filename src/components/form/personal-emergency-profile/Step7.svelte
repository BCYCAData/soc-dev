<script lang="ts">
	import {
		yesNoSendOptions,
		fireFightingExperienceOptions,
		yesNoOptions,
		stayGoOptions
	} from '$lib/profile-options';
	import type { PersonalProfileFormData } from '$lib/form.types';

	interface Props {
		userProfile: PersonalProfileFormData;
	}

	let { userProfile }: Props = $props();

	let formState = $state({
		rfs_survival_plan: userProfile.rfs_survival_plan,
		fire_fighting_experience: userProfile.fire_fighting_experience,
		fire_trauma: userProfile.fire_trauma,
		plan_to_leave_before_fire: userProfile.plan_to_leave_before_fire,
		plan_to_leave_before_flood: userProfile.plan_to_leave_before_flood
	});

	$effect(() => {
		userProfile.rfs_survival_plan = formState.rfs_survival_plan;
		userProfile.fire_fighting_experience = formState.fire_fighting_experience;
		userProfile.fire_trauma = formState.fire_trauma;
		userProfile.plan_to_leave_before_fire = formState.plan_to_leave_before_fire;
		userProfile.plan_to_leave_before_flood = formState.plan_to_leave_before_flood;
	});
</script>

<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Have you completed a RFS Bushfire survival plan?
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	{#each yesNoSendOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="ml-8 h-6 w-6"
				id="rfs_survival_plan"
				type="radio"
				name="rfs_survival_plan"
				bind:group={formState.rfs_survival_plan}
				{value}
			/>
			<label class="text-scale-6 ml-2 font-medium text-orange-900" for="rfs_survival_plan"
				>{lable}</label
			>
		</div>
	{/each}
</div>
<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	What is your level of firefighting experience?
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	<ul class="my-0 w-full list-none pl-0">
		{#each fireFightingExperienceOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="ml-8 h-6 w-6"
					id="fire_fighting_experience"
					type="radio"
					name="fire_fighting_experience"
					bind:group={formState.fire_fighting_experience}
					{value}
				/>
				<label class="text-scale-6 ml-2 font-medium text-orange-900" for="fire_fighting_experience"
					>{lable}</label
				>
			</div>
		{/each}
	</ul>
</div>
<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	Have you had unpleasant traumatic experience of bushfire?
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	{#each yesNoOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="ml-8 h-6 w-6"
				id="fire_trauma"
				type="radio"
				name="fire_trauma"
				bind:group={formState.fire_trauma}
				{value}
			/>
			<label class="text-scale-6 ml-2 font-medium text-orange-900" for="fire_trauma">{lable}</label>
		</div>
	{/each}
</div>
<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	If your property is threatened by fire, are you:
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	<ul class="my-0 w-full list-none pl-0">
		{#each stayGoOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="ml-8 h-6 w-6"
					id="plan_to_leave_before_fire"
					type="radio"
					name="plan_to_leave_before_fire"
					bind:group={formState.plan_to_leave_before_fire}
					{value}
				/>
				<label class="text-scale-6 ml-2 font-medium text-orange-900" for="plan_to_leave_before_fire"
					>{lable}</label
				>
			</div>
		{/each}
	</ul>
</div>
<h2 class="h2 mb-1 text-lg font-semibold text-surface-950">
	If your property is threatened by flood, are you:
</h2>
<div class="flex justify-start rounded-lg bg-secondary-200 p-2">
	<ul class="my-0 w-full list-none pl-0">
		{#each stayGoOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="ml-8 h-6 w-6"
					id="plan_to_leave_before_flood"
					type="radio"
					name="plan_to_leave_before_flood"
					bind:group={formState.plan_to_leave_before_flood}
					{value}
				/>
				<label
					class="text-scale-6 ml-2 font-medium text-orange-900"
					for="plan_to_leave_before_flood">{lable}</label
				>
			</div>
		{/each}
	</ul>
</div>
