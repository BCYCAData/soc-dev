<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import '../soc_theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	import { AppShell, Drawer, Modal } from '@skeletonlabs/skeleton';

	import MobileNavbar from '$components/navbar/MobileNavbar.svelte';
	import Navbar from '$components/navbar/Navbar.svelte';
	import Footer from '$components/page/Footer.svelte';

	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	// Reactive Properties
	$: classesSidebarLeft = $page.url.pathname.startsWith('/') ? 'w-0' : 'w-0 lg:w-64';
	$: ({ supabase, session } = data);
</script>

<Modal />
<Drawer>
	<h2 class="unstyled p-1">MobileNavbar</h2>
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
		<mobilenavbar />
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
			This is a Bushfire Community Recovery &amp; Resilience Fund project through the joint
			Commonwealth/State Disaster Recovery Funding Arrangements
		</p>
		<img class="mr-2 mb-2 h-10 md:mr-26" src="/nswg.jpg" alt="NSW Government logo" />
	</svelte:fragment>
	<svelte:fragment slot="footer"><Footer /></svelte:fragment>
	<!-- <svelte:fragment slot="footer">Footer</svelte:fragment> -->
</AppShell>
