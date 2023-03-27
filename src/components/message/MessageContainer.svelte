<script lang="ts">
	import type { AppMessageFunctionData } from '$lib/db.types';

	export let messagesData: AppMessageFunctionData;
</script>

<div class="flex flex-row justify-around pt-2 text-xl">Messages</div>
<div class="flex flex-col my-4 mx-4">
	{#if messagesData}
		{#each messagesData as profileMessage}
			<p class="m-2">{profileMessage.message}</p>
		{/each}
	{:else}
		<p class="m-2">No messages</p>
	{/if}
</div>
