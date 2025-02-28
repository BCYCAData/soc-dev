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

	const propertyProfiles: PropertyProfile[] = Array.isArray(data.userProfile.property_profile)
		? data.userProfile.property_profile
		: [data.userProfile.property_profile];

	const communityProfiles = data.communityProfiles;

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

<div class="app-shell bg-orange-200">
	<header class="mx-auto flex w-full items-center justify-center bg-orange-100">
		<h2 class="h2 font-bold text-primary-600">Strengthen OUR Community</h2>
	</header>

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
					<MenuToggleIcon isMenuCollapsed={isSidebarCollapsed} color="#FAFAF9" size={20} />
				</button>
				<div class="flex flex-row justify-around pt-2 text-xl">
					{#if !isSidebarCollapsed}Profile Menu{/if}
				</div>
				<div class="flex flex-col rounded-lg bg-orange-600">
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

		<div class="app-shell-content mx-4 flex-grow">
			{@render children?.()}
		</div>

		<HelpPanel isCollapsed={isHelpbarCollapsed} />
	</div>
</div>

<style lang="postcss">
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100vh;
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
		flex: 1 1 auto;
		overflow-y: auto;
		width: 0;
	}
</style>
