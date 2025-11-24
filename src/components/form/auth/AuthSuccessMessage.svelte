<script lang="ts">
	interface Props {
		message: string[];
	}

	let { message }: Props = $props();
</script>

<div
	class="my-1 inline-flex w-full items-center rounded-lg bg-green-100 py-3 text-green-700"
	role="alert"
	aria-live="assertive"
>
	<svg
		class="m-2 h-4 w-4 fill-current"
		aria-hidden="true"
		focusable="false"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
	>
		<path
			fill="currentColor"
			d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
		/>
	</svg>
	<span class="text-sm font-medium">
		{message[0]}
		{#if message.length === 2}
			<span class="ml-2">{message[1]}</span>
		{/if}
	</span>
</div>
