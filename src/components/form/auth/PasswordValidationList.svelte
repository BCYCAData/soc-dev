<script lang="ts">
	export let validations: boolean[];

	const requirements = [
		'at least 8 characters',
		'at least 1 capital letter',
		'at least 1 number',
		'at least 1 symbol (?~!@#%^&*()_+-=,:;|)',
		'matching passwords'
	];
</script>

<ul class="text-scale-4eft mt-2 list-none pl-1">
	Your password must have:
	{#each requirements as requirement, i}
		<li class="pl-4">
			<span class="text-[10px]">{validations[i] ? '✔️' : '❌'}</span>
			<span>{requirement}</span>
		</li>
	{/each}
</ul>
