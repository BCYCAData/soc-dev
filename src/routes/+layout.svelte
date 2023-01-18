<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { supabaseClient } from '$lib/dbClient';
	import { onMount } from 'svelte';

	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import '../../node_modules/leaflet/dist/leaflet.css';

	import { AppShell, Drawer, Modal } from '@skeletonlabs/skeleton';

	import MobileNavbar from '$components/navbar/MobileNavbar.svelte';
	import Navbar from '$components/navbar/Navbar.svelte';
	import Footer from '$components/page/Footer.svelte';

	// Reactive Properties
	$: classesSidebarLeft = $page.url.pathname.startsWith('/') ? 'w-0' : 'w-0 lg:w-64';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			console.log('Auth state change detected');
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
		<!-- <AppBar background="bg-primary-500" slotDefault="flex justify-center items-center">
			<svelte:fragment slot="lead">
				<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
					<span>
						<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
							<rect width="100" height="20" />
							<rect y="30" width="100" height="20" />
							<rect y="60" width="100" height="20" />
						</svg>
					</span>
				</button><button class="btn invisible lg:visible">Left-Button</button>
				<a href="/" class="btn invisible lg:visible">Left-Anchor</a></svelte:fragment
			>
			<svelte:fragment slot="default">
				<button class="btn invisible lg:visible">Centre-Button</button>
				<a href="/" class="btn invisible lg:visible">Centre-Anchor</a>
			</svelte:fragment>
			<svelte:fragment slot="trail"
				><button class="btn invisible lg:visible">Right-Button</button>
				<a href="/" class="btn invisible lg:visible">Right-Anchor</a>
			</svelte:fragment>
		</AppBar> -->
		<Navbar />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<MobileNavbar />
	</svelte:fragment>
	<!-- <svelte:fragment slot="sidebarRight">Sidebar Right</svelte:fragment> -->
	<!-- <svelte:fragment slot="pageHeader">Page Header</svelte:fragment> -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter">
		<!-- <div class="col-span-8 row-span-1">
			<div class="flex items-center text-center content-center justify-around w-full"> -->
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
		<!-- </div> -->
		<!-- </div> -->
	</svelte:fragment>
	<svelte:fragment slot="footer"><Footer /></svelte:fragment>
</AppShell>
