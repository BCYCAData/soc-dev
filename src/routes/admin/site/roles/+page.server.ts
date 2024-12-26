import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSessionAndUser } }) => {
	const { user } = await getSessionAndUser();
	return {
		siteAdminRolesData: user?.app_metadata?.roles
	};
};
