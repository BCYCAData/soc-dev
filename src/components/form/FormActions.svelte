<script lang="ts">
	interface Props {
		onReset: () => void;
		isUnsaved: boolean;
	}

	let { onReset, isUnsaved }: Props = $props();
</script>

<div class="sticky bottom-2 mt-5">
	<div class="flex justify-end space-x-4">
		<button
			type="button"
			onclick={onReset}
			class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			Undo Changes
		</button>
		<button
			type="submit"
			disabled={!isUnsaved}
			class="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Save My Answers
		</button>
	</div>
</div>
