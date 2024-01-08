<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';

	import type { AddressPointData } from '$lib/types';

	export let addressPointData: AddressPointData;

	let loading = false;
	let streetaddress = '';
	let suburb = '';

	let canGo = false;
	let canGoStreet = false;
	let canGoSuburb = false;
	$: canGoStreet = checkStreetAddressString(streetaddress);
	$: canGoSuburb = checkSuburbString(suburb);
	$: canGo = canGoStreet && canGoSuburb;

	function setUpperCase(e: Event) {
		(e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase();
	}

	function checkStreetAddressString(streetaddress: string) {
		let streetRegEx =
			/^\d+[a-zA-Z]?\s*\w+(\s+\w+)*\s+\w+(\s+\w+)*\s+(ALLEY|ARCADE|AVENUE|BOULEVARD|BYPASS|CIRCUIT|CLOSE|CORNER|COURT|CRESCENT|CUL-DE-SAC|DRIVE|ESPLANADE|GREEN|GROVE|HIGHWAY|JUNCTION|LANE|LINK|LMEWS|PARADE|PLACE|RIDGE|ROAD|SQUARE|STREET|TERRACE|WAY|)$/;
		return streetRegEx.test(String(streetaddress).toUpperCase());
	}

	function checkSuburbString(suburb: string) {
		let suburbRegex = /^(?:(?!NSW|NEW\sSOUTH\sWALES)[A-Z\s])+$/;
		return suburbRegex.test(String(suburb).toUpperCase());
	}

	async function submitForm(e: Event) {
		loading = !loading;
		const response = await fetch('/api/data/validateaddress', {
			method: 'POST',
			body: JSON.stringify({
				streetAddress: streetaddress.toUpperCase(),
				suburb: suburb.toUpperCase()
			})
		});

		const { apistatus, addressdata } = await response.json();

		if (apistatus === 200) {
			const [data] = addressdata;
			console.log('data', data);
			addressPointData.status = data?.status;
			addressPointData.apistatus = apistatus;
			addressPointData.searchaddress = `${streetaddress.toUpperCase()}`;
			addressPointData.searchsuburb = `${suburb.toUpperCase()}`;
			addressPointData.validaddress = data?.validaddress;
			addressPointData.validsuburb = data?.validsuburb;
			addressPointData.principaladdresssiteoid = data?.principaladdresssiteoid;
			addressPointData.addresspoint = data?.addresspoint;
			addressPointData.community = data?.community;
			addressPointData.kyng = data?.kyng;
		} else {
			addressPointData.apistatus = apistatus;
		}

		loading = !loading;
	}
</script>

{#if loading}
	<Spinner />
{/if}

{#if addressPointData.status === 403}
	<div class="bg-red-100 rounded-lg">
		<h2 class="unstyled text-center mt-5">This address could not be found.</h2>
		<p class="m-1 mt-2">
			Please check that your Street Address and Suburb are correctly structured and try again.
		</p>
		<p class="m-1">Each address must have a number and abbreviations are not allowed.</p>
		<p class="m-1">Do not include Postcode or State.</p>
	</div>
{/if}
<div class="flex flex-col items-center max-w-container mx-auto justify-center">
	<div class="bg-orange-50 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
		<h1 class="unstyled text-2xl text-center">Membership is restricted to specific Communities</h1>
		<p class="text-center mb-2">
			Please enter your Street Address and Suburb to check your qualification
		</p>

		<form on:submit|preventDefault={submitForm}>
			<input
				id="streetaddress"
				type="text"
				class="form-input !border !border-orange-700 w-full py-3 rounded mb-4"
				name="streetaddress"
				required={true}
				placeholder="STREET ADDRESS"
				autocomplete="street-address"
				on:input={setUpperCase}
				style="text-transform:uppercase"
				bind:value={streetaddress}
			/>
			<div class="flex justify-between">
				<input
					id="suburb"
					type="text"
					class="form-input !w-1/2 !border !border-orange-700 py-3 rounded"
					name="suburb"
					required
					placeholder="SUBURB"
					autocomplete="address-level2"
					on:input={setUpperCase}
					style="text-transform:uppercase"
					bind:value={suburb}
				/>
				{#if !canGoStreet && streetaddress.length > 0}
					<div class="bg-red-100 rounded-lg m-1 p-2 text-sm text-red-700" role="alert">
						The address must have a number and not use abbreviations.
					</div>
				{/if}
				{#if !canGoSuburb && suburb.length > 0}
					<div class="bg-red-100 rounded-lg m-1 p-2 text-sm text-red-700" role="alert">
						The suburb must not have State or Postcode.
					</div>
				{/if}
				<button
					type="submit"
					class="w-1/3 text-center rounded-full cursor-pointer bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
					disabled={!canGo}
				>
					Check
				</button>
			</div>
		</form>
	</div>
</div>
