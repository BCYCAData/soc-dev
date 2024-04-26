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
	export let optionsData;

	const communityProfileId = communityBCYCAProfile
		? communityBCYCAProfile.bcyca_profile_id
		: communityTinoneeProfile
			? communityTinoneeProfile.tinonee_profile_id
			: communityMondrookProfile
				? communityMondrookProfile.mondrook_profile_id
				: communityExternalProfile
					? communityExternalProfile.external_profile_id
					: '';
	console.log('communityProfileId', communityProfileId);

	const communityBCYCAWorkshopOptionsData =
		optionsData.communityBCYCAOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityWorkshopOptions'
		);
	const communityBCYCAWorkshopOptions = communityBCYCAWorkshopOptionsData?.options;

	const communityBCYCAInformationSheetOptionsData =
		optionsData.communityBCYCAOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'informationSheetOptions'
		);
	const communityBCYCAInformationOptions = communityBCYCAInformationSheetOptionsData?.options;
	const communityBCYCAMeetingOptionsData = optionsData.communityBCYCAOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'communityMeetingOptions'
	);
	const communityBCYCAMeetingOptions = communityBCYCAMeetingOptionsData?.options;
	const stayInTouchOptionsData = optionsData.communityBCYCAOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
	);
	const communityBCYCAStayInTouchOptions = stayInTouchOptionsData?.options;

	const communityExternalWorkshopOptionsData =
		optionsData.communityExternalOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityWorkshopOptions'
		);
	const communityExternalWorkshopOptions = communityExternalWorkshopOptionsData?.options;
	const communityExternalInformationSheetOptionsData =
		optionsData.communityExternalOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'informationSheetOptions'
		);
	const communityExternalInformationOptions = communityExternalInformationSheetOptionsData?.options;
	const communityExternalMeetingOptionsData =
		optionsData.communityExternalOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityMeetingOptions'
		);
	const communityExternalMeetingOptions = communityExternalMeetingOptionsData?.options;
	const communityExternalStayInTouchOptionsData =
		optionsData.communityExternalOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
		);
	const communityExternalStayInTouchOptions = communityExternalStayInTouchOptionsData?.options;

	const communityMondrookWorkshopOptionsData =
		optionsData.communityMondrookOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityWorkshopOptions'
		);
	const communityMondrookWorkshopOptions = communityMondrookWorkshopOptionsData?.options;
	const communityMondrookInformationSheetOptionsData =
		optionsData.communityMondrookOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'informationSheetOptions'
		);
	const communityMondrookInformationOptions = communityMondrookInformationSheetOptionsData?.options;
	const communityMondrookMeetingOptionsData =
		optionsData.communityMondrookOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityMeetingOptions'
		);
	const communityMondrookMeetingOptions = communityMondrookMeetingOptionsData?.options;
	const communityMondrookStayInTouchOptionsData =
		optionsData.communityMondrookOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
		);
	const communityMondrookStayInTouchOptions = communityMondrookStayInTouchOptionsData?.options;

	const communityTinoneeWorkshopOptionsData =
		optionsData.communityTinoneeOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityWorkshopOptions'
		);
	const communityTinoneeWorkshopOptions = communityTinoneeWorkshopOptionsData?.options;
	const communityTinoneeInformationSheetOptionsData =
		optionsData.communityTinoneeOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'informationSheetOptions'
		);
	const communityTinoneeInformationOptions = communityTinoneeInformationSheetOptionsData?.options;
	const communityTinoneeMeetingOptionsData =
		optionsData.communityTinoneeOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'communityMeetingOptions'
		);
	const communityTinoneeMeetingOptions = communityTinoneeMeetingOptionsData?.options;
	const communityTinoneeStayInTouchOptionsData =
		optionsData.communityTinoneeOptionsData?.object_names.find(
			(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
		);
	const communityTinoneeStayInTouchOptions = communityTinoneeStayInTouchOptionsData?.options;

	const cuserProfileStayInTouchOptionsData = optionsData.userOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
	);
	const userProfileStayInTouchOptions = cuserProfileStayInTouchOptionsData?.options;
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
		at Step 12
	</div>
	<form method="post" action="/survey" id="surveyForm">
		<input type="hidden" name="communityName" value={communityName} />
		<input type="hidden" name="propertyId" value={propertyId} />
		<input type="hidden" name="propertyWasRented" value={propertyWasRented} />
		<input type="hidden" name="communityProfileId" value={communityProfileId} />
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
				<Step8 {communityBCYCAProfile} {communityBCYCAWorkshopOptions} />
			</div>
			<div hidden={active_step != 9}>
				<Step9 {communityBCYCAProfile} {communityBCYCAInformationOptions} />
			</div>
			<div hidden={active_step != 10}>
				<Step10 {communityBCYCAProfile} {communityBCYCAMeetingOptions} />
			</div>
		{/if}
		{#if communityTinoneeProfile}
			<div hidden={active_step != 8}>
				<Step11 {communityTinoneeProfile} {communityTinoneeWorkshopOptions} />
			</div>
			<div hidden={active_step != 9}>
				<Step12 {communityTinoneeProfile} {communityTinoneeInformationOptions} />
			</div>
			<div hidden={active_step != 10}>
				<Step13 {communityTinoneeProfile} {communityTinoneeMeetingOptions} />
			</div>
		{/if}
		{#if communityMondrookProfile}
			<div hidden={active_step != 8}>
				<Step14 {communityMondrookProfile} {communityMondrookWorkshopOptions} />
			</div>
			<div hidden={active_step != 9}>
				<Step15 {communityMondrookProfile} {communityMondrookInformationOptions} />
			</div>
			<div hidden={active_step != 10}>
				<Step16 {communityMondrookProfile} {communityMondrookMeetingOptions} />
			</div>
		{/if}
		{#if communityExternalProfile}
			<div hidden={active_step != 8}>
				<Step17 {communityExternalProfile} {communityExternalWorkshopOptions} />
			</div>
			<div hidden={active_step != 9}>
				<Step18 {communityExternalProfile} {communityExternalInformationOptions} />
			</div>
			<div hidden={active_step != 10}>
				<Step19 {communityExternalProfile} {communityExternalMeetingOptions} />
			</div>
		{/if}
		<div hidden={active_step != 11}>
			<Step20 {userProfile} {userPostalAddress} {userProfileStayInTouchOptions} {communityName} />
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
