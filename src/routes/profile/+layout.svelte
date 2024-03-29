<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';

	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';

	import 'iconify-icon';

	let pathLables = {
		profile: ['Profile', 'carbon:home'],
		aboutme: ['About Me', 'User'],
		myplace: ['My Place', 'Home'],
		assets: ['Assets', 'BuildingEstate'],
		resources: ['Firefighting Resources', 'FireHydrant'],
		hazards: ['Firefighting Hazards', 'Flame'],
		mymap: ['My Map', 'Map'],
		mycommunity: ['My Community', 'Users'],
		bcyca: ['BCYCA', 'emojione-monotone:letter-b'],
		tinonee: ['BCYCA', 'emojione-monotone:letter-t'],
		information: ['Information', 'InfoSquareRounded'],
		events: ['Events', 'CalendarEvent'],
		workshops: ['Workshops', 'School'],
		map: ['Community Map', 'Map2'],
		settings: ['Settings', 'Settings'],
		password: ['Change Password', 'Password'],
		email: ['Change Email', 'Mailbox'],
		connect_community: ['Connect With A Community', 'vaadin:connect-o']
	};

	$: classesHeader = 'w-full';
	$: classesPageHeader = 'w-full';
	$: classesSidebarLeft = 'w-1/6 bg-stone-200';
	$: classesMain = 'mx-4';
	$: classesSidebarRight = 'w-1/6  bg-stone-200';

	export let data;
	let profileMessagesData: { id: number; message: string; created_at: string }[];
	if (data?.profileMessagesData) {
		profileMessagesData = data.profileMessagesData;
	}

	const profiles = {
		community_bcyca_profile: data.community_bcyca_profile,
		community_tinonee_profile: data.community_tinonee_profile,
		community_mondrook_profile: data.community_mondrook_profile,
		community_external_profile: data.community_external_profile
	};

	let isNotCollapsed: string | null = null;
	let isCollapsed: string[] = [];

	for (const profileKey in profiles) {
		if (profiles.hasOwnProperty(profileKey) && profiles[profileKey] !== null) {
			if (isNotCollapsed === '') {
				isNotCollapsed = profileKey.replace('_profile', '');
			} else {
				isCollapsed.push(profileKey.replace('_profile', ''));
			}
		}
	}

	const nonNullProfilesCount = Object.values(profiles).filter((profile) => profile !== null).length;
	let communityText = 'Community';
	if (nonNullProfilesCount > 1) {
		communityText = 'Communities';
	}

	function toggleCollapse(id: string) {
		const element = document.getElementById(id);
		if (element) {
			const isHidden = element.classList.contains('hidden');
			if (id === isNotCollapsed) {
				if (isNotCollapsed === '') {
					isNotCollapsed = id;
				}
				element.classList.toggle('hidden');
				if (element.classList.contains('hidden') && !isHidden) {
					isNotCollapsed = '';
				}
			} else if (isCollapsed.includes(id)) {
				element.classList.remove('hidden');
				isCollapsed = isCollapsed.filter((item) => item !== id);
			} else {
				element.classList.add('hidden');
				isCollapsed.push(id);
			}
		}
	}
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
					<span class="px-2 text-stone-50">My {communityText}</span>
				</a>
				<a
					class="flex items-center pl-8 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity/bcyca"
					on:click|preventDefault={() => toggleCollapse('community_bcyca')}
				>
					<iconify-icon
						icon="emojione-monotone:letter-b"
						class="text-stone-50"
						style="font-size: 18px"
					/>
					<span class="px-2 text-stone-50">BCYCA</span>
					{#if isNotCollapsed === 'community_bcyca'}
						<iconify-icon icon="bi:chevron-up" class="text-stone-50 ml-auto" />
					{:else}
						<iconify-icon icon="bi:chevron-down" class="text-stone-50 ml-auto" />
					{/if}
				</a>
				<div id="community_bcyca" class={isNotCollapsed !== 'community_bcyca' ? 'hidden' : ''}>
					<a
						class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
						href="/profile/mycommunity/bcyca/information"
					>
						<iconify-icon
							icon="tabler:info-square-rounded"
							class="text-stone-50"
							style="font-size: 18px"
						/>
						<span class="px-2 text-stone-50">BCYCA Information</span></a
					>
					<a
						class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
						href="/profile/mycommunity/bcyca/workshops"
					>
						<iconify-icon icon="tabler:school" class="text-stone-50" style="font-size: 18px" />
						<span class="px-2 text-stone-50">BCYCA Workshops</span></a
					>
					<a
						class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
						href="/profile/mycommunity/bcyca/events"
					>
						<iconify-icon
							icon="tabler:calendar-event"
							class="text-stone-50"
							style="font-size: 18px"
						/>
						<span class="px-2 text-stone-50">BCYCA Events</span></a
					>
					<a
						class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
						href="/profile/mycommunity/bcyca/map"
					>
						<iconify-icon icon="gis:map-users" class="text-stone-50" style="font-size: 18px" />
						<span class="px-2 text-stone-50">Community Map</span></a
					>
				</div>
				<a
					class="flex items-center pl-8 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/mycommunity/tinonee"
					on:click|preventDefault={() => toggleCollapse('community_tinonee')}
				>
					<iconify-icon
						icon="emojione-monotone:letter-t"
						class="text-stone-50"
						style="font-size: 18px"
					/>
					<span class="px-2 text-stone-50">Tinonee</span>
					{#if isNotCollapsed === 'community_tinonee'}
						<iconify-icon icon="bi:chevron-up" class="text-stone-50 ml-auto" />
					{:else}
						<iconify-icon icon="bi:chevron-down" class="text-stone-50 ml-auto" />
					{/if}
				</a>
				<div id="community_tinonee" class={isNotCollapsed !== 'community_tinonee' ? 'hidden' : ''}>
					<a
						class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
						href="/profile/mycommunity/tinonee/information"
					>
						<iconify-icon
							icon="tabler:info-square-rounded"
							class="text-stone-50"
							style="font-size: 18px"
						/>
						<span class="px-2 text-stone-50">Tinonee Information</span></a
					>
					<a
						class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
						href="/profile/mycommunity/tinonee/workshops"
					>
						<iconify-icon icon="tabler:school" class="text-stone-50" style="font-size: 18px" />
						<span class="px-2 text-stone-50">Tinonee Workshops</span></a
					>
					<a
						class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
						href="/profile/mycommunity/tinonee/events"
					>
						<iconify-icon
							icon="tabler:calendar-event"
							class="text-stone-50"
							style="font-size: 18px"
						/>
						<span class="px-2 text-stone-50">Tinonee Events</span></a
					>
					<a
						class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
						href="/profile/mycommunity/tinonee/map"
					>
						<iconify-icon icon="gis:map-users" class="text-stone-50" style="font-size: 18px" />
						<span class="px-2 text-stone-50">Community Map</span></a
					>
				</div>
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
				<a
					class="flex items-center pl-8 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
					href="/profile/settings/connect_community"
				>
					<iconify-icon icon="vaadin:connect-o" class="text-stone-50" style="font-size: 18px" />
					<span class="px-2 text-stone-50">Connect With A Community</span></a
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

<style>
	.hidden {
		display: none;
	}
</style>
