<script lang="ts">
	export let itemLabel: string;
	export let highlighted: boolean;
</script>

<button class="autocomplete-items" class:autocomplete-active={highlighted} on:click on:keydown>
	{@html itemLabel}
</button>

<style>
	button.autocomplete-items {
		list-style: none;
		border-bottom: 1px solid #d4d4d4;
		z-index: 99;
		top: 100%;
		left: 0;
		right: 0;
		padding: 10px;
		cursor: pointer;
		background-color: #fff;
	}

	button.autocomplete-items:hover {
		/*when hovering an item:*/
		background-color: #fba74c;
		color: white;
	}

	button.autocomplete-items:active {
		/*when navigating through the items using the arrow keys:*/
		background-color: #fba74c !important;
		color: #ffffff;
	}

	.autocomplete-active {
		/*when navigating through the items using the arrow keys:*/
		background-color: #fba74c !important;
		color: #ffffff;
	}
</style>
