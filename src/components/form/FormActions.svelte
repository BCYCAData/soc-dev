<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';

	interface Props {
		onReset: () => void;
		isUnsaved: boolean;
		isSubmitting: boolean;
	}
	let { onReset, isUnsaved, isSubmitting }: Props = $props();
</script>

<div class="sticky bottom-2 mt-5">
	<div class="flex justify-end space-x-4">
		<button type="button" onclick={onReset} class="btn btn-sm preset-tonal-surface font-medium">
			Undo Changes
		</button>
		<button
			type="submit"
			disabled={!isUnsaved || isSubmitting}
			aria-busy={isSubmitting}
			class="btn btn-sm preset-filled-primary-500 font-medium shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if isSubmitting}
				<Spinner size="sm" /> Saving...
			{:else}
				Save My Answers
			{/if}
		</button>
	</div>
</div>
