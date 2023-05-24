<script lang="ts">
	// import { page } from '$app/stores';
	import { AppShell, Drawer, Modal } from '@skeletonlabs/skeleton';

	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';

	import 'iconify-icon';

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
	export let data;
	console.log('adminMessages', data.adminMessages);
	$: ({ adminMessages } = data);
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
		<Breadcrumbs {pathLables} />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class="p-1 flex flex-col w-full">
			<div class="flex flex-row justify-around pt-2 text-xl">Administrator Menu</div>
			<div class="flex flex-col rounded-lg bg-orange-600">
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/site"
				>
					<iconify-icon icon="tabler:stack-2" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Site Administration</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/site/messages"
				>
					<iconify-icon icon="tabler:messages" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Site Messages</span></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/site/roles"
				>
					<iconify-icon icon="tabler:analyze" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Role Management</span></a
				>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/users"
				>
					<iconify-icon icon="la:users" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">User Administration</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/users/new"
				>
					<iconify-icon
						icon="tabler:report-analytics"
						class="text-stone-50"
						style="font-size: 18px"
					/>
					<span class="px-2 text-stone-50">New Users</span></a
				>
				<a
					class="flex items-center pl-8 pt1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/users/kits"
				>
					<iconify-icon icon="tabler:report-money" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Kits Delivered</span></a
				>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/emergency"
				>
					<iconify-icon icon="tabler:ambulance" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Emergency Administration</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/emergency/reports"
				>
					<iconify-icon icon="tabler:report" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Reports</span></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/emergency/service_map"
				>
					<iconify-icon icon="gis:map-users" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Service Map</span></a
				>
				<a
					class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/bcyca"
				>
					<iconify-icon icon="tabler:settings" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">BCYCA Administration</span>
				</a>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/bcyca/information"
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
					href="/admin/bcyca/workshops"
				>
					<iconify-icon icon="tabler:school" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Workshops</span></a
				>
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/admin/bcyca/events"
				>
					<iconify-icon
						icon="tabler:calendar-event"
						class="text-stone-50"
						style="font-size: 18px"
					/>
					<span class="px-2 text-stone-50">Events</span></a
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
		<!-- <div class="flex flex-row justify-around pt-2 text-xl">Messages</div>
		<div class="flex flex-col my-4 mx-4">
			<p class="m-2">Congratulations you are now eligible for your FREE Emergency Starter Kit.</p>
			<p class="m-2">We will be in touch soon.</p>
		</div> -->
		<MessageContainer messagesData={adminMessages} />
	</svelte:fragment>
	<slot />
</AppShell>
