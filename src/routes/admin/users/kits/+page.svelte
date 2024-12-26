<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	let tabSet: string = $state('0');
</script>

<svelte:head>
	<title>Users Admin-Kits</title>
</svelte:head>

<Tabs listMargin="mb-0" bind:value={tabSet} fluid>
	{#snippet list()}
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value={'0'}>(label)</Tabs.Control
		>
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value={'1'}>(label)</Tabs.Control
		>
		<Tabs.Control
			base="rounded-tl-[10px] rounded-tr-[10px]"
			padding="pb-0"
			stateActive="bg-orange-400"
			stateInactive="bg-tertiary-400"
			value={'2'}>(label)</Tabs.Control
		>
	{/snippet}
	{#snippet content()}
		<Tabs.Panel base="bg-orange-400 h-full" classes="flex-1" value="0">
			<div>(tab panel 1 contents)</div>
		</Tabs.Panel>
		<Tabs.Panel base="bg-orange-400" value="1">(tab panel 2 contents)</Tabs.Panel>
		<Tabs.Panel base="bg-orange-400" value="2">(tab panel 3 contents)</Tabs.Panel>
	{/snippet}
</Tabs>
