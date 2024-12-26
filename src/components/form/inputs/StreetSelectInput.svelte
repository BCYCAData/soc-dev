<script lang="ts">
	interface Props {
		streetList: string[];
		nameText: string;
		requiredValue: boolean;
		classText: string;
		selectedStreet: string;
	}

	let {
		streetList,
		nameText,
		requiredValue,
		classText,
		//@ts-ignore
		selectedStreet = $bindable('')
	}: Props = $props();

	let local: string = $state('');

	$effect(() => {
		selectedStreet = local;
	});
</script>

<select bind:value={local} id={nameText} name={nameText} class={classText} required={requiredValue}>
	<option value="" selected>Select a street name</option>
	{#each streetList as street}
		<option value={street}>
			{street}
		</option>
	{/each}
</select>
