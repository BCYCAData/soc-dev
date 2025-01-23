<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import StreetSelectInput from '$components/form/inputs/StreetSelectInput.svelte';
	import type { PageData, ActionData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let classText =
		'class="border mt-0 w-full border-orange-700 rounded bg-orange-50 py-1 sm:text-lg"';
	let nameText = 'property_address_street';
	let requiredValue = true;
	let { streetList } = $derived(data);
	let selectedStreet = $state('');

	$effect(() => {
		selectedStreet = form?.selectedStreet ?? '';
	});

	const date = new Date();

	let tabSet = $state('0');
</script>

<svelte:head>
	<title>Emergency Admin-Reports</title>
</svelte:head>

<Tabs bind:value={tabSet} fluid>
	{#snippet list()}
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value="0">RFS Street Report</Tabs.Control
		>
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value="1">RFS Property Report</Tabs.Control
		>
	{/snippet}
	{#snippet content()}
		<Tabs.Panel value="0">
			<form
				id="reportRFSByStreetForm"
				class="mx-auto flex w-full flex-col bg-orange-300 py-3 text-orange-900"
			>
				<div class="mx-5 flex basis-full flex-col">
					<h3 class="mb-2">
						This report lists reported information for all registered Users in a given street.
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
						href={`/api/reports/rfs/street/${selectedStreet}`}
						download={`${selectedStreet?.toLocaleLowerCase().replaceAll(' ', '_')}_${date.toLocaleDateString()}.pdf`}
						class="btn m-3 w-1/4 rounded-lg border border-purple-700 bg-[#0099E8] text-base font-semibold text-stone-100"
					>
						Generate Report
					</a>
				</div>
			</form>
		</Tabs.Panel>
		<Tabs.Panel value="1">
			<div>Okay</div>
		</Tabs.Panel>
	{/snippet}
</Tabs>
