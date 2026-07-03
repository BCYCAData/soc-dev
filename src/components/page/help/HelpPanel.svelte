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
				class="help-toggle-label flex text-sm {!isCollapsed
					? 'flex-row items-center gap-2'
					: 'flex-col items-center'}"
			>
				<HelpToggleIcon color="currentColor" size={24} />
				{!isCollapsed ? 'Hide help' : ''}
			</div>
		</button>
		{#if !isCollapsed}
			<div class="help-panel-body p-4">
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

	/* secondary-800→300 (non-balanced) and secondary-100→surface-800 (cross-family):
	   neither is a valid Skeleton Color Pairing, so use the .dark selector directly. */
	.help-toggle-label {
		color: var(--color-secondary-800);
	}
	:global(.dark) .help-toggle-label {
		color: var(--color-secondary-300);
	}

	.help-panel-body {
		background-color: var(--color-secondary-100);
	}
	:global(.dark) .help-panel-body {
		background-color: var(--color-surface-800);
	}
</style>
