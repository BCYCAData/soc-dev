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
		rfs_survival_plan: undefined as string | undefined,
		fire_fighting_experience: undefined as number | undefined,
		fire_trauma: undefined as boolean | undefined,
		plan_to_leave_before_fire: undefined as number | undefined,
		plan_to_leave_before_flood: undefined as number | undefined
	});

	$effect(() => {
		formState.rfs_survival_plan = userProfile.rfs_survival_plan ?? undefined;
		formState.fire_fighting_experience = userProfile.fire_fighting_experience ?? undefined;
		formState.fire_trauma = userProfile.fire_trauma ?? undefined;
		formState.plan_to_leave_before_fire = userProfile.plan_to_leave_before_fire ?? undefined;
		formState.plan_to_leave_before_flood = userProfile.plan_to_leave_before_flood ?? undefined;
	});

	$effect(() => {
		userProfile.rfs_survival_plan = formState.rfs_survival_plan ?? null;
		userProfile.fire_fighting_experience = formState.fire_fighting_experience ?? null;
		userProfile.fire_trauma = formState.fire_trauma ?? null;
		userProfile.plan_to_leave_before_fire = formState.plan_to_leave_before_fire ?? null;
		userProfile.plan_to_leave_before_flood = formState.plan_to_leave_before_flood ?? null;
	});
</script>

<h2 class="h2 text-surface-950 mb-1 text-lg font-semibold">
	Have you completed a RFS Bushfire survival plan?
</h2>
<div class="bg-secondary-200 flex justify-start rounded-lg p-2">
	{#each yesNoSendOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="ml-8 h-6 w-6"
				id="rfs_survival_plan_{value}"
				type="radio"
				name="rfs_survival_plan"
				bind:group={formState.rfs_survival_plan}
				{value}
			/>
			<label class="ml-2" for="rfs_survival_plan_{value}">{lable}</label>
		</div>
	{/each}
</div>
<h2 class="h2 text-surface-950 mb-1 text-lg font-semibold">
	What is your level of firefighting experience?
</h2>
<div class="bg-secondary-200 flex justify-start rounded-lg p-2">
	<ul class="my-0 w-full list-none pl-0">
		{#each fireFightingExperienceOptions as { value, lable }}
			<li class="flex items-center">
				<input
					class="ml-8 h-6 w-6"
					id="fire_fighting_experience_{value}"
					type="radio"
					name="fire_fighting_experience"
					bind:group={formState.fire_fighting_experience}
					{value}
				/>
				<label class="ml-2" for="fire_fighting_experience_{value}">{lable}</label>
			</li>
		{/each}
	</ul>
</div>
<h2 class="h2 text-surface-950 mb-1 text-lg font-semibold">
	Have you had unpleasant traumatic experience of bushfire?
</h2>
<div class="bg-secondary-200 flex justify-start rounded-lg p-2">
	{#each yesNoOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="ml-8 h-6 w-6"
				id="fire_trauma_{value}"
				type="radio"
				name="fire_trauma"
				bind:group={formState.fire_trauma}
				{value}
			/>
			<label class="ml-2" for="fire_trauma_{value}">{lable}</label>
		</div>
	{/each}
</div>
<h2 class="h2 text-surface-950 mb-1 text-lg font-semibold">
	In the event of a bushfire, do you plan to stay and defend or leave early?
</h2>
<div class="bg-secondary-200 flex justify-start rounded-lg p-2">
	<ul class="my-0 w-full list-none pl-0">
		{#each stayGoOptions as { value, lable }}
			<li class="flex items-center">
				<input
					class="ml-8 h-6 w-6"
					id="plan_to_leave_before_fire_{value}"
					type="radio"
					name="plan_to_leave_before_fire"
					bind:group={formState.plan_to_leave_before_fire}
					{value}
				/>
				<label class="ml-2" for="plan_to_leave_before_fire_{value}">{lable}</label>
			</li>
		{/each}
	</ul>
</div>
<h2 class="h2 text-surface-950 mb-1 text-lg font-semibold">
	In the event of a flood, do you plan to stay and defend or leave early?
</h2>
<div class="bg-secondary-200 flex justify-start rounded-lg p-2">
	<ul class="my-0 w-full list-none pl-0">
		{#each stayGoOptions as { value, lable }}
			<li class="flex items-center">
				<input
					class="ml-8 h-6 w-6"
					id="plan_to_leave_before_flood_{value}"
					type="radio"
					name="plan_to_leave_before_flood"
					bind:group={formState.plan_to_leave_before_flood}
					{value}
				/>
				<label
					class="text-scale-6 ml-2 font-medium text-orange-900"
					for="plan_to_leave_before_flood_{value}">{lable}</label
				>
			</li>
		{/each}
	</ul>
</div>
