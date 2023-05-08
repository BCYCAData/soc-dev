import { redirect } from '@sveltejs/kit';
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
	apiKey: 'dbe61b4362899203be913f4c3d804125-us20',
	server: 'us20'
});

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
	const session = await getSession();
	if (
		!session?.user.app_metadata.app_metadata?.roles?.includes('tester') &&
		!session?.user?.app_metadata?.roles?.includes('admin')
	) {
		throw redirect(307, '/auth/signin');
	}
	const response = await mailchimp.ping.get();
	console.log(response);
	return new Response();
};
// async function run() {
// 	// const response = await mailchimp.ping.get();
// 	const response = mailchimp.ping.get();
// 	console.log(response);
// }
