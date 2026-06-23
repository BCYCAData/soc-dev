<script lang="ts">
	interface Props {
		href: string;
		label?: string;
		ariaLabel?: string;
	}

	let { href, label = 'Tap here to send us an email', ariaLabel }: Props = $props();
</script>

<div class="mt-5">
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		{href}
		class="bg-secondary-500 text-secondary-50 mt-5 inline-block rounded-xl p-2 font-medium hover:underline"
		aria-label={ariaLabel}
	>
		{label}
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
</div>
