<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let haveSurvey = data.session?.user.app_metadata.havesurvey;

	$: if (browser) {
		if (!data.session?.user) {
			goto('/auth/signin');
		}
	}
</script>

<div class="flex flex-col items-center text-center mt-5 sm:mt-1 mx-auto h-full max-w-3xl">
	<h1 class="unstyled title-font font-bold hidden sm:block sm:text-4xl sm:mt-4 text-primary-600">
		Strengthen Our Community
	</h1>
	<div class="bg-green-100 rounded-lg mt-2 text-gray-900 items-center w-full">
		{#if haveSurvey}
			<p class="unstyled mt-1 mb-0 text-sm sm:text-lg sm:mt-3">
				Please step through our project survey again and ensure you answers are still valid and
				answer the new questions we have added. <br /><b>
					Don't forget to save your answers at step 12.
				</b>
			</p>
		{/if}
		<p class="unstyled mt-1 mb-0 text-sm sm:text-lg sm:mt-3">
			We hope that the questions in our project survey prompt you to review your preparedness for
			fire and flood. By completing our project survey you are helping to protect our community.
		</p>

		<p class="unstyled mt-1 mb-0 text-sm sm:text-lg sm:mt-3">
			We will never sell your data. <br /> It will only ever be shared with emergency services in an
			emergency situation.<br />
			<strong>No one will see any of your personal information without your permission.</strong>
		</p>
		<p class="unstyled mt-1 mb-0 text-sm sm:text-lg sm:mt-3">
			If you have any questions don’t hesitate to contact either
		</p>
		<p class="unstyled mt-1 mb-0 text-sm sm:text-lg sm:mt-3">
			Helen 0424 515 963 or Christine 0488 288 661
		</p>
		<a
			href="/survey"
			class="btn cursor-pointer max-w-80 rounded-xl my-5 px-5 py-2 bg-orange-500 text-stone-100 hover:bg-orange-700 font-semibold focus:outline-none"
		>
			Complete the Survey
		</a>
	</div>
	<h2 class="unstyled title-font font-bold hidden sm:block sm:text-3xl sm:mt-4 text-primary-600">
		Thank you for joining our project.
	</h2>
</div>
