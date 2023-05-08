import { error, redirect } from '@sveltejs/kit';
import { render } from 'svelte-email';
import nodemailer from 'nodemailer';

// import Tester from '$components/email_templates/Tester.svelte';
import BCYCACommunityEmail from '$components/email_templates/BCYCACommunityEmail.svelte';
import BCYCABaseTemplate from '$components/email_templates/BCYCABaseTemplate.svelte';

import type { ComponentType } from 'svelte';
import type { SvelteComponentDev } from 'svelte/internal';

// const template = Tester as unknown as ComponentType<SvelteComponentDev>;
// const template = BCYCACommunityEmail as unknown as ComponentType<SvelteComponentDev>;
const template = BCYCABaseTemplate as unknown as ComponentType<SvelteComponentDev>;

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
	const session = await getSession();
	if (
		!session?.user.app_metadata.app_metadata?.roles?.includes('tester') &&
		!session?.user?.app_metadata?.roles?.includes('admin')
	) {
		throw redirect(307, '/auth/signin');
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
