<script lang="ts">
	import { helpContent } from '$stores/helpstore';
	import HelpToggleIcon from '$components/icons/HelpToggleIcon.svelte';
	import HelpSection from '$components/page/help/HelpSection.svelte';
	import { browser } from '$app/environment';

	interface Props {
		isCollapsed?: boolean;
	}

	let { isCollapsed = $bindable(false) }: Props = $props();

	function toggleHelp() {
		isCollapsed = !isCollapsed;
		if (browser) {
			localStorage.setItem('helpbarCollapsed', isCollapsed.toString());
		}
	}
</script>

<div class="help-panel {isCollapsed ? 'w-16' : 'w-1/6'} transition-all duration-300">
	{#if $helpContent && $helpContent.hasHelp}
		<button class="collapse-toggle self-end p-2" onclick={toggleHelp}>
			<HelpToggleIcon color="#EA580C" size={28} />
		</button>

		{#if !isCollapsed}
			<div class="bg-orange-100 p-4">
				{#if $helpContent.title}
					<h3 class="mb-4 font-bold">{$helpContent.title}</h3>
				{/if}

				{#if $helpContent.sections}
					{#each $helpContent.sections as section}
						<HelpSection {section} />
					{/each}
				{:else if $helpContent.content}
					<p>{$helpContent.content}</p>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style lang="postcss">
	.help-panel {
		overflow-y: auto;
	}
</style>
