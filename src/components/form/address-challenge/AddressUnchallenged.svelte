<script lang="ts">
	import { setUpperCase } from '$lib/svelte-actions';
	import { checkStreetAddressString, checkSuburbString } from '$lib/utils';
	import Spinner from '$components/page/Spinner.svelte';

	let loading = false;
	export let streetaddress = '';
	export let suburb = '';

	let canGo = false;
	let canGoStreet = false;
	let canGoSuburb = false;
	$: canGoStreet = checkStreetAddressString(streetaddress);
	$: canGoSuburb = checkSuburbString(suburb);
	$: canGo = canGoStreet && canGoSuburb;
</script>

{#if loading}
	<Spinner />
{/if}

<div class="bg-orange-50 py-6 px-2 rounded shadow-md text-gray-900 w-full sm:p-6 sm:w-5/6">
	<h1 class="bg-orange-200 text-xl text-center">
		Membership is restricted to specific Communities
	</h1>
	<p class="text-center mb-2">
		Please enter your Street Address and Suburb to check your qualification
	</p>

	<form action="/auth/validateaddress?/validate" method="POST">
		<input
			id="streetaddress"
			type="text"
			class="form-input !border !border-orange-700 w-full p-1 rounded sm:p-3"
			name="streetaddress"
			required={true}
			placeholder="STREET ADDRESS"
			autocomplete="street-address"
			use:setUpperCase
			style="text-transform:uppercase"
			bind:value={streetaddress}
		/>
		<div class="mt-1">
			{#if !canGoStreet && streetaddress.length > 0}
				<div class="bg-red-100 rounded-lg m-1 p-2 text-sm text-red-700" role="alert">
					<small>The address must have a number and not use abbreviations.</small>
				</div>
			{/if}
		</div>
		<div class="flex justify-between mt-2 sm:mt-4">
			<input
				id="suburb"
				type="text"
				class="form-input !w-1/2 !border !border-orange-700 p-1 rounded sm:p-3"
				name="suburb"
				required
				placeholder="SUBURB"
				autocomplete="address-level2"
				use:setUpperCase
				style="text-transform:uppercase"
				bind:value={suburb}
			/>
			<button
				type="submit"
				class="w-1/3 text-center rounded-full cursor-pointer bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
				disabled={!canGo}
			>
				Check
			</button>
		</div>
		{#if !canGoSuburb && suburb.length > 0}
			<div class="bg-red-100 rounded-lg m-1 p-2 text-sm text-red-700" role="alert">
				<small>The suburb must not have State or Postcode.</small>
			</div>
		{/if}
	</form>
</div>
