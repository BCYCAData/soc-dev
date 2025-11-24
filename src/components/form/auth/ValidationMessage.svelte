<script lang="ts">
	interface Props {
		children: () => any;
		className?: string;
	}
	let { children, className }: Props = $props();
</script>

<div
	class="bg-error-50 text-error-700 m-1 rounded-lg p-2 {className}"
	role="alert"
	aria-live="polite"
>
	<small>
		{@render children()}
	</small>
</div>
