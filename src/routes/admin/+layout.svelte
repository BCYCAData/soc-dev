<script lang="ts">
	import Breadcrumbs from '$components/page/navigation/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';
	import SidebarAdminMenu from '$components/page/navigation/sidemenu/SidebarAdminMenu.svelte';
	import { adminSidebarPathLables } from '$lib/menu-items';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let adminMessages = $state(data.adminMessages);
</script>

<div class="app-shell bg-orange-200">
	<header class="mx-auto flex w-full items-center justify-center bg-orange-100">
		<h2 class="h2 font-bold text-primary-600">Admin Dashboard</h2>
	</header>

	<div class="app-shell-breadcrumbs">
		<Breadcrumbs pathLables={adminSidebarPathLables} />
	</div>

	<div class="app-shell-main">
		<div class="app-shell-sidebar-left w-1/6 bg-stone-200">
			<div class="flex w-full flex-col p-1">
				<div class="flex flex-row justify-around pt-2 text-xl">Admin Menu</div>
				<div class="flex flex-col rounded-lg bg-orange-600">
					<SidebarAdminMenu />
				</div>
				<p class="ml-2">
					Please make sure you have the correct permissions <br />
					<b>before</b>
					accessing admin features.
				</p>
			</div>
		</div>

		<div class="app-shell-content mx-4">
			{@render children?.()}
		</div>

		<div class="app-shell-sidebar-right w-1/6 bg-stone-200">
			<MessageContainer messagesData={adminMessages} />
		</div>
	</div>
</div>

<style lang="postcss">
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.app-shell-main {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.app-shell-sidebar-left,
	.app-shell-sidebar-right {
		overflow-y: auto;
	}

	.app-shell-content {
		flex: 1;
		overflow-y: auto;
	}
</style>
