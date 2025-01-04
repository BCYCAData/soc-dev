import type { KYNGArea } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import { routeMatchers } from '$lib/server/auth/routematchers';
import type { Session, User } from '@supabase/supabase-js';

export async function guardRoute({
	path,
	session,
	user,
	userRoles,
	coordinatesKYNG,
	permissions,
	propertyIds
}: {
	path: string;
	session: Session | null;
	user: User | null;
	userRoles: string[] | null;
	coordinatesKYNG: KYNGArea[] | null;
	permissions?: string | null;
	propertyIds?: string[];
}) {
	console.log('Guard Route Debug:', {
		path,
		isKYNG: routeMatchers.isKYNGRoute(path),
		requiredPermission: routeMatchers.getRequiredPermission(path),
		permissioms: permissions
	});

	if (routeMatchers.isPublicRoute(path)) {
		return;
	}

	if (!session || !user) {
		throw redirect(303, '/auth/signin');
	}

	if (routeMatchers.isSignOutRoute(path)) {
		return;
	}

	if (routeMatchers.isKYNGRoute(path)) {
		if (!coordinatesKYNG?.length) {
			throw error(403, 'Not authorized as KYNG coordinator');
		}

		const kyngArea = routeMatchers.getKYNGArea(path);
		if (kyngArea && !coordinatesKYNG.some((area) => area.kyngAreaId === kyngArea)) {
			console.log('Unauthorized KYNG area:', {
				coordinatesKYNG,
				kyngArea,
				haveMatch: coordinatesKYNG.some((area) => area.kyngAreaId === kyngArea)
			});
			throw error(403, 'Not authorized for this KYNG area');
		}
		return;
	}

	if (routeMatchers.isPropertyRoute(path)) {
		const routePropertyId = routeMatchers.getPropertyId(path);
		if (routePropertyId && (!propertyIds || !propertyIds.includes(routePropertyId))) {
			throw error(403, 'Not authorized to view this property');
		}
		return;
	}

	const requiredPermission = routeMatchers.getRequiredPermission(path);
	if (requiredPermission) {
		if (!permissions?.includes(requiredPermission)) {
			throw error(403, 'Insufficient permissions');
		}
		return;
	}
}
