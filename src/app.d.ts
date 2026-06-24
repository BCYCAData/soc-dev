// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			// NOTE: only assign fields here that hooks.server.ts actually populates.
			// `user`/`session` are intentionally NOT on locals — validate per-request with
			// locals.supabase.auth.getUser()/getSession() (or read `user` from parent() in loads).
			supabase: SupabaseClient<import('$lib/db.types').Database>;
			userRole: string | null;
			permissions: string[];
			propertyIds: string[] | null;
			communities: string[];
			coordinatesKYNG: KYNGArea[] | null;
			// Supabase session id (stable for the life of a login, changes on re-login);
			// used to show the profile-completion nag once per login.
			sessionId: string | null;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
			userRole: string | null;
			permissions: string[];
			coordinatesKYNG: KYNGArea[] | null;
			propertyIds: string[] | null;
			steps?: { index: number; text: string; page: string }[];

			// Profile-completion nag (set by the protected layout when a signed-in user
			// has an incomplete profile and hasn't yet resolved the nag this login).
			profileNag?: {
				percent: number;
				answered: number;
				total: number;
				sessionId: string;
			} | null;

			// Admin-specific
			messages?: AdminMessage[];

			// KYNG-specific
			kyngMessages?: KYNGMessage[];

			// Profile-specific
			userProfile: UserProfile | null;
			profileMessages?: ProfileMessage[];
			hadUserPostalAddress?: boolean;
			optionsData?: {
				userOptionsData: {
					object_names: Array<{
						object_name: string;
						options: Array<{
							value: string;
							lable: string;
						}>;
					}>;
				};
				communityBCYCAOptionsData: {
					object_names: Array<{
						object_name: string;
						options: Array<{
							value: string;
							lable: string;
						}>;
					}>;
				};
				communityExternalOptionsData: {
					object_names: Array<{
						object_name: string;
						options: Array<{
							value: string;
							lable: string;
						}>;
					}>;
				};
				communityTinoneeOptionsData: {
					object_names: Array<{
						object_name: string;
						options: Array<{
							value: string;
							lable: string;
						}>;
					}>;
				};
				communityMondrookOptionsData: {
					object_names: Array<{
						object_name: string;
						options: Array<{
							value: string;
							lable: string;
						}>;
					}>;
				};
			};
		}
	}
}

export {};

declare module '@fontsource/inter' {
	const content: string;
	export default content;
}

declare module '@fontsource/poppins' {
	const content: string;
	export default content;
}

declare module '@fontsource/open-sans' {
	const content: string;
	export default content;
}

declare module '@fontsource/raleway' {
	const content: string;
	export default content;
}
