import { fail, redirect, type Actions } from '@sveltejs/kit';
import { RECOVERY_COOKIE_NAME, RECOVERY_COOKIE_PATH } from '$lib/constants';
import type { PageServerLoad } from './$types';

/** A genuine recovery flow needs both a session and the confirm endpoint's flag. */
function isRecoveryFlow(cookies: { get(name: string): string | undefined }): boolean {
	return cookies.get(RECOVERY_COOKIE_NAME) === '1';
}

export const load: PageServerLoad = async ({ cookies, locals: { supabase } }) => {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	// Only render the "set new password" form for an actual recovery: an ordinary
	// logged-in session (no recovery flag) or a missing session is bounced away.
	if (!session || !isRecoveryFlow(cookies)) {
		throw redirect(303, '/auth/signin');
	}
};

export const actions: Actions = {
	resetpassword: async ({ request, cookies, locals: { supabase } }) => {
		// Re-check so an ordinary logged-in session can't POST straight to this action.
		if (!isRecoveryFlow(cookies)) {
			throw redirect(303, '/auth/signin');
		}

		const formData = await request.formData();
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.updateUser({ password });

		if (error) {
			return fail(400, {
				success: false,
				message: error.message
			});
		}

		// Consume the one-time recovery flag now the password has been changed.
		cookies.delete(RECOVERY_COOKIE_NAME, { path: RECOVERY_COOKIE_PATH });

		throw redirect(303, '/personal-profile');
	}
};
