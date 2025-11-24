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
			permissions: string | null;
			coordinatesKYNG: KYNGArea[] | null;
			steps?: { index: number; text: string; page: string }[];
			optionsData: {
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
			propertyIds: string[] | null;
			userProfile: UserProfile | null;
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
