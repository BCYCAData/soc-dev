import {
	Ambulance,
	Flame,
	Mailbox,
	Map,
	MapPinHouse,
	MapPinned,
	School,
	Settings,
	UserCheck,
	UserCog,
	Users,
	User,
	CalendarDays,
	FireExtinguisher,
	HousePlus,
	Info,
	KeyRound,
	UsersIcon,
	MessagesSquare,
	Shield,
	ChartBar,
	BookOpenText,
	SquareMenu,
	Hammer,
	BookUp,
	Cog,
	Database,
	Crown,
	Layers,
	BookPlus
} from 'lucide-svelte';

import TextIcon from '$components/page/navigation/TextIcon.svelte';

import type { MenuItem } from './types';
import type { PropertyProfile } from '$lib/form.types';

import type { KYNGArea } from '$lib/types';

export type PathConfig = {
	label: string;
	icon?: typeof User | typeof TextIcon;
	letter?: string;
	permission?: string;
};

export type Step = {
	index: number;
	text: string;
	page: string;
};

export type Crumb = {
	label: string;
	href: string;
	icon?: typeof User | typeof TextIcon;
	letter?: string;
};

export const kyngSidebarPathLables: Record<string, PathConfig> = {
	'kyng-coordinator': { label: 'KYNG Coordinator' },
	'unregistered-addresses': { label: 'Unregistered Addresses', icon: MessagesSquare },
	user_admin: { label: 'User Administration', icon: UsersIcon },
	registered: { label: 'Registered', icon: User },
	map: { label: 'KYNG Map', icon: Map }
};

const baseKyngSidebarMenuItems: MenuItem[] = [
	{
		id: 'area-name',
		name: '{kyng_name}', // Will be replaced with actual area name
		link: '/kyng-coordinator/{kyng_area}',
		icon: { icon: Users },
		permission: 'kyng',
		subItems: [
			{
				id: 'area-unregistered-addresses',
				name: 'Unregistered Addresses',
				link: '/kyng-coordinator/{kyng_area}/unregistered-addresses',
				icon: { icon: MessagesSquare },
				permission: 'kyng'
			},
			{
				id: 'area-users-admin',
				name: 'Area User Administration',
				link: '/kyng-coordinator/{kyng_area}/user-admin',
				icon: { icon: Users },
				permission: 'kyng'
			},
			{
				id: 'area-map',
				name: 'Area Map',
				link: '/kyng-coordinator/{kyng_area}/map',
				icon: { icon: MapPinned },
				permission: 'kyng'
			}
		]
	}
];

export const kyngSidebarMenuItems = (permissions: string[] | null, area: KYNGArea): MenuItem[] =>
	baseKyngSidebarMenuItems
		.filter((item) => !item.permission || permissions?.includes(item.permission))
		.map((item) => ({
			...item,
			name: item.name.replace('{kyng_name}', area.kyngName),
			link: item.link.replace('{kyng_area}', area.kyngAreaId),
			subItems: item.subItems?.map((subItem) => ({
				...subItem,
				link: subItem.link.replace('{kyng_area}', area.kyngAreaId),
				subItems: subItem.subItems?.map((nestedItem) => ({
					...nestedItem,
					link: nestedItem.link.replace('{kyng_area}', area.kyngAreaId)
				}))
			}))
		}));

export const adminSidebarPathLables: Record<string, PathConfig> = {
	admin: { label: 'Administration' },
	site: { label: 'Site Administration', icon: SquareMenu },
	messages: { label: 'Site Messages', icon: MessagesSquare },
	roles: { label: 'Role Management', icon: Shield },
	assignments: { label: 'Role Assignments', icon: UserCog },
	permissions: { label: 'Permission Management', icon: KeyRound },
	'kyng-coordinators': { label: 'KYNG Coordinator Management', icon: Crown },
	data: { label: 'Data Management', icon: Database },
	spatial: { label: 'Spatial Data Management', icon: Database },
	addresses: { label: 'Custom Address Management', icon: Database },
	users: { label: 'Project Administration', icon: Users },
	new: { label: 'New Users', icon: ChartBar },
	kits: { label: 'Kits Delivered', icon: Hammer },
	emergency: { label: 'Emergency Administration', icon: Ambulance },
	community: { label: 'Community Administration', icon: Settings },
	bcyca: { label: 'BCYCA', icon: TextIcon, letter: 'B' },
	tinonee: { label: 'Tinonee', icon: TextIcon, letter: 'T' },
	mondrook: { label: 'Mondrook', icon: TextIcon, letter: 'M' },
	external: { label: 'External', icon: TextIcon, letter: 'E' },
	information: { label: 'Information', icon: Info },
	events: { label: 'Events', icon: CalendarDays },
	workshops: { label: 'Workshops', icon: School },
	'service-map': { label: 'Service Map', icon: Map },
	reports: { label: 'Reports', icon: BookOpenText }
};

