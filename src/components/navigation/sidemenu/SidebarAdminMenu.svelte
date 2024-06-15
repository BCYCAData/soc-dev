<script lang="ts">
	import type { AdminMenuItem } from '$lib/types';
	import 'iconify-icon';

	export let siderbarMenuItems: AdminMenuItem[];
	export let adminPermissions: string[] = [];

	let activeSubmenus: string[] = siderbarMenuItems
		.filter((item) => item.initialOpen)
		.map((item) => item.id);

	let activeSubSubmenus: { [key: string]: string[] } = {};

	function toggleSubmenu(id: string) {
		// Toggle the current submenu
		if (activeSubmenus.includes(id)) {
			activeSubmenus = activeSubmenus.filter((item) => item !== id);
		} else {
			// Close any other open submenus
			activeSubmenus = [id];
		}

		// Close any open sub-submenus for the current submenu
		activeSubSubmenus[id] = [];
	}

	function toggleSubSubmenu(parentId: string, id: string) {
		// Toggle the current sub-submenu
		if (activeSubSubmenus[parentId]?.includes(id)) {
			activeSubSubmenus[parentId] = activeSubSubmenus[parentId].filter((item) => item !== id);
		} else {
			// Close any other open sub-submenus for the current submenu
			activeSubSubmenus[parentId] = [id];
		}
	}

	// Helper function to check if an item is an admin menu item
	function isAdminMenuItem(item: AdminMenuItem): item is AdminMenuItem {
		return (
			(item as AdminMenuItem).permission !== undefined &&
			(item as AdminMenuItem).permission !== 'kyng'
		);
	}

	// Filter siderbarMenuItems based on permissions
	let filteredMenuItems = siderbarMenuItems.filter((item) => {
		if (isAdminMenuItem(item)) {
			// If it's an admin menu item, check if its permission is in the adminPermissions array
			return adminPermissions.includes(item.permission);
		}
		// If it's not an admin menu item, include it by default
		return true;
	});
	filteredMenuItems = filteredMenuItems.map((item) => {
		if (item.subItems) {
			item.subItems = item.subItems.filter((subItem) => {
				if (isAdminMenuItem(subItem)) {
					// If it's an admin sub-item, check if its permission is in the adminPermissions array
					return adminPermissions.includes(subItem.permission);
				}
				// If it's not an admin sub-item, include it by default
				return true;
			});
		}
		return item;
	});
</script>

<div class="flex flex-col rounded-lg bg-orange-600">
	<!-- {#each siderbarMenuItems as item} -->
	{#each filteredMenuItems as item}
		<div>
			<a
				role="button"
				tabindex="0"
				href={item.link}
				class="menu-item p-2 rounded-full cursor-pointer flex items-center"
				on:click={() => toggleSubmenu(item.id)}
				on:keydown={() => toggleSubmenu(item.id)}
			>
				<iconify-icon icon={item.icon} class="text-stone-50 text-2xl" />
				<span class="ml-2 text-stone-50">{item.name}</span>
				{#if item.subItems}
					<svg
						class="caret {activeSubmenus.includes(item.id)
							? 'rotate'
							: ''} ml-auto transform transition-transform duration-300"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#FAFAF9"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				{/if}
			</a>
			{#if activeSubmenus.includes(item.id) && item.subItems}
				<div class="submenu pl-5">
					{#each item.subItems as subItem}
						<div>
							<a
								role="button"
								tabindex="0"
								href={subItem.link}
								class="menu-item p-2 rounded-full cursor-pointer flex items-center"
								on:click={() => toggleSubSubmenu(item.id, subItem.id)}
								on:keydown={() => toggleSubSubmenu(item.id, subItem.id)}
							>
								<iconify-icon icon={subItem.icon} class="text-stone-50 text-2xl" />
								<span class="ml-2 text-stone-50">{subItem.name}</span>
								{#if subItem.subItems}
									<svg
										class="caret {activeSubSubmenus[item.id]?.includes(subItem.id)
											? 'rotate'
											: ''} ml-auto transform transition-transform duration-300"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#FAFAF9"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polyline points="6 9 12 15 18 9"></polyline>
									</svg>
								{/if}
							</a>
							{#if activeSubSubmenus[item.id]?.includes(subItem.id) && subItem.subItems}
								<div class="submenu pl-5">
									{#each subItem.subItems as nestedSubItem}
										<div>
											<a
												role="button"
												tabindex="0"
												href={nestedSubItem.link}
												class="menu-item p-2 rounded-full cursor-pointer flex items-center"
												on:click={() => toggleSubSubmenu(subItem.id, nestedSubItem.id)}
												on:keydown={() => toggleSubSubmenu(subItem.id, nestedSubItem.id)}
											>
												<iconify-icon icon={nestedSubItem.icon} class="text-stone-50 text-2xl" />
												<span class="ml-2 text-stone-50">{nestedSubItem.name}</span>
											</a>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.menu-item:hover {
		background-color: #fdba74;
		transform: scale(1.02);
	}
	.caret.rotate {
		transform: rotate(90deg);
	}
</style>
