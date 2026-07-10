<script lang="ts">
	import { resolve } from '$app/paths';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import StreetSelectInput from '$components/form/inputs/StreetSelectInput.svelte';
	import AutoCompleteSelect from '$components/form/inputs/AutoCompleteSelect.svelte';
	import type { PageData } from './$types';
	// import type { PropertyAddress } from '$lib/types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let classText =
		'class="border mt-0 w-full border-secondary-700 rounded bg-secondary-50 py-1 sm:text-lg"';
	let nameText = 'property_address_street';
	let requiredValue = true;
	let { streetList, propertyAddressList } = $derived(data);
	let selectedStreet = $state('');
	let selectedPropertyIds = $state<string[]>([]);
	let selectedValues = $state<string[]>([]);

	const date = new Date();
	let tabSet = $state('0');

	let streetReportHref = $derived(
		selectedStreet
			? resolve('/api/reports/rfs/street/[streetname]', { streetname: selectedStreet })
			: undefined
	);
	let propertyReportHref = $derived(
		selectedPropertyIds.length
			? resolve('/api/reports/rfs/properties/[ids]', {
					ids: encodeURIComponent(JSON.stringify(selectedPropertyIds))
				})
			: undefined
	);
</script>

<svelte:head>
	<title>Emergency Admin-Reports</title>
</svelte:head>

<Tabs value={tabSet} onValueChange={(e) => (tabSet = e.value)} fluid>
	{#snippet list()}
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-secondary-400"
			stateInactive="bg-tertiary-400"
			value="0">RFS Street Report</Tabs.Control
		>
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-secondary-400"
			stateInactive="bg-tertiary-400"
			value="1">RFS Property Report</Tabs.Control
		>
	{/snippet}

	{#snippet content()}
		<Tabs.Panel value="0">
			<form
				id="reportRFSByStreetForm"
				class="bg-secondary-300 text-secondary-900 mx-auto flex w-full flex-col py-3"
			>
				<div class="mx-5 flex basis-full flex-col">
					<h3 class="mb-2">
						This report lists volunteered information for all registered Users in a given street.
					</h3>
					<p class="mb-0">Select a street to report on</p>
					<StreetSelectInput
						{streetList}
						{nameText}
						{requiredValue}
						{classText}
						bind:selectedStreet
					/>
					<a
						href={streetReportHref}
						aria-disabled={!streetReportHref}
						download={`${selectedStreet?.toLocaleLowerCase().replaceAll(' ', '_')}_${date.toLocaleDateString()}.pdf`}
						class="btn border-primary-700 bg-tertiary-500 text-surface-100 m-3 w-1/4 rounded-lg border text-base font-semibold aria-disabled:pointer-events-none aria-disabled:opacity-50"
					>
						Generate Report
					</a>
				</div>
			</form>
		</Tabs.Panel>

		<Tabs.Panel value="1">
			<form
				id="reportRFSByPropertyForm"
				class="bg-secondary-300 text-secondary-900 mx-auto flex w-full flex-col py-3"
			>
				<div class="mx-5 flex basis-full flex-col">
					<h3 class="mb-2">This report provides detailed information for selected properties.</h3>
					<p class="mb-0">Select properties to report on</p>
					<AutoCompleteSelect
						listData={propertyAddressList}
						placeholder="Start typing an address..."
						bind:selectedValues
						bind:targetValues={selectedPropertyIds}
					/>
					<pre>{JSON.stringify(selectedPropertyIds, null, 2)}</pre>
					<a
						href={propertyReportHref}
						aria-disabled={!propertyReportHref}
						download={`property_report_${date.toLocaleDateString()}.pdf`}
						class="btn border-primary-700 bg-tertiary-500 text-surface-100 m-3 w-1/4 rounded-lg border text-base font-semibold aria-disabled:pointer-events-none aria-disabled:opacity-50"
					>
						Generate Report
					</a>
				</div>
			</form>
		</Tabs.Panel>
	{/snippet}
</Tabs>