const baseAdminSidebarMenuItems: MenuItem[] = [
	{
		id: 'site-admin',
		name: 'Site Administration',
		link: '/admin/site',
		icon: { icon: SquareMenu },
		permission: 'admin.site',
		subItems: [
			{
				id: 'site-messages',
				name: 'Site Messages',
				link: '/admin/site/messages',
				icon: { icon: MessagesSquare },
				permission: 'admin.site.messages'
			},
			{
				id: 'site-roles',
				name: 'Role Management',
				link: '/admin/site/roles',
				icon: { icon: Shield },
				permission: 'admin.site.roles',
				subItems: [
					{
						id: 'site-roles-assignments',
						name: 'Role Assignments',
						link: '/admin/site/roles/assignments',
						icon: { icon: UserCog },
						permission: 'admin.site.roles'
					},
					{
						id: 'site-roles-permissions',
						name: 'Permission Management',
						link: '/admin/site/roles/permissions',
						icon: { icon: KeyRound },
						permission: 'admin.site.roles'
					}
				]
			},
			{
				id: 'site-data',
				name: 'Data Management',
				link: '/admin/site/data',
				icon: { icon: Database },
				permission: 'admin.site.data',
				subItems: [
					{
						id: 'site-data-spatial',
						name: 'Spatial Data Management',
						link: '/admin/site/data/spatial',
						icon: { icon: Layers },
						permission: 'admin.site.data'
					},
					{
						id: 'site-data-addresses',
						name: 'Custom Address Management',
						link: '/admin/site/data/addresses',
						icon: { icon: BookPlus },
						permission: 'admin.site.data'
					}
				]
			}
		]
	},
	{
		id: 'users-admin',
		name: 'Project Administration',
		link: '/admin/users',
		icon: { icon: Users },
		permission: 'admin.users',
		subItems: [
			{
				id: 'users-admin-new',
				name: 'New Users',
				link: '/admin/users/new',
				icon: { icon: ChartBar },
				permission: 'admin.users.newusers'
			},
			{
				id: 'users-admin-kits',
				name: 'Kits Delivered',
				link: '/admin/users/kits',
				icon: { icon: Hammer },
				permission: 'admin.users.kits'
			},
			{
				id: 'users-admin-kyngcoordinators',
				name: 'KYNG Coordinator Management',
				link: '/admin/users/kyng-coordinators',
				icon: { icon: Crown },
				permission: 'admin.users.kyngcoordinators'
			}
		]
	},
	{
		id: 'emergency-admin',
		name: 'Emergency Administration',
		link: '/admin/emergency',
		icon: { icon: Ambulance },
		permission: 'admin.emergency',
		subItems: [
			{
				id: 'emergency-admin-reports',
				name: 'Reports',
				link: '/admin/emergency/reports',
				icon: { icon: BookUp },
				permission: 'admin.emergency.reports'
			},
			{
				id: 'emergency-admin-service-map',
				name: 'Service Map',
				link: '/admin/emergency/service-map',
				icon: { icon: Map },
				permission: 'admin.emergency.servicemap'
			}
		]
	},
	{
		id: 'community-admin',
		name: 'Communities Administration',
		link: '/admin/community',
		icon: { icon: Cog },
		permission: 'admin.community',
		subItems: [
			{
				id: 'community-admin-bcyca',
				name: 'BCYCA',
				link: '/admin/community/bcyca',
				icon: { icon: TextIcon, letter: 'B' },
				permission: 'admin.community.bcyca',
				subItems: [
					{
						id: 'community-admin-bcyca-information',
						name: 'BCYCA Information',
						link: '/admin/community/bcyca/information',
						icon: { icon: Info },
						permission: 'admin.community.bcyca.information'
					},
					{
						id: 'community-admin-bcyca-workshops',
						name: 'BCYCA Workshops',
						link: '/admin/community/bcyca/workshops',
						icon: { icon: School },
						permission: 'admin.community.bcyca.workshops'
					},
					{
						id: 'community-admin-bcyca-events',
						name: 'BCYCA Events',
						link: '/admin/community/bcyca/events',
						icon: { icon: CalendarDays },
						permission: 'admin.community.bcyca.events'
					},
					{
						id: 'community-admin-bcyca-map',
						name: 'BCYCA Community Map',
						link: '/admin/community/bcyca/map',
						icon: { icon: Map },
						permission: 'admin.community.bcyca'
					}
				]
			},
			{
				id: 'community-admin-tinonee',
				name: 'Tinonee',
				link: '/admin/community/tinonee',
				icon: { icon: TextIcon, letter: 'T' },
				permission: 'admin.community.tinonee',
				subItems: [
					{
						id: 'community-admin-tinonee-information',
						name: 'Tinonee Information',
						link: '/admin/community/tinonee/information',
						icon: { icon: Info },
						permission: 'admin.community.tinonee.information'
					},
					{
						id: 'community-admin-tinonee-workshops',
						name: 'Tinonee Workshops',
						link: '/admin/community/tinonee/workshops',
						icon: { icon: School },
						permission: 'admin.community.tinonee.workshops'
					},
					{
						id: 'community-admin-tinonee-events',
						name: 'Tinonee Events',
						link: '/admin/community/tinonee/events',
						icon: { icon: CalendarDays },
						permission: 'admin.community.tinonee.events'
					},
					{
						id: 'community-admin-tinonee-map',
						name: 'Tinonee Community Map',
						link: '/admin/community/tinonee/map',
						icon: { icon: Map },
						permission: 'admin.community.tinonee'
					}
				]
			},
			{
				id: 'community-admin-mondrook',
				name: 'Mondrook',
				link: '/admin/community/mondrook',
				icon: { icon: TextIcon, letter: 'M' },
				permission: 'admin.community.mondrook',
				subItems: [
					{
						id: 'community-admin-mondrook-information',
						name: 'Mondrook Information',
						link: '/admin/community/mondrook/information',
						icon: { icon: Info },
						permission: 'admin.community.mondrook.information'
					},
					{
						id: 'community-admin-mondrook-workshops',
						name: 'Mondrook Workshops',
						link: '/admin/community/mondrook/workshops',
						icon: { icon: School },
						permission: 'admin.community.mondrook.workshops'
					},
					{
						id: 'community-admin-mondrook-events',
						name: 'Mondrook Events',
						link: '/admin/community/mondrook/events',
						icon: { icon: CalendarDays },
						permission: 'admin.community.mondrook.events'
					},
					{
						id: 'community-admin-mondrook-map',
						name: 'Mondrook Community Map',
						link: '/admin/community/mondrook/map',
						icon: { icon: Map },
						permission: 'admin.community.mondrook'
					}
				]
			},
			{
				id: 'community-admin-external',
				name: 'External',
				link: '/admin/community/external',
				icon: { icon: TextIcon, letter: 'E' },
				permission: 'admin.community.external',
				subItems: [
					{
						id: 'community-admin-external-information',
						name: 'External Information',
						link: '/admin/community/external/information',
						icon: { icon: Info },
						permission: 'admin.community.external.information'
					},
					{
						id: 'community-admin-external-workshops',
						name: 'External Workshops',
						link: '/admin/community/external/workshops',
						icon: { icon: School },
						permission: 'admin.community.external.workshops'
					},
					{
						id: 'community-admin-external-events',
						name: 'External Events',
						link: '/admin/community/external/events',
						icon: { icon: CalendarDays },
						permission: 'admin.community.external.events'
					},
					{
						id: 'community-admin-external-map',
						name: 'External Community Map',
						link: '/admin/community/external/map',
						icon: { icon: Map },
						permission: 'admin.community.external'
					}
				]
			}
		]
	}
];

