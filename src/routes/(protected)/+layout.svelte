<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import ProfileCompletionNag from '$components/profile/ProfileCompletionNag.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<!-- Protected pages have full navigation -->
{#if page.data.profileNag}
	<div class="px-6 pt-4">
		<ProfileCompletionNag nag={page.data.profileNag} />
	</div>
{/if}
{@render children?.()}
