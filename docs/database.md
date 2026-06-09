# Database Schema Documentation

> For complete TypeScript type definitions, see `db.types.ts`  
> This document provides context, relationships, RLS policies, and design decisions

---

## Overview

**Database:** PostgreSQL 15 with PostGIS extension  
**Schema:** Single `public` schema with multi-tenant RLS  
**Spatial Reference:** SRID 7844 (GDA2020 - Australian standard)  
**Multi-Tenancy:** Row Level Security based on JWT custom claims

---

## Core Table Relationships

### User & Community Profiles

```
user_profile (1)
├── id (PK, references auth.users)
├── bcyca_profile_id (FK) ──────┐
├── tinonee_profile_id (FK) ────┼── Optional community memberships
├── mondrook_profile_id (FK) ───┤
└── external_profile_id (FK) ───┘

community_bcyca_profile (1:1 optional)
├── bcyca_profile_id (PK, FK → user_profile.bcyca_profile_id)
└── [community-specific fields]

community_tinonee_profile (1:1 optional)
├── tinonee_profile_id (PK, FK → user_profile.tinonee_profile_id)
└── [community-specific fields]

community_mondrook_profile (1:1 optional)
├── mondrook_profile_id (PK, FK → user_profile.mondrook_profile_id)
└── [community-specific fields]

community_external_profile (1:1 optional)
├── external_profile_id (PK, FK → user_profile.external_profile_id)
└── [community-specific fields]
```

**Key Pattern:**  
Users have ONE user_profile but can belong to MULTIPLE communities via separate profile tables. Each community profile has its own set of preferences and settings.

### Properties & Spatial Features

```
user_profile (1)
    ↓
user_property_profile_join (many-to-many)
    ↓
property_profile (many)
├── id (PK)
├── property_address_street
├── principaladdresssiteoid (NSW GNAF identifier)
├── community (FK → community_areas)
└── kyng (FK → kyng_areas)
    ↓
spatial_features (many)
├── id (PK)
├── property_id (FK → property_profile)
├── template_id (FK → feature_templates)
├── user_id (FK → user_profile)
└── geom (PostGIS geometry)
    ↓
feature_templates (lookup)
├── id (PK)
├── name (e.g., "Water Source", "Refuge Area")
├── geometry_type (point | line | polygon)
└── category (hazard | asset | operational)
    ↓
template_fields (many)
├── template_id (FK → feature_templates)
├── field_name
├── field_type (text | number | date | select | boolean)
└── is_required
    ↓
feature_attributes (many)
├── feature_id (FK → spatial_features)
├── field_id (FK → template_fields)
└── value (JSONB)
```

**Key Pattern:**  
Template-driven feature system. Templates define what fields/geometry types are allowed. Features store their attribute values in separate `feature_attributes` table with FK to `template_fields`.

---

## Row Level Security (RLS) Patterns

### User Profile Access

```sql
-- Users can only read/update their own profile
CREATE POLICY "user_profile_access" ON user_profile
  FOR ALL USING (id = auth.uid());
```

### Property Access (JWT Claims-Based)

```sql
-- Access controlled by property_ids array in JWT
CREATE POLICY "property_access" ON property_profile
  FOR SELECT USING (
    id = ANY(
      (SELECT auth.jwt()->>'property_ids')::uuid[]
    )
  );

-- Users can only modify properties they own
CREATE POLICY "property_update" ON property_profile
  FOR UPDATE USING (
    id = ANY(
      (SELECT auth.jwt()->>'property_ids')::uuid[]
    )
  );
```

### Spatial Features Access

```sql
-- Users can only see features on their properties
CREATE POLICY "spatial_features_access" ON spatial_features
  FOR SELECT USING (
    property_id = ANY(
      (SELECT auth.jwt()->>'property_ids')::uuid[]
    )
  );

-- Users can only create features on their properties
CREATE POLICY "spatial_features_insert" ON spatial_features
  FOR INSERT WITH CHECK (
    property_id = ANY(
      (SELECT auth.jwt()->>'property_ids')::uuid[]
    )
    AND user_id = auth.uid()
  );
```

