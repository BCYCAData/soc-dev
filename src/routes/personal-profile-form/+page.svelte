<script lang="ts">
	import PersonalProfileFormContainer from '$components/form/personal-emergency-profile/PersonalProfileFormContainer.svelte';
	import ProgressBar from '$components/form/ProgressBar.svelte';

	import type { ActionData, PageData } from './$types';
	import type { SvelteComponent } from 'svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	interface ProgressBarInstance extends SvelteComponent {
		handleProgress: (stepIncrement: number) => void;
		skipTo: (e: MouseEvent | KeyboardEvent | CustomEvent<any>) => void;
	}

	// let { data = $bindable(), form }: Props = $props();
	let { data = $bindable() }: Props = $props();
	let currentActive = $state(1);
	let progressBar: ProgressBarInstance;

	const propertyWasRented = data.userProfile.property_profile.property_rented || false;
	const { steps } = data;
	const optionsData = {
		userOptionsData: {
			table_name: 'user_profile',
			object_names: data.optionsData.userOptionsData.object_names
		},
		communityBCYCAOptionsData: {
			table_name: 'community_bcyca_profile',
			object_names: data.optionsData.communityBCYCAOptionsData.object_names
		},
		communityExternalOptionsData: {
			table_name: 'community_external_profile',
			object_names: data.optionsData.communityExternalOptionsData.object_names
		},
		communityMondrookOptionsData: {
			table_name: 'community_mondrook_profile',
			object_names: data.optionsData.communityMondrookOptionsData.object_names
		},
		communityTinoneeOptionsData: {
			table_name: 'community_tinonee_profile',
			object_names: data.optionsData.communityTinoneeOptionsData.object_names
		}
	};

	// const handleProgress = (stepIncrement: number) => {
	// 	progressBar?.handleProgress(stepIncrement);
	// };
	const handleProgress = async (stepIncrement: number) => {
		const formElement = document.querySelector('#personalProfileForm');
		if (formElement instanceof HTMLFormElement) {
			const formData = new FormData(formElement);
			try {
				const response = await fetch('?/saveData', {
					method: 'POST',
					body: formData
				});
				if (response.ok) {
					progressBar?.handleProgress(stepIncrement);
				}
			} catch (error) {
				console.error('Error saving form data:', error);
			}
		} else {
			progressBar?.handleProgress(stepIncrement);
		}
	};

	// const skipTo = (e: MouseEvent | KeyboardEvent | CustomEvent<any>) => {
	// 	progressBar?.skipTo(e);
	// };

	const skipTo = async (e: MouseEvent | KeyboardEvent | CustomEvent<any>) => {
		const formElement = document.querySelector('#personalProfileForm');
		if (formElement instanceof HTMLFormElement) {
			const formData = new FormData(formElement);
			try {
				const response = await fetch('?/saveData', {
					method: 'POST',
					body: formData
				});
				if (response.ok) {
					progressBar?.skipTo(e);
				} else {
					console.error('Failed to save form data');
				}
			} catch (error) {
				console.error('Error saving form data:', error);
			}
		} else {
			progressBar?.skipTo(e);
		}
	};
</script>

<svelte:head>
	<title>Personal Profile Form</title>
</svelte:head>

<div class="mx-auto flex h-full w-full justify-center bg-secondary-50 text-surface-950">
	<div class="mb-5 bg-secondary-100 sm:w-11/12">
		<PersonalProfileFormContainer
			active_step={steps[currentActive - 1].index}
			{propertyWasRented}
			userProfile={data.userProfile}
			{optionsData}
			{steps}
			onFormResult={({ success, message, formData }) => {
				if (success) {
					// Show success notification
					console.log('Survey Form submitted successfully:', message);
				} else {
					// Show error notification
					console.log('Failed to submit survey form:', message);
				}
			}}
		/>
		<div class="mx-auto pt-0 sm:w-8/12">
			<ProgressBar {steps} bind:currentActive bind:this={progressBar} onStepClick={skipTo} />
			<div class="mt-1 text-center">
				<button
					class="scale 98 rounded-xl bg-secondary-500 px-[20px] py-[6px] text-secondary-50 focus:outline-none active:transform disabled:cursor-not-allowed disabled:bg-slate-300"
					onclick={() => handleProgress(-1)}
					disabled={currentActive === 1}
				>
					Prev
				</button>
				<button
					class="scale 98 rounded-xl bg-secondary-500 px-[20px] py-[6px] text-secondary-50 focus:outline-none active:transform disabled:cursor-not-allowed disabled:bg-slate-300"
					onclick={() => handleProgress(1)}
					hidden={currentActive === steps?.length}
				>
					Next
				</button>
			</div>
		</div>
	</div>
</div>
