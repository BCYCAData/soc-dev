<script lang="ts">
	import type { AppMessageFunctionData } from '$lib/types';

	interface Props {
		messagesData: AppMessageFunctionData;
	}

	let { messagesData }: Props = $props();
</script>

<div class="flex flex-row justify-around pt-2 text-xl">Messages</div>
<div class="mx-4 my-4 flex flex-col">
	{#if messagesData}
		{#each messagesData as profileMessage (profileMessage)}
			<div class="card mt-2 rounded-[20px]">
				<header class="card-header bg-tertiary-300 rounded-t-[20px] px-2 py-1 font-medium">
					Message
				</header>
				<div class="bg-primary-50 px-2 text-sm">{profileMessage.message}</div>
				<div class="flex justify-end">
					<footer class="card-footer pb-2 text-xs">Sent {profileMessage.created_at}</footer>
				</div>
			</div>
		{/each}
	{:else}
		<div class="card">
			<header class="card-header">No Messages</header>
		</div>
	{/if}
</div>
