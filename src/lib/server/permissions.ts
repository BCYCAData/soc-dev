/**
 * Shared permission checking utilities for both server and client.
 * Implements hierarchical dot-notation permission matching.
 *
 * @module permissions
 */

/**
 * Hierarchical permission checker
 * Supports dot-notation hierarchy (e.g., 'admin.site' grants 'admin.site.messages')
 *
 * @param userPermissions - Array of user's permissions from JWT claims
 * @param required - Single permission string or array of alternatives
 * @returns true if user has at least one required permission
 *
 * @example
 * // User with 'admin.site' can access 'admin.site.messages'
 * hasPermission(['admin.site'], 'admin.site.messages') // true
 *
 * @example
 * // User with 'admin' can access anything starting with 'admin'
 * hasPermission(['admin'], 'admin.site.messages') // true
 *
 * @example
 * // Check for multiple alternatives
 * hasPermission(['admin.users'], ['admin.site', 'admin.users']) // true
 */
export function hasPermission(userPermissions: string[], required: string | string[]): boolean {
	if (!userPermissions || userPermissions.length === 0) return false;

	const requiredPerms = Array.isArray(required) ? required : [required];

	return requiredPerms.some((req) =>
		userPermissions.some(
			(userPerm) =>
				// Exact match
				userPerm === req ||
				// User has parent permission (admin.site grants admin.site.messages)
				req.startsWith(userPerm + '.') ||
				// User has child permission (admin.site.messages grants admin.site)
				userPerm.startsWith(req + '.')
		)
	);
}

/**
 * Check if user has admin role OR admin permission
 *
 * @param userRole - User's role from JWT claims
 * @param permissions - User's permissions from JWT claims
 * @returns true if user is admin
 */
export function isAdmin(userRole: string | null, permissions: string[]): boolean {
	return userRole === 'admin' || permissions.includes('admin');
}

/**
 * Check if user has ANY permission ending with a feature
 *
 * @param permissions - User's permissions from JWT claims
 * @param feature - Feature name to check (e.g., 'events', 'workshops')
 * @returns true if any permission ends with the feature
 *
 * @example
 * // Check if user can manage events in any community
 * hasAnyFeature(['admin.community.bcyca.events'], 'events') // true
 */
export function hasAnyFeature(permissions: string[], feature: string): boolean {
	return permissions.some((p) => p.endsWith(`.${feature}`));
}

/**
 * Check if user has ANY of the provided permissions
 *
 * @param userPermissions - User's permissions from JWT claims
 * @param required - Array of permission alternatives
 * @returns true if user has at least one permission
 */
export function hasAnyPermission(userPermissions: string[], ...required: string[]): boolean {
	return hasPermission(userPermissions, required);
}
