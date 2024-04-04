<script lang="ts">
	import { AppShell, Accordion, AccordionItem } from '@skeletonlabs/skeleton';

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
		tinonee: ['Tinonee', 'emojione-monotone:letter-t'],
		mondrook: ['Mondrook', 'emojione-monotone:letter-m'],
		external: ['External', 'emojione-monotone:letter-e'],
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

	export let data;
	let profileMessagesData: { id: number; message: string; created_at: string }[];
	if (data?.profileMessagesData) {
		profileMessagesData = data.profileMessagesData;
	}

	const profiles = {
		community_bcyca_profile: data.communityProfiles?.community_bcyca_profile_id,
		community_tinonee_profile: data.communityProfiles?.community_tinonee_profile_id,
		community_mondrook_profile: data.communityProfiles?.community_mondrook_profile_id,
		community_external_profile: data.communityProfiles?.community_external_profile_id
	};

	const nonNullProfilesCount = Object.values(profiles).filter((profile) => profile !== null).length;
	let communityText = 'Community';
	if (nonNullProfilesCount > 1) {
		communityText = 'Communities';
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
			<h3 class="font-bold mx-auto text-orange-900">Strengthen OUR Community</h3>
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
				{#if nonNullProfilesCount > 0 && data.communityProfiles}
					<a
						class="flex items-center pl-1 pt-3 hover:bg-orange-300 hover:rounded !no-underline"
						href="/profile/mycommunity"
					>
						<iconify-icon icon="la:users" class="text-stone-50" style="font-size: 18px" />
						<span class="px-2 text-stone-50">My {communityText}</span>
					</a>
					<Accordion autocollapse>
						{#if data.communityProfiles.community_bcyca_profile_id !== null}
							<AccordionItem regionControl="bg-orange-500" regionCaret="text-stone-50">
								<svelte:fragment slot="lead">
									<a href="/profile/mycommunity/bcyca">
										<span
											><iconify-icon
												icon="emojione-monotone:letter-b"
												class="text-stone-50"
												style="font-size: 18px"
											/></span
										>
									</a>
								</svelte:fragment>
								<svelte:fragment slot="summary">
									<a href="/profile/mycommunity/bcyca">
										<span class="px-2 text-stone-50">BCYCA</span>
									</a></svelte:fragment
								>
								<svelte:fragment slot="content">
									<a
										class="flex items-center pl-2 hover:bg-orange-300 hover:rounded !no-underline"
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
										class="flex items-center pl-2 hover:bg-orange-300 hover:rounded !no-underline"
										href="/profile/mycommunity/bcyca/workshops"
									>
										<iconify-icon
											icon="tabler:school"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">BCYCA Workshops</span></a
									>
									<a
										class="flex items-center pl-2 hover:bg-orange-300 hover:rounded !no-underline"
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
										class="flex items-center pl-2 hover:bg-orange-300 hover:rounded !no-underline"
										href="/profile/mycommunity/bcyca/map"
									>
										<iconify-icon
											icon="gis:map-users"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">BCYCA Community Map</span></a
									></svelte:fragment
								>
							</AccordionItem>
						{/if}
						{#if data.communityProfiles.community_tinonee_profile_id !== null}
							<AccordionItem regionControl="bg-orange-500" regionCaret="text-stone-50">
								<svelte:fragment slot="lead">
									<a href="/profile/mycommunity/tinonee">
										<span
											><iconify-icon
												icon="emojione-monotone:letter-t"
												class="text-stone-50"
												style="font-size: 18px"
											/></span
										>
									</a>
								</svelte:fragment>
								<svelte:fragment slot="summary"
									><a href="/profile/mycommunity/tinonee">
										<span class="px-2 text-stone-50">Tinonee</span>
									</a></svelte:fragment
								>
								<svelte:fragment slot="content"
									><a
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
										<iconify-icon
											icon="tabler:school"
											class="text-stone-50"
											style="font-size: 18px"
										/>
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
										<iconify-icon
											icon="gis:map-users"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">Tinonee Community Map</span></a
									></svelte:fragment
								>
							</AccordionItem>
						{/if}
						{#if data.communityProfiles.community_mondrook_profile_id !== null}
							<AccordionItem regionControl="bg-orange-500" regionCaret="text-stone-50">
								<svelte:fragment slot="lead">
									<a href="/profile/mycommunity/mondrook">
										<span
											><iconify-icon
												icon="emojione-monotone:letter-m"
												class="text-stone-50"
												style="font-size: 18px"
											/></span
										>
									</a>
								</svelte:fragment>
								<svelte:fragment slot="summary"
									><a href="/profile/mycommunity/mondrook">
										<span class="px-2 text-stone-50">Mondrook</span>
									</a></svelte:fragment
								>
								<svelte:fragment slot="content"
									><a
										class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
										href="/profile/mycommunity/mondrook/information"
									>
										<iconify-icon
											icon="tabler:info-square-rounded"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">Mondrook Information</span></a
									>
									<a
										class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
										href="/profile/mycommunity/mondrook/workshops"
									>
										<iconify-icon
											icon="tabler:school"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">Mondrook Workshops</span></a
									>
									<a
										class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
										href="/profile/mycommunity/mondrook/events"
									>
										<iconify-icon
											icon="tabler:calendar-event"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">Mondrook Events</span></a
									>
									<a
										class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
										href="/profile/mycommunity/mondrook/map"
									>
										<iconify-icon
											icon="gis:map-users"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">Mondrook Community Map</span></a
									></svelte:fragment
								>
							</AccordionItem>
						{/if}
						{#if data.communityProfiles.community_external_profile_id !== null}
							<AccordionItem regionControl="bg-orange-500" regionCaret="text-stone-50">
								<svelte:fragment slot="lead">
									<a href="/profile/mycommunity/external">
										<span
											><iconify-icon
												icon="emojione-monotone:letter-e"
												class="text-stone-50"
												style="font-size: 18px"
											/></span
										>
									</a>
								</svelte:fragment>
								<svelte:fragment slot="summary"
									><a href="/profile/mycommunity/external">
										<span class="px-2 text-stone-50">External</span>
									</a></svelte:fragment
								>
								<svelte:fragment slot="content"
									><a
										class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
										href="/profile/mycommunity/external/information"
									>
										<iconify-icon
											icon="tabler:info-square-rounded"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">External Information</span></a
									>
									<a
										class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
										href="/profile/mycommunity/external/workshops"
									>
										<iconify-icon
											icon="tabler:school"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">External Workshops</span></a
									>
									<a
										class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
										href="/profile/mycommunity/external/events"
									>
										<iconify-icon
											icon="tabler:calendar-event"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">External Events</span></a
									>
									<a
										class="flex items-center pl-12 pt-1 hover:bg-orange-300 hover:rounded !no-underline"
										href="/profile/mycommunity/external/map"
									>
										<iconify-icon
											icon="gis:map-users"
											class="text-stone-50"
											style="font-size: 18px"
										/>
										<span class="px-2 text-stone-50">External Community Map</span></a
									></svelte:fragment
								>
							</AccordionItem>
						{/if}
					</Accordion>
				{/if}
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