### Community Profile Access

```sql
-- Admin can see all community profiles
-- KYNG coordinators can see their community
-- Users can see their own profile
CREATE POLICY "community_bcyca_access" ON community_bcyca_profile
  FOR SELECT USING (
    (auth.jwt()->>'user_role' = 'admin')
    OR (
      (auth.jwt()->>'user_role' = 'kyng_coordinator')
      AND 'bcyca' = ANY((auth.jwt()->>'community_slugs')::text[])
    )
    OR (bcyca_profile_id IN (
      SELECT bcyca_profile_id FROM user_profile WHERE id = auth.uid()
    ))
  );
```

---

## Application-Level Authentication & Authorization

> **See Also:** [`documentation/auth-system.md`](./auth-system.md) for complete application-level auth implementation details

While Row-Level Security (RLS) provides database-level security, the application implements a comprehensive defense-in-depth authorization architecture. This section covers the database aspects; see `auth-system.md` for route guards, action guards, and UI filtering.

### Authorization Layers

The application uses a multi-layer security architecture:

1. **Database RLS** (Primary Security - covered here)
   - PostgreSQL Row-Level Security policies
   - JWT claims-based access control
   - Property-level data isolation
   - Community-based access filtering

2. **Application Guards** (See `auth-system.md`)
   - Layout-based route guards
   - Server action permission checks
   - Hierarchical permission validation
   - UI component filtering

### Custom JWT Claims Structure

Generated by `custom_access_token_hook` function (Supabase auth hook):

```typescript
{
  user_role: 'admin' | 'kyng_coordinator' | 'user',
  property_ids: string[],        // UUIDs of properties user can access
  community_slugs: string[],     // ['bcyca', 'tinonee', 'mondrook', 'external']
  permissions: string[]          // Fine-grained permissions from app_role enum
}
```

**How it works:**
1. Auth hook runs on every authentication
2. Queries user's properties and communities from database
3. Queries user's roles and permissions from `user_roles` and `role_permissions` tables
4. Injects claims into JWT access token
5. RLS policies read from `auth.jwt()` function
6. No additional database queries needed for authorization checks

**Key Tables for Claims Generation:**
- `user_roles`: Maps users to their assigned roles
- `role_permissions`: Defines which permissions each role grants
- `user_property_profile_join`: Links users to properties they can access
- `user_profile`: Contains community affiliations

### Permission System (Database Perspective)

**Tables:**
- `user_roles`: User → Role assignments
- `role_permissions`: Role → Permission mappings
- `user_permissions`: Direct user → Permission overrides (optional)

**Enums:**
- `app_role`: 60+ role definitions (see Enums section below)

**Permission Format:** Hierarchical dot-notation
```
admin                          # Root admin access
admin.site                     # Site administration
admin.site.messages            # Message management
admin.community.bcyca          # BCYCA community admin
admin.community.bcyca.events   # BCYCA events management
```

**Hierarchical Access:**
- Parent permissions grant access to child permissions
- `admin.site` grants access to `admin.site.messages`
- `admin.site.messages` grants access to `admin.site` (reverse also true)

**Application Implementation:**
The application layer (see `auth-system.md`) uses the `hasPermission()` utility which implements this hierarchical logic. The database simply stores the granted permissions in `role_permissions`.

### RLS and Application Security Integration

**Defense-in-Depth Model:**

```
User Request
    ↓
1. Layout Guard (app) - Validates route access, checks permissions
    ↓
2. Action Guard (app) - Validates operation permissions
    ↓
3. Database RLS - Final enforcement based on JWT claims
    ↓
Data Access Granted/Denied
```

**Key Insight:** Even if application guards are bypassed, RLS policies provide the ultimate security boundary using the same JWT claims.

### RLS Policy Patterns (JWT Claims-Based)

All RLS policies use `auth.jwt()` to read claims:

