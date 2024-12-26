<script lang="ts">
	export let strength: number;
</script>

<div class="flex h-5 w-full bg-gray-50">
	{#each Array(4) as _, i}
		<div class="strength-bar bar-{i + 1} mb-1 mr-2 mt-1" class:bar-show={strength > i}></div>
	{/each}
</div>

<style lang="postcss">
	.strength-bar {
		@apply h-[90%] w-1/4 rounded-md transition-shadow duration-500;
		box-shadow: inset 0px 20px #e7e5e4;

		&:last-child {
			@apply mr-0;
		}
		&.bar-show {
			box-shadow: none;
		}
		&.bar-1 {
			@apply bg-gradient-to-r from-red-500 to-orange-600;
		}
		&.bar-2 {
			@apply bg-gradient-to-r from-orange-600 to-yellow-400;
		}
		&.bar-3 {
			@apply bg-gradient-to-r from-yellow-400 to-lime-500;
		}
		&.bar-4 {
			@apply bg-gradient-to-r from-lime-500 to-green-600;
		}
	}
</style>
