<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { Menu, X } from 'lucide-svelte';

	import { helpContent } from '$stores/helpstore';
	import { loadHelpContent } from '$lib/utility';
	import HelpPanel from '$components/page/help/HelpPanel.svelte';
	import MenuToggleIcon from '$components/icons/MenuToggleIcon.svelte';

	import type { Snippet } from 'svelte';

	interface Props {
		sidebarTitle: string;
		breadcrumbs?: Snippet;
		/** Sidebar menu content; receives the collapsed state (always false in the mobile drawer). */
		sidebar: Snippet<[boolean]>;
		sidebarFooter?: Snippet;
		children?: Snippet;
	}

	let { sidebarTitle, breadcrumbs, sidebar, sidebarFooter, children }: Props = $props();

	let isSidebarCollapsed = $state(
		browser ? localStorage.getItem('sidebarCollapsed') === 'true' : false
	);
	let isHelpbarCollapsed = $state(
		browser ? localStorage.getItem('helpbarCollapsed') === 'true' : false
	);
	let isMobileNavOpen = $state(false);

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

	// Close the mobile drawer whenever navigation happens.
	$effect(() => {
		void page.url.pathname;
		isMobileNavOpen = false;
	});
</script>

<svelte:window on:keydown={handleKeyboardShortcut} />

<div class="app-shell">
	<div class="app-shell-breadcrumbs flex items-center gap-1">
		<button
			type="button"
			class="text-surface-950-50 shrink-0 p-2 lg:hidden"
			aria-label="Open menu"
			onclick={() => (isMobileNavOpen = true)}
		>
			<Menu class="h-6 w-6" aria-hidden="true" />
		</button>
		<div class="min-w-0 flex-1 overflow-x-auto">
			{@render breadcrumbs?.()}
		</div>
	</div>

	<div class="app-shell-main">
		<!-- Desktop sidebar (collapsible rail) -->
		<div
			class="app-shell-sidebar-left hidden lg:block {isSidebarCollapsed
				? 'w-16'
				: 'w-1/6'} transition-all duration-300"
		>
			<div class="flex w-full flex-col p-1">
				<button
					type="button"
					class="collapse-toggle text-secondary-700-300 self-end p-2"
					onclick={toggleSidebar}
					aria-label={isSidebarCollapsed ? 'Expand menu' : 'Collapse menu'}
					aria-expanded={!isSidebarCollapsed}
				>
					<MenuToggleIcon
						isMenuCollapsed={isSidebarCollapsed}
						color="var(--color-surface-50)"
						size={20}
					/>
				</button>
				<div class="flex flex-row justify-around pt-2 text-xl">
					{#if !isSidebarCollapsed}{sidebarTitle}{/if}
				</div>
				<div class="sidebar-menu flex flex-col rounded-lg">
					{@render sidebar(isSidebarCollapsed)}
				</div>
				{#if !isSidebarCollapsed}
					{@render sidebarFooter?.()}
				{/if}
			</div>
		</div>

		<!-- Mobile off-canvas drawer -->
		{#if isMobileNavOpen}
			<div class="fixed inset-0 z-40 lg:hidden">
				<button
					type="button"
					class="absolute inset-0 h-full w-full bg-black/50"
					aria-label="Close menu"
					onclick={() => (isMobileNavOpen = false)}
				></button>
				<div class="drawer absolute inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto p-2">
					<div class="flex items-center justify-between">
						<span class="pl-2 text-xl">{sidebarTitle}</span>
						<button
							type="button"
							class="p-2"
							aria-label="Close menu"
							onclick={() => (isMobileNavOpen = false)}
						>
							<X class="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div class="sidebar-menu flex flex-col rounded-lg">
						{@render sidebar(false)}
					</div>
					{@render sidebarFooter?.()}
				</div>
			</div>
		{/if}

		<div class="app-shell-content mx-2 lg:mx-4">
			{@render children?.()}
		</div>

		<div class="hidden lg:contents">
			<HelpPanel isCollapsed={isHelpbarCollapsed} />
		</div>
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

	.drawer {
		background-color: var(--color-secondary-200);
	}
	:global(.dark) .drawer {
		background-color: var(--color-surface-900);
	}

	.app-shell-main {
		display: flex;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	.app-shell-sidebar-left {
		flex: 0 0 auto;
		overflow-y: auto;
	}

	.app-shell-content {
		flex: 1;
		min-width: 0;
		overflow-y: auto;
	}
</style>
