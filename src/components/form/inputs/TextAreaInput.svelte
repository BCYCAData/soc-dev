<script lang="ts">
	export let lableClass: string | null;
	export let lableText: string | null;
	export let headingClass: string | null;
	export let headingText: string | null;
	export let nameText: string;
	export let divClass: string;
	export let textAreaClass: string;
	export let inputValue: string | null;
</script>

{#if headingClass && headingText}
	<h2 class={headingClass}>{headingText}</h2>
{/if}
<div class={divClass}>
	{#if lableClass && lableText}
		<label class={lableClass} for={nameText}>{lableText}</label>
	{/if}
	<textarea id={nameText} name={nameText} class={textAreaClass} value={inputValue} />
</div>
