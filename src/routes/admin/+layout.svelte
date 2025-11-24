<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { helpContent } from '$stores/helpstore';
	import { loadHelpContent } from '$lib/utility';
	import Breadcrumbs from '$components/page/navigation/Breadcrumbs.svelte';
	import HelpPanel from '$components/page/help/HelpPanel.svelte';
	// import MessageContainer from '$components/message/MessageContainer.svelte';
	import AdminSideMenu from '$components/page/navigation/sidemenu/AdminSideMenu.svelte';
	import MenuToggleIcon from '$components/icons/MenuToggleIcon.svelte';
	import { adminSidebarPathLables } from '$lib/menu-items';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	// let { data, children }: Props = $props();
	// let adminMessages = $state(data.adminMessages);
	let isSidebarCollapsed = $state(
		browser ? localStorage.getItem('sidebarCollapsed') === 'true' : false
	);
	let isHelpbarCollapsed = $state(
		browser ? localStorage.getItem('helpbarCollapsed') === 'true' : false
	);

	function toggleSidebar() {
		isSidebarCollapsed = !isSidebarCollapsed;
		if (browser) {
			localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.toString());
		}
	}

	function handleKeyboardShortcut(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === '[') {
			toggleSidebar();
		}
		if (event.ctrlKey && event.key === ']') {
			isHelpbarCollapsed = !isHelpbarCollapsed;
			if (browser) {
				localStorage.setItem('helpbarCollapsed', isHelpbarCollapsed.toString());
			}
		}
	}

	$effect(() => {
		const path = page.url.pathname.slice(1);
		loadHelpContent(path).then((content) => ($helpContent = content));
	});
</script>

<svelte:window on:keydown={handleKeyboardShortcut} />

<div class="app-shell bg-orange-200">
	<!-- <header class="mx-auto flex w-full items-center justify-center bg-orange-100">
		<h2 class="h2 text-primary-600 font-bold">Admin Dashboard</h2>
	</header> -->

	<div class="app-shell-breadcrumbs">
		<Breadcrumbs pathLables={adminSidebarPathLables} />
	</div>

	<div class="app-shell-main">
		<div
			class="app-shell-sidebar-left {isSidebarCollapsed
				? 'w-16'
				: 'w-1/6'} transition-all duration-300"
		>
			<div class="flex w-full flex-col p-1">
				<button class="collapse-toggle self-end p-2" onclick={toggleSidebar}>
					<MenuToggleIcon isMenuCollapsed={isSidebarCollapsed} color="#FAFAF9" size={20} />
				</button>
				<div class="flex flex-row justify-around pt-2 text-xl">
					{#if !isSidebarCollapsed}Admin Menu{/if}
				</div>
				<div class="flex flex-col rounded-lg bg-orange-600">
					<AdminSideMenu {isSidebarCollapsed} />
				</div>
				{#if !isSidebarCollapsed}
					<p class="ml-2">
						Please make sure you have the correct permissions <br />
						<b>before</b>
						accessing admin features.
					</p>
				{/if}
			</div>
		</div>

		<div class="app-shell-content mx-4">
			{@render children?.()}
		</div>

		<HelpPanel isCollapsed={isHelpbarCollapsed} />

		<!-- <div class="app-shell-sidebar-right w-1/6 bg-stone-200">
			<MessageContainer messagesData={adminMessages} />
		</div> -->
	</div>
</div>

<style>
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

	.app-shell-sidebar-left {
		overflow-y: auto;
	}

	.app-shell-content {
		flex: 1;
		overflow-y: auto;
	}
</style>
