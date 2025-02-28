<script lang="ts">
	import type { HelpSection } from '$lib/types';

	interface Props {
		section: HelpSection;
	}

	let { section }: Props = $props();

	const importanceClasses = {
		info: 'bg-blue-50 border-blue-200',
		warning: 'bg-yellow-50 border-yellow-200',
		tip: 'bg-green-50 border-green-200'
	};

	let sectionClass = $derived(
		section.importance ? `border-l-4 p-1 my-1 ${importanceClasses[section.importance]}` : 'my-1'
	);
</script>

{#if section.title}
	<h4 class=" font-semibold">{section.title}</h4>
{/if}
<div class={sectionClass}>
	{#each section.content.split('\n\n') as paragraph}
		<p class="mb-1">{paragraph}</p>
	{/each}
</div>
