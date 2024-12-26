<script lang="ts">
	type Props = {
		name: string;
		lable: string;
		inputClass: string;
		divClass?: string;
		lableClass: string;
		inputValue: number | null | undefined;
	};

	let {
		name,
		lable,
		inputClass,
		divClass = 'flex flex-col justify-center items-center',
		lableClass,
		inputValue = $bindable()
	}: Props = $props();
</script>

<div class={divClass}>
	<label class={lableClass} for={name}>{lable}</label>
	<input type="number" id={name} {name} class={inputClass} value={inputValue} min="0" />
</div>
