export const load = async ({ locals: { supabase, getSession } }) => {
	return {
		session: getSession()
	};
};
