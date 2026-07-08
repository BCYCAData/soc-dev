<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';

	// Friendly copy for the error codes set by auth/redirect/confirm/+server.ts.
	const ERROR_MESSAGES: Record<string, string> = {
		otp_verification_failed:
			'Your confirmation link is invalid or has expired. Please request a new one and try again.',
		email_change_failed:
			'We could not complete your email address change. Please sign in and try again.',
		confirmation_failed: 'We could not confirm your request. The link may be invalid or expired.'
	};

	let errorMessage = $derived(
		ERROR_MESSAGES[page.url.searchParams.get('error') ?? ''] ??
			'Something went wrong while confirming your request.'
	);
</script>

<svelte:head>
	<title>Confirmation Problem</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col items-center justify-center">
	<div class="bg-secondary-100 text-surface-950 w-5/6 rounded p-6 shadow-md sm:ml-0 sm:w-full">
		<h1 class="h1 mb-4 text-center text-2xl">We hit a snag</h1>
		<AuthErrorMessage {errorMessage} />
		<p class="mt-4 text-sm">
			If you followed a link from an email, it may have already been used or expired. Signing in
			again, or requesting a fresh password-reset email, will send you a new link.
		</p>
		<a
			href={resolve('/auth/signin')}
			class="bg-secondary-500 text-secondary-50 hover:bg-secondary-700 mt-6 block w-full rounded-full py-2 text-center focus:outline-none"
		>
			Go to Sign In
		</a>
		<div class="mt-4 text-center">
			<a
				href={resolve('/auth/requestresetpassword')}
				class="text-secondary-900 font-semibold hover:underline"
			>
				Reset your password
			</a>
		</div>
	</div>
</div>
