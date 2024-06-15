import type { AdminMenuItem, ProfileMenuItem } from './types';

export const kyngSidebarPathLables: Record<string, string[]> = {
	kyngcoordinator: ['KYNG Coordinator', ''],
	messages: ['KYNG Area Messages', 'Messages'],
	user_admin: ['User Administration', 'Users'],
	registered: ['Registered', 'Users'],
	map: ['KYNG Map', 'Map2']
};

export const kyngSidebarMenuItems: AdminMenuItem[] = [
	{
		id: 'area-name',
		name: 'Area Name',
		link: '/kyngcoordinator/{kyng_area}',
		icon: 'la:users',
		permission: 'kyng',
		subItems: [
			{
				id: 'area-messages',
				name: 'KYNG Messages',
				link: '/kyngcoordinator/{kyng_area}/messages',
				icon: 'tabler:messages',
				permission: 'kyng'
			},
			{
				id: 'area-users-admin',
				name: 'Area User Administration',
				link: '/kyngcoordinator/{kyng_area}/user_admin',
				icon: 'la:users',
				permission: 'kyng',
				subItems: [
					{
						id: 'area-users-registered',
						name: 'Registered Users',
						link: '/kyngcoordinator/{kyng_area}/user_admin/registered',
						icon: 'tabler:report-analytics',
						permission: 'kyng'
					}
				]
			},
			{
				id: 'area-map',
				name: 'Area Map',
				link: '/kyngcoordinator/{kyng_area}/map',
				icon: 'gis:map-users',
				permission: 'kyng'
			}
		]
	}
];

export const adminSidebarPathLables = {
	admin: ['Administration', ''],
	site: ['Site Administration', 'Stack2'],
	messages: ['Site Messages', 'Messages'],
	roles: ['Role Management', 'Analyze'],
	users: ['User Administration', 'Users'],
	new: ['New Users', 'ReportAnalytics'],
	kits: ['Kits Delivered', 'ReportMoney'],
	emergency: ['Emergency Administration', 'Ambulance'],
	community: ['Community Administration', 'Settings'],
	bcyca: ['BCYCA', 'emojione-monotone:letter-b'],
	tinonee: ['Tinonee', 'emojione-monotone:letter-t'],
	mondrook: ['Mondrook', 'emojione-monotone:letter-m'],
	external: ['External', 'emojione-monotone:letter-e'],
	information: ['Information', 'InfoSquareRounded'],
	events: ['Events', 'CalendarEvent'],
	workshops: ['Workshops', 'School'],
	service_map: ['Service Map', 'Map2'],
	reports: ['Reports', 'Report']
};

