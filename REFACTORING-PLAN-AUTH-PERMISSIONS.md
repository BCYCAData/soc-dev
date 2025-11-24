# Refactoring Plan: Role and Permission Consistency

**Date:** 2025-11-24
**Status:** Planning Phase
**Priority:** CRITICAL (Security Risk)

## Executive Summary

Your codebase has a **well-designed JWT claims-based authorization system** with comprehensive database RLS policies, but suffers from **critical gaps in server-side enforcement** and **inconsistent UI permission checking patterns**. The primary security issue is that the `guardRoute` function in [authguard.ts](src/lib/server/auth/authguard.ts) exists but is **never called**, leaving the application without server-side route protection.

## Current State Analysis

### ✅ Strengths
- Excellent database RLS policies
- JWT custom claims system reduces database queries
- Well-structured permission hierarchy (dot-notation)
- Route-to-permission mapping exists

### ❌ Critical Issues
1. `guardRoute` function unused - no server-side route protection
2. Server actions lack permission validation (e.g., `src/routes/admin/site/messages/+page.server.ts`, `src/routes/admin/site/roles/assignments/+page.server.ts`)
3. Four different UI permission checking patterns causing inconsistency
4. Type inconsistency: `permissions` is `string[]` in Locals but `string | null` in PageData (`src/app.d.ts`)

## Detailed Findings

### Security Architecture

**Current Layers (in order of strength):**
1. ✅ Database RLS (Strong - primary security)
2. ❌ Server Guards (Missing - guardRoute unused)
3. ❌ Server Actions (No permission checks)
4. ⚠️ UX Guards (Cosmetic redirects only)
5. ⚠️ UI Filtering (Client-side only)

**Recommended Layers:**
1. Database RLS
2. **Server Guards** (Add these!)
3. **Action Permission Checks** (Add these!)
4. UX Guards
5. UI Filtering

### Four Inconsistent UI Permission Patterns Found

**Pattern A:** Direct role check ([src/routes/admin/+page.svelte](src/routes/admin/+page.svelte))
```typescript
let isAdmin = $derived(userRole === 'admin');
```

**Pattern B:** Hierarchical permission check ([src/routes/admin/+page.svelte](src/routes/admin/+page.svelte))
```typescript
function hasPermission(permission: string): boolean {
  if (!isAdmin) return false;
  return permissions.some((p) => p === permission || p.startsWith(permission + '.'));
}
```

**Pattern C:** Substring matching ([src/routes/admin/users/+page.svelte](src/routes/admin/users/+page.svelte))
```typescript
function hasPermission(path: string): boolean {
  const permissionKey = path.split('/').pop()?.replace('/', '');
  return permissions.some((p) => p.includes(permissionKey || ''));
}
```

**Pattern D:** Type inconsistency forcing string parsing
```typescript
let permissions = $derived(
  typeof page.data.permissions === 'string' ? page.data.permissions.split(',') : []
);
```

---

## Phase 1: Foundation - Type Safety and Utilities (CRITICAL)

### 1.1 Fix Type Inconsistencies

**File:** `src/app.d.ts` (line 33)

**Change:**
```typescript
// Current - WRONG
permissions: string | null;

// Target - CORRECT
permissions: string[];
```

**Impact:** Eliminates string parsing in 8+ Svelte components

**Affected Files:**
- `src/routes/admin/+page.svelte`
- `src/routes/admin/users/+page.svelte`
- `src/routes/admin/community/bcyca/+page.svelte`
- `src/routes/admin/community/mondrook/+page.svelte`
- `src/routes/admin/community/tinonee/+page.svelte`
- `src/routes/admin/community/external/+page.svelte`
- `src/routes/admin/community/+page.svelte`
- `src/routes/admin/site/+page.svelte`

---

### 1.2 Create Shared Permission Utility

**New File:** `src/lib/server/auth/permissions.ts`

```typescript
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
export function hasPermission(
  userPermissions: string[],
  required: string | string[]
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;

  const requiredPerms = Array.isArray(required) ? required : [required];

  return requiredPerms.some(req =>
    userPermissions.some(userPerm =>
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
  return permissions.some(p => p.endsWith(`.${feature}`));
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
```

**Why:**
- Single source of truth for permission logic
- Eliminates 4 inconsistent patterns
- Works on both server and client
- Fully documented and testable

---

### 1.3 Create Permission Constants

**New File:** `src/lib/constants/permissions.ts`

```typescript
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
  KYNG: 'kyng',
} as const;

/**
 * Type representing any valid permission string
 */
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Feature names that can appear at the end of community permissions
 */
export const COMMUNITY_FEATURES = {
  EVENTS: 'events',
  WORKSHOPS: 'workshops',
  INFORMATION: 'information',
  MAP: 'map',
} as const;

export type CommunityFeature = typeof COMMUNITY_FEATURES[keyof typeof COMMUNITY_FEATURES];
```

