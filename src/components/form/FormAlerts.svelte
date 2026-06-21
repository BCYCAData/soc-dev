<script lang="ts">
	interface Props {
		unsaved: boolean;
		formError: boolean;
		formSuccess: boolean;
		errorMessage?: string;
	}

	let { unsaved, formError, formSuccess, errorMessage = '' }: Props = $props();

	let showSuccess = $state(false);

	$effect(() => {
		if (formSuccess) {
			showSuccess = true;
			const timer = setTimeout(() => {
				showSuccess = false;
			}, 3000);

			return () => clearTimeout(timer);
		}
	});
</script>

{#if unsaved}
	<div class="border-secondary-500 bg-secondary-100 text-secondary-700 border-l-4 p-4" role="alert">
		<p>You have unsaved changes. Don't forget to save before leaving this page.</p>
	</div>
{/if}

{#if formError}
	<div class="border-error-500 bg-error-100 text-error-700 border-l-4 p-4" role="alert">
		<p>{errorMessage}</p>
	</div>
{/if}

{#if showSuccess}
	<div class="border-success-500 bg-success-100 text-success-700 border-l-4 p-4" role="alert">
		<p>Your changes have been saved</p>
	</div>
{/if}