export const adminSidebarMenuItems: AdminMenuItem[] = [
	{
		id: 'site-admin',
		name: 'Site Administration',
		link: '/admin/site',
		icon: 'tabler:stack-2',
		permission: 'admin.site',
		subItems: [
			{
				id: 'site-messages',
				name: 'Site Messages',
				link: '/admin/site/messages',
				icon: 'tabler:messages',
				permission: 'admin.site.messages'
			},
			{
				id: 'site-roles',
				name: 'Role Management',
				link: '/admin/site/roles',
				icon: 'tabler:analyze',
				permission: 'admin.site.roles'
			}
		]
	},
	{
		id: 'users-admin',
		name: 'User Administration',
		link: '/admin/users',
		icon: 'la:users',
		permission: 'admin.users',
		subItems: [
			{
				id: 'users-admin-new',
				name: 'New Users',
				link: '/admin/users/new',
				icon: 'tabler:report-analytics',
				permission: 'admin.users.newusers'
			},
			{
				id: 'users-admin-kits',
				name: 'Kits Delivered',
				link: '/admin/users/kits',
				icon: 'tabler:report-money',
				permission: 'admin.users.kits'
			}
		]
	},
	{
		id: 'emergency-admin',
		name: 'Emergency Administration',
		link: '/admin/emergency',
		icon: 'tabler:ambulance',
		permission: 'admin.emergency',
		subItems: [
			{
				id: 'emergency-admin-reports',
				name: 'Reports',
				link: '/admin/emergency/reports',
				icon: 'tabler:report',
				permission: 'admin.emergency.reports'
			},
			{
				id: 'emergency-admin-service-map',
				name: 'Service Map',
				link: '/admin/emergency/service_map',
				icon: 'gis:map-users',
				permission: 'admin.emergency.servicemap'
			}
		]
	},
	{
		id: 'community-admin',
		name: 'Communities Administration',
		link: '/admin/community',
		icon: 'tabler:settings',
		permission: 'admin.communities',
		subItems: [
			{
				id: 'community-admin-bcyca',
				name: 'BCYCA',
				link: '/admin/community/bcyca',
				icon: 'emojione-monotone:letter-b',
				permission: 'admin.bcyca',
				subItems: [
					{
						id: 'community-admin-bcyca-information',
						name: 'BCYCA Information',
						link: '/admin/community/bcyca/information',
						icon: 'tabler:info-square-rounded',
						permission: 'admin.bcyca.information'
					},
					{
						id: 'community-admin-bcyca-workshops',
						name: 'BCYCA Workshops',
						link: '/admin/community/bcyca/workshops',
						icon: 'tabler:school',
						permission: 'admin.bcyca.workshops'
					},
					{
						id: 'community-admin-bcyca-events',
						name: 'BCYCA Events',
						link: '/admin/community/bcyca/events',
						icon: 'tabler:calendar-event',
						permission: 'admin.bcyca.events'
					},
					{
						id: 'community-admin-bcyca-map',
						name: 'BCYCA Community Map',
						link: '/admin/community/bcyca/map',
						icon: 'gis:map-users',
						permission: 'admin.bcyca'
					}
				]
			},
			{
				id: 'community-admin-tinonee',
				name: 'Tinonee',
				link: '/admin/community/tinonee',
				icon: 'emojione-monotone:letter-t',
				permission: 'admin.tinonee',
				subItems: [
					{
						id: 'community-admin-tinonee-information',
						name: 'Tinonee Information',
						link: '/admin/community/tinonee/information',
						icon: 'tabler:info-square-rounded',
						permission: 'admin.tinonee.information'
					},
					{
						id: 'community-admin-tinonee-workshops',
						name: 'Tinonee Workshops',
						link: '/admin/community/tinonee/workshops',
						icon: 'tabler:school',
						permission: 'admin.tinonee.workshops'
					},
					{
						id: 'community-admin-tinonee-events',
						name: 'Tinonee Events',
						link: '/admin/community/tinonee/events',
						icon: 'tabler:calendar-event',
						permission: 'admin.tinonee.events'
					},
					{
						id: 'community-admin-tinonee-map',
						name: 'Tinonee Community Map',
						link: '/admin/community/tinonee/map',
						icon: 'gis:map-users',
						permission: 'admin.tinonee'
					}
				]
			},
			{
				id: 'community-admin-mondrook',
				name: 'Mondrook',
				link: '/admin/community/mondrook',
				icon: 'emojione-monotone:letter-m',
				permission: 'admin.mondrook',
				subItems: [
					{
						id: 'community-admin-mondrook-information',
						name: 'Mondrook Information',
						link: '/admin/community/mondrook/information',
						icon: 'tabler:info-square-rounded',
						permission: 'admin.mondrook.information'
					},
					{
						id: 'community-admin-mondrook-workshops',
						name: 'Mondrook Workshops',
						link: '/admin/community/mondrook/workshops',
						icon: 'tabler:school',
						permission: 'admin.mondrook.workshops'
					},
					{
						id: 'community-admin-mondrook-events',
						name: 'Mondrook Events',
						link: '/admin/community/mondrook/events',
						icon: 'tabler:calendar-event',
						permission: 'admin.mondrook.events'
					},
					{
						id: 'community-admin-mondrook-map',
						name: 'Mondrook Community Map',
						link: '/admin/community/mondrook/map',
						icon: 'gis:map-users',
						permission: 'admin.mondrook'
					}
				]
			},
			{
				id: 'community-admin-external',
				name: 'External',
				link: '/admin/community/external',
				icon: 'emojione-monotone:letter-e',
				permission: 'admin.external',
				subItems: [
					{
						id: 'community-admin-external-information',
						name: 'External Information',
						link: '/admin/community/external/information',
						icon: 'tabler:info-square-rounded',
						permission: 'admin.external.information'
					},
					{
						id: 'community-admin-external-workshops',
						name: 'External Workshops',
						link: '/admin/community/external/workshops',
						icon: 'tabler:school',
						permission: 'admin.external.workshops'
					},
					{
						id: 'community-admin-external-events',
						name: 'External Events',
						link: '/admin/community/external/events',
						icon: 'tabler:calendar-event',
						permission: 'admin.external.events'
					},
					{
						id: 'community-admin-external-map',
						name: 'External Community Map',
						link: '/admin/community/external/map',
						icon: 'gis:map-users',
						permission: 'admin.external'
					}
				]
			}
		]
	}
];

