/**
 * Permission constants for type-safe permission checking.
 * These should match the permissions defined in the database.
 *
 * @module permissions-constants
 */

export const PERMISSIONS = {
	// Root admin - grants access to everything
	ADMIN: 'admin',

	// Site administration
	ADMIN_SITE: 'admin.site',
	ADMIN_SITE_MESSAGES: 'admin.site.messages',
	ADMIN_SITE_ROLES: 'admin.site.roles',
	ADMIN_SITE_ROLES_PERMISSIONS: 'admin.site.roles.permissions',
	ADMIN_SITE_ROLES_ASSIGNMENTS: 'admin.site.roles.assignments',
	ADMIN_SITE_DATA: 'admin.site.data',
	ADMIN_SITE_DATA_SPATIAL: 'admin.site.data.spatial',
	ADMIN_SITE_DATA_ADDRESSES: 'admin.site.data.addresses',
	ADMIN_SITE_DATA_KYNG_BOUNDARIES: 'admin.site.data.kyng-boundaries',

	// User administration
	ADMIN_USERS: 'admin.users',
	ADMIN_USERS_KITS: 'admin.users.kits',
	ADMIN_USERS_NEWUSERS: 'admin.users.newusers',
	ADMIN_USERS_KYNG_COORDINATORS: 'admin.users.kyng-coordinators',

	// Emergency
	ADMIN_EMERGENCY: 'admin.emergency',
	ADMIN_EMERGENCY_REPORTS: 'admin.emergency.reports',
	ADMIN_EMERGENCY_SERVICE_MAP: 'admin.emergency.service-map',

	// Community - BCYCA
	ADMIN_COMMUNITY: 'admin.community',
	ADMIN_COMMUNITY_BCYCA: 'admin.community.bcyca',
	ADMIN_COMMUNITY_BCYCA_EVENTS: 'admin.community.bcyca.events',
	ADMIN_COMMUNITY_BCYCA_INFORMATION: 'admin.community.bcyca.information',
	ADMIN_COMMUNITY_BCYCA_WORKSHOPS: 'admin.community.bcyca.workshops',
	ADMIN_COMMUNITY_BCYCA_MAP: 'admin.community.bcyca.map',

	// Community - Mondrook
	ADMIN_COMMUNITY_MONDROOK: 'admin.community.mondrook',
	ADMIN_COMMUNITY_MONDROOK_EVENTS: 'admin.community.mondrook.events',
	ADMIN_COMMUNITY_MONDROOK_INFORMATION: 'admin.community.mondrook.information',
	ADMIN_COMMUNITY_MONDROOK_WORKSHOPS: 'admin.community.mondrook.workshops',
	ADMIN_COMMUNITY_MONDROOK_MAP: 'admin.community.mondrook.map',

	// Community - Tinonee
	ADMIN_COMMUNITY_TINONEE: 'admin.community.tinonee',
	ADMIN_COMMUNITY_TINONEE_EVENTS: 'admin.community.tinonee.events',
	ADMIN_COMMUNITY_TINONEE_INFORMATION: 'admin.community.tinonee.information',
	ADMIN_COMMUNITY_TINONEE_WORKSHOPS: 'admin.community.tinonee.workshops',
	ADMIN_COMMUNITY_TINONEE_MAP: 'admin.community.tinonee.map',

	// Community - External
	ADMIN_COMMUNITY_EXTERNAL: 'admin.community.external',
	ADMIN_COMMUNITY_EXTERNAL_EVENTS: 'admin.community.external.events',
	ADMIN_COMMUNITY_EXTERNAL_INFORMATION: 'admin.community.external.information',
	ADMIN_COMMUNITY_EXTERNAL_WORKSHOPS: 'admin.community.external.workshops',
	ADMIN_COMMUNITY_EXTERNAL_MAP: 'admin.community.external.map',

	// KYNG Coordinators
	KYNG: 'kyng'
} as const;

/**
 * Type representing any valid permission string
 */
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Feature names that can appear at the end of community permissions
 */
export const COMMUNITY_FEATURES = {
	EVENTS: 'events',
	WORKSHOPS: 'workshops',
	INFORMATION: 'information',
	MAP: 'map'
} as const;

export type CommunityFeature = (typeof COMMUNITY_FEATURES)[keyof typeof COMMUNITY_FEATURES];