**Why:**
- Type safety prevents typos
- IDE autocomplete
- Single source of truth for permission strings
- Easy to audit all permissions

---

## Phase 2: Server-Side Security (CRITICAL - Security Risk)

### 2.1 Enable guardRoute in hooks.server.ts

**File:** `src/hooks.server.ts`

**Current Issue:** Lines 92-140 contain only a "UX guard" with this comment:
```typescript
// Minimal UX guard - NOT for security (RLS handles that)
// Only redirects for better user experience
```

**Target:** Replace `uxGuard` with actual `securityGuard`

**Changes:**

```typescript
import { guardRoute } from '$lib/server/auth/authguard';

// REMOVE the uxGuard (lines 92-140)
// REPLACE with actual security guard:

const securityGuard: Handle = async ({ event, resolve }) => {
  // Call the actual guard function
  await guardRoute({
    path: event.url.pathname,
    session: event.locals.session,
    user: event.locals.user,
    userRole: event.locals.userRole,
    coordinatesKYNG: event.locals.coordinatesKYNG,
    permissions: event.locals.permissions.join(','), // Convert array to string for compatibility
    propertyIds: event.locals.propertyIds || []
  });

  return resolve(event);
};

// Update sequence (line 142)
export const handle = sequence(supabaseHandle, securityGuard);
```

**Why:**
- Activates server-side route protection that currently doesn't exist
- Prevents unauthorized access before page loads
- Critical security layer that's currently missing

**Testing:**
- [ ] Try accessing `/admin` without login → should redirect to `/auth/signin`
- [ ] Try accessing `/admin/site/messages` without `admin.site.messages` permission → should show 403
- [ ] Try accessing property route with wrong ID → should show 403

---

### 2.2 Update guardRoute to Use New Utilities

**File:** `src/lib/server/auth/authguard.ts`

**Change lines 1-4 (add imports):**
```typescript
import type { KYNGArea } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import { routeMatchers } from '$lib/server/auth/routematchers';
import type { Session, User } from '@supabase/supabase-js';
// ADD THESE:
import { hasPermission } from './permissions';
```

**Change lines 63-69 (use hierarchical checking):**
```typescript
// BEFORE:
const requiredPermission = routeMatchers.getRequiredPermission(path);
if (requiredPermission) {
  if (!permissions?.includes(requiredPermission)) {
    throw error(403, 'Insufficient permissions');
  }
  return;
}

// AFTER:
const requiredPermission = routeMatchers.getRequiredPermission(path);
if (requiredPermission) {
  const permissionArray = permissions ? permissions.split(',') : [];
  if (!hasPermission(permissionArray, requiredPermission)) {
    throw error(403, 'Insufficient permissions');
  }
  return;
}
```

**Why:**
- Enables hierarchical permission checking
- `admin.site` permission now grants access to `admin.site.messages`
- Consistent with UI permission logic

---

### 2.3 Add Permission Guards to Server Actions

**Critical Files Needing Guards (7 files):**

1. `src/routes/admin/site/messages/+page.server.ts` - 6 actions
2. `src/routes/admin/site/roles/assignments/+page.server.ts` - 3 actions
3. `src/routes/admin/site/roles/permissions/+page.server.ts` - permission CRUD
4. `src/routes/admin/users/kyng-coordinators/+page.server.ts` - coordinator management
5. `src/routes/admin/site/data/addresses/+page.server.ts` - address management
6. `src/routes/admin/site/data/spatial/+page.server.ts` - spatial data
7. `src/routes/admin/site/data/+page.server.ts` - data management

**Pattern to Apply:**

```typescript
import { error } from '@sveltejs/kit';
import { PERMISSIONS } from '$lib/constants/permissions';
import { hasPermission } from '$lib/server/auth/permissions';
import type { Actions } from './$types';

export const actions: Actions = {
  sendMessageToAllUsers: async ({ request, locals: { supabase, permissions } }) => {
    // ADD THIS GUARD AT THE TOP
    if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_MESSAGES)) {
      throw error(403, 'Insufficient permissions to send messages');
    }

    // ... existing code
    try {
      const formData = await request.formData();
      // ... rest of action
    } catch (err) {
      console.error('Send to all users error:', err);
      throw error(500, 'Failed to send message to all users');
    }
  },

  assignRole: async ({ request, locals: { supabase, permissions } }) => {
    // ADD THIS GUARD
    if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_ROLES)) {
      throw error(403, 'Insufficient permissions to assign roles');
    }

    // ... existing code
  },

  // Add guards to ALL actions
};
```

**Specific Action Guards Needed:**

