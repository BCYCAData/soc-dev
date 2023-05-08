import { error, redirect } from '@sveltejs/kit';
import { render } from 'svelte-email';
import nodemailer from 'nodemailer';

import Tester from '$components/email_templates/Tester.svelte';

import type { ComponentType } from 'svelte';
import type { SvelteComponentDev } from 'svelte/internal';

const template = Tester as unknown as ComponentType<SvelteComponentDev>;

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (
		!(
			session?.user?.app_metadata.roles.includes('tester') |
			session?.user?.app_metadata.roles.includes('admin')
		)
	) {
		throw redirect(307, '/auth/signin');
	}
	const { data: usersAdminNewUsersData, error: usersAdminNewUsersError } = await supabase.rpc(
		'get_user_vetting_data',
		{}
	);

	if (usersAdminNewUsersError) {
		console.log('error get New Users Admin Data:', usersAdminNewUsersError);
		throw error(400, usersAdminNewUsersError.message);
	}
	const { data: usersSendRFSPlanData, error: usersSendRFSPlanError } = await supabase.rpc(
		'get_user_sendrfsplan_data',
		{}
	);
	if (usersSendRFSPlanError) {
		console.log('error get New Users Admin Data:', usersSendRFSPlanError);
		throw error(400, usersSendRFSPlanError.message);
	}
	return {
		session,
		usersAdminNewUsersData: usersAdminNewUsersData,
		usersSendRFSPlanData: usersSendRFSPlanData
	};
};
export const actions = {
	newusersemail: async ({ request, locals: { supabase, getSession } }) => {
		console.log('Yay');
		const session = await getSession();
		if (
			!(
				session?.user?.app_metadata.roles.includes('tester') |
				session?.user?.app_metadata.roles.includes('admin')
			)
		) {
			throw redirect(307, '/auth/signin');
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
