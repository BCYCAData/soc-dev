<script lang="ts">
	import SurveyFormContainer from '$components/form/survey/SurveyFormContainer.svelte';
	import ProgressBar from '$components/form/ProgressBar.svelte';

	export let data;

	let currentActive = 1;
	let progressBar: ProgressBar;

	const {
		steps,
		propertyId,
		communityName,
		propertyAddress,
		propertyWasRented,
		property_profile: propertyProfile,
		property_agent: propertyAgent,
		userProfile,
		user_postal_address: userPostalAddress,
		community_bcyca_profile: communityBCYCAProfile,
		community_tinonee_profile: communityTinoneeProfile,
		community_mondrook_profile: communityMondrookProfile,
		community_external_profile: communityExternalProfile,
		optionsData
	} = data;

	const handleProgress = (stepIncrement: number) => {
		progressBar.handleProgress(stepIncrement);
	};

	const skipTo = (
		e:
			| (MouseEvent & { currentTarget: EventTarget & HTMLDivElement })
			| (KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement })
			| CustomEvent<any>
	) => {
		progressBar.skipTo(e);
	};
</script>

<svelte:head>
	<title>Survey</title>
</svelte:head>

<div class="h-full w-full mx-auto flex justify-center text-gray-900 bg-orange-50">
	<div class="bg-orange-100 mb-5 sm:w-11/12">
		<SurveyFormContainer
			active_step={steps[currentActive - 1].index}
			{propertyId}
			{communityName}
			{propertyAddress}
			{propertyWasRented}
			{propertyProfile}
			{propertyAgent}
			{userProfile}
			{userPostalAddress}
			{communityBCYCAProfile}
			{communityTinoneeProfile}
			{communityMondrookProfile}
			{communityExternalProfile}
			{optionsData}
		/>
		<div class="pt-0 mx-auto sm:w-8/12">
			<ProgressBar
				{steps}
				bind:currentActive
				bind:this={progressBar}
				on:click={(e) => {
					skipTo(e);
				}}
			/>
			<div class="mt-1 text-center">
				<button
					class="px-[20px] py-[6px] text-stone-100 bg-orange-500 rounded-xl focus:outline-none active:transform scale 98 disabled:cursor-not-allowed disabled:bg-slate-300"
					on:click={() => handleProgress(-1)}
					disabled={currentActive == 1}
				>
					Prev
				</button>
				<button
					class="px-[20px] py-[6px] text-stone-100 bg-orange-500 rounded-xl focus:outline-none active:transform scale 98 disabled:cursor-not-allowed disabled:bg-slate-300"
					on:click={() => handleProgress(+1)}
					hidden={currentActive == steps.length}
				>
					Next
				</button>
			</div>
		</div>
	</div>
</div>
