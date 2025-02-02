<script lang="ts">
	import { enhance } from '$app/forms';

	import type { SubmitFunction } from '@sveltejs/kit';

	import Step1 from '$components/form/personal-emergency-profile/Step1.svelte';
	import Step2 from '$components/form/personal-emergency-profile/Step2.svelte';
	import Step3 from '$components/form/personal-emergency-profile/Step3.svelte';
	import Step4 from '$components/form/personal-emergency-profile/Step4.svelte';
	import Step5 from '$components/form/personal-emergency-profile/Step5.svelte';
	import Step6 from '$components/form/personal-emergency-profile/Step6.svelte';
	import Step7 from '$components/form/personal-emergency-profile/Step7.svelte';
	import Step8 from '$components/form/personal-emergency-profile/Step8.svelte';
	import Step9 from '$components/form/personal-emergency-profile/Step9.svelte';
	import Step10 from '$components/form/personal-emergency-profile/Step10.svelte';
	import Step11 from '$components/form/personal-emergency-profile/Step11.svelte';
	import Step12 from '$components/form/personal-emergency-profile/Step12.svelte';
	import Step13 from '$components/form/personal-emergency-profile/Step13.svelte';
	import Step14 from '$components/form/personal-emergency-profile/Step14.svelte';
	import Step15 from '$components/form/personal-emergency-profile/Step15.svelte';
	import Step16 from '$components/form/personal-emergency-profile/Step16.svelte';
	import Step17 from '$components/form/personal-emergency-profile/Step17.svelte';
	import Step18 from '$components/form/personal-emergency-profile/Step18.svelte';
	import Step19 from '$components/form/personal-emergency-profile/Step19.svelte';
	import Step20 from '$components/form/personal-emergency-profile/Step20.svelte';
	import Step21 from '$components/form/personal-emergency-profile/Step21.svelte';

	import { COMMUNITY_TYPES } from '$lib/constants';
	import type {
		PersonalProfileFormData,
		OptionsData,
		FormOptionsData,
		OptionItem
	} from '$lib/form.types';

	interface FormResult {
		success: boolean;
		message: string;
		formData: any;
	}

	interface Props {
		active_step: number;
		propertyWasRented: boolean;
		userProfile: PersonalProfileFormData;
		optionsData: FormOptionsData;
		onFormResult?: (result: FormResult) => void;
		steps: { index: number; text: string; page: string }[];
	}

	let { active_step, propertyWasRented, userProfile, optionsData, onFormResult, steps }: Props =
		$props();

	let isLoading = $state(false);

	function extractOptionsData(community: string, objectName: string): OptionItem[] {
		const formattedCommunity =
			community === 'BCYCA'
				? community
				: community.charAt(0).toUpperCase() + community.slice(1).toLowerCase();

		const key = `community${formattedCommunity}OptionsData` as keyof NonNullable<FormOptionsData>;
		return (
			optionsData?.[key]?.object_names.find((item: OptionsData) => item.object_name === objectName)
				?.options ?? []
		);
	}

	const communityProfileId =
		userProfile.community_bcyca_profile?.bcyca_profile_id ||
		userProfile.community_tinonee_profile?.tinonee_profile_id ||
		userProfile.community_mondrook_profile?.mondrook_profile_id ||
		userProfile.community_external_profile?.external_profile_id ||
		'';

	const communityBCYCAWorkshopOptions = extractOptionsData(
		COMMUNITY_TYPES.BCYCA,
		'communityWorkshopOptions'
	);
	const communityBCYCAInformationOptions = extractOptionsData(
		COMMUNITY_TYPES.BCYCA,
		'informationSheetOptions'
	);
	const communityBCYCAMeetingOptions = extractOptionsData(
		COMMUNITY_TYPES.BCYCA,
		'communityMeetingOptions'
	);
	// @ts-ignore
	const communityBCYCAStayInTouchOptions = extractOptionsData(
		COMMUNITY_TYPES.BCYCA,
		'stayInTouchOptions'
	);

	const communityExternalWorkshopOptions = extractOptionsData(
		COMMUNITY_TYPES.EXTERNAL,
		'communityWorkshopOptions'
	);
	const communityExternalInformationOptions = extractOptionsData(
		COMMUNITY_TYPES.EXTERNAL,
		'informationSheetOptions'
	);
	const communityExternalMeetingOptions = extractOptionsData(
		COMMUNITY_TYPES.EXTERNAL,
		'communityMeetingOptions'
	);
	// @ts-ignore
	const communityExternalStayInTouchOptions = extractOptionsData(
		COMMUNITY_TYPES.EXTERNAL,
		'stayInTouchOptions'
	);

	const communityMondrookWorkshopOptions = extractOptionsData(
		COMMUNITY_TYPES.MONDROOK,
		'communityWorkshopOptions'
	);
	const communityMondrookInformationOptions = extractOptionsData(
		COMMUNITY_TYPES.MONDROOK,
		'informationSheetOptions'
	);
	const communityMondrookMeetingOptions = extractOptionsData(
		COMMUNITY_TYPES.MONDROOK,
		'communityMeetingOptions'
	);
	// @ts-ignore
	const communityMondrookStayInTouchOptions = extractOptionsData(
		COMMUNITY_TYPES.MONDROOK,
		'stayInTouchOptions'
	);

	const communityTinoneeWorkshopOptions = extractOptionsData(
		COMMUNITY_TYPES.TINONEE,
		'communityWorkshopOptions'
	);
	const communityTinoneeInformationOptions = extractOptionsData(
		COMMUNITY_TYPES.TINONEE,
		'informationSheetOptions'
	);
	const communityTinoneeMeetingOptions = extractOptionsData(
		COMMUNITY_TYPES.TINONEE,
		'communityMeetingOptions'
	);
	// @ts-ignore
	const communityTinoneeStayInTouchOptions = extractOptionsData(
		COMMUNITY_TYPES.TINONEE,
		'stayInTouchOptions'
	);

	const userProfileStayInTouchOptionsData = optionsData?.userOptionsData?.object_names.find(
		(item: { object_name: string }) => item.object_name === 'stayInTouchOptions'
	);
	const userProfileStayInTouchOptions = userProfileStayInTouchOptionsData?.options;

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		return async ({ result, update }) => {
			await update();

			if (result.type === 'failure') {
				onFormResult?.({
					success: false,
					message: 'Failed to update profile. Please try again.',
					formData: result.data
				});
			} else if (result.type === 'success') {
				onFormResult?.({
					success: false,
					message: 'Profile updated successfully!',
					formData: result.data
				});
			}
			console.log('Form Submission Result:', result);
			isLoading = false;
		};
	};