#### File: `src/routes/admin/site/messages/+page.server.ts`
- `sendMessageToAllUsers` → `PERMISSIONS.ADMIN_SITE_MESSAGES`
- `sendMessageToEmailList` → `PERMISSIONS.ADMIN_SITE_MESSAGES`
- `sendMessageToAddressList` → `PERMISSIONS.ADMIN_SITE_MESSAGES`
- `sendMessageToStreetList` → `PERMISSIONS.ADMIN_SITE_MESSAGES`
- `sendMessageToCommunityList` → `PERMISSIONS.ADMIN_SITE_MESSAGES`
- `sendMessageToSuburbList` → `PERMISSIONS.ADMIN_SITE_MESSAGES`

#### File: `src/routes/admin/site/roles/assignments/+page.server.ts`
- `assignRole` → `PERMISSIONS.ADMIN_SITE_ROLES_ASSIGNMENTS`
- `removeRole` → `PERMISSIONS.ADMIN_SITE_ROLES_ASSIGNMENTS`
- `updatePermissions` → `PERMISSIONS.ADMIN_SITE_ROLES_PERMISSIONS`

#### File: `src/routes/admin/site/roles/permissions/+page.server.ts`
- All CRUD actions → `PERMISSIONS.ADMIN_SITE_ROLES_PERMISSIONS`

#### File: `src/routes/admin/users/kyng-coordinators/+page.server.ts`
- All coordinator actions → `PERMISSIONS.ADMIN_USERS_KYNG_COORDINATORS`

#### File: `src/routes/admin/site/data/addresses/+page.server.ts`
- All address actions → `PERMISSIONS.ADMIN_SITE_DATA_ADDRESSES`

#### File: `src/routes/admin/site/data/spatial/+page.server.ts`
- All spatial actions → `PERMISSIONS.ADMIN_SITE_DATA_SPATIAL`

**Why:**
- Prevents unauthorized form submissions
- Currently ANYONE with a valid session can execute these actions
- Critical security vulnerability

---

### 2.4 Add Layout-Level Guards

**Purpose:** Early exit before loading any child pages

**File 1:** `src/routes/admin/+layout.server.ts`

```typescript
import { error } from '@sveltejs/kit';
import { hasPermission } from '$lib/server/auth/permissions';
import { PERMISSIONS } from '$lib/constants/permissions';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { permissions, supabase } }) => {
  // Guard the entire /admin section
  if (!hasPermission(permissions, PERMISSIONS.ADMIN)) {
    throw error(403, 'Admin access required');
  }

  // ... existing load code (fetching messages, etc.)
  const { data: messages } = await supabase.rpc('get_app_messages');

  return {
    messages: messages ?? []
  };
};
```

**File 2:** `src/routes/kyng-coordinator/+layout.server.ts`

```typescript
import { error } from '@sveltejs/kit';
import { hasPermission } from '$lib/server/auth/permissions';
import { PERMISSIONS } from '$lib/constants/permissions';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { permissions, coordinatesKYNG, supabase } }) => {
  // Guard the entire /kyng-coordinator section
  if (!hasPermission(permissions, PERMISSIONS.KYNG) || !coordinatesKYNG?.length) {
    throw error(403, 'KYNG coordinator access required');
  }

  // ... existing load code
};
```

