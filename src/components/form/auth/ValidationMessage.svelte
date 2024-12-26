<script lang="ts">
	interface Props {
		children: () => any;
		className?: string;
	}
	let { children, className }: Props = $props();
</script>

<div class="validation-message {className}" role="alert" aria-live="polite">
	<small>
		{@render children()}
	</small>
</div>

<style lang="postcss">
	.validation-message {
		@apply m-1 rounded-lg bg-error-50 p-2 text-error-700;
	}
</style>