export const profileSidebarPathLables = {
	profile: ['Profile', 'carbon:home'],
	aboutme: ['About Me', 'User'],
	myplace: ['My Place', 'Home'],
	assets: ['Assets', 'BuildingEstate'],
	resources: ['Firefighting Resources', 'FireHydrant'],
	hazards: ['Firefighting Hazards', 'Flame'],
	mymap: ['My Map', 'Map'],
	mycommunity: ['My Community', 'Users'],
	bcyca: ['BCYCA', 'emojione-monotone:letter-b'],
	tinonee: ['Tinonee', 'emojione-monotone:letter-t'],
	mondrook: ['Mondrook', 'emojione-monotone:letter-m'],
	external: ['External', 'emojione-monotone:letter-e'],
	information: ['Information', 'InfoSquareRounded'],
	events: ['Events', 'CalendarEvent'],
	workshops: ['Workshops', 'School'],
	map: ['Community Map', 'Map2'],
	settings: ['Settings', 'Settings'],
	password: ['Change Password', 'Password'],
	email: ['Change Email', 'Mailbox']
};

export const profileSidebarMenuItems = (communityText: string): ProfileMenuItem[] => [
	{
		id: 'about-me',
		name: 'About Me',
		link: '/profile/aboutme',
		icon: 'carbon:user'
	},
	{
		id: 'my-place',
		name: 'My Place',
		link: '/profile/myplace',
		icon: 'tabler:home-2',
		initialOpen: true,
		subItems: [
			{
				id: 'assets',
				name: 'Assets',
				link: '/profile/myplace/assets',
				icon: 'carbon:building'
			},
			{
				id: 'resources',
				name: 'Firefighting Resources',
				link: '/profile/myplace/resources',
				icon: 'carbon:flame'
			},
			{
				id: 'hazards',
				name: 'Firefighting Hazards',
				link: '/profile/myplace/hazards',
				icon: 'carbon:flame'
			},
			{
				id: 'mymap',
				name: 'My Map',
				link: '/profile/myplace/mymap',
				icon: 'gis:map-users'
			}
		]
	},
	{
		id: 'my-community',
		name: `My ${communityText}`,
		link: '/profile/mycommunity',
		icon: 'la:users',
		initialOpen: false,
		subItems: [
			{
				id: 'bcyca',
				name: 'BCYCA',
				link: '/profile/mycommunity/bcyca',
				icon: 'emojione-monotone:letter-b',
				initialOpen: false,
				subItems: [
					{
						id: 'bcyca-information',
						name: 'BCYCA Information',
						link: '/profile/mycommunity/bcyca/information',
						icon: 'tabler:info-square-rounded'
					},
					{
						id: 'bcyca-workshops',
						name: 'BCYCA Workshops',
						link: '/profile/mycommunity/bcyca/workshops',
						icon: 'tabler:school'
					},
					{
						id: 'bcyca-events',
						name: 'BCYCA Events',
						link: '/profile/mycommunity/bcyca/events',
						icon: 'tabler:calendar-event'
					},
					{
						id: 'bcyca-map',
						name: 'BCYCA Community Map',
						link: '/profile/mycommunity/bcyca/map',
						icon: 'gis:map-users'
					}
				]
			},
			{
				id: 'tinonee',
				name: 'Tinonee',
				link: '/profile/mycommunity/tinonee',
				icon: 'emojione-monotone:letter-t',
				initialOpen: false,
				subItems: [
					{
						id: 'tinonee-information',
						name: 'Tinonee Information',
						link: '/profile/mycommunity/tinonee/information',
						icon: 'tabler:info-square-rounded'
					},
					{
						id: 'tinonee-workshops',
						name: 'Tinonee Workshops',
						link: '/profile/mycommunity/tinonee/workshops',
						icon: 'tabler:school'
					},
					{
						id: 'tinonee-events',
						name: 'Tinonee Events',
						link: '/profile/mycommunity/tinonee/events',
						icon: 'tabler:calendar-event'
					},
					{
						id: 'tinonee-map',
						name: 'Tinonee Community Map',
						link: '/profile/mycommunity/tinonee/map',
						icon: 'gis:map-users'
					}
				]
			},
			{
				id: 'mondrook',
				name: 'Mondrook',
				link: '/profile/mycommunity/mondrook',
				icon: 'emojione-monotone:letter-m',
				initialOpen: false,
				subItems: [
					{
						id: 'mondrook-information',
						name: 'Mondrook Information',
						link: '/profile/mycommunity/mondrook/information',
						icon: 'tabler:info-square-rounded'
					},
					{
						id: 'mondrook-workshops',
						name: 'Mondrook Workshops',
						link: '/profile/mycommunity/mondrook/workshops',
						icon: 'tabler:school'
					},
					{
						id: 'mondrook-events',
						name: 'Mondrook Events',
						link: '/profile/mycommunity/mondrook/events',
						icon: 'tabler:calendar-event'
					},
					{
						id: 'mondrook-map',
						name: 'Mondrook Community Map',
						link: '/profile/mycommunity/mondrook/map',
						icon: 'gis:map-users'
					}
				]
			},
			{
				id: 'external',
				name: 'External',
				link: '/profile/mycommunity/external',
				icon: 'emojione-monotone:letter-e',
				initialOpen: false,
				subItems: [
					{
						id: 'external-information',
						name: 'External Information',
						link: '/profile/mycommunity/external/information',
						icon: 'tabler:info-square-rounded'
					},
					{
						id: 'external-workshops',
						name: 'External Workshops',
						link: '/profile/mycommunity/external/workshops',
						icon: 'tabler:school'
					},
					{
						id: 'external-events',
						name: 'External Events',
						link: '/profile/mycommunity/external/events',
						icon: 'tabler:calendar-event'
					},
					{
						id: 'external-map',
						name: 'External Community Map',
						link: '/profile/mycommunity/external/map',
						icon: 'gis:map-users'
					}
				]
			}
		]
	},
	{
		id: 'my-settings',
		name: `My Settings`,
		link: '/profile/settings',
		icon: 'la:users',
		initialOpen: false,
		subItems: [
			{
				id: 'profile',
				name: 'My Profile',
				link: '/profile/settings/profile',
				icon: 'la:user'
			},
			{
				id: 'password',
				name: 'Change Password',
				link: '/profile/settings/password',
				icon: 'la:lock'
			}
		]
	}
];
