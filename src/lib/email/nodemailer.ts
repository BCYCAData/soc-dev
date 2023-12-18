import nodemailer from 'nodemailer';
import { PUBLIC_NODEMAILER_SERVICE, PUBLIC_NODEMAILER_ACCOUNT, PUBLIC_NODEMAILER_PASSWORD, PUBLIC_NODEMAILER_SUPBASE_TARGET } from '$env/static/public';

export const transporter = nodemailer.createTransport({
    service: PUBLIC_NODEMAILER_SERVICE,
    auth: {
        user: PUBLIC_NODEMAILER_ACCOUNT,
        pass: PUBLIC_NODEMAILER_PASSWORD
    }
});

export let errorMessage = '';

// Send an email
export const mailOptions = {
    from: PUBLIC_NODEMAILER_ACCOUNT,
    to: PUBLIC_NODEMAILER_SUPBASE_TARGET,
    subject: 'SOC Emailer Message',
    text: `An error occurred: ${errorMessage}`
};