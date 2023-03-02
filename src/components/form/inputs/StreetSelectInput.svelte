<script lang="ts">
	export let streetList: string[];
	export let nameText: string;
	export let requiredValue: boolean;
	export let classText: string;
	export let selectedStreet: string;
	let local: string;
	$: selectedStreet = local;
</script>

<select bind:value={local} id={nameText} name={nameText} class={classText} required={requiredValue}>
	<option value="" disabled selected>Select a street name</option>
	{#each streetList as street}
		<option value={street}>
			{street}
		</option>
	{/each}
</select>
