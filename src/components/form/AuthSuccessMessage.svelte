<script lang="ts">
	export let message: string[];
</script>

<div
	class="bg-green-100 rounded-lg py-3 my-1 text-base text-green-700 inline-flex items-center w-full"
	role="alert"
>
	<div class="flex items-center mx-auto">
		<svg
			aria-hidden="true"
			focusable="false"
			data-prefix="fas"
			data-icon="check-circle"
			class="w-9 h-9 p-2 fill-current"
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
		>
			<path
				fill="currentColor"
				d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
			/>
		</svg>
		<p class="mx-auto">{message[0]}</p>
	</div>
	{#if message.length == 2}
		<p class="mx-auto">{message[1]}</p>
	{/if}
</div>