export const adminSidebarMenuItems = (permissions: string[] | null): MenuItem[] =>
	baseAdminSidebarMenuItems.filter(
		(item) => !item.permission || permissions?.includes(item.permission)
	);

export const profileSidebarPathLables: Record<string, PathConfig> = {
	'personal-profile': { label: 'Personal Profile', icon: UserCog },
	aboutme: { label: 'About Me', icon: UserCheck },
	'my-property': { label: 'My Place', icon: MapPinHouse },
	assets: { label: 'Assets', icon: HousePlus },
	resources: { label: 'Firefighting Resources', icon: FireExtinguisher },
	hazards: { label: 'Firefighting Hazards', icon: Flame },
	'my-map': { label: 'My Map', icon: MapPinned },
	'my-community': { label: 'My Community', icon: Users },
	bcyca: { label: 'BCYCA', icon: TextIcon, letter: 'B' },
	tinonee: { label: 'Tinonee', icon: TextIcon, letter: 'T' },
	mondrook: { label: 'Mondrook', icon: TextIcon, letter: 'M' },
	external: { label: 'External', icon: TextIcon, letter: 'E' },
	information: { label: 'Information', icon: Info },
	events: { label: 'Events', icon: CalendarDays },
	workshops: { label: 'Workshops', icon: School },
	map: { label: 'Community Map', icon: Map },
	settings: { label: 'Settings', icon: Settings },
	password: { label: 'Change Password', icon: KeyRound },
	email: { label: 'Change Email', icon: Mailbox }
};

