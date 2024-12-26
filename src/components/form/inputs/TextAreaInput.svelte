<script lang="ts">
	type Props = {
		lableClass: string | null;
		lableText: string | null;
		headingClass: string | null;
		headingText: string | null;
		nameText: string;
		divClass: string;
		textAreaClass: string;
		inputValue: string | null | undefined;
	};

	let {
		lableClass,
		lableText,
		headingClass,
		headingText,
		nameText,
		divClass,
		textAreaClass,
		inputValue = $bindable()
	}: Props = $props();
</script>

{#if headingClass && headingText}
	<h2 class={headingClass}>{headingText}</h2>
{/if}
<div class={divClass}>
	{#if lableClass && lableText}
		<label class={lableClass} for={nameText}>{lableText}</label>
	{/if}
	<textarea id={nameText} name={nameText} class={textAreaClass} value={inputValue}></textarea>
</div>
