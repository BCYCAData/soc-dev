<script lang="ts">
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
</script>

<div class="bg-error-50 mx-auto max-w-md rounded-xl p-6 text-center shadow-md">
	<div class="error-icon text-error-500 mb-4 flex justify-center">
		<AlertTriangle size={48} strokeWidth={2} />
	</div>

	<h2 class="h2 text-error-700 mb-2">Network Error</h2>

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

	<div class="flex justify-center gap-4">
		<button on:click={() => window.location.reload()} class="variant-filled-primary btn">
			Retry
		</button>
		<a href="/" class="variant-ghost-secondary btn"> Return Home </a>
	</div>
</div>
