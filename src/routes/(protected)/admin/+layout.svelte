<script lang="ts">
	import Breadcrumbs from '$components/page/navigation/Breadcrumbs.svelte';
	import ProtectedAppShell from '$components/page/ProtectedAppShell.svelte';
	import AdminSideMenu from '$components/page/navigation/sidemenu/AdminSideMenu.svelte';
	import { adminSidebarPathLables } from '$lib/menu-items';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<ProtectedAppShell sidebarTitle="Admin Menu">
	{#snippet breadcrumbs()}
		<Breadcrumbs pathLables={adminSidebarPathLables} />
	{/snippet}

	{#snippet sidebar(isSidebarCollapsed)}
		<AdminSideMenu {isSidebarCollapsed} />
	{/snippet}

	{#snippet sidebarFooter()}
		<p class="ml-2">
			Please make sure you have the correct permissions <br />
			<b>before</b>
			accessing admin features.
		</p>
	{/snippet}

	{@render children?.()}
</ProtectedAppShell>
