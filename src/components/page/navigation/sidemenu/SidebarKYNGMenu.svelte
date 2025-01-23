<script lang="ts">
	import { page } from '$app/state';
	import { kyngSidebarMenuItems } from '$lib/menu-items';
	import type { KYNGArea } from '$lib/types';

	interface Props {
		kyngArea: KYNGArea;
	}

	let { kyngArea }: Props = $props();
	let permissions = $derived(page.data.permissions ? page.data.permissions.split(',') : []);
	let menuItems = $derived(kyngSidebarMenuItems(permissions, kyngArea));

	let activeSubmenus = $state<string[]>([]);
	let activeSubSubmenus = $state<Record<string, string[]>>({});

	$effect(() => {
		activeSubmenus = menuItems.filter((item) => item.initialOpen).map((item) => item.id);
	});

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
</script>

<div class="flex flex-col rounded-lg bg-orange-600">
	{#each menuItems as item}
		<div>
			<a
				role="button"
				tabindex="0"
				href={item.link}
				class="menu-item flex cursor-pointer items-center rounded-full p-2"
				onclick={() => toggleSubmenu(item.id)}
				onkeydown={() => toggleSubmenu(item.id)}
			>
				{#if item.icon}
					<span class="text-stone-50">
						<item.icon.icon size={20} letter={item.icon.letter} />
					</span>
				{/if}
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
								class="menu-item flex cursor-pointer items-center rounded-full p-2"
								onclick={() => toggleSubSubmenu(item.id, subItem.id)}
								onkeydown={() => toggleSubSubmenu(item.id, subItem.id)}
							>
								{#if subItem.icon}
									<span class="text-stone-50">
										<subItem.icon.icon size={20} letter={subItem.icon.letter} />
									</span>
								{/if}
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
												class="menu-item flex cursor-pointer items-center rounded-full p-2"
												onclick={() => toggleSubSubmenu(subItem.id, nestedSubItem.id)}
												onkeydown={() => toggleSubSubmenu(subItem.id, nestedSubItem.id)}
											>
												{#if nestedSubItem.icon}
													<span class="text-stone-50">
														<nestedSubItem.icon.icon size={20} letter={nestedSubItem.icon.letter} />
													</span>
												{/if}
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
