<script lang="ts">
	import {
		yesNoSendOptions,
		fireFightingExperienceOptions,
		yesNoOptions,
		stayGoOptions
	} from '$lib/profileOptions';

	import type { UserProfileData } from '$lib/custom.types';

	export let userProfile: UserProfileData;
</script>

<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	Have you completed a RFS Bushfire survival plan?
</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	{#each yesNoSendOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="w-6 h-6 ml-8"
				id="rfs_survival_plan"
				type="radio"
				name="rfs_survival_plan"
				bind:group={userProfile.rfs_survival_plan}
				{value}
			/>
			<label class="ml-2 text-xl font-medium text-orange-900 font-Poppins" for="rfs_survival_plan"
				>{lable}</label
			>
		</div>
	{/each}
</div>
<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	What is your level of firefighting experience?
</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	<ul class="list-none w-full pl-0 my-0">
		{#each fireFightingExperienceOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="w-6 h-6 ml-8"
					id="fire_fighting_experience"
					type="radio"
					name="fire_fighting_experience"
					bind:group={userProfile.fire_fighting_experience}
					{value}
				/>
				<label
					class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
					for="fire_fighting_experience">{lable}</label
				>
			</div>
		{/each}
	</ul>
</div>
<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	Have you had unpleasant traumatic experience of bushfire?
</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	{#each yesNoOptions as { value, lable }}
		<div class="flex items-center">
			<input
				class="w-6 h-6 ml-8"
				id="fire_trauma"
				type="radio"
				name="fire_trauma"
				bind:group={userProfile.fire_trauma}
				{value}
			/>
			<label class="ml-2 text-xl font-medium text-orange-900 font-Poppins" for="fire_trauma"
				>{lable}</label
			>
		</div>
	{/each}
</div>
<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	If your property is threatened by fire, are you:
</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	<ul class="list-none w-full pl-0 my-0">
		{#each stayGoOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="w-6 h-6 ml-8"
					id="plan_to_leave_before_fire"
					type="radio"
					name="plan_to_leave_before_fire"
					bind:group={userProfile.plan_to_leave_before_fire}
					{value}
				/>
				<label
					class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
					for="plan_to_leave_before_fire">{lable}</label
				>
			</div>
		{/each}
	</ul>
</div>
<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	If your property is threatened by flood, are you:
</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	<ul class="list-none w-full pl-0 my-0">
		{#each stayGoOptions as { value, lable }}
			<div class="flex items-center">
				<input
					class="w-6 h-6 ml-8"
					id="plan_to_leave_before_flood"
					type="radio"
					name="plan_to_leave_before_flood"
					bind:group={userProfile.plan_to_leave_before_flood}
					{value}
				/>
				<label
					class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
					for="plan_to_leave_before_flood">{lable}</label
				>
			</div>
		{/each}
	</ul>
</div>
