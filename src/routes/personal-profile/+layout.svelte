<script lang="ts">
	import Breadcrumbs from '$components/page/navigation/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';
	import SidebarProfileMenu from '$components/page/navigation/sidemenu/SidebarProfileMenu.svelte';
	import { profileSidebarPathLables } from '$lib/menu-items';
	import type { ProfileMessageData } from '$lib/types';
	import type { PageData } from './$types';
	import type { PropertyProfile } from '$lib/form.types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let profileMessages: ProfileMessageData = $state(data.profileMessages);

	const propertyProfiles: PropertyProfile[] = Array.isArray(data.userProfile.property_profile)
		? data.userProfile.property_profile
		: [data.userProfile.property_profile];

	const communityProfiles = data.communityProfiles;
</script>

<div class="app-shell bg-orange-200">
	<header class="mx-auto flex w-full items-center justify-center bg-orange-100">
		<h2 class="h2 font-bold text-primary-600">Strengthen OUR Community</h2>
	</header>

	<div class="app-shell-breadcrumbs">
		<Breadcrumbs pathLables={profileSidebarPathLables} properties={propertyProfiles} />
	</div>
	<div class="app-shell-main">
		<div class="app-shell-sidebar-left w-1/6 bg-stone-200">
			<div class="flex w-full flex-col p-1">
				<div class="flex flex-row justify-around pt-2 text-xl">Profile Menu</div>
				<div class="flex flex-col rounded-lg bg-orange-600">
					<SidebarProfileMenu
						communityText="Community"
						properties={propertyProfiles}
						{communityProfiles}
					/>
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
			</div>
		</div>

		<div class="app-shell-content mx-4">
			{@render children?.()}
		</div>

		<div class="app-shell-sidebar-right w-1/6 bg-stone-200">
			<MessageContainer messagesData={profileMessages} />
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
