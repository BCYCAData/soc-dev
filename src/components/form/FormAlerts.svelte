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
	<div class="border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700" role="alert">
		<p>You have unsaved changes. Don't forget to save before leaving this page.</p>
	</div>
{/if}

{#if formError}
	<div class="border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
		<p>{errorMessage}</p>
	</div>
{/if}

{#if showSuccess}
	<div class="border-l-4 border-green-500 bg-green-100 p-4 text-green-700" role="alert">
		<p>Your changes have been saved</p>
	</div>
{/if}
