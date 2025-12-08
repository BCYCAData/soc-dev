// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			getSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
			userRole: string | null;
			permissions: string[];
			propertyIds: string[] | null;
			communities: string[];
			getCommunityRequestOptions: () => Promise<TransformedOptionsData[]>;
			coordinatesKYNG: KYNGArea[] | null;
			userProfile: UserProfile | null;
			userOptionsData: {
				table_name: string;
				object_names: Array<{
					object_name: string;
					options: Array<{
						value: string;
						lable: string;
					}>;
				}>;
			}[];
		}
		interface PageData {
			session: Session | null;
			user: User | null;
			userRole: string | null;
			permissions: string[];
			coordinatesKYNG: KYNGArea[] | null;
			propertyIds: string[] | null;
			steps?: { index: number; text: string; page: string }[];

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
	const content: any;
	export default content;
}

declare module '@fontsource/poppins' {
	const content: any;
	export default content;
}

declare module '@fontsource/open-sans' {
	const content: any;
	export default content;
}

declare module '@fontsource/raleway' {
	const content: any;
	export default content;
}