```sql
-- Example: Admin access
CREATE POLICY "admin_access" ON sensitive_table
  FOR ALL USING (
    (auth.jwt()->>'user_role' = 'admin')
    OR (
      'admin' = ANY((auth.jwt()->>'permissions')::text[])
    )
  );

-- Example: Permission-based access
CREATE POLICY "messages_access" ON app_messages
  FOR ALL USING (
    'admin.site.messages' = ANY((auth.jwt()->>'permissions')::text[])
  );
```

**Important:** RLS policies do **not** implement hierarchical permission checking. They check for exact permission strings. The hierarchical logic is implemented in the application layer (see `auth-system.md`).

### Security Philosophy

**Defense in Depth:**
Each layer provides independent protection:
- If UI filtering fails → server action guards block
- If action guards fail → layout guards block
- If route guards fail → RLS blocks
- RLS is the ultimate security boundary

**Principle of Least Privilege:**
- Users granted minimum required permissions
- Hierarchical permissions reduce over-granting
- Regular audits of role assignments via database queries

**Fail Secure:**
- Unknown routes default to requiring authentication (application)
- Missing permissions default to deny (RLS)
- Errors throw 403, not 500 (application)
- RLS policies deny by default

### Permissions and RLS Query Examples

**Check user's current permissions:**
```sql
SELECT
  u.email,
  r.role,
  rp.permission
FROM auth.users u
JOIN user_roles r ON u.id = r.user_id
JOIN role_permissions rp ON r.role = rp.role
WHERE u.id = 'user-uuid-here';
```

**Find all users with specific permission:**
```sql
SELECT DISTINCT
  u.email,
  r.role
FROM auth.users u
JOIN user_roles r ON u.id = r.user_id
JOIN role_permissions rp ON r.role = rp.role
WHERE rp.permission LIKE '%admin.site.messages%';
```

**Check what a permission grants access to (application-level):**
This is handled by the application's `hasPermission()` utility (see `auth-system.md`). The database simply stores the granted permission strings.

### Authentication Flow (Database Perspective)

1. **User Sign-In**
   - Supabase Auth validates credentials
   - `custom_access_token_hook` triggers

2. **Claims Generation**
   ```sql
   -- Hook queries user's roles
   SELECT role FROM user_roles WHERE user_id = auth.uid();

   -- Hook queries role's permissions
   SELECT permission FROM role_permissions WHERE role = $1;

   -- Hook queries user's properties
   SELECT property_id FROM user_property_profile_join WHERE user_id = auth.uid();

   -- Hook queries user's communities
   SELECT community FROM user_profile WHERE id = auth.uid();
   ```

3. **Claims Injection**
   - All results combined into JWT claims object
   - JWT signed and returned to client

4. **RLS Policy Evaluation**
   - Every database query extracts claims via `auth.jwt()`
   - Policies evaluate using extracted claims
   - No additional queries needed

### Claims Refresh Considerations

**Issue:** JWT claims are cached until token expiry or re-login

**Scenarios requiring refresh:**
- User assigned new role
- Role permissions modified
- User granted/revoked property access
- User added to new community

**Current Behavior:** User must log out and log back in to see changes

**Future Enhancement:** Implement claims refresh mechanism without requiring re-login

### Integration with Application Auth

For complete understanding of the authentication system:

1. **Read this section** for:
   - Database schema for auth (tables, enums)
   - RLS policy patterns
   - JWT claims structure
   - Permission storage and querying

2. **Read `auth-system.md`** for:
   - Route protection implementation
   - Server action guards
   - Hierarchical permission checking
   - UI component filtering
   - Svelte 5 permission utilities

Together, these provide a complete picture of the defense-in-depth security architecture.

---

## Key RPC Functions

### User Profile Management

**`get_profile_for_user(id_input: uuid) → Json`**
- Returns complete user profile with all joined community profiles
- Used in root `+layout.server.ts` to load user data
- Includes: user_profile + community profiles + properties

**`get_profile_messages_for_user(id_input: uuid) → Json`**
- Returns app messages targeted to user's role/communities
- Used for displaying notifications and alerts

### Property Management

**`get_property_geometry(id_input: uuid) → Json[]`**
- Returns property boundary as GeoJSON
- SRID 7844 (GDA2020)
- Used for map centering and boundary display

