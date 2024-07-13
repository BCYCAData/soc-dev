<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';

	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';
	import SidebarKyngMenu from '$components/navigation/sidemenu/SidebarKyngMenu.svelte';

	import 'iconify-icon';

	import { kyngSidebarPathLables, kyngSidebarMenuItems } from '$lib/menu-items.js';
	import type { AdminMenuItem } from '$lib/types.js';
	// import DisplayUserInfo from '$components/map/leaflet/ui/DisplayUserInfo.svelte';
	// import DisplayUnregisteredProperties from '$components/map/leaflet/ui/DisplayUnregisteredProperties.svelte';

	$: classesHeader = 'w-full';
	$: classesPageHeader = 'w-full';
	$: classesSidebarLeft = 'w-1/6 bg-stone-200';
	$: classesMain = 'mx-4';
	$: classesSidebarRight = 'w-1/6  bg-stone-200';

	export let data;

	data.kyngAreas.forEach((element: { id: string | number; kyng: any }) => {
		kyngSidebarPathLables[element.id] = [element.kyng || '', 'Area'];
	});

	function replaceLinksWithId(
		item: AdminMenuItem[],
		kyngAreaId: string,
		kyngName: string
	): AdminMenuItem[] {
		return item.map((menuItem) => {
			const updatedMenuItem: AdminMenuItem = { ...menuItem };
			if (updatedMenuItem.link.includes('{kyng_area}')) {
				updatedMenuItem.link = updatedMenuItem.link.replace('{kyng_area}', kyngAreaId);
			}
			if (updatedMenuItem.name.includes('Area Name')) {
				updatedMenuItem.name = kyngName;
			}
			if (updatedMenuItem.subItems) {
				updatedMenuItem.subItems = replaceLinksWithId(
					updatedMenuItem.subItems,
					kyngAreaId,
					kyngName
				);
			}
			return updatedMenuItem;
		});
	}

	const modifiedMenuItems: AdminMenuItem[] = [];

	data.kyngAreas.forEach((kyngArea: { id: string; kyng: string }) => {
		const updatedItems = replaceLinksWithId(kyngSidebarMenuItems, kyngArea.id, kyngArea.kyng);
		modifiedMenuItems.push(...updatedItems);
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
			<h3 class="font-bold mx-auto text-orange-900">
				Burrell Creek Youth & Community Association Inc.
			</h3>
		</div></svelte:fragment
	>
	<svelte:fragment slot="pageHeader">
		<Breadcrumbs pathLables={kyngSidebarPathLables} />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class="p-1 flex flex-col w-full">
			<div class="flex flex-row justify-around pt-2 text-xl">Coodinator Menu</div>
			<div class="flex flex-col rounded-lg bg-orange-600">
				{#each modifiedMenuItems as modifiedMenuItem}
					<SidebarKyngMenu siderbarMenuItems={[modifiedMenuItem]} />
				{/each}
			</div>
			<!-- <div class="flex flex-row justify-around pt-2 text-l">Registered Users</div>
			<div class="flex flex-col rounded-lg bg-orange-600"><DisplayUserInfo /></div> -->
			<div class="flex flex-row justify-around pt-2 text-l">Un-Registered Properties</div>
			<!-- <div class="flex flex-col rounded-lg bg-orange-600"><DisplayUnregisteredProperties /></div> -->
		</div></svelte:fragment
	>
	<svelte:fragment slot="sidebarRight">
		<MessageContainer messagesData={data.kyngMessages} />
	</svelte:fragment>
	<slot />
</AppShell>
