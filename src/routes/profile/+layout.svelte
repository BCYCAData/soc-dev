<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';

	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';
	import SidebarProfileMenu from '$components/navigation/sidemenu/SidebarProfileMenu.svelte';

	import 'iconify-icon';

	import { profileSidebarPathLables, profileSidebarMenuItems } from '$lib/menu-items.js';

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

	const filterByIds: string[] = [];

	if (!profiles.community_bcyca_profile) {
		filterByIds.push('bcyca');
	}
	if (!profiles.community_tinonee_profile) {
		filterByIds.push('tinonee');
	}
	if (!profiles.community_mondrook_profile) {
		filterByIds.push('mondrook');
	}
	if (!profiles.community_external_profile) {
		filterByIds.push('external');
	}

	const nonNullProfilesCount = Object.values(profiles).filter((profile) => profile !== null).length;
	let communityText = 'Community';
	if (nonNullProfilesCount > 1) {
		communityText = 'Communities';
	}

	const filteredProfileSidebarMenuItems = profileSidebarMenuItems('My Community').map((item) => {
		if (item.id === 'my-community') {
			return {
				...item,
				subItems: item.subItems?.filter((subItem) => !filterByIds.includes(subItem.id))
			};
		}
		return { ...item };
	});
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
	<svelte:fragment slot="pageHeader"
		><Breadcrumbs pathLables={profileSidebarPathLables} /></svelte:fragment
	>
	<svelte:fragment slot="sidebarLeft">
		<div class="p-1 flex flex-col w-full">
			<div class="flex flex-row justify-around pt-2 text-xl">Profile Menu</div>
			<div class="flex flex-col rounded-lg bg-orange-600">
				<!-- <SidebarMenu siderbarMenuItems={profileSidebarMenuItems(communityText)} /> -->
				<SidebarProfileMenu siderbarMenuItems={filteredProfileSidebarMenuItems} />
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
