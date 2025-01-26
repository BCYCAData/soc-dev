// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			getSessionAndUser: () => Promise<{
				session: Session | null;
				user: User | null;
				userRoles: string[] | null;
				coordinatesKYNG: KYNGArea[] | null;
				propertyIds: string[] | null;
				userProfile: UserProfile | null;
			}>;
			getCommunityRequestOptions: () => Promise<{
				userOptionsData: any;
			}>;
			user: User | null;
			permissions: string | null;
			coordinatesKYNG: KYNGArea[] | null;
			userProfile: UserProfile | null;
			propertyIds: string[] | null;
		}

		interface PageData {
			session: Session | null;
			user: User | null;
			userRoles: string[] | null;
			permissions: string | null;
			coordinatesKYNG: KYNGArea[] | null;
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
				communityTinoneeOptionsData: {
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
		// interface PageState {}
		// interface Platform {}
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
