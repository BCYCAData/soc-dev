<script lang="ts">
	interface Props {
		errorMessage: string;
	}

	let { errorMessage }: Props = $props();
</script>

<div class="error-alert" role="alert" aria-live="assertive">
	<svg
		class="error-icon"
		aria-hidden="true"
		focusable="false"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
	>
		<path
			fill="currentColor"
			d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
		/>
	</svg>
	<span class="error-message">{errorMessage}</span>
</div>

<style lang="postcss">
	.error-alert {
		@apply my-1 inline-flex w-full items-center rounded-lg bg-error-50 py-3 text-error-700;
	}

	.error-icon {
		@apply m-2 h-4 w-4 fill-current;
	}

	.error-message {
		@apply text-sm font-medium;
	}
</style>
