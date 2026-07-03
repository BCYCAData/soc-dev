<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { helpContent } from '$stores/helpstore';
	import { loadHelpContent } from '$lib/utility';
	import Breadcrumbs from '$components/page/navigation/Breadcrumbs.svelte';
	// import MessageContainer from '$components/message/MessageContainer.svelte';
	import ProfileSideMenu from '$components/page/navigation/sidemenu/ProfileSideMenu.svelte';
	import MenuToggleIcon from '$components/icons/MenuToggleIcon.svelte';
	import HelpPanel from '$components/page/help/HelpPanel.svelte';
	import { profileSidebarPathLables } from '$lib/menu-items';
	// import type { ProfileMessageData } from '$lib/types';
	import type { PageData } from './$types';
	import type { PropertyProfile } from '$lib/form.types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	// let profileMessages: ProfileMessageData = $state(data.profileMessages);
	let isSidebarCollapsed = $state(
		browser ? localStorage.getItem('sidebarCollapsed') === 'true' : false
	);

	let isHelpbarCollapsed = $state(
		browser ? localStorage.getItem('helpbarCollapsed') === 'true' : false
	);

	const propertyProfiles: PropertyProfile[] = $derived(
		Array.isArray(data.userProfile.property_profile)
			? data.userProfile.property_profile
			: [data.userProfile.property_profile]
	);

	const communityProfiles = $derived(data.communityProfiles);

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
			// Update this to directly modify isHelpbarCollapsed
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
	<div class="app-shell-breadcrumbs">
		<Breadcrumbs pathLables={profileSidebarPathLables} properties={propertyProfiles} />
	</div>

	<div class="app-shell-main">
		<div
			class="app-shell-sidebar-left {isSidebarCollapsed
				? 'w-16'
				: 'w-1/6'} transition-all duration-300"
		>
			<div class="flex w-full flex-col p-1">
				<button class="collapse-toggle self-end p-2" onclick={toggleSidebar}>
					<div
						class="sidebar-toggle-label flex text-sm {!isSidebarCollapsed
							? 'flex-row items-center gap-2'
							: 'flex-col items-center'}"
					>
						{!isSidebarCollapsed ? 'Hide menu' : ''}
						<MenuToggleIcon
							isMenuCollapsed={isSidebarCollapsed}
							color="var(--color-surface-50)"
							size={20}
						/>
					</div>
				</button>
				<div class="flex flex-row justify-around pt-2 text-xl">
					{#if !isSidebarCollapsed}Profile Menu{/if}
				</div>
				<div class="sidebar-menu flex flex-col rounded-lg">
					<ProfileSideMenu
						{isSidebarCollapsed}
						communityText="Community"
						properties={propertyProfiles}
						{communityProfiles}
					/>
				</div>
				{#if !isSidebarCollapsed}
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
				{/if}
			</div>
		</div>

		<div class="app-shell-content mx-4 flex grow">
			<div class="w-full">
				{@render children?.()}
			</div>
		</div>

		<HelpPanel isCollapsed={isHelpbarCollapsed} />
	</div>
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100vh;
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

	/* secondary-800 → secondary-300 (non-balanced), so not a Color Pairing. */
	.sidebar-toggle-label {
		color: var(--color-secondary-800);
	}
	:global(.dark) .sidebar-toggle-label {
		color: var(--color-secondary-300);
	}

	.app-shell-main {
		display: flex;
		flex: 1;
		min-height: 0;
	}

	.app-shell-sidebar-left {
		flex: 0 0 auto;
		overflow-y: auto;
	}

	.app-shell-content {
		display: flex;
		flex: 1;
		min-width: 0;
	}
</style>