**Why:**
- Prevents loading data for unauthorized users
- Faster failure (fails at layout, not at each page)
- Cleaner code (pages don't need individual guards)

---

## Phase 3: UI Consistency (Medium Priority)

### 3.1 Create Shared UI Permission Store

**New File:** `src/lib/stores/permissions.svelte.ts`

```typescript
/**
 * Svelte 5 runes-based permission store for UI components.
 * Provides reactive permission checking with consistent logic.
 *
 * @module permissions-store
 */

import { page } from '$app/state';
import { hasPermission, hasAnyFeature, isAdmin } from '$lib/server/auth/permissions';

/**
 * Reactive permission utilities for Svelte components.
 * Uses Svelte 5 runes for reactivity.
 *
 * @returns Object with permission checking functions
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { usePermissions } from '$lib/stores/permissions.svelte';
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
  const permissions = $derived(page.data.permissions || []);
  const userRole = $derived(page.data.userRole);

  return {
    /**
     * Raw permissions array from page data
     */
    permissions,

    /**
     * User's role from page data
     */
    userRole,

    /**
     * Check if user has a specific permission or any of multiple permissions
     * @param perm - Single permission string or array of alternatives
     */
    hasPermission: (perm: string | string[]) => hasPermission(permissions, perm),

    /**
     * Check if user is admin (by role or permission)
     */
    isAdmin: () => isAdmin(userRole, permissions),

    /**
     * Check if user has any permission ending with a feature
     * @param feature - Feature name (e.g., 'events', 'workshops')
     */
    hasFeature: (feature: string) => hasAnyFeature(permissions, feature)
  };
}
```

**Why:**
- Svelte 5 runes-based (modern approach)
- Single import provides all permission checking
- Reactive to page data changes
- Consistent with server-side logic

---

### 3.2 Refactor UI Components to Use Shared Logic

**Files to Refactor (8+ files):**

1. `src/routes/admin/+page.svelte`
2. `src/routes/admin/users/+page.svelte`
3. `src/routes/admin/community/bcyca/+page.svelte`
4. `src/routes/admin/community/mondrook/+page.svelte`
5. `src/routes/admin/community/tinonee/+page.svelte`
6. `src/routes/admin/community/external/+page.svelte`
7. `src/routes/admin/community/+page.svelte`
8. `src/routes/admin/site/+page.svelte`

**Example Refactor:**

**BEFORE** (`src/routes/admin/users/+page.svelte`):
```svelte
<script lang="ts">
  import { page } from '$app/state';

  let permissions = $derived(
    typeof page.data.permissions === 'string' ? page.data.permissions.split(',') : []
  );

  function hasPermission(path: string): boolean {
    const permissionKey = path.split('/').pop()?.replace('/', '');
    return permissions.some((p) => p.includes(permissionKey || ''));
  }

  function hasFeaturePermission(feature: string): boolean {
    console.log('Checking feature permission for:', feature);
    console.log('Current permissions:', permissions);
    return permissions.some((p) => p.includes(feature));
  }
</script>

{#if hasPermission('users.kits')}
  <a href="/admin/users/kits">Generate Reports on Kit Delivery</a>
{/if}
```

**AFTER**:
```svelte
<script lang="ts">
  import { usePermissions } from '$lib/stores/permissions.svelte';
  import { PERMISSIONS } from '$lib/constants/permissions';

  const { hasPermission, hasFeature } = usePermissions();
</script>

{#if hasPermission(PERMISSIONS.ADMIN_USERS_KITS)}
  <a href="/admin/users/kits">Generate Reports on Kit Delivery</a>
{/if}

{#if hasFeature('kits')}
  <span>Kit delivery reports available</span>
{/if}
```

**Changes for Each File:**

#### `src/routes/admin/+page.svelte`
- Remove lines 4-49 (custom permission functions)
- Add imports for `usePermissions` and `PERMISSIONS`
- Replace all `hasPermission()`, `hasAnyPermission()`, `canAccessRoute()` calls
- Remove debug output (lines 56-59)

#### `src/routes/admin/users/+page.svelte`
- Remove lines 4-17 (permission parsing and functions)
- Add imports for `usePermissions` and `PERMISSIONS`
- Replace all `hasPermission()` and `hasFeaturePermission()` calls
- Remove console.log statements

#### All community admin pages (bcyca, mondrook, tinonee, external)
- Similar pattern: remove local permission logic
- Import shared utilities
- Use constants for permission checks

**Benefits:**
- Eliminates ~200 lines of duplicated code
- No more string parsing
- Type-safe permission checks
- Consistent behavior across all pages
- Easier to maintain

---

### 3.3 Refactor Navigation Components

**File:** `src/components/page/navigation/Navbar.svelte`

**Current (line 9):**
```typescript
let isAdmin = $derived(page.data.userRole === 'admin' || permissions?.includes('admin'));
```

**Target:**
```typescript
import { usePermissions } from '$lib/stores/permissions.svelte';
const { isAdmin } = usePermissions();
```

**Why:** Consistent with rest of app, uses shared logic

---

## Phase 4: Data Flow Corrections (Medium Priority)

### 4.1 Fix permissions Serialization in Layouts

**File:** `src/routes/+layout.server.ts`

**Current Issue:**
- `Locals.permissions` is `string[]` (line 11 of app.d.ts)
- `PageData.permissions` is `string | null` (line 33 of app.d.ts)
- This forces string parsing in components

**Solution:**

After fixing `app.d.ts` in Phase 1.1, update the layout:

```typescript
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    session: locals.session,
    user: locals.user,
    userRole: locals.userRole,
    permissions: locals.permissions, // Now correctly typed as string[]
    coordinatesKYNG: locals.coordinatesKYNG,
    propertyIds: locals.propertyIds,
    userProfile: locals.userProfile
  };
};
```

**Why:**
- Eliminates need for string parsing in UI
- Type-safe data flow from server to client
- Cleaner component code

---

### 4.2 Verify All Child Layouts

**Files to Check:**
- `src/routes/admin/+layout.server.ts`
- `src/routes/kyng-coordinator/+layout.server.ts`
- `src/routes/personal-profile/+layout.server.ts`

**Ensure they don't override permissions with wrong type:**
```typescript
// Good - don't override permissions
export const load: LayoutServerLoad = async ({ parent, locals }) => {
  const parentData = await parent();
  return {
    ...parentData,
    // Add additional data here
    messages: []
  };
};

// Bad - would override with wrong type
export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    permissions: 'admin,admin.site' // WRONG TYPE!
  };
};
```

---

## Phase 5: Testing and Validation (High Priority)

### 5.1 Create Permission Test Suite

**New File:** `src/lib/server/auth/permissions.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { hasPermission, isAdmin, hasAnyFeature, hasAnyPermission } from './permissions';
import { PERMISSIONS } from '$lib/constants/permissions';

describe('Permission Utilities', () => {
  describe('hasPermission', () => {
    it('should grant exact match', () => {
      expect(hasPermission(['admin.site'], 'admin.site')).toBe(true);
    });

    it('should grant hierarchical access (parent grants child)', () => {
      expect(hasPermission(['admin.site'], 'admin.site.messages')).toBe(true);
    });

    it('should grant hierarchical access (child grants parent)', () => {
      expect(hasPermission(['admin.site.messages'], 'admin.site')).toBe(true);
    });

    it('should deny unrelated permission', () => {
      expect(hasPermission(['admin.users'], 'admin.site')).toBe(false);
    });

    it('should handle admin root permission', () => {
      expect(hasPermission(['admin'], 'admin.site.messages')).toBe(true);
      expect(hasPermission(['admin'], 'admin.users.kits')).toBe(true);
    });

    it('should handle empty permissions', () => {
      expect(hasPermission([], 'admin.site')).toBe(false);
    });

    it('should handle multiple required permissions (OR logic)', () => {
      expect(hasPermission(['admin.users'], ['admin.site', 'admin.users'])).toBe(true);
    });

    it('should work with permission constants', () => {
      expect(hasPermission(['admin.site.messages'], PERMISSIONS.ADMIN_SITE_MESSAGES)).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      expect(isAdmin('admin', [])).toBe(true);
    });

    it('should return true for admin permission', () => {
      expect(isAdmin('user', ['admin'])).toBe(true);
    });

    it('should return false for non-admin', () => {
      expect(isAdmin('user', ['admin.users'])).toBe(false);
    });

    it('should return false for null role and no permissions', () => {
      expect(isAdmin(null, [])).toBe(false);
    });
  });

  describe('hasAnyFeature', () => {
    it('should match feature at end of permission', () => {
      expect(hasAnyFeature(['admin.community.bcyca.events'], 'events')).toBe(true);
    });

    it('should not match feature in middle of permission', () => {
      expect(hasAnyFeature(['admin.events.bcyca'], 'events')).toBe(false);
    });

    it('should match across multiple communities', () => {
      expect(hasAnyFeature([
        'admin.community.bcyca.events',
        'admin.community.tinonee.workshops'
      ], 'events')).toBe(true);
    });
  });

  describe('hasAnyPermission', () => {
    it('should check multiple permissions', () => {
      expect(hasAnyPermission(['admin.users'], 'admin.site', 'admin.users')).toBe(true);
    });

    it('should return false if none match', () => {
      expect(hasAnyPermission(['admin.emergency'], 'admin.site', 'admin.users')).toBe(false);
    });
  });
});
```

**Run Tests:**
```bash
npm run test src/lib/server/auth/permissions.test.ts
```

---

### 5.2 Manual Testing Checklist

**Server-Side Route Guards:**
- [ ] Unauthenticated access to `/admin` → redirects to `/auth/signin`
- [ ] Authenticated user without admin permission accessing `/admin` → 403 error
- [ ] User with `admin.site` accessing `/admin/site/messages` → success (hierarchical)
- [ ] User with `admin.site.messages` accessing `/admin/site` → success (hierarchical)
- [ ] User with `admin.users` accessing `/admin/site` → 403 error
- [ ] KYNG coordinator accessing `/kyng-coordinator` → success
- [ ] Non-KYNG user accessing `/kyng-coordinator` → 403 error
- [ ] User accessing wrong property ID → 403 error

**Server-Side Action Guards:**
- [ ] User without `admin.site.messages` submitting message form → 403 error
- [ ] User without `admin.site.roles` assigning role → 403 error
- [ ] User with `admin.site` sending message (has parent permission) → success
- [ ] Admin user performing any action → success

**UI Permission Checks:**
- [ ] All admin pages show same menu items for same permissions
- [ ] User with `admin.site` sees `admin.site.messages` link (hierarchical)
- [ ] User with only `admin.users` doesn't see site admin links
- [ ] No console.log statements in production
- [ ] No "undefined permissions" errors in browser console
- [ ] Permission checks work after navigation (reactivity)

**Type Safety:**
- [ ] No TypeScript errors in `.svelte` files
- [ ] No `permissions.split(',')` calls remain
- [ ] `page.data.permissions` is always an array
- [ ] IDE autocomplete works for `PERMISSIONS.ADMIN_*`

**Edge Cases:**
- [ ] User with no permissions sees minimal UI
- [ ] User with null session redirected to signin
- [ ] Direct URL navigation to protected routes fails appropriately
- [ ] Browser back/forward preserves permission checks

---

### 5.3 Security Audit Checklist

**Critical Operations:**
- [ ] Sending messages to users
- [ ] Assigning/removing roles
- [ ] Managing KYNG coordinators
- [ ] Modifying spatial data
- [ ] Managing addresses
- [ ] Viewing emergency reports

**For Each Operation:**
1. Verify permission constant exists
2. Verify server action has guard
3. Verify UI button/link has permission check
4. Test bypassing UI check (direct form submission)
5. Test with insufficient permissions
6. Test with hierarchical permissions

---

## Phase 6: Documentation and Cleanup (Low Priority)

### 6.1 Update Database Documentation

**File:** `database.md`

**Add Section:**

```markdown
## Application-Level Authorization

While Row-Level Security (RLS) provides database security, the application implements defense-in-depth with multiple authorization layers:

### Authorization Layers

1. **Database RLS** (Primary Security)
   - Enforces access control at the PostgreSQL level
   - Uses JWT claims for user context
   - Cannot be bypassed by application code
   - See RLS policies section for details

2. **Server Route Guards** (`src/hooks.server.ts`)
   - Validates access before route resolution
   - Checks user session and permissions
   - Returns 403 for unauthorized access
   - Implements in `guardRoute()` function

3. **Server Action Guards** (`+page.server.ts` files)
   - Validates permissions before executing form actions
   - Prevents unauthorized state changes
   - Guards all sensitive operations
   - Example: `hasPermission(permissions, PERMISSIONS.ADMIN_SITE_MESSAGES)`

4. **Layout Guards** (`+layout.server.ts` files)
   - Guards entire route sections
   - Early exit for unauthorized users
   - Prevents loading data for restricted areas

5. **UI Filtering** (`.svelte` components)
   - Hides unauthorized UI elements
   - Improves user experience
   - Uses same permission logic as server
   - Not relied upon for security

### Permission System

All layers use the same permission checking logic from `src/lib/server/auth/permissions.ts`:

**Hierarchical Permissions:**
- Dot-notation: `admin.site.messages`
- Parent grants child: `admin.site` grants `admin.site.messages`
- Child grants parent: `admin.site.messages` grants `admin.site`

**Permission Constants:**
- Defined in `src/lib/constants/permissions.ts`
- Type-safe with TypeScript
- Matches database `app_role` enum

**Shared Utilities:**
- `hasPermission(permissions, required)` - Check single or multiple permissions
- `isAdmin(role, permissions)` - Check admin status
- `hasAnyFeature(permissions, feature)` - Check feature across communities

### Security Philosophy

**Defense in Depth:** Each layer provides independent protection:
- If UI filtering fails → server actions block
- If server actions fail → RLS blocks
- If route guards fail → RLS blocks

**Principle of Least Privilege:**
- Users granted minimum required permissions
- Hierarchical permissions reduce over-granting
- Regular audits of role assignments

**Fail Secure:**
- Unknown routes default to requiring authentication
- Missing permissions default to deny
- Errors throw 403, not 500
```

---

### 6.2 Add JSDoc Comments

**Files to Document:**
- `src/lib/server/auth/permissions.ts` (already done in Phase 1.2)
- `src/lib/server/auth/authguard.ts`
- `src/lib/server/auth/routematchers.ts`

**Example for `authguard.ts`:**

```typescript
/**
 * Route guard that validates user access to protected routes.
 * Called by the server hooks before resolving any route.
 *
 * @throws {Redirect} 303 redirect to /auth/signin if not authenticated
 * @throws {Error} 403 if user lacks required permissions
 *
 * @example
 * ```typescript
 * await guardRoute({
 *   path: '/admin/site/messages',
 *   session: locals.session,
 *   user: locals.user,
 *   userRole: locals.userRole,
 *   coordinatesKYNG: locals.coordinatesKYNG,
 *   permissions: locals.permissions.join(','),
 *   propertyIds: locals.propertyIds
 * });
 * ```
 */
export async function guardRoute({ ... }) { ... }
```

---

### 6.3 Create Migration Guide

**New File:** `MIGRATION-GUIDE-AUTH.md`

```markdown
# Permission System Migration Guide

This guide helps you update code to use the new permission system.

## For Developers

### Before (Old Pattern):
```svelte
<script lang="ts">
  let permissions = $derived(
    typeof page.data.permissions === 'string' ? page.data.permissions.split(',') : []
  );

  function hasPermission(path: string): boolean {
    const key = path.split('/').pop();
    return permissions.some(p => p.includes(key));
  }
</script>

{#if hasPermission('/admin/users/kits')}
  <a href="/admin/users/kits">Kits</a>
{/if}
```

### After (New Pattern):
```svelte
<script lang="ts">
  import { usePermissions } from '$lib/stores/permissions.svelte';
  import { PERMISSIONS } from '$lib/constants/permissions';

  const { hasPermission } = usePermissions();
</script>

{#if hasPermission(PERMISSIONS.ADMIN_USERS_KITS)}
  <a href="/admin/users/kits">Kits</a>
{/if}
```

## For Server Actions

### Before (Insecure):
```typescript
export const actions: Actions = {
  sendMessage: async ({ request, locals: { supabase } }) => {
    // No permission check!
    const formData = await request.formData();
    // ... process message
  }
};
```

### After (Secure):
```typescript
import { hasPermission } from '$lib/server/auth/permissions';
import { PERMISSIONS } from '$lib/constants/permissions';

export const actions: Actions = {
  sendMessage: async ({ request, locals: { supabase, permissions } }) => {
    if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_MESSAGES)) {
      throw error(403, 'Insufficient permissions');
    }

    const formData = await request.formData();
    // ... process message
  }
};
```

## Common Migration Tasks

### Task 1: Remove String Parsing
**Find:** `permissions.split(',')`
**Replace:** Just use `permissions` (now always an array)

### Task 2: Replace Custom Permission Functions
**Find:** Local `hasPermission()`, `canAccess()`, etc.
**Replace:** Import from `usePermissions()` store

### Task 3: Use Permission Constants
**Find:** String literals like `'admin.site'`
**Replace:** `PERMISSIONS.ADMIN_SITE`

### Task 4: Add Server Action Guards
**Find:** `export const actions: Actions = {`
**Add:** Permission check as first line of each action
```

---

## Implementation Order (Recommended Timeline)

### Week 1: Critical Security Fixes (Days 1-5)
**Priority: CRITICAL** | **Effort: Medium** | **Risk: Low**

**Monday-Tuesday:**
- [ ] Phase 1.1 - Fix type inconsistencies in `app.d.ts`
- [ ] Phase 1.2 - Create `src/lib/server/auth/permissions.ts`
- [ ] Phase 1.3 - Create `src/lib/constants/permissions.ts`

**Wednesday-Thursday:**
- [ ] Phase 2.1 - Enable `guardRoute` in `hooks.server.ts`
- [ ] Phase 2.2 - Update `guardRoute` to use new utilities
- [ ] Test route guards manually

**Friday:**
- [ ] Phase 5.1 - Create and run test suite
- [ ] Deploy to staging environment
- [ ] Verify no regressions

**Impact:** Closes major security gap where routes have no server-side protection

---

### Week 2: Server Action Guards (Days 6-10)
**Priority: CRITICAL** | **Effort: High** | **Risk: Low**

**Monday:**
- [ ] Phase 2.3 - Add guards to `admin/site/messages/+page.server.ts` (6 actions)
- [ ] Phase 2.3 - Add guards to `admin/site/roles/assignments/+page.server.ts` (3 actions)

**Tuesday:**
- [ ] Phase 2.3 - Add guards to remaining 5 admin server files
- [ ] Audit all server actions for completeness

**Wednesday:**
- [ ] Phase 2.4 - Add layout-level guards (2 files)
- [ ] Test all admin actions with insufficient permissions

**Thursday:**
- [ ] Security audit - test bypassing UI checks
- [ ] Test hierarchical permissions
- [ ] Document security test results

**Friday:**
- [ ] Code review
- [ ] Deploy to staging
- [ ] Run full security audit checklist

**Impact:** Prevents unauthorized form submissions and data modifications

---

### Week 3: UI Consistency (Days 11-15)
**Priority: MEDIUM** | **Effort: High** | **Risk: Medium**

**Monday:**
- [ ] Phase 3.1 - Create `src/lib/stores/permissions.svelte.ts`
- [ ] Test store in one component first

**Tuesday-Wednesday:**
- [ ] Phase 3.2 - Refactor `admin/+page.svelte`
- [ ] Phase 3.2 - Refactor `admin/users/+page.svelte`
- [ ] Phase 3.2 - Refactor 4 community admin pages
- [ ] Phase 3.2 - Refactor 2 remaining admin pages

**Thursday:**
- [ ] Phase 3.3 - Refactor `Navbar.svelte`
- [ ] Phase 4.1 - Fix permissions serialization in layouts
- [ ] Phase 4.2 - Verify all child layouts

**Friday:**
- [ ] Test UI consistency across all pages
- [ ] Verify reactivity works correctly
- [ ] Remove all debug console.log statements
- [ ] Deploy to staging

**Impact:** Consistent user experience, eliminates 4 different permission patterns

---

### Week 4: Testing and Documentation (Days 16-20)
**Priority: HIGH** | **Effort: Medium** | **Risk: Low**

**Monday:**
- [ ] Phase 5.2 - Complete manual testing checklist
- [ ] Phase 5.3 - Complete security audit checklist

**Tuesday:**
- [ ] Fix any issues found during testing
- [ ] Re-run test suite
- [ ] Performance testing

**Wednesday:**
- [ ] Phase 6.1 - Update `database.md`
- [ ] Phase 6.2 - Add JSDoc comments
- [ ] Phase 6.3 - Create migration guide

**Thursday:**
- [ ] Final code review
- [ ] Update team documentation
- [ ] Create deployment plan

**Friday:**
- [ ] Deploy to production
- [ ] Monitor logs for authorization errors
- [ ] Verify analytics/metrics

**Impact:** Maintainability, documentation, and team onboarding

---

## Risk Assessment

### Before Refactoring
- **Server Layer:** ❌ No protection (guardRoute unused)
- **Action Layer:** ❌ No protection (no permission checks)
- **UI Layer:** ⚠️ Inconsistent (4 different patterns)
- **Overall Risk:** **HIGH**

### After Refactoring
- **Server Layer:** ✅ Protected (guardRoute active)
- **Action Layer:** ✅ Protected (all actions guarded)
- **UI Layer:** ✅ Consistent (single pattern)
- **Overall Risk:** **LOW**

---

## Rollback Plan

If critical issues arise during deployment:

### Quick Rollback (< 5 minutes)
1. Revert `hooks.server.ts` to disable `guardRoute`
2. Deploy previous version
3. Monitor for stability

### Partial Rollback
- Keep Phase 1 changes (utilities, no functional impact)
- Disable `securityGuard` in `hooks.server.ts`
- Remove action guards temporarily
- Keep UI changes (backward compatible)

### What NOT to Rollback
- Type fixes in `app.d.ts` (breaking change for future work)
- Permission constants (no functional impact)
- Documentation updates

---

## Success Metrics

### Security Metrics
- [ ] Zero unauthorized access to admin routes
- [ ] Zero unauthorized action executions
- [ ] All protected routes return 403 when appropriate
- [ ] Zero security findings in audit

### Code Quality Metrics
- [ ] All TypeScript errors resolved
- [ ] All tests passing
- [ ] Zero duplicated permission logic
- [ ] 100% JSDoc coverage for auth utilities

### User Experience Metrics
- [ ] Consistent permission behavior across UI
- [ ] Clear error messages for unauthorized access
- [ ] No broken links for users with partial permissions
- [ ] Fast page loads (guard checks are fast)

---

## Files Summary

### New Files (3)
- `src/lib/server/auth/permissions.ts` - Permission utilities (~100 lines)
- `src/lib/constants/permissions.ts` - Permission constants (~80 lines)
- `src/lib/stores/permissions.svelte.ts` - UI permission store (~40 lines)

### Modified Files (19)
- `src/app.d.ts` - Fix permissions type (1 line)
- `src/hooks.server.ts` - Enable guardRoute (~20 lines changed)
- `src/lib/server/auth/authguard.ts` - Use new utilities (~10 lines changed)
- `src/routes/+layout.server.ts` - Pass permissions correctly (~5 lines)
- 2 `+layout.server.ts` files - Add layout guards (~10 lines each)
- 7 `+page.server.ts` files - Add action guards (~5-30 lines each)
- 8 `.svelte` files - Use shared permission logic (~20-50 lines each)

### Test Files (1)
- `src/lib/server/auth/permissions.test.ts` - Test suite (~150 lines)

### Documentation Files (3)
- `database.md` - Updated with auth section (~50 lines added)
- `MIGRATION-GUIDE-AUTH.md` - New migration guide (~200 lines)
- `REFACTORING-PLAN-AUTH-PERMISSIONS.md` - This document

**Total Impact:** ~500-700 lines changed across 26 files

---

## Frequently Asked Questions

### Q: Will this break existing functionality?
**A:** Phase 1 and 3 have minimal breaking changes. Phase 2 adds security that should have always been there. We recommend thorough testing in staging first.

### Q: Do I need to update the database?
**A:** No. The database schema and RLS policies remain unchanged. We're only changing application-level code.

### Q: What about performance?
**A:** Minimal impact. Permission checks are simple array operations. Route guards add <1ms per request.

### Q: Can I deploy this incrementally?
**A:** Yes. You can deploy Phase 1 alone (utilities) without risk. Phase 2 should be deployed together. Phase 3 can be incremental (one component at a time).

### Q: What if a user reports they can't access something?
**A:** Check their permissions in the database:
```sql
SELECT r.role, rp.permissions
FROM user_roles r
JOIN role_permissions rp ON r.role = rp.role
WHERE r.user_id = 'user-uuid-here';
```

### Q: How do I add a new permission?
1. Add to `PERMISSIONS` constant in `permissions.ts`
2. Add to database `app_role` enum (if new role)
3. Add to `role_permissions` table (if new mapping)
4. Use constant in guards and UI checks

---

## Support and Questions

**Issues:** File bugs at [GitHub Issues]
**Questions:** Contact dev team lead
**Documentation:** See `database.md` and `MIGRATION-GUIDE-AUTH.md`

---

## Sign-off Checklist

Before considering this refactoring complete:

- [ ] All phases implemented
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Code reviewed by 2+ developers
- [ ] Deployed to staging and tested
- [ ] Performance validated
- [ ] Documentation updated
- [ ] Team trained on new patterns
- [ ] Rollback plan tested
- [ ] Production deployment successful
- [ ] Post-deployment monitoring complete (24 hours)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-24
**Next Review:** After Phase 2 completion
