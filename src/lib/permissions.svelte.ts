/**
 * Svelte 5 runes-based permission store for UI components.
 * Provides reactive permission checking with consistent logic.
 *
 * @module permissions-store
 */

import { page } from '$app/state';
import {
	hasPermission as hasPermissionCore,
	isAdmin as isAdminCore,
	hasAnyFeature
} from '$lib/constants/permissions';

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

	// Delegate to the canonical helpers in $lib/constants/permissions so the UI gating
	// matches the server guards exactly (reactive values are read at call time).
	function hasPermission(perm: string | string[]): boolean {
		return hasPermissionCore(permissions, perm);
	}

	function hasAnyPermission(...perms: string[]): boolean {
		return hasPermissionCore(permissions, perms);
	}

	function isAdmin(): boolean {
		return isAdminCore(userRole, permissions);
	}

	function hasFeature(feature: string): boolean {
		return hasAnyFeature(permissions, feature);
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
