import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
    const {
        url,
        locals: { supabase }
    } = event;
    const token_hash = url.searchParams.get('token_hash') as string;
    const type = url.searchParams.get('type') as EmailOtpType;
    const next = url.searchParams.get('next') ?? '/';


    console.log('url', url);
    console.log('token_hash', token_hash);
    console.log('type', type);
    console.log('next', next);

    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type });
        if (!error) {
            switch (type) {
                case 'email':
                    console.log('Is email confirmed')
                    return new Response(undefined, {
                        status: 302,
                        headers: { Location: '/auth/redirect?redirectType=email&haveSurvey=false' }
                    });
                    break;
                case 'signup':

                    break;
                case 'invite':

                    break;
                case 'recovery':

                    break;
                case 'email_change':

                    break;

                default:
                    break;
            }
            redirect(303, `/${next.slice(1)}`);
        }
    }

    // return the user to an error page with some instructions
    redirect(303, '/auth/auth-code-error');
};