# Authentication & Authorization System Documentation

## Overview
This system implements a multi-layered auth approach combining Supabase SSR authentication with role-based access control (RBAC) and route protection.

## Key Components

### 1. Server-Side Authentication (hooks.server.ts)
- Handles initial auth state
- Manages Supabase client creation
- Processes session validation
- Extracts user roles and KYNG coordinates from JWT

### 2. Route Protection (lib/auth/authGuard.ts)
Implements centralized route guarding with:
- Public route allowlist
- Protected route validation
- Permission-based access control
- KYNG coordinator area validation

### 3. Permission Management (lib/auth/permissions.ts)
- Fetches user permissions from database
- Validates admin access levels
- Manages role-permission relationships

### 4. Layout Data Flow
#### Server Layout Load (routes/+layout.server.ts)
Provides:
- Session state
- User data
- Role information
- Permissions
- KYNG coordinates

#### Client Layout Load (routes/+layout.ts)
Handles:
- Browser-side Supabase client
- Session management
- Data synchronization

### 5. Navigation Components (Navbar.svelte)
Implements:
- Dynamic navigation based on auth state
- Permission-based UI elements
- KYNG coordinator access controls

## Route Protection Rules

### Public Routes
- /
- /about
- /contact
- /policies/*
- /auth/signup
- /auth/signin

### Protected Routes
1. Session Required:
   - /auth/signout
   - /personal-profile/*

2. KYNG Coordinator:
   - /kyng-coordinator
   - /kyng-coordinator/[kyng_area]

3. Admin Routes:
   - /admin/* (requires admin permission)
   - /admin/community/* (requires specific community permissions)
   - /admin/emergency/* (requires emergency management permissions)
   - /admin/site/* (requires site administration permissions)
   - /admin/users/* (requires user management permissions)

## Usage Examples

### Adding New Protected Routes
1. Add route pattern to routeMatchers.ts
2. Define required permissions
3. Update auth guard logic if needed

### Implementing New Permissions
1. Add permission to database
2. Update role-permission relationships
3. Add permission check in relevant components

### Adding Role-Based UI Elements
```typescript
{#if permissions?.includes('required.permission')}
    <YourProtectedComponent />
{/if}
```
# Auth System File Structure and Functions

## Server-Side Files

### src/hooks.server.ts
- Entry point for server-side auth processing
- Creates and configures Supabase server client
- Manages cookie handling for auth state
- Implements route protection middleware
- Sequences auth checks with other server hooks

### src/routes/+layout.server.ts
- Handles server-side data loading
- Fetches and validates user session
- Retrieves user permissions
- Provides auth data to client layout
- Manages KYNG coordinator data

## Auth Utilities

### src/lib/server/auth/authguard.ts
- Implements route protection logic
- Validates user permissions
- Checks KYNG coordinator access
- Manages redirect flows
- Handles auth-related errors

### src/lib/server/auth/routematchers.ts
- Defines route matching patterns
- Handles path validation
- Maps routes to required permissions
- Provides utility functions for path checking
- Manages public route allowlist

### src/lib/server/auth/utility.ts
- Fetches user permissions from database
- Validates permission strings
- Handles role-permission mapping
- Provides permission checking utilities
- Manages admin access validation

## Client-Side Files

### src/routes/+layout.ts
- Creates browser-side Supabase client
- Manages client-side session state
- Handles auth state synchronization
- Provides auth data to components
- Manages auth-related dependencies

### src/components/page/navigation/Navbar.svelte
- Renders navigation based on auth state
- Shows/hides elements by permission
- Manages auth-related UI elements
- Handles sign-in/sign-out flows
- Displays KYNG coordinator options

## Type Definitions

### src/app.d.ts
- Defines auth-related TypeScript types
- Declares session structure
- Types user roles and permissions
- Defines KYNG coordinator types
- Declares global namespace augmentations

### src/lib/types.ts
- Contains shared type definitions
- Defines permission interfaces
- Types for KYNG area data
- User profile types
- Auth-related utility types

## Additional Files

### src/lib/server/auth/utility.ts
- Server-side auth helper functions
- Permission validation utilities
- Session management helpers
- Error handling utilities
- Auth-related type guards

Public Routes:
	/
	/about
	/contact
	/policies/privacy
	/policies/termsofservice
	/auth/signup
	/auth/signin

Protected Routes:
	Sign Out Route:
			/auth/sgnout => have session and user

	Onboarding Profile Route:
			/personal-profile-form => only on redirect from callback

	Personal Profile Route:
			/personal-profile => have session and user
			/personal-profile/my-property/[propertyid] => have session and user and UserPropertyProfile.id === `propertyid`

	Coordinator Routes:
			/kyng-coordinator => length `coordinatesKYNG`> 0 and not null
			/kyng-coordinator/[kyng_area] => `coordinatesKYNG`.kyngAreaId === `kyng_area`

	Admin Routes:	/admin => permissions.includes('admin')
		Community Admin:	/admin/community => permissions.includes('admin.communities')
			/admin/community/bcyca => permissions.includes('admin.bcyca')
			/admin/community/bcyca/workshops => permissions.includes('admin.bcyca.workshops')
			/admin/community/bcyca/information => permissions.includes('admin.bcyca.information')
			/admin/community/bcyca/events => permissions.includes('admin.bcyca.events')
			/admin/community/bcyca/map => permissions.includes('admin.bcyca')
			/admin/community/tinonee => permissions.includes('admin.tinonee')
			/admin/community/tinonee/workshops => permissions.includes('admin.tinonee.workshops')
			/admin/community/tinonee/information => permissions.includes('admin.tinonee.information')
			/admin/community/tinonee/events => permissions.includes('admin.tinonee.events')
			/admin/community/tinonee/map => permissions.includes('admin.tinonee')
			/admin/community/mondrook => permissions.includes('admin.mondrook')
			/admin/community/mondrook/workshops => permissions.includes('admin.mondrook.workshops')
			/admin/community/mondrook/events => permissions.includes('admin.mondrook.events')
			/admin/community/mondrook/information => permissions.includes('admin.mondrook.information')
			/admin/community/mondrook/map => permissions.includes('admin.mondrook')
			/admin/community/external => permissions.includes('admin.external')
			/admin/community/external/events => permissions.includes('admin.external.events')
			/admin/community/external/workshops => permissions.includes('admin.external.workshops')
			/admin/community/external/information => permissions.includes('admin.external.information')
			/admin/community/external/map => permissions.includes('admin.external')
		Emergency Admin:
			/admin/emergency => permissions.includes('admin.emergency')
			/admin/emergency/reports => permissions.includes('admin.emergency.reports')
			/admin/emergency/service-map => permissions.includes('admin.emergency.servicemap')
		Site Admin:
			/admin/site => permissions.includes('admin.site')
			/admin/site/data => permissions.includes('admin.site.data')
			/admin/site/messages => permissions.includes('admin.site.messages')
			/admin/site/roles => permissions.includes('admin.site.roles')
		Users Admin:
			/admin/users => permissions.includes('admin.users')
			/admin/users/kits => permissions.includes('admin.users.kits')
			/admin/users/new => permissions.includes('admin.users.new')