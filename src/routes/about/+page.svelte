<script lang="ts">
	import Tabs from '$components/tabs/Tabs.svelte';

	import ProjectTab from '$components/tabs/about/ProjectTab.svelte';
	import KYNGsTab from '$components/tabs/about/KYNGsTab.svelte';
	import HallInfoHubTab from '$components/tabs/about/HallInfoHubTab.svelte';
	import WorkshopsTab from '$components/tabs/about/WorkshopsTab.svelte';

	export let data;
	const { allPoints, registeredPoints } = data;
	const props = { allPoints, registeredPoints };

	// List of tab items with labels, values and assigned components
	let items = [
		{ label: 'SOC Project', value: 1, component: ProjectTab, props: props },
		{ label: 'Know Your Neighbour Groups', value: 2, component: KYNGsTab },
		{ label: 'BCYCA Hall as Info Hub', value: 3, component: HallInfoHubTab },
		{ label: 'Workshops', value: 4, component: WorkshopsTab }
	];
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Tabs {items} />
