<script lang="ts">
	import SurveyFormContainer from '$components/form/survey/SurveyFormContainer.svelte';
	import ProgressBar from '$components/form/ProgressBar.svelte';

	export let data;

	let steps = [
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'11',
		'12',
		'13',
		'14',
		'15',
		'16',
		'17',
		'18',
		'19',
		'20',
		'21'
	];
	let currentActive = 1;
	let progressBar: ProgressBar;

	const {
		propertyProfileData,
		propertyAgentData,
		propertyGeometryData,
		userProfileData,
		userPostalAddressData,
		communityBCYCAProfileData,
		communityTinoneeProfileData,
		communityMondrookProfileData,
		communityExternalProfileData
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
			active_step={steps[currentActive - 1]}
			{propertyProfileData}
			{propertyAgentData}
			{userProfileData}
			{userPostalAddressData}
			{communityBCYCAProfileData}
			{communityTinoneeProfileData}
			{communityMondrookProfileData}
			{communityExternalProfileData}
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
