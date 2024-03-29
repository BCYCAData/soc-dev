<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	import type { PageData } from './$types';

	export let data: PageData;
	console.log('Here', data);
	let tabSet: number = 0;
</script>

<svelte:head>
	<title>Connect Community</title>
</svelte:head>

<h1>Select a tab to request connection.</h1>
<TabGroup
	justify="justify-left"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded="rounded-tl-lg rounded-tr-lg"
	border=""
	class="w-full !space-y-0"
	regionList="bg-primary-200"
	regionPanel="variant-filled-primary p-2"
>
	{#if !data.community_bcyca_profile}
		<Tab bind:group={tabSet} name="tabBCYCA" value={0}>BCYCA Inc</Tab>
	{/if}
	{#if !data.community_tinonee_profile}
		<Tab bind:group={tabSet} name="tabTinonee" value={1} selected="true">Tinonee</Tab>
	{/if}{#if !data.community_mondrook_profile}
		<Tab bind:group={tabSet} name="tabMondrook" value={2}>Mondrook</Tab>
	{/if}{#if !data.community_external_profile}
		<Tab bind:group={tabSet} name="tabExternal" value={3}>External</Tab>
	{/if}
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if !data.community_bcyca_profile && tabSet === 0}
			<form
				id="reportRFSByStreetForm"
				class="flex flex-col py-3 mx-auto w-full text-orange-900 bg-orange-300"
			>
				<div class="flex flex-col basis-full mx-5">
					<h3 class="mb-2">
						This report lists reported information for all registered Users in a given street.
					</h3>
					<p class="mb-0">Select a street to report on</p>
				</div>
			</form>
		{:else if !data.community_tinonee_profile && tabSet === 1}
			<div>Tinonee</div>
		{:else if !data.community_mondrook_profile && tabSet === 2}
			<div>Mondrook</div>
		{:else if !data.community_external_profile && tabSet === 3}
			<div>External</div>
		{/if}
	</svelte:fragment>
</TabGroup>
