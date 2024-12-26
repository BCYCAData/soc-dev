import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: usersAdminNewUsersData, error: usersAdminNewUsersError } = await supabase.rpc(
		'get_user_vetting_data',
		{}
	);

	if (usersAdminNewUsersError) {
		console.log('error get New Users Admin Data:', usersAdminNewUsersError);
		error(400, usersAdminNewUsersError.message);
	}
	return {
		usersAdminNewUsersData: usersAdminNewUsersData
	};
};
// export const actions: Actions = {
// 	newusersemail: async ({ request, locals: { supabase, getSessionAndUser } }) => {
// 		const { user } = await getSessionAndUser();

// 		// else {
// 		// const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
// 		// 	if (session) {
// 		// 		const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
// 		// 		const userRole = jwt.user_roles;
// 		// 		if (userRole?.split('_')[0] !== 'admin') {
// 		// 			error(403, { message: 'Forbidden' });
// 		// 		}
// 		// 	}
// 		// 	data.subscription.unsubscribe();
// 		// });
// 		// }
// 		// const transporter = nodemailer.createTransport({
// 		// 	service: 'hotmail',
// 		// 	auth: {
// 		// 		user: 'socdatadev@outlook.com',
// 		// 		pass: 'CommunityInformationInfrastructure'
// 		// 	}
// 		// });
// 		// const emailHtml = await render({
// 		// 	template: template,
// 		// 	props: {
// 		// 		firstName: 'John'
// 		// 	}
// 		// });
// 		// const mailOptions: nodemailer.SendMailOptions = {
// 		// 	from: 'socdatadev@outlook.com',
// 		// 	to: 'socdata@outlook.com, alankeown@southernphone.com.au',
// 		// 	subject: 'Test Email',
// 		// 	html: emailHtml
// 		// };
// 		// transporter.sendMail(mailOptions, (error, info) => {
// 		// 	if (error) {
// 		// 		console.log(error);
// 		// 	} else {
// 		// 		console.log('Email sent: ' + info.response);
// 		// 	}
// 		// });
// 		// const body = Object.fromEntries(await request.formData());
// 		// const { error: err } = await supabase.auth.signInWithPassword({
// 		// 	email: body.email as string,
// 		// 	password: body.password as string
// 		// });
// 		// if (err) {
// 		// 	if (err instanceof AuthApiError && err.status === 400) {
// 		// 		return fail(400, {
// 		// 			error: 'Invalid credentials'
// 		// 		});
// 		// 	}
// 		// 	return fail(500, {
// 		// 		message: 'Server error. Try again later.'
// 		// 	});
// 		// }
// 		// throw redirect(303, '/profile');
// 	}
// };
