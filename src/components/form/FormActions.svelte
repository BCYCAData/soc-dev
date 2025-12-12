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
		<button
			type="button"
			onclick={onReset}
			class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
		>
			Undo Changes
		</button>
		<button
			type="submit"
			disabled={!isUnsaved || isSubmitting}
			aria-busy={isSubmitting}
			class="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if isSubmitting}
				<Spinner size="sm" /> Saving...
			{:else}
				Save My Answers
			{/if}
		</button>
	</div>
</div>
