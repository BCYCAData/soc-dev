<script lang="ts">
	import { PUBLIC_SUPABASE_EMAIL_ADDRESS } from '$env/static/public';
</script>

<div class="flex flex-col items-center text-center mt-5 sm:mt-1 mx-auto h-full max-w-3xl">
	<h1 class="unstyled title-font font-bold hidden sm:block sm:text-4xl sm:mt-4 text-primary-600">
		Strengthen OUR Community
	</h1>
	<div class="bg-green-100 rounded-lg mt-2 text-gray-900 items-center w-full">
		<p class="unstyled my-1 text-lg">Your request has been lodged.</p>
		<strong class="unstyled my-1 text-lg">
			Please check you inbox for an email from <br />
			<em class="text-orange-600">{PUBLIC_SUPABASE_EMAIL_ADDRESS}</em> <br /> asking you to confirm your
			details.
		</strong>
		<p class="unstyled text-lg">You may need to 'Send/Receive'.</p>
		<p class="unstyled text-lg mb-3">If nothing is showing check your 'Spam' folder.</p>
	</div>
</div>
