<script lang="ts">
	export let messages: any;
</script>

<div class="flex flex-row justify-around pt-2 text-xl">Messages</div>
<div class="flex flex-col my-4 mx-4">
	{#each messages as message}
		<p class="m-2">{message.message}</p>
	{/each}
</div>
