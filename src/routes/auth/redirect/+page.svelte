<script lang="ts">
	import { page } from '$app/stores';

	import { PUBLIC_SUPABASE_EMAIL_ADDRESS } from '$env/static/public';

	import PasswordEntry from '$components/form/auth/PasswordEntry.svelte';
	import SignUpSuccess from '$components/form/auth/SignUpSuccess.svelte';

	const url = new URLSearchParams($page.url.hash.substring(1));
	const redirectType = url.get('type');
	const message = url.get('message');

	let haveSurvey = false;
</script>

<svelte:head>
	<title>Redirect</title>
</svelte:head>

{#if redirectType === 'invite'}
	<PasswordEntry {redirectType} />
{:else if redirectType === 'signup'}
	<SignUpSuccess {redirectType} {haveSurvey} />
{:else if redirectType === 'recovery'}
	<!-- <PasswordEntry {redirectType} /> -->
	<div>Password Recovery</div>
{:else if message && redirectType === null}
	<section class="flex flex-col items-center text-center mt-5 sm:mt-1 mx-auto h-full max-w-3xl">
		<h1 class="unstyled title-font font-bold hidden sm:block sm:text-4xl sm:mt-4 text-primary-600">
			Strengthen OUR Community
		</h1>
		<div class="bg-green-100 rounded-lg mt-2 text-gray-900 items-center w-full">
			<p class="my-1 text-xl">You need to validate your new email address.</p>
			<p class="my-1 text-xl">You have confirmed your old email address.</p>
			<p class="my-1 text-xl">
				Please check the mailbox of your new email address for a confirmation request.
			</p>
		</div>
	</section>
{:else if redirectType === 'email_change'}
	<section class="flex flex-col items-center text-center mt-5 sm:mt-1 mx-auto h-full max-w-3xl">
		<h1 class="unstyled title-font font-bold hidden sm:block sm:text-4xl sm:mt-4 text-primary-600">
			Strengthen OUR Community
		</h1>
		<div class="bg-green-100 rounded-lg mt-2 text-gray-900 items-center w-full">
			<p class="my-1 text-xl">Your login email has been changed.</p>
		</div>
	</section>
{:else}
	<section class="flex flex-col items-center text-center mt-5 sm:mt-1 mx-auto h-full max-w-3xl">
		<h1 class="unstyled title-font font-bold hidden sm:block sm:text-4xl sm:mt-4 text-primary-600">
			Strengthen OUR Community
		</h1>
		<div class="bg-green-100 rounded-lg mt-2 text-gray-900 items-center w-full">
			<p class="my-1 text-xl">Your request has been lodged.</p>
			<strong class="my-1">
				Please check you inbox for an email from <br />
				<em class="text-orange-600">{PUBLIC_SUPABASE_EMAIL_ADDRESS}</em> <br /> asking you to confirm
				your details.
			</strong>
			<p>You may need to 'Send/Receive'.</p>
			<p>If nothing is showing check your 'Spam' folder.</p>
		</div>
	</section>
{/if}
