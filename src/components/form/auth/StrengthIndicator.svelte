<script lang="ts">
	export let strength: number;
</script>

<div class="bg-surface-50 flex h-5 w-full">
	{#each Array(4) as _, i (i)}
		<div
			class="[&.bar-1]:from-error-500 [&.bar-1]:to-secondary-600 [&.bar-2]:from-secondary-600 [&.bar-2]:to-secondary-400 [&.bar-3]:from-secondary-400 [&.bar-3]:to-secondary-500 [&.bar-4]:from-secondary-500 [&.bar-4]:to-success-600 h-[90%] w-1/4 rounded-md [box-shadow:inset_0px_20px_var(--color-surface-200)] transition-shadow duration-500 last:mr-0 [&.bar-1]:bg-linear-to-r [&.bar-2]:bg-linear-to-r [&.bar-3]:bg-linear-to-r [&.bar-4]:bg-linear-to-r [&.bar-show]:[box-shadow:none] bar-{i +
				1} mt-1 mr-2 mb-1"
			class:bar-show={strength > i}
		></div>
	{/each}
</div>
