<script lang="ts">
	export let strength: number;
</script>

<div class="flex h-5 w-full bg-gray-50">
	{#each Array(4) as _, i}
		<div
			class="h-[90%] w-1/4 rounded-md [box-shadow:inset_0px_20px_#e7e5e4] transition-shadow duration-500 last:mr-0 [&.bar-1]:bg-gradient-to-r [&.bar-1]:from-red-500 [&.bar-1]:to-orange-600 [&.bar-2]:bg-gradient-to-r [&.bar-2]:from-orange-600 [&.bar-2]:to-yellow-400 [&.bar-3]:bg-gradient-to-r [&.bar-3]:from-yellow-400 [&.bar-3]:to-lime-500 [&.bar-4]:bg-gradient-to-r [&.bar-4]:from-lime-500 [&.bar-4]:to-green-600 [&.bar-show]:[box-shadow:none] bar-{i +
				1} mt-1 mr-2 mb-1"
			class:bar-show={strength > i}
		></div>
	{/each}
</div>
