<script lang="ts">
	import PersonalProfileFormContainer from '$components/form/personal-emergency-profile/PersonalProfileFormContainer.svelte';
	import ProgressBar from '$components/form/ProgressBar.svelte';

	import { invalidateAll } from '$app/navigation';

	import { Loader } from 'lucide-svelte';

	import type { ActionData, PageData } from './$types';
	import type { SvelteComponent } from 'svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	interface ProgressBarInstance extends SvelteComponent {
		handleProgress: (stepIncrement: number) => void;
		skipTo: (e: MouseEvent | KeyboardEvent | CustomEvent<unknown>) => void;
	}

	// let { data = $bindable(), form }: Props = $props();
	let { data = $bindable() }: Props = $props();

	// Outstanding required questions at page load, grouped by section, so users can
	// see exactly what remains. (Reflects the profile as loaded; refreshes on next visit.)
	const completion = $derived(data.completion);
	const missingBySection = $derived.by(() => {
		const map = new Map<string, string[]>();
		for (const item of completion.missing) {
			const list = map.get(item.section) ?? [];
			list.push(item.label);
			map.set(item.section, list);
		}
		return [...map.entries()];
	});

	let currentActive = $state(1);
	let isPrevLoading = $state(false);
	let isNextLoading = $state(false);

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
		if (stepIncrement === 1) {
			isNextLoading = true;
		} else {
			isPrevLoading = true;
		}

		const formElement = document.querySelector('#personalProfileForm');
		if (formElement instanceof HTMLFormElement) {
			const formData = new FormData(formElement);
			try {
				const response = await fetch('?/saveData', {
					method: 'POST',
					body: formData
				});
				if (response.ok) {
					// Re-run load so the completion banner reflects the just-saved answers.
					await invalidateAll();
					progressBar?.handleProgress(stepIncrement);
				}
			} catch (error) {
				console.error('Error saving form data:', error);
			}
		} else {
			progressBar?.handleProgress(stepIncrement);
		}
		if (stepIncrement === 1) {
			isNextLoading = false;
		} else {
			isPrevLoading = false;
		}
	};
	// const skipTo = (e: MouseEvent | KeyboardEvent | CustomEvent<unknown>) => {
	// 	progressBar?.skipTo(e);
	// };

	const skipTo = async (e: MouseEvent | KeyboardEvent | CustomEvent<unknown>) => {
		const formElement = document.querySelector('#personalProfileForm');
		if (formElement instanceof HTMLFormElement) {
			const formData = new FormData(formElement);
			try {
				const response = await fetch('?/saveData', {
					method: 'POST',
					body: formData
				});
				if (response.ok) {
					// Re-run load so the completion banner reflects the just-saved answers.
					await invalidateAll();
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

<div class="bg-secondary-50-950 text-surface-950-50 mx-auto flex h-full w-full justify-center">
	<div class="bg-secondary-100-900 mb-5 sm:w-11/12">
		{#if completion.total > 0}
			<div class="mx-auto px-4 pt-4 sm:w-10/12">
				{#if completion.isComplete}
					<div class="preset-filled-success-500 rounded-lg p-3 text-sm" role="status">
						✓ All {completion.total} required questions are answered — your profile is complete.
					</div>
				{:else}
					<details class="bg-surface-50-950 rounded-lg p-3 shadow">
						<summary class="cursor-pointer font-semibold">
							Profile {completion.percent}% complete — {completion.answered} of {completion.total}
							required questions answered ({completion.missing.length} still needed)
						</summary>
						<div class="mt-3 grid gap-3 text-sm sm:grid-cols-2">
							{#each missingBySection as [section, labels] (section)}
								<div>
									<p class="font-semibold">{section}</p>
									<ul class="list-disc pl-5 opacity-90">
										{#each labels as label (label)}
											<li>{label}</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>
					</details>
				{/if}
			</div>
		{/if}
		<PersonalProfileFormContainer
			active_step={steps[currentActive - 1].index}
			{propertyWasRented}
			userProfile={data.userProfile}
			{optionsData}
			{steps}
			onFormResult={({ success, message }) => {
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
					class="scale 98 bg-secondary-500 text-secondary-50 disabled:bg-surface-300 inline-flex items-center gap-2 rounded-xl px-5 py-1.5 focus:outline-none active:transform disabled:cursor-not-allowed"
					onclick={() => handleProgress(-1)}
					disabled={currentActive === 1}
				>
					{#if isPrevLoading}
						<Loader class="animate-spin-reverse h-4 w-4" />
					{/if}
					<span>Prev</span>
				</button>
				<button
					class="scale 98 bg-secondary-500 text-secondary-50 disabled:bg-surface-300 inline-flex items-center gap-2 rounded-xl px-5 py-1.5 focus:outline-none active:transform disabled:cursor-not-allowed"
					onclick={() => handleProgress(1)}
					hidden={currentActive === steps?.length}
				>
					<span>Next</span>
					{#if isNextLoading}
						<Loader class="h-4 w-4 animate-spin" />
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes spin-reverse {
		from {
			transform: rotate(360deg);
		}
		to {
			transform: rotate(0deg);
		}
	}

	:global(.animate-spin-reverse) {
		animation: spin-reverse 1s linear infinite;
	}
</style>
