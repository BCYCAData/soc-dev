export const routeMatchers = {
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

	isProtectedAuthRoute: (path: string): boolean => {
		const protectedAuthRoutes = ['/auth/redirect/resetpassword', '/auth/redirect/changeemail'];
		return protectedAuthRoutes.includes(path);
	},

	isSignOutRoute: (path: string): boolean => {
		return path === '/auth/signout';
	},

	isOnboardingRoute: (path: string): boolean => {
		return path === '/personal-profile-form';
	},

	isPersonalProfileRoute: (path: string): boolean => {
		return path.startsWith('/personal-profile');
	},

	isPropertyRoute: (path: string): boolean => {
		return path.startsWith('/personal-profile/my-property/');
	},

	getPropertyId: (path: string): string | null => {
		const match = path.match(/\/personal-profile\/my-property\/([^/]+)/);
		return match ? match[1] : null;
	},

	isKYNGRoute: (path: string): boolean => {
		return path.startsWith('/kyng-coordinator');
	},

	getKYNGArea: (path: string): string | null => {
		const match = path.match(/^\/kyng-coordinator\/([^/]+)/);
		return match ? match[1] : null;
	},

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
