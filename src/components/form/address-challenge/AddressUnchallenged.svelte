<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';

	import type { AddressPointData } from '$lib/types';

	export let addressPointData: AddressPointData;

	let loading = false;
	let streetaddress = '';
	let suburb = '';

	let canGo = false;
	$: canGo = checkAddressString(streetaddress);
	$: searchAddress = `${streetaddress.toUpperCase()} ${suburb.toUpperCase()}`;

	function setUpperCase(e: Event) {
		(e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase();
	}

	function checkAddressString(streetaddress: string) {
		let streetRegEx = /^(\d+).*/;
		return streetRegEx.test(String(streetaddress).toLowerCase());
	}

	async function submitForm(e: Event) {
		loading = !loading;
		let data: AddressPointData;
		searchAddress = `${replaceAbbreviations(streetaddress.toUpperCase())} ${suburb.toUpperCase()}`;
		try {
			const response = await fetch('/api/data/validateaddress', {
				method: 'POST',
				body: JSON.stringify({
					streetAddress: streetaddress.toUpperCase(),
					suburb: suburb.toUpperCase()
				})
			});
			data = await response.json();
			if (data.apistatus === 200) {
				addressPointData.status = data.status;
				addressPointData.communityname = data.communityname ? data.communityname : null;
				addressPointData.principaladdresssiteoid = data.principaladdresssiteoid
					? data.principaladdresssiteoid
					: null;
				addressPointData.validaddress = data.validaddress;
				addressPointData.searchaddress = data.searchaddress;
				addressPointData.addresspoint = data.addresspoint ? data.addresspoint : null;
				addressPointData.message = data.message ? data.message : null;
				addressPointData.apistatus = data.apistatus ? data.apistatus : null;
				addressPointData.apistatustext = data.apistatustext ? data.apistatustext : null;
				addressPointData.error = data.error;
			}
		} catch (error) {
			console.log(error);
			addressPointData.status = 418;
			addressPointData.communityname = 'None identified';
			addressPointData.principaladdresssiteoid = null;
			addressPointData.validaddress = [];
			addressPointData.searchaddress = [];
			addressPointData.addresspoint = null;
			addressPointData.message = 'Could not check the address.';
			addressPointData.apistatus = null;
			addressPointData.apistatustext = null;
			addressPointData.error = error;
		}
		loading = !loading;
	}
	const abbreviations: Object = {
		RD: 'ROAD',
		L: 'LANE',
		LN: 'LANE',
		LNE: 'LANE',
		AVE: 'AVENUE',
		PL: 'PLACE',
		CL: 'CLOSE',
		ST: 'STREET',
		WY: 'WAY'
	};

	function replaceAbbreviations(streetAddress: string) {
		streetAddress = streetAddress.trim().replace('  ', ' ').replace(/\.$/, '');
		const address = streetAddress.split(' ');
		const streetType = address[address.length - 1];
		if (abbreviations.hasOwnProperty(streetType)) {
			address[address.length - 1] = abbreviations[streetType];
		}
		return address.join(' ');
	}
</script>

{#if loading}
	<Spinner />
{/if}

{#if addressPointData.status === 400 || addressPointData.status === 404}
	<div class="bg-red-100 rounded-lg">
		<h2 class=" text-center mt-5 ">This address could not be found.</h2>
		<p class="m-1 mt-2">
			Please check that your Street Address and Suburb are correctly structured and try again.
		</p>
		<p class="m-1">Each address must have a number</p>
		<p class="m-1">Abbreviations are not allowed.</p>
	</div>
{/if}
<div class="flex flex-col items-center  max-w-container mx-auto justify-center">
	<div class="bg-orange-50 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
		<h1 class="text-2xl text-center">Membership is restricted to specific Communities</h1>
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
				{#if !canGo && streetaddress.length > 0}
					<div class="bg-red-100 rounded-lg m-1 p-2 text-sm text-red-700" role="alert">
						The address must have a number.
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
