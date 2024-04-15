import { redirect } from '@sveltejs/kit';
import { render } from 'svelty-email';
import nodemailer from 'nodemailer';

import BCYCABaseTemplate from '$components/email_templates/BCYCABaseTemplate.svelte';

const template = BCYCABaseTemplate;

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const {
		locals: { getUser },
		request
	} = event;
	const { user } = await getUser();
	if (
		!user?.app_metadata.app_metadata?.roles?.includes('tester') &&
		!user?.app_metadata?.roles?.includes('admin')
	) {
		redirect(307, '/auth/signin');
	}
	const data = await request.json();
	const emails = data.map((item: { email: string }) => item.email).join(', ');

	const transporter = nodemailer.createTransport({
		service: 'hotmail',
		auth: {
			user: 'socdatadev@outlook.com',
			pass: 'CommunityInformationInfrastructure'
		}
	});
	const emailHtml = render({
		template: template,
		props: {}
	});

	const mailOptions: nodemailer.SendMailOptions = {
		from: 'socdatadev@outlook.com',
		to: `${emails}`,
		subject: 'Test Email',
		html: emailHtml
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});

	return new Response();
};
