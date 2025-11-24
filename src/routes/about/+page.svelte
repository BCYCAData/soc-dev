<script lang="ts">
	import Tabs from '$components/page/tabs/TabContainer.svelte';
	import ProjectTab from '$components/page/tabs/about/ProjectTab.svelte';
	import KYNGsTab from '$components/page/tabs/about/KYNGsTab.svelte';
	import HallInfoHubTab from '$components/page/tabs/about/HallInfoHubTab.svelte';
	import WorkshopsTab from '$components/page/tabs/about/WorkshopsTab.svelte';
	import type { PageData } from './$types';

	interface TabItem {
		label: string;
		value: number;
		component: any;
		props?: Record<string, any>;
	}

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const tabItems: TabItem[] = [
		{
			label: 'SOC Project',
			value: 1,
			component: ProjectTab,
			props: {
				addressPointsGeoJSON: data.projectAddressPointData
			}
		},
		{
			label: 'Know Your Neighbour Groups',
			value: 2,
			component: KYNGsTab,
			props: {}
		},
		{
			label: 'BCYCA Hall as Info Hub',
			value: 3,
			component: HallInfoHubTab,
			props: {}
		},
		{
			label: 'Workshops',
			value: 4,
			component: WorkshopsTab,
			props: {}
		}
	];
</script>

<svelte:head>
	<title>About - Strengthen OUR Community</title>
	<meta
		name="description"
		content="Learn about the Strengthen OUR Community project and its initiatives"
	/>
</svelte:head>

<main class="flex min-h-full flex-col">
	<Tabs items={tabItems} />
	<footer class="mt-auto">
		<div class="flex items-center justify-between px-2 md:px-24">
			<picture>
				<source srcset="/images/ag.webp" type="image/webp" />
				<img
					class="mb-2 h-10"
					src="/images/ag.png"
					alt="Australian Government logo"
					width="120"
					height="40"
					loading="lazy"
					decoding="async"
				/>
			</picture>

			<small class="text-center md:text-sm">
				This is a Bushfire Community Recovery &amp; Resilience Fund project through the joint
				Commonwealth/State Disaster Recovery Funding Arrangements
			</small>

			<picture>
				<source srcset="/images/nswg.webp" type="image/webp" />
				<img
					class="mb-2 h-10"
					src="/images/nswg.png"
					alt="NSW Government logo"
					width="40"
					height="40"
					loading="lazy"
					decoding="async"
				/>
			</picture>
		</div>
	</footer>
</main>
