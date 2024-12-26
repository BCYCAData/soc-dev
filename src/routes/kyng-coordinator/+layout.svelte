<script lang="ts">
	import Breadcrumbs from '$components/page/navigation/Breadcrumbs.svelte';
	import MessageContainer from '$components/message/MessageContainer.svelte';
	import SidebarKyngMenu from '$components/page/navigation/sidemenu/SidebarKYNGMenu.svelte';
	import { kyngSidebarPathLables } from '$lib/menu-items';
	import type { PageData } from './$types';
	import type { KYNGArea } from '$lib/types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let { kyngMessages, coordinatesKYNG } = data;

	const safeCoordinatesKYNG = coordinatesKYNG ?? ([] as KYNGArea[]);
</script>

<div class="app-shell bg-orange-200">
	<header class="mx-auto flex w-full items-center justify-center bg-orange-100">
		<h3 class="font-bold text-orange-900">Burrell Creek Youth & Community Association Inc.</h3>
	</header>

	<div class="app-shell-breadcrumbs">
		<Breadcrumbs pathLables={kyngSidebarPathLables} coordinatesKYNG={safeCoordinatesKYNG} />
	</div>

	<div class="app-shell-main">
		<div class="app-shell-sidebar-left w-1/6 bg-stone-200">
			<div class="flex w-full flex-col p-1">
				<div class="flex flex-row justify-around pt-2 text-xl">Coordinator Menu</div>
				<div class="flex flex-col rounded-lg bg-orange-600">
					{#each safeCoordinatesKYNG as kyngArea (kyngArea.kyngAreaId)}
						<SidebarKyngMenu {kyngArea} />
					{/each}
				</div>
				<div class="text-l flex flex-row justify-around pt-2">Un-Registered Properties</div>
			</div>
		</div>

		<div class="app-shell-content mx-4">
			{@render children?.()}
		</div>

		<div class="app-shell-sidebar-right w-1/6 bg-stone-200">
			<MessageContainer messagesData={kyngMessages} />
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
		height: 100%;
	}
</style>
