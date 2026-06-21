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
			<div
				class="text-secondary-800 flex text-sm {!isCollapsed
					? 'flex-row items-center gap-2'
					: 'flex-col items-center'}"
			>
				<HelpToggleIcon color="var(--color-secondary-700)" size={24} />
				{!isCollapsed ? 'Hide help' : ''}
			</div>
		</button>
		{#if !isCollapsed}
			<div class="bg-secondary-100 p-4">
				{#if $helpContent.title}
					<h3 class="mb-4 font-bold">{$helpContent.title}</h3>
				{/if}

				{#if $helpContent.sections}
					{#each $helpContent.sections as section (section)}
						<HelpSection {section} />
					{/each}
				{:else if $helpContent.content}
					<p>{$helpContent.content}</p>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.help-panel {
		overflow-y: auto;
	}
</style>