**`create_property_for_user(...) → void`**
- Creates property and links to user
- Parameters include validated GNAF address data
- Triggers JWT claims refresh

### Spatial Features

**`delete_spatial_feature(p_feature_id: uuid, p_property_id: uuid, p_user_id: uuid) → boolean`**
- Deletes feature and associated attributes
- Validates ownership via property_id and user_id
- Cascades to feature_attributes

### Community Profiles

**`add_community_bcyca_profile(user_id_param: uuid) → void`**
- Creates BCYCA community profile for user
- Similar functions exist for other communities
- Triggers JWT claims refresh to add 'bcyca' to community_slugs

### Address Validation

**`check_gnaf_address_match(...) → Json`**
- Validates address against NSW GNAF dataset
- Used during property onboarding
- Returns principaladdresssiteoid for property linkage

---

## Important Data Patterns

### Address Data (NSW GNAF)

Properties store three address fields:
- `property_address_street`: User-entered address
- `property_address_suburb`: User-entered suburb
- `property_address_postcode`: Validated postcode
- `principaladdresssiteoid`: NSW GNAF unique identifier (integer)

**Key Insight:** The `principaladdresssiteoid` is the authoritative property identifier used to link to NSW government spatial datasets.

### Fire Safety Assessment Data

Property profiles contain extensive fire safety fields:
- `fire_fighting_resources`: Array of integers (lookup codes)
- `fire_hazard_reduction`: Array of integers (lookup codes)
- `site_hazards`: Array of integers (lookup codes)
- `static_water_available`: Array of integers (lookup codes)
- `truck_access`: Integer (lookup code)
- `residents*`: Age demographic counts

**Pattern:** Arrays of integers reference `community_request_options_lut` table for dropdown options. This allows dynamic option management without code changes.

### Spatial Feature Templates

Templates define feature types WITHOUT hardcoding:

```typescript
// feature_templates table
{
  id: uuid,
  name: "Water Source",
  category: "asset",
  geometry_type: "point",
  is_active: true
}

// template_fields table
{
  template_id: uuid,
  field_name: "capacity_litres",
  field_type: "number",
  is_required: true,
  validation_rules: { min: 0, max: 100000 }
}

// feature_attributes table (user data)
{
  feature_id: uuid,
  field_id: uuid,
  value: "15000"  // Stored as JSONB
}
```

**Benefits:**
- New feature types added via admin UI
- No code deployments required
- Validation rules stored with template

---

## Geometry Handling

### SRID Consistency

**Always use SRID 7844 (GDA2020):**
```sql
-- Insert geometry
INSERT INTO spatial_features (geom, ...)
VALUES (ST_GeomFromGeoJSON('{"type":"Point",...}', 7844), ...);

-- Transform if needed
ST_Transform(geometry, 7844)

-- Check SRID
SELECT ST_SRID(geom) FROM spatial_features;
```

### GeoJSON Conversion

```sql
-- To GeoJSON
SELECT ST_AsGeoJSON(geom)::json FROM spatial_features;

-- From GeoJSON
ST_GeomFromGeoJSON('{"type":"Point","coordinates":[...]}', 7844)
```

### Common Spatial Queries

**Find features within property boundary:**
```sql
SELECT sf.* 
FROM spatial_features sf
JOIN property_geometry pg ON sf.property_id = pg.property_id
WHERE ST_Within(sf.geom, pg.geom);
```

**Calculate distance between features:**
```sql
SELECT 
  f1.id,
  f2.id,
  ST_Distance(f1.geom, f2.geom) as distance_meters
FROM spatial_features f1, spatial_features f2
WHERE f1.template_id = 'water-source-uuid'
  AND f2.template_id = 'hazard-uuid';
```

---

## Enums

### app_role
Comprehensive role-based permissions:
- `admin`: Full system access
- `kyng_coordinator`: KYNG area management
- `user`: Standard user access
- Plus fine-grained roles like:
  - `admin_bcyca`, `admin_tinonee`, `admin_mondrook`, `admin_external`
  - `admin_site_messages`, `admin_users`, etc.

