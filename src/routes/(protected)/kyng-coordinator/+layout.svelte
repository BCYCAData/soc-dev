<script lang="ts">
	import Breadcrumbs from '$components/page/navigation/Breadcrumbs.svelte';
	import ProtectedAppShell from '$components/page/ProtectedAppShell.svelte';
	import KYNGSideMenu from '$components/page/navigation/sidemenu/KYNGSideMenu.svelte';
	import { kyngSidebarPathLables } from '$lib/menu-items';
	import type { PageData } from './$types';
	import type { KYNGArea } from '$lib/types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	const coordinatesKYNG = $derived(data.coordinatesKYNG);
	const safeCoordinatesKYNG = $derived(coordinatesKYNG ?? ([] as KYNGArea[]));
</script>

<ProtectedAppShell sidebarTitle="Coordinator Menu">
	{#snippet breadcrumbs()}
		<Breadcrumbs pathLables={kyngSidebarPathLables} coordinatesKYNG={safeCoordinatesKYNG} />
	{/snippet}

	{#snippet sidebar(isSidebarCollapsed)}
		{#each safeCoordinatesKYNG as kyngArea (kyngArea.kyngAreaId)}
			<KYNGSideMenu {kyngArea} {isSidebarCollapsed} />
		{/each}
	{/snippet}

	{@render children?.()}
</ProtectedAppShell>
