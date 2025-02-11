<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import MenuItem from '$components/page/navigation/sidemenu/MenuItem.svelte';
	import SubMenuItem from '$components/page/navigation/sidemenu/SubMenuItem.svelte';
	import SubSubMenuItem from '$components/page/navigation/sidemenu/SubSubMenuItem.svelte';
	import { profileSidebarMenuItems } from '$lib/menu-items';
	import type { PropertyProfile } from '$lib/form.types';

	interface Props {
		isSidebarCollapsed: boolean;
		communityText: string;
		properties: PropertyProfile[];
		communityProfiles: Record<string, string | null>;
	}

	const { isSidebarCollapsed, communityText, properties, communityProfiles }: Props = $props();

	const menuItems = $derived(
		profileSidebarMenuItems(communityText, properties, null, communityProfiles)
	);

	let activeSubmenus = $state<string[]>([]);
	let activeSubSubmenus = $state<Record<string, string[]>>({});
	let currentPath = $state(page.url.pathname);

	function isCurrentPath(itemPath: string) {
		return page.url.pathname.startsWith(itemPath);
	}

	function smoothSlide(node: HTMLElement, { duration = 200 }) {
		return {
			duration,
			css: (t: number) => {
				const eased = quintOut(t);
				return `
                height: ${t * 100}%;
                opacity: ${eased};
                transform: translateY(${(1 - eased) * 20}px)
            `;
			}
		};
	}

	function toggleSubmenu(id: string) {
		if (activeSubmenus.includes(id)) {
			activeSubmenus = activeSubmenus.filter((item) => item !== id);
			delete activeSubSubmenus[id];
		} else {
			activeSubmenus = [id];
			activeSubSubmenus = { [id]: [] };
		}
	}

	function toggleSubSubmenu(parentId: string, id: string) {
		activeSubSubmenus[parentId] = activeSubSubmenus[parentId]?.includes(id)
			? activeSubSubmenus[parentId].filter((item) => item !== id)
			: [...(activeSubSubmenus[parentId] || []), id];
	}

	$effect(() => {
		if (currentPath !== page.url.pathname) {
			currentPath = page.url.pathname;
			updateActiveMenus();
		}
	});

	function updateActiveMenus() {
		menuItems.forEach((item) => {
			if (item.subItems) {
				const hasMatchingSubItem = item.subItems.some(
					(subItem) =>
						(subItem.link && isCurrentPath(subItem.link)) ||
						subItem.subItems?.some(
							(nestedItem) => nestedItem.link && isCurrentPath(nestedItem.link)
						)
				);

				if (hasMatchingSubItem) {
					activeSubmenus = [...activeSubmenus, item.id];
					item.subItems.forEach((subItem) => {
						if (
							subItem.subItems?.some(
								(nestedItem) => nestedItem.link && isCurrentPath(nestedItem.link)
							)
						) {
							activeSubSubmenus[item.id] = [...(activeSubSubmenus[item.id] || []), subItem.id];
						}
					});
				}
			}
		});
	}
</script>

<div class="menu-container">
	{#each menuItems as item}
		<MenuItem
			{item}
			isCollapsed={isSidebarCollapsed}
			isActive={isCurrentPath(item.link)}
			onItemClick={() => item.subItems && toggleSubmenu(item.id)}
		/>

		{#if activeSubmenus.includes(item.id) && item.subItems && !isSidebarCollapsed}
			<div class="submenu" transition:smoothSlide={{ duration: 200 }}>
				{#each item.subItems as subItem}
					<div transition:fade={{ duration: 150 }}>
						<SubMenuItem
							item={subItem}
							isActive={isCurrentPath(subItem.link)}
							onItemClick={() => subItem.subItems && toggleSubSubmenu(item.id, subItem.id)}
						/>

						{#if activeSubSubmenus[item.id]?.includes(subItem.id) && subItem.subItems}
							<div class="nested-submenu" transition:smoothSlide={{ duration: 200 }}>
								{#each subItem.subItems as nestedSubItem}
									<div transition:fade={{ duration: 150 }}>
										<SubSubMenuItem
											item={nestedSubItem}
											isActive={isCurrentPath(nestedSubItem.link)}
										/>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/each}
</div>

<style>
	.menu-container {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.submenu,
	.nested-submenu {
		overflow: hidden;
	}
</style>
