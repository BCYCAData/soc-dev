<script lang="ts">
	import type { HelpSection } from '$lib/types';

	interface Props {
		section: HelpSection;
	}

	let { section }: Props = $props();

	// Cross-family light→dark fills (family tint → surface-800), which Skeleton Color
	// Pairings can't express, so these resolve via plain `.dark`-selector rules in app.css.
	const importanceClasses = {
		info: 'help-callout-info',
		warning: 'help-callout-warning',
		tip: 'help-callout-tip'
	};

	let sectionClass = $derived(
		section.importance ? `border-l-4 p-1 my-1 ${importanceClasses[section.importance]}` : 'my-1'
	);
</script>

{#if section.title}
	<h4 class=" font-semibold">{section.title}</h4>
{/if}
<div class={sectionClass}>
	{#each section.content.split('\n\n') as paragraph (paragraph)}
		<p class="mb-1">{paragraph}</p>
	{/each}
</div>
