<script lang="ts">
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
</script>

<div class="error-container mx-auto max-w-md p-6 text-center">
	<div class="error-icon mb-4 flex justify-center text-error-500">
		<AlertTriangle size={48} strokeWidth={2} />
	</div>

	<h2 class="h2 mb-2 text-error-700">Network Error</h2>

	<p class="mb-4 text-neutral-600">
		Unfortunately, there was a problem processing your request. Our system is currently experiencing
		technical difficulties.
	</p>

	<div class="mb-4">
		<p class="mb-2 text-neutral-700">
			Please try again later or
			<a href="../contact/" class="text-blue-600 underline transition-colors hover:text-blue-800">
				contact our support team
			</a>
			for assistance.
		</p>
	</div>

	<div class="error-actions flex justify-center gap-4">
		<button on:click={() => window.location.reload()} class="variant-filled-primary btn">
			Retry
		</button>
		<a href="/" class="variant-ghost-secondary btn"> Return Home </a>
	</div>
</div>

<style lang="postcss">
	.error-container {
		@apply rounded-xl bg-error-50 shadow-md;
	}
</style>
