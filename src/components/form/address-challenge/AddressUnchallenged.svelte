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
	$: searchAddress = `${streetaddress.toUpperCase()} ${suburb.toUpperCase()}`;

	const streetPattern =
		'/^[0-9]+[a-zA-Z]?s+([a-zA-Z]+s+)*(Alley|Ally|Arcade|Arc|Avenue|Ave|Boulevard|Bvd|Bypass|Bypa|Circuit|Cct|Close|Cl|Corner|Crn|Court|Ct|Crescent|Cres|Cul-de-sac|Cds|Drive|Dr|Esplanade|Esp|Green|Grn|Grove|Gr|Highway|Hwy|Junction|Jnc|Lane|Lane|Link|Link|Mews|Mews|Parade|Pde|Place|Pl|Ridge|Rdge|Road|Rd|Square|Sq|Street|St|Terrace|Tce|ALLEY|ALLY|ARCADE|ARC|AVENUE|AVE|BOULEVARD|BVD|BYPASS|BYPA|CIRCUIT|CCT|CLOSE|CL|CORNER|CRN|COURT|CT|CRESCENT|CRES|CUL-DE-SAC|CDS|DRIVE|DR|ESPLANADE|ESP|GREEN|GRN|GROVE|GR|HIGHWAY|HWY|JUNCTION|JNC|LANE|LANE|LINK|LINK|MEWS|MEWS|PARADE|PDE|PLACE|PL|RIDGE|RDGE|ROAD|RD|SQUARE|SQ|STREET|ST|TERRACE|TCE)$/';

	function setUpperCase(e: Event) {
		(e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase();
	}

	function checkStreetAddressString(streetaddress: string) {
		let streetRegEx =
			/^\d+[a-zA-Z]?\s*\w+(\s+\w+)*\s+\w+(\s+\w+)*\s+(ALLEY|ALLY|ARCADE|ARC|AVENUE|AVE|BOULEVARD|BVD|BYPASS|BYPA|CIRCUIT|CCT|CLOSE|CL|CORNER|CRN|COURT|CT|CRESCENT|CRES|CUL-DE-SAC|CDS|DRIVE|DR|ESPLANADE|ESP|GREEN|GRN|GROVE|GR|HIGHWAY|HWY|JUNCTION|JNC|LANE|LANE|LINK|LINK|MEWS|MEWS|PARADE|PDE|PLACE|PL|RIDGE|RDGE|ROAD|RD|SQUARE|SQ|STREET|ST|TERRACE|TCE|WAY|WY)$/;
		return streetRegEx.test(String(streetaddress).toUpperCase());
	}

	function checkSuburbString(suburb: string) {
		let suburbRegex = /^(?:(?!NSW|NEW\sSOUTH\sWALES)[A-Z\s])+$/;
		return suburbRegex.test(String(suburb).toUpperCase());
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
	const abbreviations: object = {
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
		<h2 class="unstyled text-center mt-5">This address could not be found.</h2>
		<p class="m-1 mt-2">
			Please check that your Street Address and Suburb are correctly structured and try again.
		</p>
		<p class="m-1">Each address must have a number</p>
		<p class="m-1">Abbreviations are not allowed.</p>
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
						The address must have a number.
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
