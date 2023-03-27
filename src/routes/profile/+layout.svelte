<script lang="ts">
	import { AppShell, Drawer, Modal } from '@skeletonlabs/skeleton';

	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';

	import 'iconify-icon';

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
	<svelte:fragment slot="pageHeader"><Breadcrumbs {pathLables} /></svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class="p-1 flex flex-col w-full">
			<div class="flex flex-row justify-around pt-2 text-xl">Profile Menu</div>
			<div class="flex flex-col rounded-lg bg-orange-600">
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/aboutme"
				>
					<iconify-icon icon="carbon:user" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">About Me</span>
				</a>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/myplace"
				>
					<iconify-icon icon="tabler:home-2" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">My Place</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/myplace/assets"
				>
					<iconify-icon
						icon="tabler:building-estate"
						class="text-stone-50"
						style="font-size: 18px"
					/>
					<span class="px-2 text-stone-50">Assets</span></a
				>
				<a
					class="flex items-center pl-8 pt1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/myplace/resources"
				>
					<iconify-icon icon="tabler:fire-hydrant" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Firefighting Resources</span></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/myplace/hazards"
				>
					<iconify-icon icon="tabler:flame" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Firefighting Hazards</span></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/myplace/mymap"
				>
					<iconify-icon icon="gis:map-user" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">My Map</span></a
				>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity"
				>
					<iconify-icon icon="la:users" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">My Community</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity/information"
				>
					<iconify-icon
						icon="tabler:info-square-rounded"
						class="text-stone-50"
						style="font-size: 18px"
					/>
					<span class="px-2 text-stone-50">Information</span></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity/workshops"
				>
					<iconify-icon icon="tabler:school" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Workshops</span></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity/events"
				>
					<iconify-icon
						icon="tabler:calendar-event"
						class="text-stone-50"
						style="font-size: 18px"
					/>
					<span class="px-2 text-stone-50">Events</span></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity/map"
				>
					<iconify-icon icon="gis:map-users" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Community Map</span></a
				>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/settings"
				>
					<iconify-icon icon="tabler:settings" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Settings</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/settings/password"
				>
					<iconify-icon icon="tabler:password" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Change Password</span></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/settings/email"
				>
					<iconify-icon icon="tabler:mailbox" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Change Email</span></a
				>
			</div>
			<p class="ml-2">
				Please make sure you click every heading in the menu on the left <br />
				<b>and</b>
				check your answers to all the questions.
			</p>
			<p class="ml-2">
				Remember this is <b>your</b>
				data. To help keep
				<b>you</b>
				prepared.
			</p>
		</div></svelte:fragment
	>
	<svelte:fragment slot="sidebarRight">
		<MessageContainer messagesData={profileMessagesData} />
	</svelte:fragment>
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<!-- <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment> -->
</AppShell>