### feature_category
- `hazard`: Fire hazards, obstacles
- `asset`: Water sources, refuges, equipment
- `operational`: Access routes, assembly points

### geometry_type
- `point`: Single location
- `line`: Linear features (roads, fences)
- `polygon`: Area features (boundaries, zones)

### field_type
For template field definitions:
- `text`, `number`, `date`, `boolean`
- `select`: Single choice dropdown
- `multiselect`: Multiple choice

---

## KYNG Areas System

KYNG (Know Your Neighbour Group) divides communities into geographic zones for coordination:

**Tables:**
- `kyng_areas`: Zone definitions with geometry
- `kyng_area_users_join`: User assignments to zones
- `coordinates_kyng`: Spatial index for quick lookups

**Views:** Auto-generated views per KYNG area:
- `kyng_abbots_road_property_view`
- `kyng_bootawa_road_north_addresspoint_view`
- etc.

**Pattern:** Each KYNG area has views for:
- `*_addresspoint_view`: NSW GNAF address points in area
- `*_property_view`: Properties in area
- `*_proway_view`: Roads in area
- `*_waypoint_view`: Waypoints in area

---

## Common Gotchas

### 1. JWT Claims Not Updating
**Issue:** User adds property but can't access it  
**Cause:** JWT claims cached until next login  
**Solution:** Implement claims refresh or force re-login

### 2. Geometry SRID Mismatch
**Issue:** Spatial queries return empty results  
**Cause:** Mixing SRID 7844 and 4326 (WGS84)  
**Solution:** Always use 7844, transform if importing external data

### 3. Feature Attributes Orphaning
**Issue:** Deleted templates leave orphaned attributes  
**Cause:** No CASCADE on feature_attributes  
**Solution:** Use `cleanup_orphaned_attributes()` RPC function

### 4. Property Access After Transfer
**Issue:** User transferred property but still has access  
**Cause:** JWT claims not refreshed  
**Solution:** Claims refresh or force logout

---

## Security Checklist

- ✅ All tables have RLS policies enabled
- ✅ JWT claims used for multi-tenant isolation
- ✅ Foreign key constraints prevent orphaned records
- ✅ Geometry validation on insert/update
- ✅ SRID enforcement (7844)
- ✅ User can only modify own features
- ✅ Property access controlled by JWT property_ids
- ✅ Community profiles isolated by RLS
- ✅ Admin role checked for sensitive operations
- ✅ Input validation in RPC functions

---

## Database Maintenance

### Cleanup Functions

**`cleanup_orphaned_attributes() → number`**  
Removes feature_attributes without valid feature_id

**`cleanup_orphaned_spatial_features() → number`**  
Removes spatial_features without valid property_id or template_id

**`find_orphaned_attributes() → record[]`**  
Identifies orphaned attributes without deleting

### Performance Indexes

Key indexes (inferred from schema):
- `property_profile.id` (PK)
- `property_profile.principaladdresssiteoid` (NSW GNAF lookup)
- `spatial_features.property_id` (FK, common filter)
- `spatial_features.template_id` (FK, common filter)
- `spatial_features.geom` (Spatial index - GIST)
- `feature_attributes.feature_id` (FK, join performance)

---

## Design Decisions

### Why Separate Community Profile Tables?
- Different communities have different data requirements
- Optional membership (user may belong to 0-4 communities)
- Easier to add new communities without schema changes
- Cleaner RLS policies per community

### Why Template-Driven Features?
- Non-developers can define new feature types
- Avoids hardcoded feature schemas
- Flexible attribute system via JSONB
- Easy to evolve without migrations

### Why JWT Claims for Authorization?
- Zero database queries for auth checks
- Fast RLS policy evaluation
- Scales well with user count
- Consistent across all tables

### Why Property-Centric Model?
- Fire safety is property-based, not user-based
- Users may manage multiple properties
- Property can transfer between users
- Clear authorization boundary

---

**Last Updated:** 2025-12-08
**PostgreSQL Version:** 15
**PostGIS Version:** Latest
**For type definitions:** See `db.types.ts`
**For auth implementation:** See [`documentation/auth-system.md`](./auth-system.md)