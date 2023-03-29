<script lang="ts">
	import {
		yesNoSendOptions,
		fireFightingExperienceOptions,
		yesNoOptions,
		stayGoOptions
	} from '$lib/profileOptions';

	// import type { UserProfileData } from '$lib/types';

	export let userProfileData: any;
</script>

<pre>{userProfileData.send_rfs_survival_plan}</pre>
<h2 class="unstyled mb-1 text-xl font-semibold text-gray-900">
	Have you completed a RFS Bushfire survival plan?
</h2>
<div class="p-2 flex justify-start rounded-lg bg-orange-200">
	{#each yesNoSendOptions as { value, lable }}
		<div class="flex items-center">
			<input
				on:change={() => {
					userProfileData.send_rfs_survival_plan = false;
				}}
				class="w-6 h-6 ml-8"
				id="rfs_survival_plan"
				type="radio"
				name="rfs_survival_plan"
				bind:group={userProfileData.rfs_survival_plan}
				{value}
			/>
			<label class="ml-2 text-xl font-medium text-orange-900 font-Poppins" for="rfs_survival_plan"
				>{lable}</label
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
			class="w-6 h-6 ml-8"
			id="send_rfs_survival_plan"
			type="checkbox"
			name="send_rfs_survival_plan"
			bind:checked={userProfileData.send_rfs_survival_plan}
		/>
		<label
			class="ml-2 text-xl font-medium text-orange-900 font-Poppins"
			for="send_rfs_survival_plan">Please send one</label
		>
		{#if userProfileData.sent_rfs_survival_plan}
			<div class="ml-4 text-base font-semibold text-orange-900 font-Poppins">
				RFS Survival Plan Details were sent on {userProfileData.sent_rfs_survival_plan}
			</div>
		{/if}
	</div>
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
					bind:group={userProfileData.fire_fighting_experience}
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
				bind:group={userProfileData.fire_trauma}
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
					bind:group={userProfileData.plan_to_leave_before_fire}
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
					bind:group={userProfileData.plan_to_leave_before_flood}
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
