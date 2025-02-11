<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import MenuItem from './MenuItem.svelte';
	import SubMenuItem from './SubMenuItem.svelte';
	import SubSubMenuItem from './SubSubMenuItem.svelte';
	import { kyngSidebarMenuItems } from '$lib/menu-items';
	import type { KYNGArea } from '$lib/types';

	interface Props {
		kyngArea: KYNGArea;
		isSidebarCollapsed: boolean;
	}

	const { kyngArea, isSidebarCollapsed }: Props = $props();

	let permissions = $derived(page.data.permissions ? page.data.permissions.split(',') : []);
	const menuItems = $derived(kyngSidebarMenuItems(permissions, kyngArea));

	let activeSubmenus = $state<string[]>([]);
	let activeSubSubmenus = $state<Record<string, string[]>>({});
	let currentPath = $state(page.url.pathname);

	function isCurrentPath(itemPath: string) {
		return currentPath.startsWith(itemPath);
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
		activeSubmenus = activeSubmenus.includes(id)
			? activeSubmenus.filter((item) => item !== id)
			: [id];
		activeSubSubmenus[id] = [];
	}

	function toggleSubSubmenu(parentId: string, id: string) {
		activeSubSubmenus[parentId] = activeSubSubmenus[parentId]?.includes(id)
			? activeSubSubmenus[parentId].filter((item) => item !== id)
			: [id];
	}

	function updateActiveMenus() {
		const newActiveSubmenus = new Set<string>();
		const newActiveSubSubmenus: Record<string, string[]> = {};

		menuItems.forEach((item) => {
			if (item.subItems) {
				const activeSubItems = item.subItems
					.filter((subItem) => subItem.link && isCurrentPath(subItem.link))
					.map((subItem) => subItem.id);

				if (activeSubItems.length > 0) {
					newActiveSubmenus.add(item.id);
					newActiveSubSubmenus[item.id] = activeSubItems;
				}
			}
		});

		activeSubmenus = Array.from(newActiveSubmenus);
		activeSubSubmenus = newActiveSubSubmenus;
	}

	$effect(() => {
		if (currentPath !== page.url.pathname) {
			currentPath = page.url.pathname;
			updateActiveMenus();
		}
	});
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
