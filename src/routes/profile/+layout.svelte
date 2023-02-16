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

	import User from 'tabler-icons-svelte/icons/User.svelte';
	import Home2 from 'tabler-icons-svelte/icons/Home2.svelte';
	import Users from 'tabler-icons-svelte/icons/Users.svelte';
	import Settings from 'tabler-icons-svelte/icons/Settings.svelte';
	import Password from 'tabler-icons-svelte/icons/Password.svelte';
	import Mailbox from 'tabler-icons-svelte/icons/Mail.svelte';
	import FireHydrant from 'tabler-icons-svelte/icons/FireHydrant.svelte';
	import Flame from 'tabler-icons-svelte/icons/Flame.svelte';
	import BuildingEstate from 'tabler-icons-svelte/icons/BuildingEstate.svelte';
	import InfoSquareRounded from 'tabler-icons-svelte/icons/InfoSquareRounded.svelte';
	import School from 'tabler-icons-svelte/icons/School.svelte';
	import Map from 'tabler-icons-svelte/icons/Map.svelte';
	import Map2 from 'tabler-icons-svelte/icons/Map2.svelte';
	import CalendarEvent from 'tabler-icons-svelte/icons/CalendarEvent.svelte';

	import type { PageData } from './$types';

	let pathLables = {
		profile: ['Profile', 'carbon:home'],
		aboutme: ['About Me', 'User'],
		myplace: ['My Place', 'Home'],
		assets: ['Assets', 'BuildingEstate'],
		resources: ['Firefighting Resources', 'FireHydrant'],
		hazards: ['Firefighting Hazards', 'Flame'],
		mymap: ['My Map', 'Map'],
		mycommunity: ['My Community', 'Users'],
		information: ['Information', 'InfoSquareRounded'],
		events: ['Events', 'CalendarEvent'],
		workshops: ['Workshops', 'School'],
		map: ['Community Map', 'Map2'],
		settings: ['Settings', 'Settings'],
		password: ['Change Password', 'Password'],
		email: ['Change Email', 'Mailbox']
	};

	$: classesHeader = 'w-full';
	$: classesPageHeader = 'w-full';
	$: classesSidebarLeft = 'w-1/6 bg-stone-200';
	$: classesMain = 'mx-4';
	$: classesSidebarRight = 'w-1/6  bg-stone-200';

	// profileMessages
	export let data: PageData;
	$: ({ profileMessagesData } = data);
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
	<svelte:fragment slot="pageHeader"
		><Breadcrumbs path={$page.url.pathname} {pathLables} /></svelte:fragment
	>
	<svelte:fragment slot="sidebarLeft">
		<div class="p-1 flex flex-col w-full">
			<div class="flex flex-row justify-around pt-2 text-xl">Profile Menu</div>
			<div class="flex flex-col rounded-lg bg-orange-600">
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/aboutme"
				>
					<User class="text-stone-50" />
					<span class="px-2 text-stone-50">About Me</span>
				</a>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/myplace"
				>
					<Home2 class="text-stone-50" /><span class="px-2 text-stone-50">My Place</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/myplace/assets"
					><BuildingEstate class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Assets</span
					></a
				>
				<a
					class="flex items-center pl-8 pt1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/myplace/resources"
					><FireHydrant class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Firefighting Resources</span
					></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/myplace/hazards"
					><Flame class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Firefighting Hazards</span
					></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/myplace/mymap"
					><Map class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50">My Map</span></a
				>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity"
				>
					<Users class="text-stone-50" />
					<span class="px-2 text-stone-50">My Community</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity/information"
					><InfoSquareRounded class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Information</span
					></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity/workshops"
					><School class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50">Workshops</span
					></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity/events"
					><CalendarEvent class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Events</span
					></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity/map"
					><Map2 class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Community Map</span
					></a
				>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/settings"
				>
					<Settings class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50">Settings</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/settings/password"
					><Password class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Change Password</span
					></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/settings/email"
					><Mailbox class="text-stone-50 w-4 h-4" /><span class="px-2 text-stone-50"
						>Change Email</span
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
		<MessageContainer {profileMessagesData} />
	</svelte:fragment>
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<!-- <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment> -->
</AppShell>
