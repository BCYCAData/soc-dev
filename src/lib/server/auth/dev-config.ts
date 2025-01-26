import { createClient } from '@vercel/edge-config';
import { EDGE_CONFIG } from '$env/static/private';

const client = createClient(EDGE_CONFIG);

interface DevConfig {
	'allowed-emails': string[];
}

export async function isEmailAllowed(email: string): Promise<boolean> {
	try {
		const config = (await client.get('dev-config')) as DevConfig;
		const allowedEmails = config['allowed-emails'];

		if (
			!allowedEmails ||
			!Array.isArray(allowedEmails) ||
			!allowedEmails.every((email): email is string => typeof email === 'string')
		) {
			console.error('Allowed emails list is not properly configured');
			return false;
		}
		return allowedEmails.includes(email.toLowerCase());
	} catch (error) {
		console.error('Error checking allowed emails:', error);
		return false;
	}
}