</script>

<div class="mx-auto sm:w-11/12">
	<div
		class="text-scale-5 p-1 text-center text-orange-600"
		hidden={active_step == 1 || active_step == 12}
	>
		Please complete all steps and tap
		<span
			class="text-scale-3 rounded-lg border border-purple-700 bg-[#0099E8] p-1 font-semibold text-secondary-50"
		>
			Save My Answers
		</span>
		at Step 12
	</div>
	<form
		method="post"
		action="/personal-profile-form"
		id="personalProfileForm"
		use:enhance={handleSubmit}
	>
		<input
			type="hidden"
			name="communityName"
			value={userProfile?.property_profile?.community_areas?.[0]?.community ?? ''}
		/>
		<input type="hidden" name="propertyId" value={userProfile?.property_profile?.id ?? ''} />
		<input type="hidden" name="propertyWasRented" value={propertyWasRented} />
		<input type="hidden" name="communityProfileId" value={communityProfileId} />

		<!-- Base steps - always shown -->
		<div hidden={active_step != 1}><Step1 /></div>
		<div hidden={active_step != 2}><Step2 {userProfile} {propertyWasRented} /></div>
		<div hidden={active_step != 3}><Step3 {userProfile} /></div>
		<div hidden={active_step != 4}><Step4 propertyProfile={userProfile.property_profile} /></div>
		<div hidden={active_step != 5}><Step5 propertyProfile={userProfile.property_profile} /></div>
		<div hidden={active_step != 6}><Step6 propertyProfile={userProfile.property_profile} /></div>
		<div hidden={active_step != 7}><Step7 {userProfile} /></div>

		<!-- BCYCA Profile Steps -->
		{#if userProfile.community_bcyca_profile}
			<div hidden={active_step != 8}>
				<Step8
					communityBCYCAProfile={userProfile.community_bcyca_profile}
					{communityBCYCAWorkshopOptions}
				/>
			</div>
			<div hidden={active_step != 9}>
				<Step9
					communityBCYCAProfile={userProfile.community_bcyca_profile}
					{communityBCYCAInformationOptions}
				/>
			</div>
			<div hidden={active_step != 10}>
				<Step10
					communityBCYCAProfile={userProfile.community_bcyca_profile}
					{communityBCYCAMeetingOptions}
				/>
			</div>
		{/if}

		<!-- Tinonee Profile Steps -->
		{#if userProfile.community_tinonee_profile}
			<div hidden={active_step != 11}>
				<Step11
					communityTinoneeProfile={userProfile.community_tinonee_profile}
					{communityTinoneeWorkshopOptions}
				/>
			</div>
			<div hidden={active_step != 12}>
				<Step12
					communityTinoneeProfile={userProfile.community_tinonee_profile}
					{communityTinoneeInformationOptions}
				/>
			</div>
			<div hidden={active_step != 13}>
				<Step13
					communityTinoneeProfile={userProfile.community_tinonee_profile}
					{communityTinoneeMeetingOptions}
				/>
			</div>
		{/if}

		<!-- Mondrook Profile Steps -->
		{#if userProfile.community_mondrook_profile}
			<div hidden={active_step != 14}>
				<Step14
					communityMondrookProfile={userProfile.community_mondrook_profile}
					{communityMondrookWorkshopOptions}
				/>
			</div>
			<div hidden={active_step != 15}>
				<Step15
					communityMondrookProfile={userProfile.community_mondrook_profile}
					{communityMondrookInformationOptions}
				/>
			</div>
			<div hidden={active_step != 16}>
				<Step16
					communityMondrookProfile={userProfile.community_mondrook_profile}
					{communityMondrookMeetingOptions}
				/>
			</div>
		{/if}

		<!-- External Profile Steps -->
		{#if userProfile.community_external_profile}
			<div hidden={active_step != 17}>
				<Step17
					communityExternalProfile={userProfile.community_external_profile}
					{communityExternalWorkshopOptions}
				/>
			</div>
			<div hidden={active_step != 18}>
				<Step18
					communityExternalProfile={userProfile.community_external_profile}
					{communityExternalInformationOptions}
				/>
			</div>
			<div hidden={active_step != 19}>
				<Step19
					communityExternalProfile={userProfile.community_external_profile}
					{communityExternalMeetingOptions}
				/>
			</div>
		{/if}

		<!-- Final Steps -->
		<div hidden={active_step != steps.length - 1}>
			<Step20
				{userProfile}
				{userProfileStayInTouchOptions}
				communityName={userProfile?.property_profile?.community_areas?.[0]?.community ?? ''}
			/>
		</div>
		<div hidden={active_step != steps.length}>
			<Step21 />
		</div>

		<div class="sm:text-scale-5 flex flex-col items-center justify-center">
			<button
				class="text-scale-3 mx-3 mb-3 w-1/4 rounded-lg border border-purple-700 bg-[#0099E8] font-semibold text-secondary-50"
				hidden={active_step != steps.length}
				type="submit"
				form="personalProfileForm"
				disabled={isLoading}
			>
				{isLoading ? 'Saving...' : 'Save My Answers'}
			</button>
		</div>
	</form>
</div>
