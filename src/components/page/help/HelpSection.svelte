<script lang="ts">
	import type { HelpSection } from '$lib/types';

	interface Props {
		section: HelpSection;
	}

	let { section }: Props = $props();

	const importanceClasses = {
		info: 'bg-tertiary-50 border-tertiary-200 dark:bg-surface-800 dark:border-tertiary-500',
		warning: 'bg-secondary-50 border-secondary-200 dark:bg-surface-800 dark:border-secondary-500',
		tip: 'bg-success-50 border-success-200 dark:bg-surface-800 dark:border-success-500'
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
