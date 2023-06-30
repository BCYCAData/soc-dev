<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	let tabSet: number = 0;
</script>

<svelte:head>
	<title>Users Admin-Kits</title>
</svelte:head>

<TabGroup
	justify="justify-left"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded="rounded-tl-lg rounded-tr-lg"
	border=""
	class="bg-surface-100-800-token w-full"
>
	<Tab bind:group={tabSet} name="tab1" value={0}>(label)</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>(label)</Tab>
	<Tab bind:group={tabSet} name="tab3" value={2}>(label)</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			(tab panel 1 contents)
		{:else if tabSet === 1}
			(tab panel 2 contents)
		{:else if tabSet === 2}
			(tab panel 3 contents)
		{/if}
	</svelte:fragment>
</TabGroup>
