/**
 * Server-facing permissions entry point.
 *
 * The implementation is the canonical, environment-agnostic logic in
 * `$lib/constants/permissions`, so the server guards and the client UI share one source
 * of truth (see that module for the layering overview). This module is kept as the
 * stable import path for server code (`$lib/server/permissions`).
 *
 * @module server/permissions
 */
export { hasPermission, isAdmin, hasAnyFeature, hasAnyPermission } from '$lib/constants/permissions';
