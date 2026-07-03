<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { helpContent } from '$stores/helpstore';
	import { loadHelpContent } from '$lib/utility';
	import Breadcrumbs from '$components/page/navigation/Breadcrumbs.svelte';
	// import MessageContainer from '$components/message/MessageContainer.svelte';
	import HelpPanel from '$components/page/help/HelpPanel.svelte';
	import KYNGSideMenu from '$components/page/navigation/sidemenu/KYNGSideMenu.svelte';
	import MenuToggleIcon from '$components/icons/MenuToggleIcon.svelte';
	import { kyngSidebarPathLables } from '$lib/menu-items';
	import type { PageData } from './$types';
	import type { KYNGArea } from '$lib/types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	// let { kyngMessages, coordinatesKYNG } = data;
	const coordinatesKYNG = $derived(data.coordinatesKYNG);
	const safeCoordinatesKYNG = $derived(coordinatesKYNG ?? ([] as KYNGArea[]));

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

<div class="app-shell">
	<!-- <header class="mx-auto flex w-full items-center justify-center bg-secondary-100">
		<h3 class="font-bold text-secondary-900">Burrell Creek Youth & Community Association Inc.</h3>
	</header> -->

	<div class="app-shell-breadcrumbs">
		<Breadcrumbs pathLables={kyngSidebarPathLables} coordinatesKYNG={safeCoordinatesKYNG} />
	</div>

	<div class="app-shell-main">
		<div
			class="app-shell-sidebar-left {isSidebarCollapsed
				? 'w-16'
				: 'w-1/6'} transition-all duration-300"
		>
			<div class="flex w-full flex-col p-1">
				<button class="collapse-toggle text-secondary-700-300 self-end p-2" onclick={toggleSidebar}>
					<MenuToggleIcon
						isMenuCollapsed={isSidebarCollapsed}
						color="var(--color-surface-50)"
						size={20}
					/>
				</button>
				<div class="flex flex-row justify-around pt-2 text-xl">
					{#if !isSidebarCollapsed}Coordinator Menu{/if}
				</div>
				<div class="sidebar-menu flex flex-col rounded-lg">
					{#each safeCoordinatesKYNG as kyngArea (kyngArea.kyngAreaId)}
						<KYNGSideMenu {kyngArea} {isSidebarCollapsed} />
					{/each}
				</div>
			</div>
		</div>

		<div class="app-shell-content mx-4">
			{@render children?.()}
		</div>

		<HelpPanel isCollapsed={isHelpbarCollapsed} />
		<!-- <div class="app-shell-sidebar-right w-1/6 bg-surface-200">
			<MessageContainer messagesData={kyngMessages} />
		</div> -->
	</div>
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100%;
		/* secondary-200 → surface-900 is cross-family, so not a Color Pairing. */
		background-color: var(--color-secondary-200);
	}
	:global(.dark) .app-shell {
		background-color: var(--color-surface-900);
	}

	/* secondary-800 → secondary-900 (non-balanced), so not a Color Pairing. */
	.sidebar-menu {
		background-color: var(--color-secondary-800);
	}
	:global(.dark) .sidebar-menu {
		background-color: var(--color-secondary-900);
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
