<script lang="ts">
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
</script>

<div class="bg-error-50 mx-auto max-w-md rounded-xl p-6 text-center shadow-md">
	<div class="error-icon text-error-500 mb-4 flex justify-center">
		<AlertTriangle size={48} strokeWidth={2} />
	</div>

	<h2 class="h2 text-error-700 mb-2">Network Error</h2>

	<p class="text-surface-600 mb-4">
		Unfortunately, there was a problem processing your request. Our system is currently experiencing
		technical difficulties.
	</p>

	<div class="mb-4">
		<p class="text-surface-700 mb-2">
			Please try again later or
			<a
				href="../contact/"
				class="text-tertiary-600 hover:text-tertiary-800 underline transition-colors"
			>
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
