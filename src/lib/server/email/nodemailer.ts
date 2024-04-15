import { dev } from '$app/environment';
import nodemailer from 'nodemailer';
import { render } from 'svelty-email';

import SOCDataBaseTemplate from '$components/email_templates/SOCDataBaseTemplate.svelte';

import { PUBLIC_NODEMAILER_SERVICE, PUBLIC_NODEMAILER_DEV_TARGET } from '$env/static/public';

import { NODEMAILER_ACCOUNT, NODEMAILER_PASSWORD } from '$env/static/private';
import type { PostgrestError } from '@supabase/supabase-js';

const transporter = nodemailer.createTransport({
	service: PUBLIC_NODEMAILER_SERVICE,
	auth: {
		user: NODEMAILER_ACCOUNT,
		pass: NODEMAILER_PASSWORD
	}
});

export type PostgRestErrorEmailSubject = { type: string; user: string; time: string };

export enum TitleType {
	databaseError = 'SOC Database Error Report',
	information = 'SOC Data Information'
}

// Send an email
export function sendPostgRestErrorEmail(
	subject: PostgRestErrorEmailSubject,
	postgrestError: PostgrestError
) {
	if (dev) return;
	const emailHtml = render({
		template: SOCDataBaseTemplate,
		props: {
			titleType: TitleType.databaseError,
			subjectText: subject,
			postgRestError: postgrestError
		}
	});
	// const mailOptions = {
	// 	from: NODEMAILER_ACCOUNT,
	// 	to: PUBLIC_NODEMAILER_DEV_TARGET,
	// 	subject: `${subject}`,
	// 	text: JSON.stringify(postgrestError)
	// };
	const mailOptions = {
		from: NODEMAILER_ACCOUNT,
		to: PUBLIC_NODEMAILER_DEV_TARGET,
		subject: `SOC ${subject.type}`,
		html: emailHtml
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log('Error Email sent: ' + info.response);
		}
	});
}
