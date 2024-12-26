<script lang="ts">
	import {
		yesNoSendOptions,
		fireFightingExperienceOptions,
		yesNoOptions,
		stayGoOptions
	} from '$lib/profile-options';

	import type { PersonalProfileFormData } from '$lib/form.types';

	type Props = {
		userProfile: PersonalProfileFormData;
	};

	let { userProfile = $bindable() }: Props = $props();
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
				bind:group={userProfile.rfs_survival_plan}
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
					bind:group={userProfile.fire_fighting_experience}
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
				bind:group={userProfile.fire_trauma}
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
					bind:group={userProfile.plan_to_leave_before_fire}
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
					bind:group={userProfile.plan_to_leave_before_flood}
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
