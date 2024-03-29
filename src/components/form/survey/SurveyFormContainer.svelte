<script lang="ts">
	import Step1 from '$components/form/survey/Step1.svelte';
	import Step2 from '$components/form/survey/Step2.svelte';
	import Step3 from '$components/form/survey/Step3.svelte';
	import Step4 from '$components/form/survey/Step4.svelte';
	import Step5 from '$components/form/survey/Step5.svelte';
	import Step6 from '$components/form/survey/Step6.svelte';
	import Step7 from '$components/form/survey/Step7.svelte';
	import Step8 from '$components/form/survey/Step8.svelte';
	import Step9 from '$components/form/survey/Step9.svelte';
	import Step10 from '$components/form/survey/Step10.svelte';
	import Step11 from '$components/form/survey/Step11.svelte';
	import Step12 from '$components/form/survey/Step12.svelte';
	import Step13 from '$components/form/survey/Step13.svelte';
	import Step14 from '$components/form/survey/Step14.svelte';
	import Step15 from '$components/form/survey/Step15.svelte';
	import Step16 from '$components/form/survey/Step16.svelte';
	import Step17 from '$components/form/survey/Step17.svelte';
	import Step18 from '$components/form/survey/Step18.svelte';
	import Step19 from '$components/form/survey/Step19.svelte';
	import Step20 from '$components/form/survey/Step20.svelte';
	import Step21 from '$components/form/survey/Step21.svelte';

	import type {
		PropertyAddress,
		PropertyAgentData,
		PropertyProfileData,
		CommunityBCYCAProfileData,
		CommunityTinoneeProfileData,
		CommunityMondrookProfileData,
		CommunityExternalProfileData,
		UserPostalAddressData,
		UserProfileData
	} from '$lib/custom.types';

	export let active_step: number;
	export let propertyId: string;
	export let communityName: string;
	export let propertyAddress: PropertyAddress;
	export let propertyWasRented: boolean;
	export let propertyProfile: PropertyProfileData;
	export let propertyAgent: PropertyAgentData;
	export let userProfile: UserProfileData;
	export let userPostalAddress: UserPostalAddressData;
	export let communityBCYCAProfile: CommunityBCYCAProfileData;
	export let communityTinoneeProfile: CommunityTinoneeProfileData;
	export let communityMondrookProfile: CommunityMondrookProfileData;
	export let communityExternalProfile: CommunityExternalProfileData;
</script>

<div class="mx-auto sm:w-11/12">
	<div
		class="p-1 text-center text-lg text-orange-600"
		hidden={active_step == 1 || active_step == 12}
	>
		Please complete all steps and tap <span
			class="p-1 rounded-lg text-base font-semibold bg-[#0099E8] text-stone-100 border border-purple-700"
		>
			Save My Answers
		</span>
		at Step 21
	</div>
	<form method="post" action="/survey" id="surveyForm">
		<input type="hidden" name="communityName" value={communityName} />
		<input type="hidden" name="propertyId" value={propertyId} />
		<input type="hidden" name="propertyWasRented" value={propertyWasRented} />
		<div hidden={active_step != 1}>
			<Step1 />
		</div>
		<div hidden={active_step != 2}>
			<Step2 {userProfile} {propertyProfile} {propertyAddress} {propertyAgent} />
		</div>
		<div hidden={active_step != 3}>
			<Step3 {userProfile} {propertyProfile} />
		</div>
		<div hidden={active_step != 4}>
			<Step4 {propertyProfile} />
		</div>
		<div hidden={active_step != 5}>
			<Step5 {propertyProfile} />
		</div>
		<div hidden={active_step != 6}>
			<Step6 {propertyProfile} />
		</div>
		<div hidden={active_step != 7}>
			<Step7 {userProfile} />
		</div>
		{#if communityBCYCAProfile}
			<div hidden={active_step != 8}>
				<Step8 {communityBCYCAProfile} />
			</div>
			<div hidden={active_step != 9}>
				<Step9 {communityBCYCAProfile} />
			</div>
			<div hidden={active_step != 10}>
				<Step10 {communityBCYCAProfile} />
			</div>
		{/if}
		{#if communityTinoneeProfile}
			<div hidden={active_step != 8}>
				<Step11 {communityTinoneeProfile} />
			</div>
			<div hidden={active_step != 9}>
				<Step12 {communityTinoneeProfile} />
			</div>
			<div hidden={active_step != 10}>
				<Step13 {communityTinoneeProfile} />
			</div>
		{/if}
		{#if communityMondrookProfile}
			<div hidden={active_step != 8}>
				<Step14 {communityMondrookProfile} />
			</div>
			<div hidden={active_step != 9}>
				<Step15 {communityMondrookProfile} />
			</div>
			<div hidden={active_step != 10}>
				<Step16 {communityMondrookProfile} />
			</div>
		{/if}
		{#if communityExternalProfile}
			<div hidden={active_step != 8}>
				<Step17 {communityExternalProfile} />
			</div>
			<div hidden={active_step != 9}>
				<Step18 {communityExternalProfile} />
			</div>
			<div hidden={active_step != 10}>
				<Step19 {communityExternalProfile} />
			</div>
		{/if}
		<div hidden={active_step != 11}>
			<Step20 {userProfile} {userPostalAddress} />
		</div>
		<div hidden={active_step != 12}>
			<Step21 />
		</div>
		<div class="flex flex-col justify-center items-center sm:text-lg">
			<button
				class="w-1/4 mx-3 mb-3 rounded-lg text-base font-semibold bg-[#0099E8] text-stone-100 border border-purple-700"
				hidden={active_step != 12}
				type="submit"
				form="surveyForm"
			>
				Save My Answers
			</button>
		</div>
	</form>
</div>
