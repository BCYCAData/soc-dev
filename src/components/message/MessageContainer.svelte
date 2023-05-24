<script lang="ts">
	import type { AppMessageFunctionData } from '$lib/custom.types';

	export let messagesData: AppMessageFunctionData;
</script>

<div class="flex flex-row justify-around pt-2 text-xl">Messages</div>
<div class="flex flex-col my-4 mx-4">
	{#if messagesData}
		{#each messagesData as profileMessage}
			<!-- <p class="m-2">{profileMessage.message}</p> -->
			<div class="card mt-2 rounded-b-md">
				<header class="bg-primary-300 font-medium rounded-t-md px-2 pt-2 pb-1 card-header">
					Message
				</header>
				<div class="px-2 text-sm bg-primary-50">{profileMessage.message}</div>
				<div class="flex justify-end">
					<footer class="card-footer text-xs pb-2">Sent {profileMessage.created_at}</footer>
				</div>
			</div>
		{/each}
	{:else}
		<!-- <p class="m-2">No messages</p> -->
		<div class="card">
			<header class="card-header">No Messages</header>
		</div>
	{/if}
</div>

<style>
	/* .card {
		border-radius: 20px !important;
	} */
	/* .card-header {
		border-radius: 20px !important;
	} */
</style>