const baseProfileSidebarMenuItems = (
	communityText: string,
	properties: PropertyProfile[]
): MenuItem[] => [
	{
		id: 'about-me',
		name: 'About Me',
		link: '/personal-profile/aboutme',
		icon: { icon: UserCheck },
		permission: 'profile.view'
	},
	{
		id: 'my-property',
		name: 'My Place',
		link: '/personal-profile/my-property',
		icon: { icon: MapPinHouse },
		permission: 'profile.view',
		initialOpen: true,
		subItems: properties.map((property, index) => ({
			id: `property-${property.id}`,
			name: property.property_address_street,
			icon: { icon: MapPinHouse, letter: `${index + 1}` },
			permission: 'profile.view',
			link: `/personal-profile/my-property/${property.id}`,
			subItems: [
				{
					id: 'assets',
					name: 'Assets',
					link: `/personal-profile/my-property/${property.id}/assets`,
					icon: { icon: HousePlus },
					permission: 'profile.view'
				},
				{
					id: 'hazards',
					name: 'Hazards',
					link: `/personal-profile/my-property/${property.id}/hazards`,
					icon: { icon: Flame },
					permission: 'profile.view'
				},
				{
					id: 'my-map',
					name: 'My Map',
					link: `/personal-profile/my-property/${property.id}/my-map`,
					icon: { icon: MapPinned },
					permission: 'profile.view'
				},
				{
					id: 'resources',
					name: 'Resources',
					link: `/personal-profile/my-property/${property.id}/resources`,
					icon: { icon: FireExtinguisher },
					permission: 'profile.view'
				}
			]
		}))
	},
	{
		id: 'my-community',
		name: `My ${communityText}`,
		link: '/personal-profile/my-community',
		icon: { icon: Users },
		permission: 'profile.view',
		initialOpen: false,
		subItems: [
			{
				id: 'bcyca',
				name: 'BCYCA',
				link: '/personal-profile/my-community/bcyca',
				icon: { icon: TextIcon, letter: 'B' },
				permission: 'profile.view',
				initialOpen: false,
				subItems: [
					{
						id: 'bcyca-information',
						name: 'BCYCA Information',
						link: '/personal-profile/my-community/bcyca/information',
						icon: { icon: Info },
						permission: 'profile.view'
					},
					{
						id: 'bcyca-workshops',
						name: 'BCYCA Workshops',
						link: '/personal-profile/my-community/bcyca/workshops',
						icon: { icon: School },
						permission: 'profile.view'
					},
					{
						id: 'bcyca-events',
						name: 'BCYCA Events',
						link: '/personal-profile/my-community/bcyca/events',
						icon: { icon: CalendarDays },
						permission: 'profile.view'
					},
					{
						id: 'bcyca-map',
						name: 'BCYCA Community Map',
						link: '/personal-profile/my-community/bcyca/map',
						icon: { icon: Map },
						permission: 'profile.view'
					}
				]
			},
			{
				id: 'tinonee',
				name: 'Tinonee',
				link: '/personal-profile/my-community/tinonee',
				icon: { icon: TextIcon, letter: 'T' },
				permission: 'profile.view',
				initialOpen: false,
				subItems: [
					{
						id: 'tinonee-information',
						name: 'Tinonee Information',
						link: '/personal-profile/my-community/tinonee/information',
						icon: { icon: Info },
						permission: 'profile.view'
					},
					{
						id: 'tinonee-workshops',
						name: 'Tinonee Workshops',
						link: '/personal-profile/my-community/tinonee/workshops',
						icon: { icon: School },
						permission: 'profile.view'
					},
					{
						id: 'tinonee-events',
						name: 'Tinonee Events',
						link: '/personal-profile/my-community/tinonee/events',
						icon: { icon: CalendarDays },
						permission: 'profile.view'
					},
					{
						id: 'tinonee-map',
						name: 'Tinonee Community Map',
						link: '/personal-profile/my-community/tinonee/map',
						icon: { icon: Map },
						permission: 'profile.view'
					}
				]
			},
			{
				id: 'mondrook',
				name: 'Mondrook',
				link: '/personal-profile/my-community/mondrook',
				icon: { icon: TextIcon, letter: 'M' },
				permission: 'profile.view',
				initialOpen: false,
				subItems: [
					{
						id: 'mondrook-information',
						name: 'Mondrook Information',
						link: '/personal-profile/my-community/mondrook/information',
						icon: { icon: Info },
						permission: 'profile.view'
					},
					{
						id: 'mondrook-workshops',
						name: 'Mondrook Workshops',
						link: '/personal-profile/my-community/mondrook/workshops',
						icon: { icon: School },
						permission: 'profile.view'
					},
					{
						id: 'mondrook-events',
						name: 'Mondrook Events',
						link: '/personal-profile/my-community/mondrook/events',
						icon: { icon: CalendarDays },
						permission: 'profile.view'
					},
					{
						id: 'mondrook-map',
						name: 'Mondrook Community Map',
						link: '/personal-profile/my-community/mondrook/map',
						icon: { icon: Map },
						permission: 'profile.view'
					}
				]
			},
			{
				id: 'external',
				name: 'External',
				link: '/personal-profile/my-community/external',
				icon: { icon: TextIcon, letter: 'E' },
				permission: 'profile.view',
				initialOpen: false,
				subItems: [
					{
						id: 'external-information',
						name: 'External Information',
						link: '/personal-profile/my-community/external/information',
						icon: { icon: Info },
						permission: 'profile.view'
					},
					{
						id: 'external-workshops',
						name: 'External Workshops',
						link: '/personal-profile/my-community/external/workshops',
						icon: { icon: School },
						permission: 'profile.view'
					},
					{
						id: 'external-events',
						name: 'External Events',
						link: '/personal-profile/my-community/external/events',
						icon: { icon: CalendarDays },
						permission: 'profile.view'
					},
					{
						id: 'external-map',
						name: 'External Community Map',
						link: '/personal-profile/my-community/external/map',
						icon: { icon: Map },
						permission: 'profile.view'
					}
				]
			}
		]
	},
	{
		id: 'my-settings',
		name: `My Settings`,
		link: '/personal-profile/my-settings',
		icon: { icon: Settings },
		permission: 'profile.view',
		initialOpen: false,
		subItems: [
			{
				id: 'profile',
				name: 'Change Email',
				link: '/auth/redirect/changeemail',
				icon: { icon: User },
				permission: 'profile.view'
			},
			{
				id: 'password',
				name: 'Change Password',
				link: '/auth/redirect/resetpassword',
				icon: { icon: KeyRound },
				permission: 'profile.view'
			}
		]
	}
];

export const profileSidebarMenuItems = (
	communityText: string,
	properties: PropertyProfile[],
	_permissions: string[] | null,
	communityProfiles: Record<string, string | null>
): MenuItem[] => {
	const filterMenuItems = (items: MenuItem[]): MenuItem[] =>
		items.map((item) => ({
			...item,
			subItems: item.subItems
				? filterMenuItems(
						item.subItems.filter((subItem) => {
							if (subItem.id === 'bcyca' && !communityProfiles.community_bcyca_profile_id)
								return false;
							if (subItem.id === 'tinonee' && !communityProfiles.community_tinonee_profile_id)
								return false;
							if (subItem.id === 'mondrook' && !communityProfiles.community_mondrook_profile_id)
								return false;
							if (subItem.id === 'external' && !communityProfiles.community_external_profile_id)
								return false;
							return true;
						})
					)
				: undefined
		}));

	return filterMenuItems(baseProfileSidebarMenuItems(communityText, properties));
};
