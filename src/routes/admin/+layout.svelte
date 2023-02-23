<script lang="ts">
	import { page } from '$app/stores';
	import { AppShell, Drawer, Modal } from '@skeletonlabs/skeleton';

	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';
	// import {
	// 	User,
	// 	Home2,
	// 	Users,
	// 	Settings,
	// 	Password,
	// 	Mailbox,
	// 	FireHydrant,
	// 	Flame,
	// 	BuildingEstate,
	// 	InfoSquareRounded,
	// 	School,
	// 	Map2,
	// 	CalendarEvent
	// } from 'tabler-icons-svelte';

	import Stack2 from 'tabler-icons-svelte/icons/Stack2.svelte';
	import Ambulance from 'tabler-icons-svelte/icons/Ambulance.svelte';
	import Users from 'tabler-icons-svelte/icons/Users.svelte';
	import Settings from 'tabler-icons-svelte/icons/Settings.svelte';
	import Messages from 'tabler-icons-svelte/icons/Messages.svelte';
	import Analyze from 'tabler-icons-svelte/icons/Analyze.svelte';
	import Report from 'tabler-icons-svelte/icons/Report.svelte';
	import ReportMoney from 'tabler-icons-svelte/icons/ReportMoney.svelte';
	import ReportAnalytics from 'tabler-icons-svelte/icons/ReportAnalytics.svelte';
	import InfoSquareRounded from 'tabler-icons-svelte/icons/InfoSquareRounded.svelte';
	import School from 'tabler-icons-svelte/icons/School.svelte';
	import Map2 from 'tabler-icons-svelte/icons/Map2.svelte';
	import CalendarEvent from 'tabler-icons-svelte/icons/CalendarEvent.svelte';

	import type { PageData } from './$types';

	let pathLables = {
		admin: ['Administration', ''],
		site: ['Site Administration', 'Stack2'],
		messages: ['Site Messages', 'Messages'],
		roles: ['Role Management', 'Analyze'],
		users: ['User Administration', 'Users'],
		new: ['New Users', 'ReportAnalytics'],
		kits: ['Kits Delivered', 'ReportMoney'],
		emergency: ['Emergency Administration', 'Ambulance'],
		information: ['Information', 'InfoSquareRounded'],
		events: ['Events', 'CalendarEvent'],
		workshops: ['Workshops', 'School'],
		bcyca: ['BCYCA Administration', 'Settings'],
		service_map: ['Service Map', 'Map2'],
		reports: ['Reports', 'Report']
	};

	$: classesHeader = 'w-full';
	$: classesPageHeader = 'w-full';
	$: classesSidebarLeft = 'w-1/6 bg-stone-200';
	$: classesMain = 'mx-4';
	$: classesSidebarRight = 'w-1/6  bg-stone-200';

	// adminMessages
	export let data: PageData;
	$: ({ adminMessages: messagesData } = data);
</script>

<AppShell
	class="bg-orange-200"
	slotSidebarLeft={classesSidebarLeft}
	slotSidebarRight={classesSidebarRight}
	slotHeader={classesHeader}
	slotPageHeader={classesPageHeader}
	slotPageContent={classesMain}
>
	<svelte:fragment slot="header"
		><div class="flex max-h-[45px] min-h-[45px] mx-auto items-center bg-orange-100">
			<h3 class="font-bold mx-auto text-orange-900">
				Burrell Creek Youth & Community Association Inc.
			</h3>
		</div></svelte:fragment
	>
	<svelte:fragment slot="pageHeader">
		<Breadcrumbs path={$page.url.pathname} {pathLables} />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class="p-1 flex flex-col w-full">
			<div class="flex flex-row justify-around pt-2 text-xl">Administrator Menu</div>
			<div class="flex flex-col rounded-lg bg-orange-600">
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/site"
				>
					<Stack2 class="text-stone-50" />
					<span class="px-2 text-stone-50">Site Administration</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/site/messages"
					><Messages class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Site Messages</span
					></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/site/roles"
					><Analyze class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Role Management</span
					></a
				>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/users"
				>
					<Users class="text-stone-50" /><span class="px-2 text-stone-50">User Administration</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/users/new"
					><ReportAnalytics class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>New Users</span
					></a
				>
				<a
					class="flex items-center pl-8 pt1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/users/kits"
					><ReportMoney class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Kits Delivered</span
					></a
				>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/emergency"
				>
					<Ambulance class="text-stone-50" />
					<span class="px-2 text-stone-50">Emergency Administration</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/emergency/reports"
					><Report class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50">Reports</span
					></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/emergency/service_map"
					><Map2 class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50">Service Map</span
					></a
				>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/bcyca"
				>
					<Settings class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>BCYCA Administration</span
					>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/bcyca/information"
					><InfoSquareRounded class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Information</span
					></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/bcyca/workshops"
					><School class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50">Workshops</span
					></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/bcyca/events"
					><CalendarEvent class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Events</span
					></a
				>
			</div>
			<p class="ml-2 ">
				Please make sure you click every heading in the menu on the left <br />
				<b>and</b>
				check your answers to all the questions.
			</p>
			<p class="ml-2 ">
				Remember this is <b>your</b>
				data. To help keep
				<b>you</b>
				prepared.
			</p>
		</div></svelte:fragment
	>
	<svelte:fragment slot="sidebarRight">
		<!-- <div class="flex flex-row justify-around pt-2 text-xl">Messages</div>
		<div class="flex flex-col my-4 mx-4">
			<p class="m-2">Congratulations you are now eligible for your FREE Emergency Starter Kit.</p>
			<p class="m-2">We will be in touch soon.</p>
		</div> -->
		<MessageContainer {messagesData} />
	</svelte:fragment>
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<!-- <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment> -->
</AppShell>
