<script lang="ts">
	export let name: string;
	export let lable: string;
	export let inputClass: string;
	export let divClass = 'flex flex-col justify-center items-center';
	export let lableClass: string;
	export let inputValue: number | null;
</script>

<div class={divClass}>
	<label class={lableClass} for={name}>{lable}</label>
	<input type="number" id={name} {name} class={inputClass} value={inputValue} min="0" />
</div>
