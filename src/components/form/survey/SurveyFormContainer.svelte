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
		AgentData,
		PropertyProfileData,
		UserBCYCAProfileData,
		UserTinoneeProfileData,
		UserMondrookProfileData,
		UserExternalProfileData,
		UserPostalAddressData,
		UserProfileData,
		PropertyGeometryData
	} from '$lib/custom.types';

	export let active_step: string;

	export let propertyProfileData: PropertyProfileData;
	export let propertyAgentData: AgentData;
	export let userProfileData: UserProfileData;
	export let userPostalAddressData: UserPostalAddressData;
	export let communityBCYCAProfileData: UserBCYCAProfileData;
	export let communityTinoneeProfileData: UserTinoneeProfileData;
	export let communityMondrookProfileData: UserMondrookProfileData;
	export let communityExternalProfileData: UserExternalProfileData;
</script>

<div class="mx-auto sm:w-11/12">
	<div
		class="p-1 text-center text-lg text-orange-600"
		hidden={active_step == '1' || active_step == '12'}
	>
		Please complete all steps and tap <span
			class="p-1 rounded-lg text-base font-semibold bg-[#0099E8] text-stone-100 border border-purple-700"
		>
			Save My Answers
		</span>
		at Step 12
	</div>
	<form method="post" action="/survey" id="surveyForm">
		<div hidden={active_step != '1'}>
			<Step1 />
		</div>
		<div hidden={active_step != '2'}>
			<Step2 {userProfileData} {propertyProfileData} {propertyAgentData} />
		</div>
		<div hidden={active_step != '3'}>
			<Step3 {userProfileData} {propertyProfileData} />
		</div>
		<div hidden={active_step != '4'}>
			<Step4 {propertyProfileData} />
		</div>
		<div hidden={active_step != '5'}>
			<Step5 {propertyProfileData} />
		</div>
		<div hidden={active_step != '6'}>
			<Step6 {propertyProfileData} />
		</div>
		<div hidden={active_step != '7'}>
			<Step7 {userProfileData} />
		</div>
		{#if communityBCYCAProfileData}
			<div hidden={active_step != '8'}>
				<Step8 {communityBCYCAProfileData} />
			</div>
			<div hidden={active_step != '9'}>
				<Step9 {communityBCYCAProfileData} />
			</div>
			<div hidden={active_step != '10'}>
				<Step10 {communityBCYCAProfileData} />
			</div>
		{/if}
		{#if communityTinoneeProfileData}
			<div hidden={active_step != '11'}>
				<Step11 {communityTinoneeProfileData} />
			</div>
			<div hidden={active_step != '12'}>
				<Step12 {communityTinoneeProfileData} />
			</div>
			<div hidden={active_step != '13'}>
				<Step13 {communityTinoneeProfileData} />
			</div>
		{/if}
		{#if communityMondrookProfileData}
			<div hidden={active_step != '14'}>
				<Step14 {communityMondrookProfileData} />
			</div>
			<div hidden={active_step != '15'}>
				<Step15 {communityMondrookProfileData} />
			</div>
			<div hidden={active_step != '16'}>
				<Step16 {communityMondrookProfileData} />
			</div>
		{/if}
		{#if communityExternalProfileData}
			<div hidden={active_step != '17'}>
				<Step17 {communityExternalProfileData} />
			</div>
			<div hidden={active_step != '18'}>
				<Step18 {communityExternalProfileData} />
			</div>
			<div hidden={active_step != '19'}>
				<Step19 {communityExternalProfileData} />
			</div>
		{/if}
		<div hidden={active_step != '20'}>
			<Step20 {userProfileData} {userPostalAddressData} />
		</div>
		<div hidden={active_step != '21'}>
			<Step21 />
		</div>
		<input type="text" name="property_key" value={propertyProfileData.id} hidden />
		<div class="flex flex-col justify-center items-center sm:text-lg">
			<button
				class="w-1/4 mx-3 mb-3 rounded-lg text-base font-semibold bg-[#0099E8] text-stone-100 border border-purple-700"
				hidden={active_step != '12'}
				type="submit"
				form="surveyForm"
			>
				Save My Answers
			</button>
		</div>
	</form>
</div>
