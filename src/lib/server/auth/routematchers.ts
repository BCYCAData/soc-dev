/**
 * @fileoverview Route matching utilities for authentication and authorization.
 *
 * This module provides pattern-matching functions to identify route types and extract
 * route parameters for authorization decisions. Used by the `authGuard` to determine
 * which access rules to apply.
 *
 * **Route Categories:**
 * - **Public Routes**: Accessible without authentication
 * - **Protected Auth Routes**: Require session (password reset, email change)
 * - **Sign Out Route**: Session-based logout endpoint
 * - **Onboarding Route**: First-time user profile setup
 * - **Personal Profile Routes**: User's own profile and property data
 * - **KYNG Routes**: KYNG coordinator area-specific pages
 * - **Admin Routes**: Permission-based administrative pages
 *
 * @module lib/server/auth/routematchers
 * @see {@link module:lib/server/auth/authguard} for route guard implementation
 * @see {@link https://kit.svelte.dev/docs/routing} SvelteKit Routing
 *
 * @example
 * import { routeMatchers } from '$lib/server/auth/routematchers';
 *
 * // Check if route is public
 * if (routeMatchers.isPublicRoute('/about')) {
 *   // Skip auth checks
 * }
 *
 * // Extract required permission for admin route
 * const permission = routeMatchers.getRequiredPermission('/admin/site/messages');
 * // Returns: 'admin.site.messages'
 */

/**
 * Collection of route matching utilities for authentication and authorization.
 *
 * Each matcher function operates on URL pathnames to determine route type
 * or extract route parameters for access control decisions.
 */
