<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';

	const redirectType = page.url.searchParams.get('redirectType');
	const encodedRef = encodeURIComponent('SOC Email Already Registered');
	const mailtoUrl = `mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodedRef}`;
</script>

<section class="mx-auto mt-5 flex h-full max-w-3xl flex-col items-center text-center sm:mt-1">
	<h1 class="title-font hidden font-bold text-orange-600 underline sm:block sm:text-2xl">
		Strengthen OUR Community
	</h1>
	{#if redirectType === 'signup'}
		<div class="mt-2 w-full items-center rounded-lg bg-green-100 text-gray-900">
			<p class="my-1 text-xl">Your request has been lodged.</p>
			<p class="my-1 text-xl">Please check you email inbox to confirm your details.</p>
			<p>You may need to 'Send/Receive'.</p>
			<p>If nothing is showing check your 'Spam' folder.</p>
		</div>
	{:else if redirectType === 'emailExists'}
		<div class="mt-2 w-full items-center rounded-lg bg-red-100 text-gray-900">
			<p class="my-1 text-xl">Thank you for your interest in joining our community.</p>
			<p class="my-1 text-xl">The email address you used is already registered with the project.</p>
			<p class="my-1 text-xl">
				Please contact our support team who will help guide you through the next steps.
			</p>
			<div class="mt-5">
				<a
					href={mailtoUrl}
					class="bg-secondary-500 text-secondary-50 mt-5 inline-block rounded-xl p-2 font-medium hover:underline"
				>
					Tap here to send us an email
				</a>
			</div>
		</div>
	{/if}
</section>
