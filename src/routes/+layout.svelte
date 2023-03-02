<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { supabaseClient } from '$lib/dbClient';
	import { onMount } from 'svelte';

	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	import { AppShell, Drawer, Modal } from '@skeletonlabs/skeleton';

	import MobileNavbar from '$components/navbar/MobileNavbar.svelte';
	import Navbar from '$components/navbar/Navbar.svelte';
	import Footer from '$components/page/Footer.svelte';

	// Reactive Properties
	$: classesSidebarLeft = $page.url.pathname.startsWith('/') ? 'w-0' : 'w-0 lg:w-64';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(async (event, session) => {
			invalidateAll();
		});
		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<Modal />
<Drawer>
	<h2 class="p-1">MobileNavbar</h2>
	<hr />
	<MobileNavbar />
</Drawer>

<AppShell
	slotSidebarLeft={classesSidebarLeft}
	slotSidebarRight={classesSidebarLeft}
	slotPageFooter="flex items-center text-center content-center justify-around w-full"
>
	<svelte:fragment slot="header">
		<Navbar />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<MobileNavbar />
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter">
		<img
			class="ml-2 mb-2 h-10 md:ml-26"
			src="/ag.png"
			alt="Australian Government logo"
			width="auto"
			height="40"
		/>
		<p class="text-[0.6rem] md:text-sm">
			This is a Bushfire Community Recovery & Resilience Fund project through the joint
			Commonwealth/State Disaster Recovery Funding Arrangements
		</p>
		<img class="mr-2 mb-2 h-10 md:mr-26" src="/nswg.jpg" alt="NSW Government logo" />
	</svelte:fragment>
	<svelte:fragment slot="footer"><Footer /></svelte:fragment>
</AppShell>