export const routeMatchers = {
	/**
	 * Checks if a route is publicly accessible (no authentication required).
	 *
	 * Public routes include:
	 * - Landing and informational pages (/, /about, /contact)
	 * - Auth pages (signup, signin, password reset)
	 * - Policy pages (/policies/privacy, /policies/termsofservice)
	 * - API endpoints (/api/cron)
	 * - Auth callback/redirect routes
	 *
	 * @param {string} path - URL pathname to check
	 * @returns {boolean} `true` if route is public, `false` if authentication required
	 *
	 * @example
	 * routeMatchers.isPublicRoute('/');                    // true
	 * routeMatchers.isPublicRoute('/about');               // true
	 * routeMatchers.isPublicRoute('/auth/signin');         // true
	 * routeMatchers.isPublicRoute('/personal-profile');    // false
	 * routeMatchers.isPublicRoute('/admin');               // false
	 */
	isPublicRoute: (path: string): boolean => {
		const publicRoutes = [
			'/',
			'/about',
			'/contact',
			'/policies/privacy',
			'/policies/termsofservice',
			'/api/cron',
			'/api/cron/',
			'/auth/signup',
			'/auth/signin',
			'/auth/redirect/email-not-allowed',
			'/auth/redirect/signup/respond',
			'/auth/redirect/signup/respond/',
			'/auth/redirect/confirm',
			'/auth/requestresetpassword',
			'/auth/requestresetpassword/',
			'/auth/redirect/signup/personal-profile-form',
			'/auth/redirect/signup/personal-profile-form/'
		];
		return publicRoutes.includes(path);
	},

	/**
	 * Checks if a route is a protected authentication action route.
	 *
	 * These routes require an active session but are used for account
	 * management actions like password resets and email changes.
	 *
	 * @param {string} path - URL pathname to check
	 * @returns {boolean} `true` if route is a protected auth action
	 *
	 * @example
	 * routeMatchers.isProtectedAuthRoute('/auth/redirect/resetpassword');  // true
	 * routeMatchers.isProtectedAuthRoute('/auth/redirect/changeemail');    // true
	 * routeMatchers.isProtectedAuthRoute('/auth/signin');                   // false
	 */
	isProtectedAuthRoute: (path: string): boolean => {
		const protectedAuthRoutes = ['/auth/redirect/resetpassword', '/auth/redirect/changeemail'];
		return protectedAuthRoutes.includes(path);
	},

	/**
	 * Checks if route is the sign-out endpoint.
	 *
	 * The sign-out route requires an active session to sign out from.
	 *
	 * @param {string} path - URL pathname to check
	 * @returns {boolean} `true` if route is the sign-out endpoint
	 *
	 * @example
	 * routeMatchers.isSignOutRoute('/auth/signout');  // true
	 * routeMatchers.isSignOutRoute('/auth/signin');   // false
	 */
	isSignOutRoute: (path: string): boolean => {
		return path === '/auth/signout';
	},

	/**
	 * Checks if route is the user onboarding profile form.
	 *
	 * This route is only accessible after successful signup via callback redirect,
	 * and is used for first-time user profile completion.
	 *
	 * @param {string} path - URL pathname to check
	 * @returns {boolean} `true` if route is the onboarding form
	 *
	 * @example
	 * routeMatchers.isOnboardingRoute('/personal-profile-form');  // true
	 * routeMatchers.isOnboardingRoute('/personal-profile');       // false
	 */
	isOnboardingRoute: (path: string): boolean => {
		return path === '/personal-profile-form';
	},

	/**
	 * Checks if route is within the personal profile section.
	 *
	 * Personal profile routes include the main profile page and all sub-routes
	 * like property management pages. Requires active user session.
	 *
	 * @param {string} path - URL pathname to check
	 * @returns {boolean} `true` if route is under /personal-profile
	 *
	 * @example
	 * routeMatchers.isPersonalProfileRoute('/personal-profile');                        // true
	 * routeMatchers.isPersonalProfileRoute('/personal-profile/my-property/abc-123');    // true
	 * routeMatchers.isPersonalProfileRoute('/admin');                                   // false
	 */
	isPersonalProfileRoute: (path: string): boolean => {
		return path.startsWith('/personal-profile');
	},

	/**
	 * Checks if route is a specific property detail page.
	 *
	 * Property routes require the property UUID in the URL path. Access is validated
	 * by checking if the property ID exists in the user's JWT `property_ids` claim.
	 *
	 * @param {string} path - URL pathname to check
	 * @returns {boolean} `true` if route is a property-specific page
	 *
	 * @example
	 * routeMatchers.isPropertyRoute('/personal-profile/my-property/abc-123');  // true
	 * routeMatchers.isPropertyRoute('/personal-profile');                      // false
	 *
	 * @see {@link getPropertyId} to extract the property UUID from the path
	 */
	isPropertyRoute: (path: string): boolean => {
		return path.startsWith('/personal-profile/my-property/');
	},

	/**
	 * Extracts the property UUID from a property route path.
	 *
	 * Parses the URL to extract the property identifier, which is then validated
	 * against the user's JWT `property_ids` claim to ensure authorized access.
	 *
	 * @param {string} path - URL pathname containing a property ID
	 * @returns {string | null} Property UUID if found, `null` if not a property route
	 *
	 * @example
	 * routeMatchers.getPropertyId('/personal-profile/my-property/abc-123');
	 * // Returns: 'abc-123'
	 *
	 * routeMatchers.getPropertyId('/personal-profile');
	 * // Returns: null
	 *
	 * @example
	 * // Usage in authGuard
	 * if (routeMatchers.isPropertyRoute(path)) {
	 *   const routePropertyId = routeMatchers.getPropertyId(path);
	 *   const userPropertyIds = claims.property_ids || [];
	 *   if (routePropertyId && !userPropertyIds.includes(routePropertyId)) {
	 *     throw error(403, 'Not authorized to view this property');
	 *   }
	 * }
	 */
	getPropertyId: (path: string): string | null => {
		const match = path.match(/\/personal-profile\/my-property\/([^/]+)/);
		return match ? match[1] : null;
	},

	/**
	 * Checks if route is within the KYNG coordinator section.
	 *
	 * KYNG (Know Your Neighbour Group) coordinator routes require the user to have
	 * coordinator status, verified via the JWT `coordinates_kyng` claim array.
	 *
	 * @param {string} path - URL pathname to check
	 * @returns {boolean} `true` if route is under /kyng-coordinator
	 *
	 * @example
	 * routeMatchers.isKYNGRoute('/kyng-coordinator');              // true
	 * routeMatchers.isKYNGRoute('/kyng-coordinator/mondrook');     // true
	 * routeMatchers.isKYNGRoute('/admin');                         // false
	 *
	 * @see {@link getKYNGArea} to extract the specific KYNG area from the path
	 */
	isKYNGRoute: (path: string): boolean => {
		return path.startsWith('/kyng-coordinator');
	},

	/**
	 * Extracts the KYNG area identifier from a KYNG coordinator route path.
	 *
	 * Parses the URL to extract the specific KYNG area (e.g., 'mondrook', 'tinonee'),
	 * which is validated against the user's JWT `coordinates_kyng` array.
	 *
	 * @param {string} path - URL pathname containing a KYNG area identifier
	 * @returns {string | null} KYNG area ID if found, `null` if base coordinator route
	 *
	 * @example
	 * routeMatchers.getKYNGArea('/kyng-coordinator/mondrook');
	 * // Returns: 'mondrook'
	 *
	 * routeMatchers.getKYNGArea('/kyng-coordinator');
	 * // Returns: null
	 *
	 * @example
	 * // Usage in authGuard
	 * if (routeMatchers.isKYNGRoute(path)) {
	 *   const kyngArea = routeMatchers.getKYNGArea(path);
	 *   const coordinatesKyng = claims.coordinates_kyng || [];
	 *
	 *   if (kyngArea && !coordinatesKyng.some(area => area.kyngAreaId === kyngArea)) {
	 *     throw error(403, 'Not authorized for this KYNG area');
	 *   }
	 * }
	 */
	getKYNGArea: (path: string): string | null => {
		const match = path.match(/^\/kyng-coordinator\/([^/]+)/);
		return match ? match[1] : null;
	},

	/**
	 * Determines the required hierarchical permission for a given route path.
	 *
	 * Constructs permission strings using dot-notation hierarchy from URL segments.
	 * The permission system supports parent-child relationships where parent permissions
	 * automatically grant access to child routes (e.g., 'admin.site' grants 'admin.site.messages').
	 *
	 * **Permission Hierarchy Examples:**
	 * - `/admin` → `'admin'`
	 * - `/admin/site` → `'admin.site'`
	 * - `/admin/site/messages` → `'admin.site.messages'`
	 * - `/admin/users/kyng-coordinators` → `'admin.users.kyng-coordinators'`
	 * - `/kyng-coordinator` → `'kyng'`
	 *
	 * @param {string} path - URL pathname to extract permission from
	 * @returns {string | null} Hierarchical permission string, or `null` if no permission required
	 *
	 * @example
	 * routeMatchers.getRequiredPermission('/admin');
	 * // Returns: 'admin'
	 *
	 * routeMatchers.getRequiredPermission('/admin/site/messages');
	 * // Returns: 'admin.site.messages'
	 *
	 * routeMatchers.getRequiredPermission('/kyng-coordinator');
	 * // Returns: 'kyng'
	 *
	 * routeMatchers.getRequiredPermission('/personal-profile');
	 * // Returns: null (session-based, not permission-based)
	 *
	 * @example
	 * // Usage in authGuard with hierarchical permission checking
	 * const requiredPermission = routeMatchers.getRequiredPermission(path);
	 * if (requiredPermission) {
	 *   const userPermissions = claims.permissions || [];
	 *   if (!hasPermission(userPermissions, requiredPermission)) {
	 *     throw error(403, 'Insufficient permissions');
	 *   }
	 * }
	 *
	 * @see {@link module:lib/server/permissions.hasPermission} for hierarchical permission validation
	 * @see {@link module:lib/constants/permissions} for predefined permission constants
	 */
	getRequiredPermission: (path: string): string | null => {
		if (path.startsWith('/kyng-coordinator')) {
			return 'kyng';
		}
		if (path.startsWith('/admin')) {
			const segments = path.split('/').filter(Boolean);

			if (segments.length === 1) return 'admin';

			return segments
				.slice(1)
				.reduce((acc, segment) => (acc ? `${acc}.${segment}` : segment), 'admin');
		}
		return null;
	}
};
