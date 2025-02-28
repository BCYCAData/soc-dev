<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import CustomAddressManagementTab from '$components/page/tabs/addresses/CustomAddressManagementTab.svelte';

	import '../../../../../components/page/tabs/tabs.css';

	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let customAddresses = $derived(data.customAddresses);

	let tabSet = $state('0');
</script>

<Tabs bind:value={tabSet} fluid>
	{#snippet list()}
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value="0">Maintain Custom Addresses</Tabs.Control
		>
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value="1">Determine Custom Addresses</Tabs.Control
		>
	{/snippet}
	{#snippet content()}
		<Tabs.Panel value="0">
			<CustomAddressManagementTab {customAddresses} />
		</Tabs.Panel>
		<Tabs.Panel value="1">
			{#if tabSet === '1'}
				{#await import('$components/page/tabs/addresses/CustomAddressMapTab.svelte') then { default: CustomAddressMapTab }}
					<CustomAddressMapTab active={true} />
				{/await}
			{/if}
		</Tabs.Panel>
	{/snippet}
</Tabs>
