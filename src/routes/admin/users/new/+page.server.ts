import { error, redirect } from '@sveltejs/kit';
// import { render } from 'svelty-email';
// import nodemailer from 'nodemailer';

import Tester from '$components/email_templates/Tester.svelte';

import type { PageServerLoad } from './$types.js';
import type { Actions } from './$types.js';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session) {
		redirect(307, '/auth/signin');
	} else if (
		!(
			session?.user?.app_metadata.roles.includes('tester') |
			session?.user?.app_metadata.roles.includes('admin')
		)
	) {
		error(401, { message: 'Unauthorized' });
	}
	const { data: usersAdminNewUsersData, error: usersAdminNewUsersError } = await supabase.rpc(
		'get_user_vetting_data',
		{}
	);

	if (usersAdminNewUsersError) {
		console.log('error get New Users Admin Data:', usersAdminNewUsersError);
		error(400, usersAdminNewUsersError.message);
	}
	return {
		session,
		usersAdminNewUsersData: usersAdminNewUsersData
	};
};
export const actions: Actions = {
	newusersemail: async ({ locals: { getSession } }) => {
		console.log('Yay');
		const session = await getSession();
		if (
			!(
				session?.user?.app_metadata.roles.includes('tester') |
				session?.user?.app_metadata.roles.includes('admin')
			)
		) {
			redirect(307, '/auth/signin');
		}
		// const transporter = nodemailer.createTransport({
		// 	service: 'hotmail',
		// 	auth: {
		// 		user: 'socdatadev@outlook.com',
		// 		pass: 'CommunityInformationInfrastructure'
		// 	}
		// });
		// const emailHtml = await render({
		// 	template: template,
		// 	props: {
		// 		firstName: 'John'
		// 	}
		// });

		// const mailOptions: nodemailer.SendMailOptions = {
		// 	from: 'socdatadev@outlook.com',
		// 	to: 'socdata@outlook.com, alankeown@southernphone.com.au',
		// 	subject: 'Test Email',
		// 	html: emailHtml
		// };

		// transporter.sendMail(mailOptions, (error, info) => {
		// 	if (error) {
		// 		console.log(error);
		// 	} else {
		// 		console.log('Email sent: ' + info.response);
		// 	}
		// });
		// const body = Object.fromEntries(await request.formData());
		// const { error: err } = await supabase.auth.signInWithPassword({
		// 	email: body.email as string,
		// 	password: body.password as string
		// });

		// if (err) {
		// 	if (err instanceof AuthApiError && err.status === 400) {
		// 		return fail(400, {
		// 			error: 'Invalid credentials'
		// 		});
		// 	}
		// 	return fail(500, {
		// 		message: 'Server error. Try again later.'
		// 	});
		// }
		// throw redirect(303, '/profile');
	}
};
