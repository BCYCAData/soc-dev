import { helpContentPersonalProfileMap } from '$lib/help/content/personal-profile-help';
import { helpContentAdminMap } from '$lib/help/content/admin-help';
import { helpContentKYNGCoordinatorMap } from '$lib/help/content/kyng-coordinator-help';
import type { HelpContent } from '$lib/types';

export const getPersonalProfileHelpContent = (path: string): HelpContent => {
	const normalizedPath = path.toLowerCase();
	if (helpContentPersonalProfileMap[normalizedPath]) {
		return helpContentPersonalProfileMap[normalizedPath];
	}
	const pathParts = normalizedPath.split('/');
	if (normalizedPath.startsWith('personal-profile/my-property/')) {
		const dynamicPath = 'personal-profile/my-property/[propertyid]/' + pathParts[3];
		return helpContentPersonalProfileMap[dynamicPath];
	}
	return { hasHelp: false };
};

export const getAdminHelpContent = (path: string): HelpContent => {
	const normalizedPath = path.toLowerCase();
	return helpContentAdminMap[normalizedPath] || { hasHelp: false };
};

export const getKYNGCoordinatorHelpContent = (path: string): HelpContent => {
	const normalizedPath = path.toLowerCase();
	if (helpContentKYNGCoordinatorMap[normalizedPath]) {
		return helpContentKYNGCoordinatorMap[normalizedPath];
	}

	const pathParts = normalizedPath.split('/');
	if (normalizedPath.startsWith('kyng-coordinator/')) {
		if (pathParts.length === 2) {
			return helpContentKYNGCoordinatorMap['kyng-coordinator/[kyng-area]'];
		}
		const dynamicPath = 'kyng-coordinator/[kyng-area]/' + pathParts[2];
		return helpContentPersonalProfileMap[dynamicPath];
	}
	return { hasHelp: false };
};
