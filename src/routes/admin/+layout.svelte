<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';

	import Breadcrumbs from '$components/page/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';
	import SidebarAdminMenu from '$components/navigation/sidemenu/SidebarAdminMenu.svelte';

	import 'iconify-icon';
	import { adminSidebarPathLables, adminSidebarMenuItems } from '$lib/menu-items.js';

	$: classesHeader = 'w-full';
	$: classesPageHeader = 'w-full';
	$: classesSidebarLeft = 'w-1/6 bg-stone-200';
	$: classesMain = 'mx-4';
	$: classesSidebarRight = 'w-1/6  bg-stone-200';

	export let data;

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
		<Breadcrumbs pathLables={adminSidebarPathLables} />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class="p-1 flex flex-col w-full">
			<div class="flex flex-row justify-around pt-2 text-xl">Administrator Menu</div>
			<div class="flex flex-col rounded-lg bg-orange-600">
				<SidebarAdminMenu
					siderbarMenuItems={adminSidebarMenuItems}
					adminPermissions={data.permissions}
				/>
			</div>
		</div></svelte:fragment
	>
	<svelte:fragment slot="sidebarRight">
		<MessageContainer messagesData={adminMessages} />
	</svelte:fragment>
	<slot />
</AppShell>
