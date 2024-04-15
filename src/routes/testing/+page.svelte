<script lang="ts">
	import SidebarMenu from '$components/navigation/sidemenu/SidebarMenu.svelte';

	import { adminSidebarMenuItems } from '$lib/menu-items';

	// let menuItems = [
	// 	{ name: 'Dashboard', link: '/dashboard', icon: '🏠' },
	// 	{
	// 		name: 'Products',
	// 		link: '/products',
	// 		icon: '📦',
	// 		subItems: [
	// 			{ name: 'Product 1', link: '/products/1', icon: '🛈' },
	// 			{ name: 'Product 2', link: '/products/2', icon: '🛈' },
	// 			{ name: 'Product 3', link: '/products/3', icon: 'tabler:stack-2' }
	// 		]
	// 	},
	// 	{ name: 'Settings', link: '/settings', icon: '⚙️' },
	// 	{
	// 		name: 'Products',
	// 		link: '/products',
	// 		icon: '📦',
	// 		subItems: [
	// 			{ name: 'Product 1', link: '/products/1', icon: '🛈' },
	// 			{ name: 'Product 2', link: '/products/2', icon: '🛈' },
	// 			{ name: 'Product 3', link: '/products/3', icon: '🛈' }
	// 		]
	// 	},
	// 	{ name: 'Settings', link: '/settings', icon: '⚙️' }
	// ];
</script>

<SidebarMenu menuItems={adminSidebarMenuItems} />
