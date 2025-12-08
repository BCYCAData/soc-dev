/**
 * Svelte 5 runes-based permission store for UI components.
 * Provides reactive permission checking with consistent logic.
 *
 * @module permissions-store
 */

import { page } from '$app/state';

/**
 * Reactive permission utilities for Svelte components.
 * Uses Svelte 5 runes for reactivity.
 *
 * @returns Object with permission checking functions
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { usePermissions } from '$lib/permissions.svelte';
 *   import { PERMISSIONS } from '$lib/constants/permissions';
 *
 *   const { hasPermission, isAdmin } = usePermissions();
 * </script>
 *
 * {#if hasPermission(PERMISSIONS.ADMIN_SITE_MESSAGES)}
 *   <a href="/admin/site/messages">Messages</a>
 * {/if}
 * ```
 */
export function usePermissions() {
	const permissions = $derived((page.data.permissions as string[]) || []);
	const userRole = $derived(page.data.userRole as string | null);

	function hasPermission(perm: string | string[]): boolean {
		// Access reactive values inside the function
		const perms = permissions;
		if (!perms || perms.length === 0) return false;

		const required = Array.isArray(perm) ? perm : [perm];
		return required.some((p) =>
			perms.some((userPerm) => userPerm === p || userPerm.startsWith(p + '.'))
		);
	}

	function hasAnyPermission(...perms: string[]): boolean {
		return hasPermission(perms);
	}

	function isAdmin(): boolean {
		// Access reactive values inside the function
		const role = userRole;
		const perms = permissions;
		return role === 'admin' || perms.includes('admin');
	}

	function hasFeature(feature: string): boolean {
		// Access reactive values inside the function
		const perms = permissions;
		return perms.some((p) => p.endsWith(`.${feature}`));
	}

	return {
		get permissions() {
			return permissions;
		},
		get userRole() {
			return userRole;
		},
		hasPermission,
		hasAnyPermission,
		isAdmin,
		hasFeature
	};
}
